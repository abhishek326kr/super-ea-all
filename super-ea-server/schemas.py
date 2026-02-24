from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class SearchIntent(str, Enum):
    INFORMATIONAL = "Informational"
    TRANSACTIONAL = "Transactional"
    COMMERCIAL = "Commercial Investigation"
    NAVIGATIONAL = "Navigational"

class ContentType(str, Enum):
    BLOG_POST = "Standard Blog Post"
    PILLAR_PAGE = "Pillar Page"
    LISTICLE = "Listicle"
    CASE_STUDY = "Case Study"
    NEWS_UPDATE = "News Update"

class PersonaType(str, Enum):
    ROGUE_ACADEMIC = "The Rogue SEO Academic"
    WALL_STREET = "The Wall Street Veteran"
    FRIENDLY_CODER = "The Friendly Coder"
    CUSTOM = "Custom"

class CoreIdentity(BaseModel):
    campaign_name: str
    primary_keyword: str
    target_audience: str
    intent: SearchIntent
    content_type: ContentType

class SEOTechnical(BaseModel):
    secondary_keywords: List[str]
    meta_description_goal: Optional[str] = None
    internal_links: List[str] = []
    external_authority_links: bool = False
    slug_strategy: str
    featured_image_urls: Optional[List[str]] = []  # URLs for the blog's featured/hero images

class ToneStylePersona(BaseModel):
    act_as: PersonaType
    custom_persona: Optional[str] = None
    tone: str
    style: str
    pov: str
    emoji_usage: str # Yes, No, Minimal
    humanization_level: int # 0-100
    negative_constraints: Optional[str] = None

class StructureFormatting(BaseModel):
    target_word_count: List[int] # [min, max]
    header_structure: List[str] # FAQ, Key Takeaways, Pros/Cons
    cta: str

class Distribution(BaseModel):
    target_site_ids: Optional[List[str]] = None # Support multiple
    post_status: str # Publish, Draft, Schedule
    scheduled_at: Optional[datetime] = None # When to publish scheduled posts
    category: Optional[str] = None # Support category association

class ContentGenerationRequest(BaseModel):
    core_identity: CoreIdentity
    seo_technical: SEOTechnical
    personalization: ToneStylePersona
    structure: StructureFormatting
    distribution: Distribution

class SuperPublishRequest(BaseModel):
    content_req: ContentGenerationRequest
    target_site_ids: List[str]
    supplementary_data: Optional[Dict[str, Dict[str, Any]]] = None
    table_overrides: Optional[Dict[str, str]] = None # site_id -> table_name

class SiteValidationResult(BaseModel):
    site_id: str
    valid: bool
    missing_fields: List[str]
    message: Optional[str] = None

class ValidationResponse(BaseModel):
    results: List[SiteValidationResult]
    has_issues: bool

# Gemini Structured Output Schema
class FAQItem(BaseModel):
    question: str
    answer: str

class BlogContent(BaseModel):
    h1: str
    meta_title: str
    meta_description: str
    body_html: str
    faq_schema_json: List[FAQItem]
    lsi_used: List[str]

# -- Injection Schemas (for Preview/Edit flow) --
class ContentInjection(BaseModel):
    site_id: str
    target_table: str
    content: Dict[str, Any]

class InjectContentRequest(BaseModel):
    injections: List[ContentInjection]

# -- Scheduling Schemas --
class BlogScheduleRequest(BaseModel):
    blog_id: int
    scheduled_at: datetime
    site_id: str

class BlogScheduleResponse(BaseModel):
    success: bool
    message: str
    blog_id: Optional[int] = None
    scheduled_at: Optional[datetime] = None

class ScheduledPost(BaseModel):
    id: int
    title: str
    scheduled_at: datetime
    site_id: str
    status: str = "scheduled"

# -- Category Schemas --
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


