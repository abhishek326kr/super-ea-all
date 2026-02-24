"""
Database module for the Admin application.
Provides SQLAlchemy models and session management for storing site connections.
"""
from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in environment variables")

# Create engine for admin database
admin_engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=5,
    max_overflow=10
)

# Session factory
AdminSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=admin_engine)

# Base class for models
Base = declarative_base()


class SiteConnection(Base):
    """Model for storing site database configurations."""
    __tablename__ = "site_connections"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    db_type = Column(String, default="postgresql")
    connection_string = Column(String, nullable=False)
    target_table_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # R2 Storage credentials (optional - if NULL, uses default from .env)
    r2_account_id = Column(String, nullable=True)
    r2_access_key_id = Column(String, nullable=True)
    r2_secret_access_key = Column(String, nullable=True)
    r2_bucket_name = Column(String, nullable=True)
    r2_public_url = Column(String, nullable=True)
    
    def to_dict(self):
        """Convert model to dictionary for API responses."""
        return {
            "id": self.id,
            "name": self.name,
            "db_type": self.db_type,
            "connection_string": self.connection_string,
            "target_table_name": self.target_table_name,
            "r2_account_id": self.r2_account_id,
            "r2_access_key_id": self.r2_access_key_id,
            "r2_secret_access_key": "***" if self.r2_secret_access_key else None,  # Mask for security
            "r2_bucket_name": self.r2_bucket_name,
            "r2_public_url": self.r2_public_url,
            "has_custom_r2": bool(self.r2_account_id),  # Helper flag for frontend
        }


class Category(Base):
    """Model for storing Categories globally for the super admin."""
    __tablename__ = "categories"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }



def get_admin_db_session():
    """Get a database session for admin operations."""
    session = AdminSessionLocal()
    try:
        yield session
    finally:
        session.close()


def init_db():
    """Initialize database tables."""
    print("Initializing admin database tables...")
    Base.metadata.create_all(bind=admin_engine)
    print("Admin database tables created successfully!")
