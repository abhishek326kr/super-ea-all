from typing import List, Dict, Any
from sqlalchemy import text, inspect
from datetime import datetime
from schemas import ContentGenerationRequest
from services.connection_manager import ConnectionManager
from services.schema_discovery import SchemaDiscovery
from services.xai_engine import ContentGenerator
from services.name_generator import get_random_american_name
import time

# Cache TTL in seconds (30 minutes)
SCHEMA_CACHE_TTL = 1800

class ContentOrchestrator:
    # Class-level caches (shared across instances)
    _schema_cache: Dict[str, Dict] = {}  # key: "site_id:table_name" -> { "columns": [...], "timestamp": ... }
    _seo_cache: Dict[str, Dict] = {}     # key: "site_id:table_name" -> { "seo_info": {...}, "timestamp": ... }
    
    def __init__(self):
        self.conn_manager = ConnectionManager.get_instance()
        self.gemini = ContentGenerator()

    async def validate_distribution(self, req: ContentGenerationRequest, target_site_ids: List[str]):
        from schemas import SiteValidationResult, ValidationResponse # Lazy import to avoid circular dependency if any
        
        results = []
        has_issues = False

        for site_id in target_site_ids:
            try:
                # 1. Get Connection & Config
                engine = self.conn_manager.get_engine(site_id)
                config = self.conn_manager.get_config(site_id)
                
                # 2. Discover Schema
                # 2. Discover Schema (Auto-Resolution)
                target_table = await self._resolve_target_table(site_id, engine, config)
                
                discovery = SchemaDiscovery(engine)
                schema_prompt = discovery.get_structure_for_prompt(target_table)
                
                # 3. Validate
                validation_data = await self.gemini.validate_content_against_schema(req, schema_prompt)
                missing_fields = validation_data.get("missing_fields", [])
                
                is_valid = len(missing_fields) == 0
                if not is_valid:
                    has_issues = True
                
                results.append(SiteValidationResult(
                    site_id=site_id,
                    valid=is_valid,
                    missing_fields=missing_fields
                ))
                
            except Exception as e:
                print(f"Validation error for {site_id}: {e}")
                has_issues = True
                results.append(SiteValidationResult(
                    site_id=site_id,
                    valid=False,
                    missing_fields=[],
                    message=str(e)
                ))

        return ValidationResponse(results=results, has_issues=has_issues)

    async def orchestrate_distribution(self, req: ContentGenerationRequest, target_site_ids: List[str], supplementary_data: Dict[str, Dict[str, Any]] = None):
        results = []

        for site_id in target_site_ids:
            try:
                print(f"Starting orchestration for site: {site_id}")
                
                # 1. Get Connection & Config
                engine = self.conn_manager.get_engine(site_id)
                config = self.conn_manager.get_config(site_id)
                
                # 2. Discover Schema
                # 2. Discover Schema (Auto-Resolution)
                target_table = await self._resolve_target_table(site_id, engine, config)
                
                discovery = SchemaDiscovery(engine)
                schema_prompt = discovery.get_structure_for_prompt(target_table)
                
                # 3. Generate Schema-Specific Content
                print(f"Generating content for table: {target_table} with status: {req.distribution.post_status} ...")
                
                # Handle scheduling
                post_status = req.distribution.post_status.lower()
                if post_status == "schedule" and req.distribution.scheduled_at:
                    post_status = "scheduled"
                
                content_payload = await self.gemini.generate_schema_aware_content(
                    req, 
                    schema_prompt, 
                    post_status=post_status
                )
                
                # Add scheduled_at if scheduling
                if post_status == "scheduled" and req.distribution.scheduled_at:
                    content_payload["scheduled_at"] = req.distribution.scheduled_at
                
                # 4. Merge Supplementary Data (if any)
                if supplementary_data and site_id in supplementary_data:
                    print(f"Merging supplementary data for {site_id}...")
                    content_payload.update(supplementary_data[site_id])

                # 5. Inject into DB
                # Ensure complex dicts are serialized for JSONB columns if needed
                # (SQLAlchemy often handles this but explicit checks help for raw text queries)
                blog_id = self._inject_content(engine, target_table, content_payload, site_id)
                
                # 6. Inject Category Relation (if category is provided)
                category_name = req.distribution.category
                if getattr(req.distribution, 'category', None) and blog_id:
                    self._inject_category_relation(engine, blog_id, req.distribution.category)
                
                results.append({"site_id": site_id, "status": "success", "table": target_table, "blog_id": blog_id})
                
            except Exception as e:
                print(f"Error distributing to {site_id}: {e}")
                results.append({"site_id": site_id, "status": "failed", "error": str(e)})

        return results

    async def preview_distribution(self, req: ContentGenerationRequest, target_site_ids: List[str], table_overrides: Dict[str, str] = None):
        results = []
        for site_id in target_site_ids:
            try:
                engine = self.conn_manager.get_engine(site_id)
                config = self.conn_manager.get_config(site_id)
                
                # Check for override first
                override_table = table_overrides.get(site_id) if table_overrides else None
                target_table = await self._resolve_target_table(site_id, engine, config, override_table)
                
                discovery = SchemaDiscovery(engine)
                schema_prompt = discovery.get_structure_for_prompt(target_table)
                
                # FIX: Use the requested status from the request, NOT hardcoded "Draft"
                # But typically previews ARE drafts. However, user wants to see what it looks like with "Publish Immediately".
                # If we want to strictly preview what will happen, we should respect the request.
                # BUT, usually preview means "don't save to DB".
                # I will use the requested status so the 'status' field in the generated JSON is correct.
                content_payload = await self.gemini.generate_schema_aware_content(
                    req, 
                    schema_prompt,
                    post_status=req.distribution.post_status 
                )
                
                results.append({
                    "site_id": site_id,
                    "target_table": target_table,
                    "preview_content": content_payload
                })
            except Exception as e:
                results.append({"site_id": site_id, "error": str(e)})
        return results

    async def inject_edited_content(self, injections: List[Any]):
        """
        Inject pre-edited content into databases without regeneration.
        Used after user reviews and edits the preview content.
        """
        results = []
        for injection in injections:
            try:
                engine = self.conn_manager.get_engine(injection.site_id)
                blog_id = self._inject_content(engine, injection.target_table, injection.content, injection.site_id)
                results.append({
                    "site_id": injection.site_id, 
                    "status": "success", 
                    "table": injection.target_table,
                    "blog_id": blog_id
                })
            except Exception as e:
                print(f"Error injecting to {injection.site_id}: {e}")
                results.append({
                    "site_id": injection.site_id, 
                    "status": "failed", 
                    "error": str(e)
                })
        return results

    async def schedule_blog_post(self, blog_id: int, scheduled_at: datetime, site_id: str):
        """Schedule an existing blog post for future publication"""
        try:
            engine = self.conn_manager.get_engine(site_id)
            config = self.conn_manager.get_config(site_id)
            
            # Get the target table
            target_table = await self._resolve_target_table(site_id, engine, config)
            
            # Update the blog post status and add scheduled_at
            with engine.connect() as conn:
                # Check if scheduled_at column exists, if not add it
                inspector = inspect(engine)
                columns = [col['name'].lower() for col in inspector.get_columns(target_table)]
                
                if 'scheduled_at' not in columns:
                    # Add scheduled_at column
                    conn.execute(text(f'ALTER TABLE "{target_table}" ADD COLUMN "scheduled_at" TIMESTAMP'))
                
                # Update the blog post
                update_sql = text(f'''
                    UPDATE "{target_table}" 
                    SET status = :status, scheduled_at = :scheduled_at 
                    WHERE id = :blog_id
                ''')
                
                conn.execute(update_sql, {
                    'status': 'scheduled',
                    'scheduled_at': scheduled_at,
                    'blog_id': blog_id
                })
                conn.commit()
                
                return {
                    "success": True,
                    "message": f"Blog post {blog_id} scheduled for {scheduled_at}",
                    "blog_id": blog_id,
                    "scheduled_at": scheduled_at
                }
                
        except Exception as e:
            print(f"Error scheduling blog post {blog_id} on {site_id}: {e}")
            return {
                "success": False,
                "message": str(e),
                "blog_id": blog_id
            }

    async def get_scheduled_posts(self, site_id: str):
        """Get all scheduled posts for a site"""
        try:
            engine = self.conn_manager.get_engine(site_id)
            config = self.conn_manager.get_config(site_id)
            
            # Get the target table
            target_table = await self._resolve_target_table(site_id, engine, config)
            
            with engine.connect() as conn:
                # Query scheduled posts
                query_sql = text(f'''
                    SELECT id, title, scheduled_at, status 
                    FROM "{target_table}" 
                    WHERE status = 'scheduled'
                    ORDER BY scheduled_at ASC
                ''')
                
                result = conn.execute(query_sql)
                scheduled_posts = []
                
                for row in result:
                    scheduled_posts.append({
                        "id": row.id,
                        "title": row.title,
                        "scheduled_at": row.scheduled_at,
                        "status": row.status,
                        "site_id": site_id
                    })
                
                return {
                    "success": True,
                    "scheduled_posts": scheduled_posts
                }
                
        except Exception as e:
            print(f"Error getting scheduled posts for {site_id}: {e}")
            return {
                "success": False,
                "message": str(e),
                "scheduled_posts": []
            }

    async def publish_scheduled_posts(self, site_id: str = None):
        """Publish scheduled posts whose time has come"""
        try:
            sites_to_process = [site_id] if site_id else [site['id'] for site in self.conn_manager.list_sites()]
            results = []
            
            for current_site_id in sites_to_process:
                try:
                    engine = self.conn_manager.get_engine(current_site_id)
                    config = self.conn_manager.get_config(current_site_id)
                    
                    # Get the target table
                    target_table = await self._resolve_target_table(current_site_id, engine, config)
                    
                    with engine.connect() as conn:
                        # Find posts ready to publish
                        query_sql = text(f'''
                            UPDATE "{target_table}" 
                            SET status = 'published', scheduled_at = NULL
                            WHERE status = 'scheduled' 
                            AND scheduled_at <= NOW()
                            RETURNING id, title
                        ''')
                        
                        result = conn.execute(query_sql)
                        published_posts = []
                        
                        for row in result:
                            published_posts.append({
                                "id": row.id,
                                "title": row.title
                            })
                        
                        conn.commit()
                        
                        if published_posts:
                            results.append({
                                "site_id": current_site_id,
                                "published_count": len(published_posts),
                                "published_posts": published_posts
                            })
                            
                except Exception as e:
                    print(f"Error processing scheduled posts for {current_site_id}: {e}")
                    results.append({
                        "site_id": current_site_id,
                        "error": str(e)
                    })
            
            return {
                "success": True,
                "results": results
            }
            
        except Exception as e:
            print(f"Error in publish_scheduled_posts: {e}")
            return {
                "success": False,
                "message": str(e)
            }

    async def _resolve_target_table(self, site_id, engine, config, override_table: str = None) -> str:
        target_name = None
        
        if override_table:
            print(f"Using override table for {site_id}: {override_table}")
            target_name = override_table
        elif config.target_table_name:
            target_name = config.target_table_name
        else:
            print(f"Target table not specified for {site_id}. Initiating Auto-Discovery...")
            discovery = SchemaDiscovery(engine)
            all_tables = discovery.get_all_table_names()
            
            best_table = await self.gemini.identify_best_content_table(all_tables)
            
            if not best_table:
                raise ValueError(f"Could not auto-discover a suitable content table for {site_id}")
                
            print(f"Auto-Discovered target table: {best_table}")
            target_name = best_table

        # Case-Insensitivity Check: Verify if table exists exactly as requested
        from sqlalchemy import inspect
        inspector = inspect(engine)
        if not inspector.has_table(target_name):
            print(f"[RECOVERY] Table '{target_name}' not found. Checking for case-insensitive matches...")
            all_tables = inspector.get_table_names()
            match = next((t for t in all_tables if t.lower() == target_name.lower()), None)
            
            if match:
                print(f"[RECOVERY] Found case-insensitive match: '{target_name}' -> '{match}'")
                return match
            else:
                # Singular/plural recovery, especially for legacy Blog/blogs mismatch.
                target_lower = target_name.lower()
                plural_candidates = []
                if target_lower.endswith("s"):
                    plural_candidates.append(target_lower[:-1])
                else:
                    plural_candidates.append(f"{target_lower}s")

                if target_lower not in {"blog", "blogs"}:
                    plural_candidates.extend(["blogs", "blog"])

                plural_match = next(
                    (t for t in all_tables if t.lower() in plural_candidates),
                    None
                )

                if plural_match:
                    print(f"[RECOVERY] Found singular/plural match: '{target_name}' -> '{plural_match}'")
                    return plural_match

                # If no match found, raise the error now or let the caller fail
                print(f"[RECOVERY] No case-insensitive or singular/plural match found for '{target_name}'")
        
        return target_name

    async def discover_suitable_tables(self, site_id: str) -> Dict[str, Any]:
        """
        Discovers potential content tables for a given site.
        """
        engine = self.conn_manager.get_engine(site_id)
        
        # 1. Get all tables
        discovery = SchemaDiscovery(engine)
        all_tables = discovery.get_all_table_names()
        
        # 2. Try Gemini first, fallback to heuristic if quota exceeded
        try:
            candidates = await self.gemini.identify_candidate_tables(all_tables)
        except Exception as e:
            print(f"Gemini API failed for table discovery: {e}. Using heuristic fallback.")
            # Heuristic fallback: look for common content table names
            candidates = self._heuristic_identify_tables(all_tables)
        
        return {
            "site_id": site_id,
            "total_tables": len(all_tables),
            "candidates": candidates.get("candidates", []),
            "best_match": candidates.get("best_match"),
            "all_tables": all_tables # Useful for manual override
        }

    def _heuristic_identify_tables(self, table_names: list) -> Dict[str, Any]:
        """
        Simple heuristic to identify content tables without AI.
        Looks for common patterns like 'blog', 'post', 'article', 'content', etc.
        """
        content_keywords = ['blog', 'post', 'article', 'content', 'news', 'entry', 'story', 'page']
        ignore_keywords = ['tag', 'category', 'comment', 'user', 'session', 'migration', 'log', 'setting', 'seo', 'meta']
        
        candidates = []
        for table in table_names:
            table_lower = table.lower()
            # Skip tables that look like join tables or system tables
            if any(ignore in table_lower for ignore in ignore_keywords):
                continue
            # Check if table name contains content keywords
            if any(keyword in table_lower for keyword in content_keywords):
                candidates.append(table)
        
        # If no matches found by keywords, just return tables that don't look like system tables
        if not candidates:
            for table in table_names:
                table_lower = table.lower()
                if not any(ignore in table_lower for ignore in ignore_keywords):
                    # Prefer shorter table names (usually main content tables)
                    if len(table) < 20:
                        candidates.append(table)
        
        # Sort by relevance (exact match for 'blog' or 'Blog' first)
        def sort_key(name):
            lower = name.lower()
            if lower == 'blog':
                return 0
            if lower == 'post' or lower == 'posts':
                return 1
            if 'blog' in lower:
                return 2
            if 'post' in lower:
                return 3
            return 10
        
        candidates.sort(key=sort_key)
        
        return {
            "candidates": candidates[:5],  # Return top 5
            "best_match": candidates[0] if candidates else None
        }

    def _detect_seo_table(self, engine, main_table: str, site_id: str = None) -> Dict[str, Any]:
        """
        Detect if there's a separate SEO/meta table related to the main content table.
        Returns table name and foreign key column if found, None otherwise.
        Uses cache to avoid repeated database introspection.
        """
        from sqlalchemy import inspect
        
        # Generate cache key
        cache_key = f"{site_id or str(engine.url)}:{main_table}"
        
        # Check cache first
        if cache_key in ContentOrchestrator._seo_cache:
            cached = ContentOrchestrator._seo_cache[cache_key]
            if time.time() - cached["timestamp"] < SCHEMA_CACHE_TTL:
                print(f"[SEO CACHE HIT] Using cached SEO info for {main_table}")
                return cached["seo_info"]
            else:
                print(f"[SEO CACHE EXPIRED] Refreshing cache for {main_table}")
        
        inspector = inspect(engine)
        all_tables = inspector.get_table_names()
        
        # Common SEO table name patterns
        seo_patterns = [
            f"{main_table}_seo",
            f"{main_table}_meta",
            "seo_meta",
            "blog_seo",
            "post_seo",
            "seo_data",
            "meta_data",
            "SeoMeta",
            "BlogSeo"
        ]
        
        seo_info = None
        
        # Try exact matches first
        for pattern in seo_patterns:
            if pattern in all_tables or pattern.lower() in [t.lower() for t in all_tables]:
                # Find the actual table name (case-sensitive)
                seo_table = next((t for t in all_tables if t.lower() == pattern.lower()), None)
                if seo_table:
                    # Try to find the foreign key column
                    fk_col = self._find_foreign_key_column(engine, seo_table, main_table)
                    if fk_col:
                        print(f"[SEO DETECTION] Found SEO table: {seo_table} with FK: {fk_col}")
                        seo_info = {"table": seo_table, "fk_column": fk_col}
                        break
        
        # Check for tables with 'seo' or 'meta' in the name (if not found yet)
        if not seo_info:
            for table in all_tables:
                table_lower = table.lower()
                if 'seo' in table_lower or 'meta' in table_lower:
                    # Verify it has a foreign key to main table
                    fk_col = self._find_foreign_key_column(engine, table, main_table)
                    if fk_col:
                        print(f"[SEO DETECTION] Found SEO table: {table} with FK: {fk_col}")
                        seo_info = {"table": table, "fk_column": fk_col}
                        break
        
        # Cache the result (even if None to avoid repeated lookups)
        ContentOrchestrator._seo_cache[cache_key] = {
            "seo_info": seo_info,
            "timestamp": time.time()
        }
        print(f"[SEO CACHE MISS] Cached SEO detection result for {main_table}")
        
        return seo_info
    
    def _find_foreign_key_column(self, engine, seo_table: str, main_table: str) -> str:
        """
        Find the foreign key column in SEO table that references the main table.
        """
        from sqlalchemy import inspect
        
        inspector = inspect(engine)
        
        try:
            # Get foreign keys for the SEO table
            foreign_keys = inspector.get_foreign_keys(seo_table)

            for fk in foreign_keys:
                if fk['referred_table'].lower() == main_table.lower():
                    # Return the local column name
                    return fk['constrained_columns'][0] if fk['constrained_columns'] else None

            # If no FK constraint found, try common column name patterns
            columns = inspector.get_columns(seo_table)
            common_fk_names = [
                f"{main_table}_id",
                f"{main_table}_integer",
                "blog_id",
                "blog_integer",
                "post_id",
                "post_integer",
                "content_id"
            ]
            
            for col in columns:
                col_lower = col['name'].lower()
                if col_lower in common_fk_names or col_lower == f"{main_table.lower()}_id":
                    print(f"[SEO DETECTION] Inferred FK column: {col['name']} (no explicit constraint)")
                    return col['name']
                    
        except Exception as e:
            print(f"[SEO DETECTION] Error finding FK: {e}")
        
        return None
    
    def _split_seo_payload(self, payload: Dict[str, Any]) -> tuple[Dict[str, Any], Dict[str, Any]]:
        """
        Split payload into blog content and SEO metadata.
        Returns (blog_payload, seo_payload)
        
        IMPORTANT: The 'title' field is duplicated in BOTH payloads since:
        - Blog table needs it for display on the website
        - SEO table needs it for meta tags and SEO purposes
        """
        # SEO field patterns to extract
        seo_field_patterns = [
            'seo_title', 'meta_title', 'og_title',
            'seo_description', 'meta_description', 'og_description',
            'seo_keywords', 'meta_keywords', 'keywords',
            'seo_slug', 'canonical_url',
            'meta_robots', 'og_image', 'og_type',
            'twitter_card', 'twitter_title', 'twitter_description'
        ]
        
        blog_payload = {}
        seo_payload = {}
        
        # First, find the title field (it has various possible names)
        title_value = None
        title_key = None
        title_field_names = ['title', 'h1', 'headline', 'post_title', 'blog_title', 'seo_title', 'meta_title']
        
        for key, value in payload.items():
            key_lower = key.lower().replace('_', '').replace(' ', '')
            for title_field in title_field_names:
                title_field_norm = title_field.lower().replace('_', '').replace(' ', '')
                if key_lower == title_field_norm or title_field_norm in key_lower:
                    title_value = value
                    title_key = key
                    break
            if title_value:
                break
        
        # Process all fields
        for key, value in payload.items():
            key_lower = key.lower().replace('_', '')
            
            # Check if this is an SEO field
            is_seo = False
            for pattern in seo_field_patterns:
                pattern_norm = pattern.lower().replace('_', '')
                if pattern_norm in key_lower or key_lower in pattern_norm:
                    seo_payload[key] = value
                    is_seo = True
                    break
            
            if not is_seo:
                blog_payload[key] = value
        
        # CRITICAL: Ensure title is in BOTH payloads
        # This is needed because:
        # 1. The website fetches title from the blog table for display
        # 2. SEO metadata also needs the title for meta tags
        if title_value and title_key:
            # Make sure it's in blog_payload
            if title_key not in blog_payload:
                blog_payload[title_key] = title_value
                print(f"[TITLE INJECTION] Added title to blog_payload: {title_key}")
            
            # Make sure it's in seo_payload
            if title_key not in seo_payload:
                seo_payload[title_key] = title_value
                print(f"[TITLE INJECTION] Added title to seo_payload: {title_key}")
        
        return blog_payload, seo_payload

    def _inject_seo_data(self, conn, seo_table: str, fk_column: str, blog_id: int, seo_payload: Dict[str, Any], engine):
        """
        Insert SEO metadata into the SEO table with foreign key reference to blog.
        """
        import json
        from sqlalchemy import inspect, text
        
        print(f"[SEO INJECT] Inserting SEO data into {seo_table} for blog ID: {blog_id}")

        # Introspect SEO table
        inspector = inspect(engine)
        seo_columns_info = inspector.get_columns(seo_table)
        seo_table_map = {}
        
        for col in seo_columns_info:
            norm_name = col['name'].lower().replace('_', '').replace(' ', '')
            seo_table_map[norm_name] = {
                'name': col['name'],
                'type': col['type'],
                'nullable': col['nullable']
            }
            seo_table_map[col['name'].lower()] = seo_table_map[norm_name]
        
        # Build SEO final payload
        seo_final_payload = {
            fk_column: blog_id  # Foreign key to blog
        }
        
        # Map SEO fields to actual column names
        for key, value in seo_payload.items():
            # Try to find matching column
            key_norm = key.lower().replace('_', '').replace(' ', '')
            
            # First, try exact match (normalized)
            if key_norm in seo_table_map:
                actual_col_name = seo_table_map[key_norm]['name']
                seo_final_payload[actual_col_name] = value
                print(f"[SEO MAP] {key} -> {actual_col_name}")
            # Try exact lowercase match
            elif key.lower() in seo_table_map:
                actual_col_name = seo_table_map[key.lower()]['name']
                seo_final_payload[actual_col_name] = value
                print(f"[SEO MAP] {key} -> {actual_col_name}")
            else:
                # Try fuzzy match with enhanced title handling
                matched = False
                
                # Special handling for title fields
                if any(t in key_norm for t in ['title', 'headline', 'h1']):
                    # Look for any title-related column in SEO table
                    for norm, col_info in seo_table_map.items():
                        col_norm = norm.replace('_', '').replace(' ', '')
                        if 'title' in col_norm or 'headline' in col_norm:
                            seo_final_payload[col_info['name']] = value
                            print(f"[SEO MAP - TITLE] {key} -> {col_info['name']}")
                            matched = True
                            break
                
                # General fuzzy match if not matched yet
                if not matched:
                    for norm, col_info in seo_table_map.items():
                        if key_norm in norm or norm in key_norm:
                            seo_final_payload[col_info['name']] = value
                            print(f"[SEO MAP - FUZZY] {key} -> {col_info['name']}")
                            matched = True
                            break
                
                if not matched:
                    print(f"[SEO MAP - SKIP] Could not map field: {key}")
                    
        # Prisma SQLite NOT NULL fallback: Auto-fill typical timestamp fields if they exist but were not provided
        for norm, col_info in seo_table_map.items():
            if col_info['name'] not in seo_final_payload and not col_info['nullable']:
                from datetime import datetime
                col_lower = col_info['name'].lower()
                if "updatedat" in col_lower or "createdat" in col_lower or "updated_at" in col_lower or "created_at" in col_lower:
                    seo_final_payload[col_info['name']] = datetime.utcnow()
                    print(f"[SEO MAP - AUTOFILL] Auto-filled non-nullable timestamp: {col_info['name']}")
        
        if len(seo_final_payload) > 1:  # More than just the FK
            # Serialize complex types
            clean_seo_payload = {}
            for k, v in seo_final_payload.items():
                if isinstance(v, (dict, list)):
                    clean_seo_payload[k] = json.dumps(v)
                else:
                    clean_seo_payload[k] = v
            
            # Build INSERT query
            columns_sql = ", ".join([f'"{k}"' for k in clean_seo_payload.keys()])
            placeholders_sql = ", ".join([f":{k}" for k in clean_seo_payload.keys()])
            
            seo_sql = text(f'INSERT INTO "{seo_table}" ({columns_sql}) VALUES ({placeholders_sql})')
            
            conn.execute(seo_sql, clean_seo_payload)
            print(f"[SEO INJECT] Successfully inserted {len(clean_seo_payload)-1} SEO fields into {seo_table}")
        else:
            print(f"[SEO INJECT] No SEO fields to insert (only FK)")

    def _inject_content(self, engine, table_name: str, payload: Dict[str, Any], site_id: str = None) -> int:
        """
        Dynamically inserts the payload dictionary into the table with Smart Mapping and Auto-Filling.
        NOW SUPPORTS MULTI-TABLE INJECTION for SEO metadata!
        Uses schema cache for improved performance.
        """
        import json
        from sqlalchemy import inspect, text
        from datetime import datetime
        
        # 0. DETECT SEO TABLE (if exists) - now uses cache
        seo_table_info = self._detect_seo_table(engine, table_name, site_id)
        
        # If SEO table exists, split the payload
        if seo_table_info:
            print(f"[MULTI-TABLE] Detected SEO table: {seo_table_info['table']}")
            blog_payload, seo_payload = self._split_seo_payload(payload)
            print(f"[MULTI-TABLE] Split payload - Blog fields: {len(blog_payload)}, SEO fields: {len(seo_payload)}")
            
            # Use blog_payload for main insert
            payload = blog_payload
        else:
            seo_payload = None
            print(f"[SINGLE-TABLE] No SEO table detected, using single-table injection")
        
        # 1. Introspect Table (with caching)
        cache_key = f"{site_id or str(engine.url)}:{table_name}"
        
        # Check schema cache first
        cached_schema = None
        if cache_key in ContentOrchestrator._schema_cache:
            cached = ContentOrchestrator._schema_cache[cache_key]
            if time.time() - cached["timestamp"] < SCHEMA_CACHE_TTL:
                print(f"[SCHEMA CACHE HIT] Using cached schema for {table_name}")
                cached_schema = cached
        
        if cached_schema:
            columns_info = cached_schema["columns_info"]
            table_map = cached_schema["table_map"]
        else:
            # Cache miss - do full introspection
            print(f"[SCHEMA CACHE MISS] Introspecting table {table_name}")
            inspector = inspect(engine)
            try:
                columns_info = inspector.get_columns(table_name)
                # Map simplified names to actual column names (e.g., 'title' -> 'Title', 'post_title' -> 'Title')
                # dict of { lowercase_normalized_name: { 'name': actual_name, 'type': type_obj, 'nullable': bool } }
                table_map = {} 
                for col in columns_info:
                    # Normalize: lowercase, remove underscores and spaces
                    norm_name = col['name'].lower().replace('_', '').replace(' ', '')
                    table_map[norm_name] = {
                        'name': col['name'],
                        'type': str(col['type']),  # Convert to string for JSON serialization in cache
                        'nullable': col['nullable'],
                        'default': col.get('default')
                    }
                    # Also map the exact lowercase name for easier lookups
                    table_map[col['name'].lower()] = table_map[norm_name]
                
                # Cache the result
                ContentOrchestrator._schema_cache[cache_key] = {
                    "columns_info": columns_info,
                    "table_map": table_map,
                    "timestamp": time.time()
                }
                    
            except Exception as e:
                print(f"Error getting columns for table {table_name}: {e}")
                raise ValueError(f"Could not introspect table '{table_name}': {e}")
        
        print(f"Target Table '{table_name}' Columns: {[c['name'] for c in columns_info]}")

        # 2. Smart Mapping Logic
        # We want to construct a final_payload where keys are ACTUAL column names
        final_payload = {}
        
        # Helper: Try to find a value in payload for a given column config
        def find_value_for_column(col_info):
            possible_keys = [
                col_info['name'], 
                col_info['name'].lower(),
                col_info['name'].lower().replace('_', ''),
                col_info['name'].lower().replace(' ', '')
            ]
            
            # Add semantic synonyms
            synonyms = {
                'title': ['title', 'h1', 'headline', 'subject', 'topic', 'name', 'seotitle'],
                'content': ['content', 'body', 'bodyhtml', 'text', 'article', 'articlebody', 'htmlcontent', 'fulltext', 'description'],
                'slug': ['slug', 'seoslug', 'url', 'uri', 'path', 'alias'],
                'image': ['image', 'featuredimage', 'heroimage', 'thumbnail', 'cover', 'picture', 'img'],
                'status': ['status', 'poststatus', 'state', 'visibility', 'ispublished'],
                'author': ['author', 'creator', 'writer', 'postedby', 'username'],
                'excerpt': ['excerpt', 'summary', 'shortdescription', 'intro', 'teaser'], 
                'createdat': ['createdat', 'date', 'publishdate', 'postedat', 'time', 'timestamp'],
                'updatedat': ['updatedat', 'lastmodified', 'modified', 'editedat']
            }
            
            # Check synonyms if the column name matches a known concept
            norm_col_name = col_info['name'].lower().replace('_', '')
            
            # 1. Check exact matches in payload
            for key in possible_keys:
                if key in payload:
                    return payload[key]
            
            # 2. Check synonyms
            # Reverse lookup: is this column a 'title'?
            for concept, keys in synonyms.items():
                # If column name looks like this concept (e.g. 'article_title' contains 'title')
                if concept in norm_col_name:
                    # Check if payload has any of the concept keys
                    for key in keys:
                        if key in payload:
                            return payload[key]
                # If payload has this concept as a key (e.g. payload['title'])
                if concept in payload:
                     # Already handled by direct key checks if keys match perfectly, 
                     # but this loop is for checking if 'title' column should take payload['h1'] etc.
                     pass

            # 3. Direct Fuzzy Match
            # Iterate through payload keys and see if they loosely match column name
            for k, v in payload.items():
                norm_k = k.lower().replace('_', '')
                if norm_k == norm_col_name:
                    return v
                # Partial match for common things? Be careful.
            
            return None

        # 3. Build Final Payload
        for norm_name, col_info in table_map.items():
            actual_name = col_info['name']
            
            # Skip if we already handled this column (due to multiple mappings pointing to same col)
            if actual_name in final_payload:
                continue
                
            # Skip auto-increment/primary keys often named 'id'
            if actual_name.lower() == 'id':
                continue

            # Try to get value
            val = find_value_for_column(col_info)
            
            if val is not None:
                final_payload[actual_name] = val
            elif not col_info['nullable'] and col_info['default'] is None:
                # 4. Auto-Fill Defaults for NOT NULL columns
                str_type = str(col_info['type']).upper()
                print(f"Auto-filling MISSING required column: {actual_name} ({str_type})")
                
                # SPECIAL CASE: Author column - Generate random American name
                if 'author' in norm_name or 'writer' in norm_name or 'byline' in norm_name:
                    if 'CHAR' in str_type or 'TEXT' in str_type:
                        random_name = get_random_american_name()
                        final_payload[actual_name] = random_name
                        print(f"  -> Auto-generated author name: {random_name}")
                
                elif 'INT' in str_type:
                    # Special Case: category_id, user_id, author_id
                    if 'category' in norm_name:
                        final_payload[actual_name] = 1 # Default category usually 1
                    elif 'user' in norm_name or 'author' in norm_name:
                        final_payload[actual_name] = 1 # Default user usually 1
                    else:
                        final_payload[actual_name] = 0
                        
                elif 'BOOL' in str_type:
                    final_payload[actual_name] = True if 'published' in norm_name or 'active' in norm_name else False
                    
                elif 'CHAR' in str_type or 'TEXT' in str_type:
                     # Check if it needs a valid slug
                    if 'slug' in norm_name:
                        # Fallback slug
                        import re
                        raw = payload.get('title') or payload.get('h1') or 'untitled-post'
                        final_payload[actual_name] = re.sub(r'[^a-z0-9]+', '-', raw.lower()).strip('-')
                    else:
                        final_payload[actual_name] = ""
                        
                elif 'JSON' in str_type:
                    final_payload[actual_name] = "{}" # empty json
                    
                elif 'DATE' in str_type or 'TIME' in str_type:
                    final_payload[actual_name] = datetime.utcnow()
            else:
                # 4.5. Auto-Fill Author even if NULLABLE (if column is detected as author-related)
                # This ensures author gets filled even if it's not required
                if val is None and ('author' in norm_name or 'writer' in norm_name or 'byline' in norm_name):
                    str_type = str(col_info['type']).upper()
                    if 'CHAR' in str_type or 'TEXT' in str_type:
                        random_name = get_random_american_name()
                        final_payload[actual_name] = random_name
                        print(f"Auto-filling author column: {actual_name} = {random_name}")
            
            # If nullable, we can skip it (it will be NULL)
            
        # 5. Serialization for JSON/Special Types
        clean_payload = {}
        # Create a quick lookup for types
        col_types = {c['name']: c['type'] for c in columns_info}
        
        for k, v in final_payload.items():
            col_type = col_types.get(k)
            str_type = str(col_type).upper()
            
            # Check if it's an ARRAY type
            if 'ARRAY' in str_type:
                # Pass list directly for SQLAlchemy to handle
                # Ensure it's a list (if it was a single item acting as list)
                if isinstance(v, str):
                     # If we mapped a single string to an array column, wrap it
                     clean_payload[k] = [v]
                elif not isinstance(v, list) and v is not None:
                     clean_payload[k] = [v]
                else:
                     clean_payload[k] = v
            # Basic serialization for dict/list -> json string for JSON/TEXT columns
            elif isinstance(v, (dict, list)):
                clean_payload[k] = json.dumps(v)
            else:
                clean_payload[k] = v

        if not clean_payload:
            raise ValueError(f"Failed to map any content to table '{table_name}'.")

        # 6. Execute Insert (with SEO table support)
        inserted_id = None
        with engine.begin() as conn:
            columns_sql = ", ".join([f'"{k}"' for k in clean_payload.keys()])
            placeholders_sql = ", ".join([f":{k}" for k in clean_payload.keys()])
            
            try:
                # Use RETURNING if supported to get the inserted ID (for SEO table)
                sql = text(f'INSERT INTO "{table_name}" ({columns_sql}) VALUES ({placeholders_sql}) RETURNING id')
                result = conn.execute(sql, clean_payload)
                inserted_id = result.scalar()
                print(f"Successfully injected record into {table_name}. ID: {inserted_id}")
            except Exception as e:
                # If RETURNING fails (e.g. SQLite sometimes), fallback to standard insert
                print(f"RETURNING failed, trying standard insert: {e}")
                sql = text(f'INSERT INTO "{table_name}" ({columns_sql}) VALUES ({placeholders_sql})')
                conn.execute(sql, clean_payload)
                
                # Fetch last insert rowid for sqlite
                if engine.dialect.name == "sqlite":
                    result = conn.execute(text("SELECT last_insert_rowid()"))
                    inserted_id = result.scalar()
                
                print(f"Successfully injected record into {table_name} (No RETURNING). ID: {inserted_id}")

            if seo_payload and seo_table_info and inserted_id:
                try:
                    self._inject_seo_data(conn, seo_table_info['table'], seo_table_info['fk_column'], inserted_id, seo_payload, engine)
                except Exception as e:
                    print(f"Error injecting SEO data: {e}")
                    
        return inserted_id
        
    def _inject_category_relation(self, engine, blog_id: int, category_name: str):
        """
        Create a link between a Blog post and a Category in the Prisma DB.
        If the category doesn't exist, it creates it.
        """
        from sqlalchemy import text
        from datetime import datetime
        print(f"[CATEGORY INJECT] Linking Blog {blog_id} to Category: '{category_name}'")
        
        try:
            with engine.begin() as conn:
                # 1. Check if Category exists
                cat_sql = text('SELECT categoryId FROM "Category" WHERE name = :name')
                result = conn.execute(cat_sql, {"name": category_name}).fetchone()
                
                if result:
                    category_id = result[0]
                    print(f"[CATEGORY INJECT] Category exists. ID: {category_id}")
                else:
                    # Determine next categoryId (Prisma requires both `id` and `categoryId` in schema)
                    max_id_sql = text('SELECT MAX(categoryId) FROM "Category"')
                    max_id_res = conn.execute(max_id_sql).scalar()
                    next_cat_id = (max_id_res or 0) + 1
                    
                    # 2. Create new Category
                    insert_cat_sql = text('''
                        INSERT INTO "Category" (categoryId, name, status, createdAt, updatedAt) 
                        VALUES (:cid, :name, 'active', :now, :now)
                    ''')
                    conn.execute(insert_cat_sql, {
                        "cid": next_cat_id, 
                        "name": category_name, 
                        "now": datetime.utcnow()
                    })
                    category_id = next_cat_id
                    print(f"[CATEGORY INJECT] Created new Category. ID: {category_id}")
                
                # 3. Create mapping in BlogCategory table
                map_sql = text('''
                    INSERT INTO "BlogCategory" (blogId, categoryId, createdAt) 
                    VALUES (:bid, :cid, :now)
                ''')
                conn.execute(map_sql, {
                    "bid": blog_id, 
                    "cid": category_id, 
                    "now": datetime.utcnow()
                })
                print(f"[CATEGORY INJECT] Successfully mapped Blog {blog_id} to Category {category_id}")
                
        except Exception as e:
            print(f"[CATEGORY INJECT] Error linking category: {e}")
    async def update_content(self, engine, table_name: str, post_id: int, updates: Dict[str, Any], site_id: str = None):
        """
        Updates an existing record in the table with Smart Mapping.
        Only updates columns that exist in the target table.
        """
        import json
        from sqlalchemy import inspect, text
        from datetime import datetime

        # 1. Introspect Table (using cache if available)
        cache_key = f"{site_id or str(engine.url)}:{table_name}"
        
        # Check cache (exact same logic as _inject_content)
        cached_schema = None
        if cache_key in ContentOrchestrator._schema_cache:
            cached = ContentOrchestrator._schema_cache[cache_key]
            if time.time() - cached["timestamp"] < SCHEMA_CACHE_TTL:
                cached_schema = cached
        
        if cached_schema:
            columns_info = cached_schema["columns_info"]
            table_map = cached_schema["table_map"]
        else:
            inspector = inspect(engine)
            try:
                # Try fetching with 'public' schema first (common in PostgreSQL)
                try:
                    columns_info = inspector.get_columns(table_name)
                except Exception:
                    # Fallback to default schema (useful for SQLite or other setups)
                    columns_info = inspector.get_columns(table_name)
                
                table_map = {} 
                for col in columns_info:
                    norm_name = col['name'].lower().replace('_', '').replace(' ', '')
                    table_map[norm_name] = {
                        'name': col['name'],
                        'type': str(col['type']),
                        'nullable': col['nullable'],
                        'default': col.get('default')
                    }
                    table_map[col['name'].lower()] = table_map[norm_name]
                
                ContentOrchestrator._schema_cache[cache_key] = {
                    "columns_info": columns_info,
                    "table_map": table_map,
                    "timestamp": time.time()
                }
            except Exception as e:
                print(f"Error getting columns for table {table_name}: {e}")
                raise ValueError(f"Could not introspect table '{table_name}': {e}")

        # 2. Build Set Clause with Smart Mapping
        set_parts = []
        params = {"id": post_id}
        
        # Extract category if present for relational mapping
        category_name = updates.pop("category", None)
        
        # Reverse lookup map for easier matching
        # actual_name -> value
        mapped_updates = {}

        for key, value in updates.items():
            norm_key = key.lower().replace('_', '').replace(' ', '')
            
            # Find matching column
            matched_col = None
            if norm_key in table_map:
                matched_col = table_map[norm_key]['name']
            else:
                # Try fuzzy/synonym match if not exact
                # Synonyms from _inject_content logic (could refactor to share)
                synonyms = {
                    'title': ['title', 'h1', 'headline', 'subject', 'topic', 'name', 'seotitle'],
                    'content': ['content', 'body', 'bodyhtml', 'text', 'article', 'articlebody', 'htmlcontent', 'fulltext', 'description'],
                    'slug': ['slug', 'seoslug', 'url', 'uri', 'path', 'alias'],
                    'image': ['image', 'featuredimage', 'heroimage', 'thumbnail', 'cover', 'picture', 'img'],
                    'status': ['status', 'poststatus', 'state', 'visibility', 'ispublished'],
                    'author': ['author', 'creator', 'writer', 'postedby', 'username'],
                    'excerpt': ['excerpt', 'summary', 'shortdescription', 'intro', 'teaser'], 
                    'createdat': ['createdat', 'date', 'publishdate', 'postedat', 'time', 'timestamp'],
                    'updatedat': ['updatedat', 'lastmodified', 'modified', 'editedat']
                }
                
                for concept, keys in synonyms.items():
                    if norm_key == concept or norm_key in keys:
                        # Find if any column name matches this concept
                        for norm_col, col_info in table_map.items():
                            if concept in norm_col:
                                matched_col = col_info['name']
                                break
                    if matched_col: break

            if matched_col and matched_col.lower() != 'id':
                # Handle serialization for complex types
                str_type = table_map[matched_col.lower()]['type'].upper()
                if isinstance(value, (dict, list)) and 'ARRAY' not in str_type:
                    mapped_updates[matched_col] = json.dumps(value)
                else:
                    mapped_updates[matched_col] = value

        # Always try to update updated_at if it exists
        if 'updatedat' in table_map:
            col_name = table_map['updatedat']['name']
            mapped_updates[col_name] = datetime.utcnow()
        elif 'updated_at' in [c.lower() for c in table_map.keys()]:
            # Backup check for exact name
            col_name = next(c for c in table_map.values() if c['name'].lower() == 'updated_at')['name']
            mapped_updates[col_name] = datetime.utcnow()

        if not mapped_updates and not category_name:
            return {"status": "no_changes", "message": "No valid fields to update for this table schema"}

        if mapped_updates:
            for col, val in mapped_updates.items():
                set_parts.append(f'"{col}" = :{col}')
                params[col] = val

            set_sql = ", ".join(set_parts)
            sql = text(f'UPDATE "{table_name}" SET {set_sql} WHERE id = :id')

            print(f"Executing UPDATE on {table_name} for ID {post_id}...")
            try:
                with engine.begin() as conn:
                    result = conn.execute(sql, params)
                    if result.rowcount == 0:
                        raise ValueError(f"No record found with ID {post_id} in {table_name}")
            except Exception as e:
                print(f"Update failed: {e}")
                raise

        if category_name:
            try:
                with engine.begin() as conn:
                    # Check if it's a Prisma DB with Category mapping table
                    cat_check = text("SELECT name FROM sqlite_master WHERE type='table' AND name='Category'")
                    has_cat_table = conn.execute(cat_check).fetchone()
                    if has_cat_table:
                        # Clear old mappings before injecting new one
                        delete_old_sql = text('DELETE FROM "BlogCategory" WHERE blogId = :bid')
                        conn.execute(delete_old_sql, {"bid": post_id})
                
                if 'has_cat_table' in locals() and has_cat_table:
                    self._inject_category_relation(engine, post_id, category_name)
            except Exception as e:
                print(f"Error handling category update: {e}")

        return {"status": "success", "post_id": post_id}
