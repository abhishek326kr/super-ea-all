import os
import json
from typing import Optional, Dict, Any
from openai import OpenAI
from schemas import BlogContent, ContentGenerationRequest, PersonaType
from dotenv import load_dotenv

load_dotenv()

class ContentGenerator:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            # Fallback for dev without key
            print("WARNING: OPENROUTER_API_KEY not found. Using mock mode.")
            self.model_name = "mock-openrouter"
            self.client = None
        else:
            self.client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=self.api_key,
                timeout=120.0  # 120 seconds timeout for API calls
            )
            # Using Xiaomi: MiMo-V2-Flash free tier, excellent for content generation
            self.model_name = "xiaomi/mimo-v2-flash:free"

    def _call_openrouter(self, prompt: str, json_mode: bool = True) -> str:
        """Make a call to OpenRouter API and return the response text."""
        messages = [{"role": "user", "content": prompt}]
        
        kwargs = {
            "model": self.model_name,
            "messages": messages,
            "max_tokens": 8000,
        }
        
        # Note: Not using response_format as not all models support it
        # The prompt asks for JSON explicitly
        
        print(f"[API] Calling OpenRouter with model: {self.model_name}")
        print(f"[API] Prompt length: {len(prompt)} characters")
        
        try:
            response = self.client.chat.completions.create(**kwargs)
            content = response.choices[0].message.content
            print(f"[API] Received response ({len(content)} characters)")
        except Exception as e:
            print(f"[API ERROR] {type(e).__name__}: {str(e)}")
            raise
        
        # Extract JSON from response if wrapped in markdown code blocks
        if "```json" in content:
            import re
            match = re.search(r'```json\s*([\s\S]*?)\s*```', content)
            if match:
                content = match.group(1)
        elif "```" in content:
            import re
            match = re.search(r'```\s*([\s\S]*?)\s*```', content)
            if match:
                content = match.group(1)
        
        return content.strip()

    async def generate_blog_post(self, req: ContentGenerationRequest) -> BlogContent:
        # Backward compatibility for Phase 1
        # This returns the standard BlogContent schema
        if self.model_name == "mock-openrouter":
            return self._mock_response()

        prompt = self._build_base_prompt(req)
        prompt += """

        IMPORTANT: Return your response as a valid JSON object with these exact keys:
        {
            "title":"title of the blog post",
            "h1": "Main heading",
            "meta_title": "SEO meta title (50-60 chars)",
            "meta_description": "SEO meta description (150-160 chars)",
            "body_html": "Full HTML content of the blog post with proper tags like <h2>, <p>, <ul>, etc.",
            "faq_schema_json": [{"question": "...", "answer": "..."}, ...],
            "lsi_used": ["keyword1", "keyword2", ...]
        }
        """
        
        response_text = self._call_openrouter(prompt, json_mode=True)
        return BlogContent.model_validate_json(response_text)

    async def generate_schema_aware_content(self, req: ContentGenerationRequest, target_schema_text: str, post_status: str = "publish") -> Dict[str, Any]:
        """
        Generates content that strictly adheres to the provided database schema description.
        Returns a raw dictionary that maps 1:1 to the target table columns.
        """
        if self.model_name == "mock-openrouter":
            print(f"Mocking schema-aware generation for schema:\n{target_schema_text}")
            return {"mock_col_1": "Content", "mock_col_2": "Meta"}

        prompt = f"""
        You are a Database Content Adapter.
        
        CORE STRATEGY:
        - Campaign Name: {req.core_identity.campaign_name}
        - Persona: {req.personalization.act_as} {f"({req.personalization.custom_persona})" if req.personalization.act_as == PersonaType.CUSTOM else ""}
        - Topic: {req.core_identity.primary_keyword}
        - Target Audience: {req.core_identity.target_audience}
        - Search Intent: {req.core_identity.intent}
        - Content Type: {req.core_identity.content_type}
        
        SEO PARAMETERS:
        - Secondary Keywords: {", ".join(req.seo_technical.secondary_keywords)}
        - Meta Description Goal: {req.seo_technical.meta_description_goal or "Auto-generate"}
        - Internal Links to Include: {", ".join(req.seo_technical.internal_links)}
        - Use External Authority Links: {"Yes" if req.seo_technical.external_authority_links else "No"}
        - Featured Image URLs: {', '.join(req.seo_technical.featured_image_urls) if req.seo_technical.featured_image_urls else "None provided"}
        
        IMAGE MAPPING INSTRUCTION:
        If Featured Image URLs are provided above, you MUST:
        - Use the FIRST URL as the primary value for columns named:
          "image", "featured_image", "hero_image", "thumbnail", "cover_image", "main_image", "post_image" or similar.
        - If the database has a column for multiple images (like "images", "gallery", "featured_images"), store ALL URLs as a JSON array.
        - Use the EXACT URLs provided, do not generate placeholder text.
        
        TONE, STYLE & PERSONALITY:
        - Tone of Voice: {req.personalization.tone}
        - Writing Style: {req.personalization.style}
        - Point of View: {req.personalization.pov}
        - Emoji Usage: {req.personalization.emoji_usage}
        - Humanization Level (0-100): {req.personalization.humanization_level}
        - Negative Constraints: {req.personalization.negative_constraints or "None"}
        
        STRUCTURE & FORMATTING:
        - Target Word Count: {req.structure.target_word_count[0]} - {req.structure.target_word_count[1]}
        - Header Structure: {", ".join(req.structure.header_structure)}
        - Final CTA: {req.structure.cta}
        
        TASK:
        Generate a blog post/article according to these parameters and format it strictly as a JSON object.
        The JSON object keys MUST exactly match the column names defined in the schema below.
        
        {target_schema_text}
        
        CRITICAL - DO NOT INCLUDE THESE COLUMNS IN YOUR OUTPUT:
        - Do NOT include PRIMARY KEY columns (marked as PRIMARY KEY in the schema) - the database auto-generates these
        - Do NOT include columns named "id", "post_id", "article_id", or any auto-increment ID column
        - The database will automatically assign the ID when inserting
        
        Constraint: Do not include fields that are not in the schema.
        Ensure content types (VARCHAR, TEXT, INT) are respected.
        
        CRITICAL INSTRUCTION - CONTENT FORMATTING:
        For columns named "content", "body", "body_html", "post_content", "article_body", "html_content" or similar TEXT/VARCHAR columns meant for the main article body:
        - Generate PLAIN TEXT content with proper formatting using line breaks (\n\n for paragraphs)
        - Use clear section headings followed by double line breaks
        - Structure the content with proper hierarchy (Main sections, then subsections)
        - Separate paragraphs with double line breaks (\n\n)
        - Use bullet points with "• " or numbered lists with "1. ", "2. ", etc. for lists
        - Use UPPERCASE or **text** for emphasis on important terms (but avoid actual markdown/HTML)
        - Keep it clean, readable plain text that will display properly without HTML rendering
        - Example format: "Introduction\n\nYour text here with proper sentences.\n\nSection Title\n\nMore content with clear paragraphs."
        
        CRITICAL INSTRUCTION - STATUS MAPPING:
        The user has requested the post status be: "{post_status}".
        Look for a column named "status", "post_status", "state", "published", "is_published", "visibility" or similar.
        
        IMPORTANT: If the schema shows "ALLOWED VALUES:" for this column, you MUST use one of those EXACT values (case-sensitive).
        - For Draft/Save requests: Use the lowercase value like 'draft', 'pending', 'unpublished', or false/0
        - For Publish requests: Use the lowercase value like 'published', 'live', 'active', or true/1
        
        Examples:
        - If schema says "ALLOWED VALUES: ['draft', 'published']" and user wants Draft → use 'draft' (lowercase, exact match)
        - If schema says "ALLOWED VALUES: ['DRAFT', 'PUBLISHED']" and user wants Draft → use 'DRAFT' (uppercase, exact match)
        - If the column is boolean: Draft → false, Publish → true
        
        NEVER use a value that is not in the ALLOWED VALUES list. Match case exactly.
        
        Return ONLY a valid JSON object with the column names as keys.
        """

        response_text = self._call_openrouter(prompt, json_mode=True)
        return json.loads(response_text)

    async def validate_content_against_schema(self, req: ContentGenerationRequest, target_schema_text: str) -> Dict[str, Any]:
        """
        Analyzes the target schema and the content request to identify any mandatory fields
        that cannot be auto-generated by the AI (e.g. specific foreign keys, unique constrained fields not covered by content).
        """
        if self.model_name == "mock-openrouter":
            return {"missing_fields": []}

        prompt = f"""
        You are a Database Schema Validator.

        I am about to generate a blog post based on these parameters:
        - Topic: {req.core_identity.primary_keyword}
        - Authorship: AI Persona ({req.personalization.act_as})

        TARGET DATABASE SCHEMA:
        {target_schema_text}

        TASK:
        Identify if there are any REQUIRED (NOT NULL) columns in the schema that:
        1. Are NOT primary keys (auto-increment).
        2. Are NOT generic content fields (title, body, slug, meta_description, published_at, created_at - these are handled by AI).
        3. Are NOT capable of being auto-generated or inferred safely.
        
        Specifically look for:
        - Foreign Keys (e.g., category_id, user_id, author_id) that require specific ID lookup.
        - Specific Flags that default to NULL but might be needed (though usually defaults handle this).
        
        Return a JSON object with a single key "missing_fields" which is a list of strings (column names).
        If nothing is missing, return {{"missing_fields": []}}.
        """

        response_text = self._call_openrouter(prompt, json_mode=True)
        return json.loads(response_text)

    async def identify_best_content_table(self, table_names: list[str]) -> str:
        """
        Analyzes a list of table names and identifies the most likely table for storing blog posts/content.
        """
        if self.model_name == "mock-openrouter":
            return "mock_posts"

        prompt = f"""
        You are a Database Analyst.
        
        TASK:
        Analyze the following list of database table names and identify the ONE table that is most likely intended to store Blog Posts, Articles, or Main Content.
        
        CANDIDATE TABLES:
        {json.dumps(table_names)}
        
        CRITERIA:
        - Look for names like: "posts", "articles", "blogs", "content", "news", "entries", "wp_posts".
        - Ignore system tables (e.g., "users", "sessions", "migrations", "logs", "settings").
        - Ignore join tables (e.g., "post_tags", "category_posts").
        
        OUTPUT:
        Return ONLY the exact name of the identified table as a JSON object with a single key "table_name".
        If no suitable table is found, return {{"table_name": null}}.
        """

        response_text = self._call_openrouter(prompt, json_mode=True)
        result = json.loads(response_text)
        return result.get("table_name")

    async def identify_candidate_tables(self, table_names: list[str]) -> Dict[str, Any]:
        """
        Analyzes a list of table names and identifies all potential candidate tables for storing content.
        Returns a list of candidates and a best guess.
        """
        if self.model_name == "mock-openrouter":
            return {
                "candidates": ["mock_posts", "mock_articles"],
                "best_match": "mock_posts"
            }

        prompt = f"""
        You are a Database Analyst.
        
        TASK:
        Analyze the following list of database table names and identify ALL tables that look like they might store Blog Posts, Articles, News, or similar content.
        Also, pick the ONE best match.
        
        CANDIDATE TABLES:
        {json.dumps(table_names)}
        
        CRITERIA:
        - Look for names like: "posts", "articles", "blogs", "content", "news", "entries", "wp_posts".
        - Ignore system tables (e.g., "users", "sessions", "migrations", "logs", "settings").
        - Ignore join tables (e.g., "post_tags", "category_posts").
        
        OUTPUT:
        Return a JSON object with two keys:
        - "candidates": A list of strings (all plausible table names).
        - "best_match": The single best table name string (or null if none found).
        """

        response_text = self._call_openrouter(prompt, json_mode=True)
        return json.loads(response_text)

    def _build_base_prompt(self, req: ContentGenerationRequest) -> str:
        return f"""
        Generate a high-fidelity SEO blog post.
        Campaign: {req.core_identity.campaign_name}
        Topic: {req.core_identity.primary_keyword}
        Persona: {req.personalization.act_as}
        Tone: {req.personalization.tone}
        Style: {req.personalization.style}
        """

    def _mock_response(self):
        return BlogContent(
            h1="Mock Title", meta_title="Mock Meta", meta_description="Mock Desc", 
            body_html="<p>Mock Body</p>", faq_schema_json=[], lsi_used=[]
        )
