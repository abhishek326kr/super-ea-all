"""
Cloudflare R2 Storage Service
Upload images to R2 bucket and return public URLs
Supports per-site credentials or falls back to default .env credentials
"""
import os
import uuid
from datetime import datetime
from typing import Optional
from io import BytesIO
import boto3
from botocore.config import Config
from dotenv import load_dotenv
from PIL import Image

load_dotenv()


class R2StorageService:
    """Service for uploading files to Cloudflare R2"""
    
    def __init__(
        self,
        account_id: Optional[str] = None,
        access_key_id: Optional[str] = None,
        secret_access_key: Optional[str] = None,
        bucket_name: Optional[str] = None,
        public_url: Optional[str] = None
    ):
        """
        Initialize R2 storage service.
        
        Args:
            account_id: Cloudflare account ID (optional, falls back to R2_ACCOUNT_ID env)
            access_key_id: R2 access key (optional, falls back to R2_ACCESS_KEY_ID env)
            secret_access_key: R2 secret key (optional, falls back to R2_SECRET_ACCESS_KEY env)
            bucket_name: R2 bucket name (optional, falls back to R2_BUCKET_NAME env)
            public_url: R2 public URL (optional, falls back to R2_PUBLIC_URL env)
        """
        # Use provided credentials or fall back to environment variables
        self.account_id = account_id or os.getenv("R2_ACCOUNT_ID")
        self.access_key_id = access_key_id or os.getenv("R2_ACCESS_KEY_ID")
        self.secret_access_key = secret_access_key or os.getenv("R2_SECRET_ACCESS_KEY")
        self.bucket_name = bucket_name or os.getenv("R2_BUCKET_NAME", "superadmin")
        self.public_url = (public_url or os.getenv("R2_PUBLIC_URL", "")).rstrip("/")
        
        # R2 endpoint URL
        self.endpoint_url = f"https://{self.account_id}.r2.cloudflarestorage.com"
        
        # Initialize S3 client for R2
        self.client = boto3.client(
            "s3",
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.access_key_id,
            aws_secret_access_key=self.secret_access_key,
            config=Config(
                signature_version="s3v4",
                retries={"max_attempts": 3, "mode": "standard"}
            ),
            region_name="auto"
        )
    
    def _generate_unique_filename(self, original_filename: str, force_webp: bool = True) -> str:
        """Generate a unique filename with timestamp and UUID"""
        # If we're forcing WebP, use .webp extension
        if force_webp:
            ext = ".webp"
        else:
            ext = os.path.splitext(original_filename)[1].lower()
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = uuid.uuid4().hex[:8]
        safe_name = "".join(c for c in os.path.splitext(original_filename)[0] if c.isalnum() or c in "-_")[:30]
        return f"images/{timestamp}_{safe_name}_{unique_id}{ext}"
    
    def _convert_to_webp(self, file_content: bytes, quality: int = 85) -> bytes:
        """
        Convert any image format to WebP
        
        Args:
            file_content: Raw bytes of the image
            quality: WebP quality (1-100, default 85)
            
        Returns:
            bytes: WebP encoded image
        """
        try:
            # Open the image from bytes
            image = Image.open(BytesIO(file_content))
            
            # Convert RGBA to RGB if necessary (WebP supports both but RGB is smaller)
            if image.mode in ('RGBA', 'LA'):
                # Create a white background
                background = Image.new('RGB', image.size, (255, 255, 255))
                # Paste the image on the background using alpha channel as mask
                if image.mode == 'RGBA':
                    background.paste(image, mask=image.split()[3])
                else:
                    background.paste(image, mask=image.split()[1])
                image = background
            elif image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Save as WebP to BytesIO
            output = BytesIO()
            image.save(output, format='WEBP', quality=quality, method=6)
            output.seek(0)
            
            return output.read()
            
        except Exception as e:
            raise Exception(f"Failed to convert image to WebP: {str(e)}")
    
    async def upload_image(
        self, 
        file_content: bytes, 
        original_filename: str,
        content_type: str = "image/jpeg",
        convert_to_webp: bool = True,
        webp_quality: int = 85
    ) -> dict:
        """
        Upload an image to R2 and return the public URL
        By default, converts all images to WebP format for optimal storage
        
        Args:
            file_content: The raw bytes of the image file
            original_filename: Original name of the uploaded file
            content_type: MIME type of the image (will be overridden if converting to WebP)
            convert_to_webp: Whether to convert the image to WebP format (default: True)
            webp_quality: Quality for WebP conversion (1-100, default: 85)
            
        Returns:
            dict with 'success', 'url', and optionally 'error'
        """
        try:
            # Convert to WebP if requested
            if convert_to_webp:
                file_content = self._convert_to_webp(file_content, quality=webp_quality)
                content_type = "image/webp"
            
            # Generate unique object key
            object_key = self._generate_unique_filename(original_filename, force_webp=convert_to_webp)
            
            # Upload to R2
            self.client.put_object(
                Bucket=self.bucket_name,
                Key=object_key,
                Body=file_content,
                ContentType=content_type
            )
            
            # Construct public URL
            public_url = f"{self.public_url}/{object_key}"
            
            return {
                "success": True,
                "url": public_url,
                "key": object_key,
                "filename": original_filename,
                "converted_to_webp": convert_to_webp,
                "bucket": self.bucket_name
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "filename": original_filename
            }
    
    async def delete_image(self, object_key: str) -> dict:
        """Delete an image from R2 by its object key"""
        try:
            self.client.delete_object(
                Bucket=self.bucket_name,
                Key=object_key
            )
            return {"success": True, "deleted_key": object_key}
        except Exception as e:
            return {"success": False, "error": str(e)}


# Singleton instance for default credentials
_r2_service: Optional[R2StorageService] = None

def get_r2_service() -> R2StorageService:
    """Get or create R2 storage service singleton with default (.env) credentials"""
    global _r2_service
    if _r2_service is None:
        _r2_service = R2StorageService()
    return _r2_service


def get_r2_service_for_site(site_id: str) -> R2StorageService:
    """
    Get R2 service with site-specific credentials if available.
    Falls back to default (.env) credentials if site has no custom R2 config.
    
    Args:
        site_id: The site ID to get R2 service for
        
    Returns:
        R2StorageService configured with site-specific or default credentials
    """
    from database import AdminSessionLocal, SiteConnection
    
    session = AdminSessionLocal()
    try:
        site = session.query(SiteConnection).filter(SiteConnection.id == site_id).first()
        
        if site and site.r2_account_id:
            # Site has custom R2 credentials - create new service instance
            return R2StorageService(
                account_id=site.r2_account_id,
                access_key_id=site.r2_access_key_id,
                secret_access_key=site.r2_secret_access_key,
                bucket_name=site.r2_bucket_name,
                public_url=site.r2_public_url
            )
        else:
            # No custom credentials - use default singleton
            return get_r2_service()
    finally:
        session.close()

