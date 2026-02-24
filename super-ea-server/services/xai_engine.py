"""
XAI Grok Engine - Drop-in replacement for content generation.
Uses grok-4-fast-reasoning as primary with automatic fallback to grok-4-fast-non-reasoning.
"""

import os
import re
import json
from typing import Optional, Dict, Any, Tuple
from openai import OpenAI
from schemas import BlogContent, ContentGenerationRequest, PersonaType
from dotenv import load_dotenv
from html.parser import HTMLParser

load_dotenv()


class HTMLTextExtractor(HTMLParser):
    """Simple HTML parser to extract plain text for word counting."""
    def __init__(self):
        super().__init__()
        self.text_parts = []
    
    def handle_data(self, data):
        self.text_parts.append(data)
    
    def get_text(self):
        return ' '.join(self.text_parts)

# Global failsafe message
FAILSAFE_MESSAGE = "Content generation is temporarily unavailable. Please try again later."


class XAIContentGenerator:
    """
    XAI Grok-based content generator with automatic failover.
    Primary: grok-4-fast-reasoning
    Fallback: grok-4-fast-non-reasoning
    """
    
    PRIMARY_MODEL = "grok-4-fast-reasoning"
    FALLBACK_MODEL = "grok-4-fast-non-reasoning"
    XAI_BASE_URL = "https://api.x.ai/v1"
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("XAI_API_KEY")
        if not self.api_key:
            print("WARNING: XAI_API_KEY not found. Using mock mode.")
            self.model_name = "mock-xai"
            self.client = None
        else:
            self.client = OpenAI(
                base_url=self.XAI_BASE_URL,
                api_key=self.api_key,
                timeout=120.0
            )
            self.model_name = self.PRIMARY_MODEL

    def _call_xai(self, prompt: str, json_mode: bool = True, max_tokens: int = 8000) -> str:
        """
        Make a call to XAI API with automatic failover.
        Primary: grok-4-fast-reasoning
        Fallback: grok-4-fast-non-reasoning

        Args:
            prompt: The prompt to send to the API
            json_mode: Whether to expect JSON response
            max_tokens: Maximum tokens for response (dynamic based on content needs)
        """
        if not self.client:
            raise RuntimeError("XAI client not initialized - check XAI_API_KEY environment variable")

        messages = [{"role": "user", "content": prompt}]

        kwargs = {
            "messages": messages,
            "max_tokens": max_tokens,
        }

        # FIX: Enable JSON mode for the API - this tells XAI to return valid JSON
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}
        
        # Attempt primary model
        last_error = None
        try:
            response = self._execute_api_call(self.PRIMARY_MODEL, kwargs)
            if response:
                return response
        except Exception as e:
            last_error = e
            print(f"[XAI] Primary model {self.PRIMARY_MODEL} failed: {type(e).__name__}: {e}")

        # Attempt fallback model
        try:
            response = self._execute_api_call(self.FALLBACK_MODEL, kwargs)
            if response:
                return response
        except Exception as e:
            last_error = e
            print(f"[XAI] Fallback model {self.FALLBACK_MODEL} failed: {type(e).__name__}: {e}")

        # Both models failed - include error details in the exception
        error_msg = f"{FAILSAFE_MESSAGE}"
        if last_error:
            error_msg += f" Last error: {type(last_error).__name__}: {last_error}"

        raise RuntimeError(error_msg)
    
    def _execute_api_call(self, model: str, kwargs: Dict[str, Any]) -> Optional[str]:
        """Execute API call to specified model and return extracted content."""
        kwargs["model"] = model
        
        response = self.client.chat.completions.create(**kwargs)
        
        if not response or not response.choices:
            return None
        
        content = response.choices[0].message.content
        
        if not content or not content.strip():
            return None
        
        # Extract JSON from response if wrapped in markdown code blocks
        content = self._extract_json_content(content)
        
        return content.strip()
    
    def _extract_json_content(self, content: str) -> str:
        """Extract JSON from markdown code blocks if present."""
        import re
        
        if "```json" in content:
            match = re.search(r'```json\s*([\s\S]*?)\s*```', content)
            if match:
                return match.group(1)
        elif "```" in content:
            match = re.search(r'```\s*([\s\S]*?)\s*```', content)
            if match:
                return match.group(1)
        
        return content

    def _count_words_in_html(self, html_content: str) -> int:
        """Count words in HTML content by stripping tags and counting words."""
        if not html_content:
            return 0
        
        try:
            # Parse HTML and extract text
            parser = HTMLTextExtractor()
            parser.feed(html_content)
            text = parser.get_text()
        except Exception:
            # Fallback: use regex to strip tags if parser fails
            text = re.sub(r'<[^>]+>', ' ', html_content)
        
        # Clean up the text
        text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
        text = text.strip()
        
        # Count words (split by whitespace)
        words = [w for w in text.split() if len(w) > 0]
        return len(words)
    
    def _validate_word_count(self, html_content: str, min_words: int, max_words: int) -> Tuple[bool, int, str]:
        """
        Validate if content meets word count requirements.
        Returns: (is_valid, actual_word_count, message)
        """
        word_count = self._count_words_in_html(html_content)
        
        if word_count < min_words:
            return (False, word_count, f"Content has {word_count} words, below minimum of {min_words}")
        elif word_count > max_words:
            return (False, word_count, f"Content has {word_count} words, above maximum of {max_words}")
        else:
            return (True, word_count, f"Content has {word_count} words (within {min_words}-{max_words} range)")

    def _calculate_max_tokens(self, max_words: int) -> int:
        """
        Calculate the required max_tokens for XAI API based on target word count.
        
        Rule of thumb:
        - 1 word ≈ 1.3-1.5 tokens for English text
        - Add buffer for JSON structure, HTML tags, metadata, FAQs
        - Minimum 8000 tokens, scale up for longer content
        """
        # Base calculation: words * 1.5 (token/word ratio) * 2 (safety factor for JSON/HTML overhead)
        estimated_tokens = int(max_words * 1.5 * 2)
        
        # Ensure minimum of 8000 and maximum of 32000 (API limit consideration)
        return max(8000, min(estimated_tokens, 32000))

    def _build_word_limit_instructions(self, req: ContentGenerationRequest) -> str:
        """Build strict word limit enforcement instructions for the prompt."""
        min_words = req.structure.target_word_count[0]
        max_words = req.structure.target_word_count[1]
        target_words = int((min_words + max_words) / 2)  # Aim for middle of range
        
        # Calculate required sections based on word count
        num_sections = max(5, min_words // 400)  # At least 5 sections, more for longer content
        words_per_section = target_words // num_sections
        
        return f"""
        ╔══════════════════════════════════════════════════════════════════╗
        ║              MANDATORY WORD COUNT REQUIREMENTS                    ║
        ╠══════════════════════════════════════════════════════════════════╣
        ║  MINIMUM REQUIRED: {min_words} words (YOU MUST REACH THIS)              ║
        ║  MAXIMUM ALLOWED:  {max_words} words (DO NOT EXCEED)                    ║
        ║  TARGET:           {target_words} words (AIM FOR THIS)                       ║
        ╚══════════════════════════════════════════════════════════════════╝
        
        ⚠️ CRITICAL: GENERATING LESS THAN {min_words} WORDS IS A FAILURE ⚠️
        
        MANDATORY CONTENT STRUCTURE (to ensure minimum word count):
        You MUST include AT LEAST {num_sections} major sections with approximately {words_per_section} words each.
        
        REQUIRED SECTION BREAKDOWN:
        1. INTRODUCTION (detailed, comprehensive - ~{words_per_section} words)
           - Hook the reader with an engaging opening
           - Explain why this topic matters
           - Preview what will be covered
        
        2-{num_sections-1}. MAIN BODY SECTIONS (each ~{words_per_section} words)
           - Each section must have a clear H2 heading
           - Include detailed explanations, examples, and insights
           - Use bullet points, numbered lists where appropriate
           - Add real-world applications and practical advice
           - Include statistics, facts, or expert insights where relevant
        
        {num_sections}. CONCLUSION (~{words_per_section} words)
           - Summarize key points comprehensively
           - Provide actionable takeaways
           - End with a strong call-to-action
        
        CONTENT DEPTH REQUIREMENTS:
        ✓ Each paragraph should be 3-5 sentences minimum
        ✓ Explain concepts thoroughly, don't just mention them
        ✓ Include specific examples and case studies
        ✓ Add practical tips and actionable advice
        ✓ Cover multiple perspectives on the topic
        ✓ Address common questions and concerns
        ✓ Provide step-by-step guidance where applicable
        
        WHAT TO DO IF RUNNING SHORT:
        - Add more detailed examples
        - Expand on each point with deeper analysis
        - Include additional subsections
        - Add FAQ section with detailed answers
        - Provide more context and background information
        - Include comparisons and alternatives
        
        ❌ DO NOT:
        - Generate thin, superficial content
        - Skip sections or provide brief summaries
        - Use filler or repetitive text
        - Mention word counts in the output
        
        FINAL CHECK: Before outputting, verify your content has AT LEAST {min_words} words.
        """

    async def generate_blog_post(self, req: ContentGenerationRequest) -> BlogContent:
        """
        Generate a blog post - backward compatible with Phase 1.
        Validates word count and retries if content doesn't meet requirements.
        """
        if self.model_name == "mock-xai":
            return self._mock_response()

        min_words = req.structure.target_word_count[0]
        max_words = req.structure.target_word_count[1]
        max_tokens = self._calculate_max_tokens(max_words)
        max_retries = 2
        last_word_count = 0
        result = None
        
        print(f"[Token Allocation] Target: {min_words}-{max_words} words -> Allocating {max_tokens} tokens")
        
        for attempt in range(max_retries + 1):
            prompt = self._build_base_prompt(req)
            prompt += self._build_word_limit_instructions(req)
            
            # Add stronger emphasis on retries
            if attempt > 0:
                prompt += f"""
                
                ⚠️ CRITICAL RETRY NOTICE (Attempt {attempt + 1}/{max_retries + 1}) ⚠️
                Previous generation had only {last_word_count} words.
                YOU MUST generate content with AT LEAST {min_words} words!
                This is NON-NEGOTIABLE. Expand every section with more details.
                """
            
            prompt += """

            IMPORTANT: Return your response as a valid JSON object with these exact keys:
            {
                "h1": "Main heading/title of the blog post",
                "meta_title": "SEO meta title (50-60 chars)",
                "meta_description": "SEO meta description (150-160 chars)",
                "body_html": "Full HTML content of the blog post with proper tags like <h2>, <p>, <ul>, etc.",
                "faq_schema_json": [{"question": "...", "answer": "..."}, ...],
                "lsi_used": ["keyword1", "keyword2", ...]
            }
            
            REMINDER: The body_html content MUST respect the word limit specified above.
            """
            
            response_text = self._call_xai(prompt, json_mode=True, max_tokens=max_tokens)

            # FIX: Add better error handling for JSON validation
            try:
                result = BlogContent.model_validate_json(response_text)
            except Exception as validation_error:
                print(f"[ERROR] JSON Validation failed. Raw response (first 500 chars): {response_text[:500]}")
                raise RuntimeError(f"AI response validation failed: {validation_error}. Raw response preview: {response_text[:200]}...")

            # Validate word count
            is_valid, word_count, message = self._validate_word_count(
                result.body_html, min_words, max_words
            )
            last_word_count = word_count
            
            print(f"[Word Count Check] Attempt {attempt + 1}: {message}")
            
            if is_valid:
                print(f"[Word Count] ✓ Content meets requirements: {word_count} words")
                return result
            
            # If below minimum and we have retries left, try again
            if word_count < min_words and attempt < max_retries:
                print(f"[Word Count] ✗ Content too short ({word_count}/{min_words}), retrying...")
                continue
            
            # If above maximum, we still return (hard to reduce AI output)
            # Or if we've exhausted retries, return what we have
            print(f"[Word Count] Returning content with {word_count} words (target: {min_words}-{max_words})")
            return result
        
        # Should not reach here, but return last result as fallback
        return result

    async def generate_schema_aware_content(self, req: ContentGenerationRequest, target_schema_text: str, post_status: str = "publish") -> Dict[str, Any]:
        """
        Generates content that strictly adheres to the provided database schema description.
        Returns a raw dictionary that maps 1:1 to the target table columns.
        Validates word count and retries if content doesn't meet requirements.
        """
        if self.model_name == "mock-xai":
            return {"mock_col_1": "Content", "mock_col_2": "Meta"}

        min_words = req.structure.target_word_count[0]
        max_words = req.structure.target_word_count[1]
        max_tokens = self._calculate_max_tokens(max_words)
        max_retries = 2
        last_word_count = 0
        result = None
        
        print(f"[Token Allocation] Target: {min_words}-{max_words} words -> Allocating {max_tokens} tokens")
        
        # Common content field names to check for word count
        content_field_names = ["content", "body", "body_html", "post_content", "article_body", "html_content", "text", "description"]
        
        for attempt in range(max_retries + 1):
            retry_instruction = ""
            if attempt > 0:
                retry_instruction = f"""
                
                ⚠️ CRITICAL RETRY NOTICE (Attempt {attempt + 1}/{max_retries + 1}) ⚠️
                Previous generation had only {last_word_count} words in the content field.
                YOU MUST generate content with AT LEAST {min_words} words!
                This is NON-NEGOTIABLE. Expand every section with more details, examples, and explanations.
                """
            
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
            - Header Structure: {", ".join(req.structure.header_structure)}
            - Final CTA: {req.structure.cta}
            
            {self._build_word_limit_instructions(req)}
            {retry_instruction}
            
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
            - Generate PLAIN TEXT content with proper formatting using line breaks (\\n\\n for paragraphs)
            - Use clear section headings followed by double line breaks
            - Structure the content with proper hierarchy (Main sections, then subsections)
            - Separate paragraphs with double line breaks (\\n\\n)
            - Use bullet points with "• " or numbered lists with "1. ", "2. ", etc. for lists
            - Use UPPERCASE or **text** for emphasis on important terms (but avoid actual markdown/HTML)
            - Keep it clean, readable plain text that will display properly without HTML rendering
            - Example format: "Introduction\\n\\nYour text here with proper sentences.\\n\\nSection Title\\n\\nMore content with clear paragraphs."
            
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

            response_text = self._call_xai(prompt, json_mode=True, max_tokens=max_tokens)

            # FIX: Add better error handling for JSON parsing
            try:
                result = json.loads(response_text)
            except json.JSONDecodeError as parse_error:
                print(f"[ERROR] JSON Parse failed. Raw response (first 500 chars): {response_text[:500]}")
                raise RuntimeError(f"AI response parsing failed: {parse_error}. Raw response preview: {response_text[:200]}...")
            
            # Find the content field and validate word count
            content_text = ""
            content_field_found = None
            for field_name in content_field_names:
                if field_name in result and result[field_name]:
                    content_text = str(result[field_name])
                    content_field_found = field_name
                    break
            
            if content_text:
                is_valid, word_count, message = self._validate_word_count(
                    content_text, min_words, max_words
                )
                last_word_count = word_count
                
                print(f"[Word Count Check] Attempt {attempt + 1} (field: {content_field_found}): {message}")
                
                if is_valid:
                    print(f"[Word Count] ✓ Content meets requirements: {word_count} words")
                    return result
                
                # If below minimum and we have retries left, try again
                if word_count < min_words and attempt < max_retries:
                    print(f"[Word Count] ✗ Content too short ({word_count}/{min_words}), retrying...")
                    continue
                
                # If above maximum or exhausted retries, return what we have
                print(f"[Word Count] Returning content with {word_count} words (target: {min_words}-{max_words})")
                return result
            else:
                # No content field found, return the result as-is
                print(f"[Word Count] No content field found in response, skipping validation")
                return result
        
        # Fallback
        return result

    async def validate_content_against_schema(self, req: ContentGenerationRequest, target_schema_text: str) -> Dict[str, Any]:
        """
        Analyzes the target schema and the content request to identify any mandatory fields
        that cannot be auto-generated by the AI.
        """
        if self.model_name == "mock-xai":
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

        response_text = self._call_xai(prompt, json_mode=True)
        return json.loads(response_text)

    async def identify_best_content_table(self, table_names: list[str]) -> str:
        """
        Analyzes a list of table names and identifies the most likely table for storing blog posts/content.
        """
        if self.model_name == "mock-xai":
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
        - IMPORTANT: PostgreSQL is CASE-SENSITIVE. You MUST return the table name EXACTLY as it appears in the CANDIDATE TABLES list, respecting its case perfectly.
        
        OUTPUT:
        Return ONLY the exact name of the identified table as a JSON object with a single key "table_name".
        The value MUST match one of the candidate tables EXACTLY (case-sensitive).
        If no suitable table is found, return {{"table_name": null}}.
        """

        response_text = self._call_xai(prompt, json_mode=True)
        result = json.loads(response_text)
        return result.get("table_name")

    async def identify_candidate_tables(self, table_names: list[str]) -> Dict[str, Any]:
        """
        Analyzes a list of table names and identifies all potential candidate tables for storing content.
        Returns a list of candidates and a best guess.
        """
        if self.model_name == "mock-xai":
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
        - IMPORTANT: PostgreSQL is CASE-SENSITIVE. You MUST use the EXACT strings from the CANDIDATE TABLES list, respecting their case perfectly.
        
        OUTPUT:
        Return a JSON object with two keys:
        - "candidates": A list of strings (all plausible table names, MUST match original case).
        - "best_match": The single best table name string (MUST match original case, or null if none found).
        """

        response_text = self._call_xai(prompt, json_mode=True)
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


# Alias for drop-in compatibility
ContentGenerator = XAIContentGenerator
