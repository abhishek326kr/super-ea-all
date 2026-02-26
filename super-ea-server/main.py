from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import List, Optional
from datetime import datetime
from schemas import ContentGenerationRequest, BlogContent, Distribution, SuperPublishRequest, ValidationResponse, InjectContentRequest, BlogScheduleRequest, BlogScheduleResponse
from services.xai_engine import ContentGenerator  # Using XAI engine with word limit enforcement
from services.connection_manager import ConnectionManager, DatabaseConfig
from services.content_orchestrator import ContentOrchestrator
from services.r2_storage import get_r2_service, get_r2_service_for_site
from routers import auth
from pydantic import BaseModel
import uvicorn
import json
import asyncio
import sys
import io

# Force UTF-8 encoding for standard output to avoid Windows console charmap errors with characters like '✓'
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Import and initialize database
from database import init_db
try:
    init_db()
except Exception as e:
    print(f"Warning: Database initialization failed: {e}")
    print("Server will start but database features may not work")

app = FastAPI(title="ContentNexus API (Super User)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",             # Local Dev (Next.js)
        "http://localhost:5173",             # Local Dev (Vite)
        "http://localhost:8080",             # Local Dev (Other)
        "https://admin.algotradingbot.online",  # Production
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(auth.router)

from routers import categories
app.include_router(categories.router, prefix="/categories", tags=["Categories"])

# Add explicit OPTIONS handler for CORS preflight
@app.options("/{path:path}")
async def options_handler(path: str):
    """Handle CORS preflight requests"""
    return {"status": "ok"}

@app.on_event("startup")
async def warm_connection_manager():
    """
    Prime the singleton at startup so first frontend /sites request is instant.
    """
    try:
        await asyncio.to_thread(ConnectionManager.get_instance)
    except Exception as e:
        print(f"Warning: Connection manager warmup failed: {e}")

# -- Dependencies --
def get_xai_engine():
    return ContentGenerator()

def get_orchestrator():
    return ContentOrchestrator()

def get_conn_manager():
    return ConnectionManager.get_instance()

# -- Request Models --


# -- Endpoints --

@app.post("/sites")
async def add_site(config: DatabaseConfig, manager: ConnectionManager = Depends(get_conn_manager)):
    try:
        manager.add_connection(config)
        return {"status": "connected", "site_id": config.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/sites")
async def list_sites(manager: ConnectionManager = Depends(get_conn_manager)):
    return manager.list_sites()

@app.delete("/sites/{site_id}")
async def delete_site(site_id: str, manager: ConnectionManager = Depends(get_conn_manager)):
    try:
        manager.delete_connection(site_id)
        return {"status": "deleted", "site_id": site_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class SiteUpdate(BaseModel):
    target_table_name: str = None
    name: str = None
    # R2 Storage credentials (optional)
    r2_account_id: Optional[str] = None
    r2_access_key_id: Optional[str] = None
    r2_secret_access_key: Optional[str] = None
    r2_bucket_name: Optional[str] = None
    r2_public_url: Optional[str] = None

@app.patch("/sites/{site_id}")
async def update_site(
    site_id: str, 
    update: SiteUpdate, 
    manager: ConnectionManager = Depends(get_conn_manager)
):
    try:
        updated_config = manager.update_site_config(site_id, update.dict(exclude_unset=True))
        return {"status": "updated", "config": updated_config}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/validate-distribution", response_model=ValidationResponse)
async def validate_distribution(
    request: SuperPublishRequest,
    orchestrator: ContentOrchestrator = Depends(get_orchestrator)
):
    """
    Checks if target sites have any required schema fields missing from the standard AI generation.
    Returns a list of missing fields per site.
    """
    return await orchestrator.validate_distribution(request.content_req, request.target_site_ids)

@app.post("/preview-distribution")
async def preview_distribution(
    request: SuperPublishRequest,
    orchestrator: ContentOrchestrator = Depends(get_orchestrator)
):
    """
    Generates content without publishing to DB.
    Also tests Auto-Discovery if target_table is not set.
    """
    return await orchestrator.preview_distribution(
        request.content_req, 
        request.target_site_ids,
        request.table_overrides
    )

@app.post("/super-publish")
async def super_publish(
    request: SuperPublishRequest, 
    orchestrator: ContentOrchestrator = Depends(get_orchestrator)
):
    """
    The Master Button: Generates schema-aware content and distributes to ALL selected sites.
    """
    results = await orchestrator.orchestrate_distribution(
        request.content_req, 
        request.target_site_ids,
        request.supplementary_data
    )
    return results

@app.post("/generate", response_model=BlogContent)
async def generate_content(request: ContentGenerationRequest, engine: ContentGenerator = Depends(get_xai_engine)):
    # Legacy endpoint for single-view testing
    try:
        content = await engine.generate_blog_post(request)
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/stream")
async def generate_content_stream(
    request: ContentGenerationRequest, 
    engine: ContentGenerator = Depends(get_xai_engine)
):
    """
    Streaming endpoint for long-running AI generation.
    Sends NDJSON chunks to keep the connection alive (Heartbeating).
    """
    async def event_generator():
        # 1. Send initial heartbeat
        yield json.dumps({"status": "processing", "message": "Initializing AI engine..."}) + "\n"
        await asyncio.sleep(0.1)  # Flush
        
        try:
            # 2. Start the heavy generation task
            # In a real async pipeline, we would yield partial tokens here.
            # Since the current engine is atomic, we wrap it but keep sending "dots" if possible 
            # or just rely on the first byte being sent to satisfy some timeouts.
            
            # For strict heartbeat during wait, we would need to run generation in a separate thread/task
            # and poll it, but for now we'll start the request which at least establishes the stream.
            
            # We send a "thinking" status
            yield json.dumps({"status": "processing", "message": "Generating content (this may take 60s+)..."}) + "\n"
            
            # Execute generation
            content = await engine.generate_blog_post(request)
            
            # 3. Send success
            yield json.dumps({
                "status": "complete", 
                "data": content.dict()
            }) + "\n"
            
        except Exception as e:
            yield json.dumps({"status": "error", "message": str(e)}) + "\n"

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")

@app.post("/inject-content")
async def inject_content(
    request: InjectContentRequest, 
    orchestrator: ContentOrchestrator = Depends(get_orchestrator)
):
    """
    Injects user-edited content directly into target databases.
    Used after preview/edit step - content has already been reviewed/modified by user.
    """
    return await orchestrator.inject_edited_content(request.injections)

# -- Image Upload Endpoint --
@app.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    site_id: Optional[str] = None
):
    """
    Upload an image to Cloudflare R2 and return the public URL.
    
    AUTOMATIC WEBP CONVERSION:
    - All uploaded images are automatically converted to WebP format
    - This reduces file sizes significantly while maintaining quality
    - Conversion quality is set to 85 (good balance of size/quality)
    - Original formats supported: jpg, jpeg, png, gif, webp
    
    Args:
        file: The image file to upload
        site_id: Optional site ID to use site-specific R2 credentials
    
    Returns the public URL to the converted WebP image.
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type: {file.content_type}. Allowed: {', '.join(allowed_types)}"
        )
    
    # Validate file size (max 10MB)
    max_size = 10 * 1024 * 1024  # 10MB
    content = await file.read()
    if len(content) > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is 10MB."
        )
    
    try:
        # Use site-specific R2 credentials if site_id provided, otherwise use default
        if site_id:
            r2_service = get_r2_service_for_site(site_id)
        else:
            r2_service = get_r2_service()
        
        result = await r2_service.upload_image(
            file_content=content,
            original_filename=file.filename,
            content_type=file.content_type
        )
        
        if result["success"]:
            return {
                "success": True,
                "url": result["url"],
                "filename": result["filename"]
            }
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Upload failed"))
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload error: {str(e)}")

# -- Multi-Site Image Upload Endpoint (for TinyMCE inline images) --
@app.post("/upload-image-multi")
async def upload_image_multi(
    file: UploadFile = File(...),
    site_ids: str = Form(...)  # JSON array string e.g. '["site1","site2"]'
):
    """
    Upload a file (image, doc, etc.) to multiple sites' R2 buckets.
    Used by TinyMCE editor to upload inline content assets.
    
    The image is uploaded to every selected site's R2 bucket.
    Returns per-site URLs so content can use each site's own image URL at publish time.
    
    Args:
        file: The image file to upload
        site_ids: JSON array of site IDs to upload to
    
    Returns:
        primary_url: URL from the first site (used for TinyMCE display)
        site_urls: Dict mapping each site_id to its R2 public URL
    """
    # Parse site_ids
    try:
        parsed_site_ids = json.loads(site_ids)
        if not isinstance(parsed_site_ids, list) or len(parsed_site_ids) == 0:
            raise ValueError("site_ids must be a non-empty JSON array")
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Invalid site_ids: {str(e)}")
    
    # Validate file type
    # Expanded list to support documents for "Insert Link" feature
    allowed_types = [
        "image/jpeg", "image/png", "image/gif", "image/webp",
        "application/pdf", "text/plain", "text/csv",
        "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", # docx
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", # xlsx
        "application/zip", "application/x-zip-compressed",
        "video/mp4", "video/mpeg", "audio/mpeg"
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Allowed: Images, PDF, Docs, Excel, CSV, Zip, Media"
        )
    
    # Validate file size (max 10MB)
    max_size = 10 * 1024 * 1024
    content = await file.read()
    if len(content) > max_size:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")
    
    try:
        site_urls = {}
        primary_url = None
        errors = []
        
        for site_id in parsed_site_ids:
            try:
                r2_service = get_r2_service_for_site(site_id)
                result = await r2_service.upload_image(
                    file_content=content,
                    original_filename=file.filename,
                    content_type=file.content_type
                )
                
                if result["success"]:
                    site_urls[site_id] = result["url"]
                    if primary_url is None:
                        primary_url = result["url"]
                else:
                    errors.append(f"{site_id}: {result.get('error', 'Upload failed')}")
            except Exception as e:
                errors.append(f"{site_id}: {str(e)}")
        
        if not primary_url:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload to any site. Errors: {'; '.join(errors)}"
            )
        
        return {
            "success": True,
            "primary_url": primary_url,
            "site_urls": site_urls,
            "filename": file.filename,
            "errors": errors if errors else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-upload error: {str(e)}")

@app.get("/sites/{site_id}/recent-posts")
async def get_recent_posts(site_id: str, limit: int = 5, manager: ConnectionManager = Depends(get_conn_manager)):
    """
    Fetch the most recent posts from a site's database to verify injection worked.
    """
    from sqlalchemy import text
    
    try:
        engine = manager.get_engine(site_id)
        config = manager.get_config(site_id)
        table_name = manager.resolve_table_name(engine, config.target_table_name)
        
        # Query recent posts
        sql = text(f'SELECT * FROM "{table_name}" ORDER BY id DESC LIMIT :limit')
        
        with engine.connect() as conn:
            result = conn.execute(sql, {"limit": limit})
            rows = result.fetchall()
            columns = result.keys()
            
            # Convert to list of dicts
            posts = [dict(zip(columns, row)) for row in rows]
            
            # Convert non-serializable types to strings
            import datetime
            for post in posts:
                for key, value in post.items():
                    if isinstance(value, (datetime.datetime, datetime.date)):
                        post[key] = str(value)
            
            return {
                "site_id": site_id,
                "table": table_name,
                "count": len(posts),
                "posts": posts
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/sites/{site_id}/candidate-tables")
async def get_candidate_tables(
    site_id: str,
    orchestrator: ContentOrchestrator = Depends(get_orchestrator)
):
    """
    Returns a list of candidate tables for content injection.
    """
    try:
        return await orchestrator.discover_suitable_tables(site_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/sites/{site_id}/stats")
async def get_site_stats(site_id: str, manager: ConnectionManager = Depends(get_conn_manager)):
    """
    Get statistics for a specific site including post count and table info.
    """
    from sqlalchemy import text
    
    try:
        engine = manager.get_engine(site_id)
        config = manager.get_config(site_id)
        table_name = manager.resolve_table_name(engine, config.target_table_name)
        
        with engine.connect() as conn:
            # Get total post count
            count_sql = text(f'SELECT COUNT(*) as total FROM "{table_name}"')
            result = conn.execute(count_sql)
            total_posts = result.scalar() or 0
            
            return {
                "site_id": site_id,
                "name": config.name,
                "table": table_name,
                "total_posts": total_posts,
                "status": "connected"
            }
    except Exception as e:
        return {
            "site_id": site_id,
            "name": config.name if 'config' in dir() else site_id,
            "table": "unknown",
            "total_posts": 0,
            "status": "error",
            "error": str(e)
        }


@app.get("/sites/quick")
async def get_sites_quick(manager: ConnectionManager = Depends(get_conn_manager)):
    """
    Get all sites instantly from local DB (no remote connections).
    Used for fast initial page load.
    """
    return [
        {
            "id": k,
            "name": v.name,
            "table": manager.normalize_table_name(v.target_table_name),
            "total_posts": -1,  # -1 signals "not loaded yet" to frontend
            "status": "connected"
        }
        for k, v in manager.connections.items()
    ]


@app.get("/sites/detailed")
async def get_sites_detailed(
    background_tasks: BackgroundTasks,
    manager: ConnectionManager = Depends(get_conn_manager)
):
    """
    Get all sites with their statistics.
    RETURNS CACHED DATA IMMEDIATELY to prevent blocking.
    Triggers background refresh for stale data (> 5 minutes).
    """
    import time
    
    sites = manager.list_sites()
    detailed_sites = []
    
    CACHE_TTL = 300  # 5 minutes
    now = time.time()
    
    for site in sites:
        site_id = site["id"]
        cached = manager.get_cached_stats(site_id)
        
        if cached:
            # Check if stale
            last_updated = cached.get("last_updated", 0)
            if now - last_updated > CACHE_TTL:
                background_tasks.add_task(manager.refresh_site_stats, site_id)
            
            detailed_sites.append(cached)
        else:
            # No cache? Return basic info and trigger refresh
            detailed_sites.append({
                "id": site_id,
                "name": site["name"],
                "table": manager.normalize_table_name(site["target_table"]),
                "total_posts": -1, # Loading
                "status": "refreshing",
                "last_updated": 0
            })
            background_tasks.add_task(manager.refresh_site_stats, site_id)
            
    return detailed_sites


@app.post("/sites/{site_id}/refresh-stats")
async def refresh_site_statistics(
    site_id: str, 
    manager: ConnectionManager = Depends(get_conn_manager)
):
    """Force refresh statistics for a specific site."""
    stats = await manager.refresh_site_stats(site_id)
    return stats


@app.get("/sites/{site_id}/posts")
async def get_site_posts(
    site_id: str, 
    page: int = 1, 
    limit: int = 10,
    status: str = None,
    search: str = None,
    category: str = None,
    sort: str = "id_desc",
    manager: ConnectionManager = Depends(get_conn_manager)
):
    """
    Fetch paginated posts with filtering and search.
    """
    from sqlalchemy import text
    
    try:
        engine = manager.get_engine(site_id)
        config = manager.get_config(site_id)
        table_name = manager.resolve_table_name(engine, config.target_table_name)
        offset = (page - 1) * limit
        
        with engine.connect() as conn:
            # Build WHERE clause
            where_clauses = []
            params = {"limit": limit, "offset": offset}
            
            if status:
                where_clauses.append("status = :status")
                params["status"] = status
            
            if search:
                where_clauses.append("(title ILIKE :search OR h1 ILIKE :search)")
                params["search"] = f"%{search}%"
            
            # Check for BlogCategory relationships
            has_cat_table = False
            try:
                # Introspect if relationship tables exist
                from sqlalchemy import inspect
                inspector = inspect(engine)
                tables = inspector.get_table_names()
                if "BlogCategory" in tables and "Category" in tables:
                    has_cat_table = True
            except:
                pass

            if category:
                if has_cat_table:
                    where_clauses.append(f'id IN (SELECT blogId FROM "BlogCategory" bc JOIN "Category" c ON bc.categoryId = c.categoryId WHERE c.name = :category)')
                    params["category"] = category
                else:
                    where_clauses.append("category = :category")
                    params["category"] = category
            
            where_sql = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""
            
            # Build ORDER BY
            sort_map = {
                "id_desc": "id DESC",
                "id_asc": "id ASC",
                "title_asc": "title ASC",
                "title_desc": "title DESC",
                "date_desc": "\"createdAt\" DESC",
                "date_asc": "\"createdAt\" ASC"
            }
            order_by = sort_map.get(sort, "id DESC")
            
            # Get total count with filters
            count_sql = text(f'SELECT COUNT(*) FROM "{table_name}"{where_sql}')
            total = conn.execute(count_sql, params).scalar() or 0
            
            # Get stats by status
            stats_sql = text(f'''
                SELECT status, COUNT(*) as count 
                FROM "{table_name}" 
                GROUP BY status
            ''')
            stats_result = conn.execute(stats_sql)
            stats = {row[0]: row[1] for row in stats_result.fetchall()}
            
            # Get paginated posts
            sql = text(f'SELECT * FROM "{table_name}"{where_sql} ORDER BY {order_by} LIMIT :limit OFFSET :offset')
            result = conn.execute(sql, params)
            rows = result.fetchall()
            columns = result.keys()
            
            # Convert to list of dicts
            posts = [dict(zip(columns, row)) for row in rows]
            
            # Convert non-serializable types
            import datetime
            for post in posts:
                for key, value in post.items():
                    if isinstance(value, (datetime.datetime, datetime.date)):
                        post[key] = str(value)
            
            # Append Category details
            if has_cat_table and posts:
                post_ids = [str(p["id"]) for p in posts]
                ids_str = ",".join(post_ids)
                cat_sql = text(f'''
                    SELECT bc.blogId, c.name 
                    FROM "BlogCategory" bc 
                    JOIN "Category" c ON bc.categoryId = c.categoryId 
                    WHERE bc.blogId IN ({ids_str})
                ''')
                cat_rows = conn.execute(cat_sql).fetchall()
                cat_map = {row[0]: row[1] for row in cat_rows}
                for post in posts:
                    post["category"] = cat_map.get(post["id"])
                    
            return {
                "site_id": site_id,
                "table": table_name,
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": (total + limit - 1) // limit if total > 0 else 1,
                "stats": stats,
                "posts": posts
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/sites/{site_id}/posts/{post_id}")
async def get_single_post(
    site_id: str,
    post_id: int,
    manager: ConnectionManager = Depends(get_conn_manager)
):
    """Get a single post by ID."""
    from sqlalchemy import text
    
    try:
        engine = manager.get_engine(site_id)
        config = manager.get_config(site_id)
        
        # Use auto-discovery like content injection
        from services.content_orchestrator import ContentOrchestrator
        orchestrator = ContentOrchestrator()
        table_name = await orchestrator._resolve_target_table(site_id, engine, config)
        
        with engine.connect() as conn:
            sql = text(f'SELECT * FROM "{table_name}" WHERE id = :id')
            result = conn.execute(sql, {"id": post_id})
            row = result.fetchone()
            
            if not row:
                raise HTTPException(status_code=404, detail="Post not found")
            
            post = dict(zip(result.keys(), row))
            
            import datetime
            for key, value in post.items():
                if isinstance(value, (datetime.datetime, datetime.date)):
                    post[key] = str(value)
            
            # Append Category
            try:
                from sqlalchemy import inspect
                inspector = inspect(engine)
                if "BlogCategory" in inspector.get_table_names():
                    cat_sql = text('''
                        SELECT c.name 
                        FROM "BlogCategory" bc 
                        JOIN "Category" c ON bc.categoryId = c.categoryId 
                        WHERE bc.blogId = :id
                    ''')
                    cat_row = conn.execute(cat_sql, {"id": post_id}).fetchone()
                    if cat_row:
                        post["category"] = cat_row[0]
            except Exception as e:
                print(f"Failed to fetch single post category: {e}")
            
            return post
    except ValueError as e:
        if "No active engine for site ID" in str(e) or "No config for site ID" in str(e):
            raise HTTPException(status_code=404, detail=f"Site '{site_id}' not found or not connected")
        if "Could not auto-discover a suitable content table" in str(e):
            raise HTTPException(status_code=400, detail=f"Could not find content table for site '{site_id}'. Please configure target_table_name.")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_single_post for site {site_id}, post {post_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching post")


@app.put("/sites/{site_id}/posts/{post_id}")
async def update_post(
    site_id: str,
    post_id: int,
    updates: dict,
    manager: ConnectionManager = Depends(get_conn_manager)
):
    """Update a post's fields."""
    from sqlalchemy import text
    
    try:
        engine = manager.get_engine(site_id)
        config = manager.get_config(site_id)
        
        from services.content_orchestrator import ContentOrchestrator
        orchestrator = ContentOrchestrator()
        table_name = await orchestrator._resolve_target_table(site_id, engine, config)
        
        # Remove id from updates if present
        updates.pop("id", None)
        updates.pop("createdAt", None)
        updates.pop("updated_at", None)
        updates.pop("updatedAt", None)
        
        if not updates:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        result = await orchestrator.update_content(engine, table_name, post_id, updates, site_id)
        
        if result.get("status") == "no_changes":
            raise HTTPException(status_code=400, detail=result.get("message"))
            
        return {"status": "updated", "post_id": post_id}
    except ValueError as e:
        if "No active engine for site ID" in str(e) or "No config for site ID" in str(e):
            raise HTTPException(status_code=404, detail=f"Site '{site_id}' not found or not connected")
        if "Could not auto-discover a suitable content table" in str(e):
            raise HTTPException(status_code=400, detail=f"Could not find content table for site '{site_id}'. Please configure target_table_name.")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in update_post for site {site_id}, post {post_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error while updating post: {str(e)}")


@app.patch("/sites/{site_id}/posts/{post_id}/status")
async def update_post_status(
    site_id: str,
    post_id: int,
    status_update: dict,
    manager: ConnectionManager = Depends(get_conn_manager)
):
    """Quick status update for a post."""
    from sqlalchemy import text
    
    new_status = status_update.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required")
    
    try:
        engine = manager.get_engine(site_id)
        config = manager.get_config(site_id)
        
        from services.content_orchestrator import ContentOrchestrator
        orchestrator = ContentOrchestrator()
        table_name = await orchestrator._resolve_target_table(site_id, engine, config)
        
        result = await orchestrator.update_content(
            engine, 
            table_name, 
            post_id, 
            {"status": new_status}, 
            site_id
        )
        
        return {"status": "updated", "post_id": post_id, "new_status": new_status}
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR in update_post_status: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/sites/{site_id}/posts/bulk-action")
async def bulk_post_action(
    site_id: str,
    action_data: dict,
    manager: ConnectionManager = Depends(get_conn_manager)
):
    """Perform bulk actions on multiple posts."""
    from sqlalchemy import text
    
    action = action_data.get("action")
    post_ids = action_data.get("post_ids", [])
    
    if not action or not post_ids:
        raise HTTPException(status_code=400, detail="Action and post_ids are required")
    
    try:
        engine = manager.get_engine(site_id)
        config = manager.get_config(site_id)
        
        # Use auto-discovery like content injection
        from services.content_orchestrator import ContentOrchestrator
        orchestrator = ContentOrchestrator()
        table_name = await orchestrator._resolve_target_table(site_id, engine, config)
        
        with engine.connect() as conn:
            if action == "publish":
                sql = text(f'''
                    UPDATE "{table_name}" 
                    SET status = 'published'
                    WHERE id = ANY(:ids)
                ''')
            elif action == "draft":
                sql = text(f'''
                    UPDATE "{table_name}" 
                    SET status = 'draft'
                    WHERE id = ANY(:ids)
                ''')
            elif action == "delete":
                sql = text(f'DELETE FROM "{table_name}" WHERE id = ANY(:ids)')
            else:
                raise HTTPException(status_code=400, detail=f"Unknown action: {action}")
            
            result = conn.execute(sql, {"ids": post_ids})
            conn.commit()
            
            return {
                "status": "success",
                "action": action,
                "affected_count": result.rowcount
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/sites/{site_id}/posts/{post_id}")
async def delete_post(
    site_id: str,
    post_id: int,
    manager: ConnectionManager = Depends(get_conn_manager)
):
    """Delete a single post."""
    from sqlalchemy import text
    
    try:
        engine = manager.get_engine(site_id)
        config = manager.get_config(site_id)
        
        # Use auto-discovery like content injection
        from services.content_orchestrator import ContentOrchestrator
        orchestrator = ContentOrchestrator()
        table_name = await orchestrator._resolve_target_table(site_id, engine, config)
        
        with engine.connect() as conn:
            sql = text(f'DELETE FROM "{table_name}" WHERE id = :id RETURNING id')
            result = conn.execute(sql, {"id": post_id})
            conn.commit()
            
            if result.rowcount == 0:
                raise HTTPException(status_code=404, detail="Post not found")
            
            return {"status": "deleted", "post_id": post_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# -- Scheduling Endpoints --

@app.post("/sites/{site_id}/posts/{post_id}/schedule", response_model=BlogScheduleResponse)
async def schedule_post(
    site_id: str,
    post_id: int,
    schedule_request: BlogScheduleRequest,
    orchestrator: ContentOrchestrator = Depends(get_orchestrator)
):
    """
    Schedule a blog post for future publication.
    """
    try:
        # Validate that the post_id matches the request
        if schedule_request.blog_id != post_id:
            raise HTTPException(status_code=400, detail="Post ID mismatch")
        
        # Validate that the site_id matches the request
        if schedule_request.site_id != site_id:
            raise HTTPException(status_code=400, detail="Site ID mismatch")
        
        result = await orchestrator.schedule_blog_post(
            post_id, 
            schedule_request.scheduled_at, 
            site_id
        )
        
        if result["success"]:
            return BlogScheduleResponse(
                success=True,
                message=result["message"],
                blog_id=result["blog_id"],
                scheduled_at=result["scheduled_at"]
            )
        else:
            return BlogScheduleResponse(
                success=False,
                message=result["message"]
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sites/{site_id}/scheduled-posts")
async def get_scheduled_posts(
    site_id: str,
    orchestrator: ContentOrchestrator = Depends(get_orchestrator)
):
    """
    Get all scheduled posts for a site.
    """
    try:
        result = await orchestrator.get_scheduled_posts(site_id)
        
        if result["success"]:
            return {
                "site_id": site_id,
                "scheduled_posts": result["scheduled_posts"],
                "count": len(result["scheduled_posts"])
            }
        else:
            raise HTTPException(status_code=400, detail=result["message"])
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/publish-scheduled-posts")
async def publish_scheduled_posts(
    site_id: str = None,
    orchestrator: ContentOrchestrator = Depends(get_orchestrator)
):
    """
    Publish all scheduled posts whose time has come.
    If site_id is provided, only process that site; otherwise process all sites.
    """
    try:
        result = await orchestrator.publish_scheduled_posts(site_id)
        
        if result["success"]:
            return {
                "status": "success",
                "processed_sites": result["results"],
                "timestamp": str(datetime.utcnow())
            }
        else:
            raise HTTPException(status_code=400, detail=result["message"])
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/sites/{site_id}/posts/{post_id}/unschedule")
async def unschedule_post(
    site_id: str,
    post_id: int,
    manager: ConnectionManager = Depends(get_conn_manager)
):
    """
    Unschedule a post (change status from 'scheduled' to 'draft').
    """
    from sqlalchemy import text
    
    try:
        engine = manager.get_engine(site_id)
        config = manager.get_config(site_id)
        
        # Use auto-discovery like content injection
        orchestrator = ContentOrchestrator()
        table_name = await orchestrator._resolve_target_table(site_id, engine, config)
        
        with engine.connect() as conn:
            sql = text(f'''
                UPDATE "{table_name}" 
                SET status = 'draft', scheduled_at = NULL
                WHERE id = :id AND status = 'scheduled'
                RETURNING id, status
            ''')
            result = conn.execute(sql, {"id": post_id})
            conn.commit()
            
            row = result.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Scheduled post not found")
            
            return {
                "status": "unscheduled", 
                "post_id": row[0], 
                "new_status": row[1],
                "message": "Post unscheduled successfully"
            }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
