from typing import Dict, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
import os
from sqlalchemy import create_engine, inspect
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel, validator

# Import database session and model
from database import AdminSessionLocal, SiteConnection


class DatabaseConfig(BaseModel):
    id: str  # Unique Site ID (e.g., "site_yoforex_001")
    name: str # Display Name (e.g., "YoForex WP")
    db_type: str = "postgresql" # postgresql, mysql, etc.
    connection_string: str # User-provided URI
    target_table_name: Optional[str] = None # Default content table (e.g., "wp_posts", "daily_analysis")
    # R2 Storage credentials (optional - if not provided, uses default from .env)
    r2_account_id: Optional[str] = None
    r2_access_key_id: Optional[str] = None
    r2_secret_access_key: Optional[str] = None
    r2_bucket_name: Optional[str] = None
    r2_public_url: Optional[str] = None

    @validator('connection_string', 'name', 'target_table_name', pre=True)
    def strip_whitespace(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v

    @validator('target_table_name', pre=True)
    def normalize_legacy_blog_table(cls, v):
        if isinstance(v, str) and v.strip().lower() in {"blog", "blogs"}:
            return "blogs"
        return v


class ConnectionManager:
    _instance = None
    
    def __init__(self):
        self.connections: Dict[str, DatabaseConfig] = {}
        self.engines: Dict[str, Engine] = {}
        # timestamped cache: { site_id: { "data": dict, "timestamp": float } }
        self.site_stats_cache: Dict[str, Dict] = {} 
        self.restore_workers = max(1, int(os.getenv("SITE_RESTORE_WORKERS", "6")))
        self.connect_timeout = max(1, int(os.getenv("SITE_DB_CONNECT_TIMEOUT", "5")))
        self.eager_restore = os.getenv("SITE_EAGER_RESTORE", "false").lower() in ("1", "true", "yes", "on")
        # Load persisted connections from database on startup
        self._load_connections()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _load_connections(self):
        """Load saved connections from database on startup."""
        try:
            session = AdminSessionLocal()
            saved_sites = session.query(SiteConnection).all()
            session.close()

            loaded_configs = []
            for site in saved_sites:
                try:
                    config = DatabaseConfig(**site.to_dict())
                    self.connections[config.id] = config
                    loaded_configs.append(config)
                except Exception as e:
                    print(f"Failed to parse saved connection {site.name}: {e}")

            if self.eager_restore and loaded_configs:
                self._warmup_connections_parallel(loaded_configs)
            else:
                print(f"Loaded {len(loaded_configs)} site config(s) (lazy connection mode)")
        except Exception as e:
            print(f"Error loading saved sites from database: {e}")

    def _warmup_connections_parallel(self, configs):
        """Optionally pre-connect configured sites in parallel."""
        work_items: Dict = {}
        with ThreadPoolExecutor(max_workers=min(self.restore_workers, len(configs) or 1)) as executor:
            for config in configs:
                future = executor.submit(self._create_engine_and_test, config)
                work_items[future] = config

            for future in as_completed(work_items):
                config = work_items[future]
                try:
                    engine = future.result()
                    self.engines[config.id] = engine
                    print(f"Restored connection: {config.name}")
                except Exception as e:
                    print(f"Restore skipped for {config.name}: {self._format_db_error(e)}")

    def _format_db_error(self, exc: Exception) -> str:
        """Return a short DB error message without SQLAlchemy docs noise."""
        message = str(exc)
        marker = "(Background on this error"
        if marker in message:
            message = message.split(marker)[0].strip()
        message = " ".join(message.split())
        return message

    def normalize_table_name(self, table_name: Optional[str]) -> str:
        """
        Normalize configured table names so legacy values like 'Blog'
        map to the actual default table used by most sites.
        """
        if not table_name:
            return "blogs"

        normalized = table_name.strip()
        if not normalized:
            return "blogs"

        if normalized.lower() in {"blog", "blogs"}:
            return "blogs"

        return normalized

    def resolve_table_name(self, engine: Engine, configured_table_name: Optional[str]) -> str:
        """
        Resolve the best queryable table name with recovery for common
        misconfigurations (case mismatch and singular/plural blog names).
        """
        target_table = self.normalize_table_name(configured_table_name)
        inspector = inspect(engine)

        # Prefer exact configured/default name first.
        has_exact = False
        try:
            has_exact = inspector.has_table(target_table)
        except Exception:
            has_exact = False

        if not has_exact:
            try:
                has_exact = inspector.has_table(target_table)
            except Exception:
                has_exact = False

        if has_exact:
            return target_table

        try:
            all_tables = inspector.get_table_names()
        except Exception:
            all_tables = inspector.get_table_names()

        if not all_tables:
            return target_table

        target_lower = target_table.lower()

        # Case-insensitive recovery, e.g. "Blogs" -> "blogs"
        match = next((t for t in all_tables if t.lower() == target_lower), None)
        if match:
            return match

        # Singular/plural recovery, e.g. "blog" <-> "blogs"
        fallback_candidates = []
        if target_lower.endswith("s"):
            fallback_candidates.append(target_lower[:-1])
        else:
            fallback_candidates.append(f"{target_lower}s")

        if target_lower not in {"blog", "blogs"}:
            fallback_candidates.extend(["blogs", "blog"])

        for candidate in fallback_candidates:
            match = next((t for t in all_tables if t.lower() == candidate), None)
            if match:
                return match

        return target_table

    def _build_engine_kwargs(self, config: DatabaseConfig) -> Dict:
        """Build SQLAlchemy engine kwargs with bounded connection timeout."""
        db_type = (config.db_type or "").lower()
        conn = (config.connection_string or "").lower()
        
        # SQLite doesn't support connection pooling size or timeouts in the same way
        if db_type == "sqlite" or conn.startswith("sqlite"):
            return {
                "pool_pre_ping": True,
                "connect_args": {"check_same_thread": False}
            }
            
        kwargs = {
            "pool_pre_ping": True,  # Verify connection is alive before using
            "pool_recycle": 300,    # Recycle connections after 5 minutes
            "pool_size": 5,
            "max_overflow": 10,
            "pool_timeout": max(1, self.connect_timeout),
        }

        connect_args = {}

        if db_type == "postgresql" or conn.startswith("postgresql"):
            connect_args["connect_timeout"] = self.connect_timeout
        elif db_type == "mysql" or conn.startswith("mysql"):
            connect_args["connect_timeout"] = self.connect_timeout

        if connect_args:
            kwargs["connect_args"] = connect_args

        return kwargs

    def _create_engine_and_test(self, config: DatabaseConfig) -> Engine:
        """Create an engine and immediately test connectivity."""
        engine = create_engine(
            config.connection_string,
            **self._build_engine_kwargs(config)
        )
        with engine.connect():
            pass
        return engine

    def _save_to_database(self, config: DatabaseConfig):
        """Save a single connection to the database."""
        try:
            session = AdminSessionLocal()
            
            # Check if site already exists
            existing = session.query(SiteConnection).filter(SiteConnection.id == config.id).first()
            
            if existing:
                # Update existing record
                existing.name = config.name
                existing.db_type = config.db_type
                existing.connection_string = config.connection_string
                existing.target_table_name = self.normalize_table_name(config.target_table_name)
                # Update R2 credentials
                existing.r2_account_id = config.r2_account_id
                existing.r2_access_key_id = config.r2_access_key_id
                existing.r2_secret_access_key = config.r2_secret_access_key
                existing.r2_bucket_name = config.r2_bucket_name
                existing.r2_public_url = config.r2_public_url
            else:
                # Create new record
                site_conn = SiteConnection(
                    id=config.id,
                    name=config.name,
                    db_type=config.db_type,
                    connection_string=config.connection_string,
                    target_table_name=self.normalize_table_name(config.target_table_name),
                    # R2 credentials
                    r2_account_id=config.r2_account_id,
                    r2_access_key_id=config.r2_access_key_id,
                    r2_secret_access_key=config.r2_secret_access_key,
                    r2_bucket_name=config.r2_bucket_name,
                    r2_public_url=config.r2_public_url
                )
                session.add(site_conn)
            
            session.commit()
            session.close()
            print(f"Saved site '{config.name}' to database")
        except Exception as e:
            print(f"Error saving site to database: {e}")
            raise e

    def _delete_from_database(self, site_id: str):
        """Delete a connection from the database."""
        try:
            session = AdminSessionLocal()
            site = session.query(SiteConnection).filter(SiteConnection.id == site_id).first()
            if site:
                session.delete(site)
                session.commit()
            session.close()
            print(f"Deleted site '{site_id}' from database")
        except Exception as e:
            print(f"Error deleting site from database: {e}")
            raise e

    def _connect_without_save(self, config: DatabaseConfig):
        """Connect to a database without saving to database (used for loading)."""
        engine = self._create_engine_and_test(config)
        self.connections[config.id] = config
        self.engines[config.id] = engine
        return True

    def add_connection(self, config: DatabaseConfig):
        """Register a new external database connection and persist it to database."""
        try:
            self._connect_without_save(config)
            print(f"Successfully connected to {config.name}")
            # Save to database for persistence
            self._save_to_database(config)
            return True
        except Exception as e:
            print(f"Failed to connect to {config.name}: {e}")
            raise e

    def delete_connection(self, site_id: str):
        """Remove a site connection and update database."""
        if site_id not in self.connections:
            raise ValueError(f"No site found with ID: {site_id}")
        
        # Close the engine connection pool
        if site_id in self.engines:
            try:
                self.engines[site_id].dispose()
            except Exception as e:
                print(f"Error disposing engine for {site_id}: {e}")
            del self.engines[site_id]
        
        # Remove from connections
        site_name = self.connections[site_id].name
        del self.connections[site_id]
        
        # Delete from database
        self._delete_from_database(site_id)
        
        print(f"Deleted connection: {site_name} ({site_id})")
        return True

    def get_engine(self, site_id: str) -> Engine:
        if site_id in self.engines:
            return self.engines[site_id]

        if site_id not in self.connections:
            raise ValueError(f"No config for site ID: {site_id}")

        config = self.connections[site_id]
        try:
            engine = self._create_engine_and_test(config)
            self.engines[site_id] = engine
            return engine
        except SQLAlchemyError as e:
            raise ValueError(f"Connection failed for {config.name}: {self._format_db_error(e)}")
        except Exception as e:
            raise ValueError(f"Connection failed for {config.name}: {e}")

    def get_config(self, site_id: str) -> DatabaseConfig:
        if site_id not in self.connections:
            raise ValueError(f"No config for site ID: {site_id}")
        return self.connections[site_id]
        
    def list_sites(self):
        return [
            {"id": k, "name": v.name, "target_table": v.target_table_name} 
            for k, v in self.connections.items()
        ]

    def update_site_config(self, site_id: str, updates: Dict[str, any]):
        """Update specific fields of a site configuration."""
        if site_id not in self.connections:
            raise ValueError(f"No site found with ID: {site_id}")
            
        current_config = self.connections[site_id]
        normalized_target_table_name = None
        if 'target_table_name' in updates:
            normalized_target_table_name = self.normalize_table_name(updates['target_table_name'])
        
        # Apply updates to in-memory config
        if 'target_table_name' in updates:
            current_config.target_table_name = normalized_target_table_name
        if 'name' in updates:
            current_config.name = updates['name']
        if 'r2_account_id' in updates:
            current_config.r2_account_id = updates['r2_account_id']
        if 'r2_access_key_id' in updates:
            current_config.r2_access_key_id = updates['r2_access_key_id']
        if 'r2_secret_access_key' in updates:
            current_config.r2_secret_access_key = updates['r2_secret_access_key']
        if 'r2_bucket_name' in updates:
            current_config.r2_bucket_name = updates['r2_bucket_name']
        if 'r2_public_url' in updates:
            current_config.r2_public_url = updates['r2_public_url']
        
        # Save updates directly to database
        try:
            session = AdminSessionLocal()
            site = session.query(SiteConnection).filter(SiteConnection.id == site_id).first()
            if site:
                if 'target_table_name' in updates:
                    site.target_table_name = normalized_target_table_name
                if 'name' in updates:
                    site.name = updates['name']
                if 'r2_account_id' in updates:
                    site.r2_account_id = updates['r2_account_id']
                if 'r2_access_key_id' in updates:
                    site.r2_access_key_id = updates['r2_access_key_id']
                if 'r2_secret_access_key' in updates:
                    site.r2_secret_access_key = updates['r2_secret_access_key']
                if 'r2_bucket_name' in updates:
                    site.r2_bucket_name = updates['r2_bucket_name']
                if 'r2_public_url' in updates:
                    site.r2_public_url = updates['r2_public_url']
                session.commit()
            session.close()
        except Exception as e:
            print(f"Error updating site in database: {e}")
            raise e
        
        self.connections[site_id] = current_config
        
        print(f"Updated config for site {site_id}")
        return current_config
    
    def get_cached_stats(self, site_id: str) -> Optional[Dict]:
        """Get cached stats for a site if available."""
        return self.site_stats_cache.get(site_id)

    async def refresh_site_stats(self, site_id: str):
        """
        Connect to the site DB and update the stats cache.
        This is an async method intended to be run in background or on-demand.
        """
        import time
        from sqlalchemy import text
        
        if site_id not in self.connections:
            return None
            
        config = self.connections[site_id]
        table_name = self.normalize_table_name(config.target_table_name)
        
        stats = {
            "id": site_id,
            "name": config.name,
            "table": table_name,
            "total_posts": 0,
            "status": "error",
            "last_updated": time.time()
        }
        
        try:
            # We use the existing synchronous engine but run the query
            # inside a thread pool if called from async context (handled by FastAPI usually)
            # For now, we just execute it.
            engine = self.get_engine(site_id)
            table_name = self.resolve_table_name(engine, config.target_table_name)
            stats["table"] = table_name
            
            with engine.connect() as conn:
                count_sql = text(f'SELECT COUNT(*) as total FROM "{table_name}"')
                result = conn.execute(count_sql)
                total_posts = result.scalar() or 0
                
                stats["total_posts"] = total_posts
                stats["status"] = "connected"
                
        except Exception as e:
            stats["error"] = str(e)
            print(f"Error refreshing stats for {site_id}: {e}")
            
        # Update cache
        self.site_stats_cache[site_id] = stats
        return stats
