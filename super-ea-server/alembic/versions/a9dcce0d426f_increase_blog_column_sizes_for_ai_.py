"""Increase blog column sizes for AI content

Revision ID: a9dcce0d426f
Revises: 146bdbaa7c4b
Create Date: 2025-12-26 18:43:53.107472

"""
"""Increase blog column sizes for AI content"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'a9dcce0d426f'
down_revision = '146bdbaa7c4b'
branch_labels = None
depends_on = None


def upgrade():
    # Check if blogs table exists before altering
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    
    if "blogs" not in tables:
        print("Skipping migration: 'blogs' table does not exist")
        return
    
    # Only proceed if blogs table exists
    op.alter_column("blogs", "content", type_=sa.Text())

    op.alter_column("blogs", "meta_title", type_=sa.String(255))
    op.alter_column("blogs", "meta_description", type_=sa.String(500))
    op.alter_column("blogs", "seo_slug", type_=sa.String(255))
    op.alter_column("blogs", "author", type_=sa.String(100))

    op.alter_column("blogs", "tags", type_=sa.Text())

    op.alter_column(
        "blogs",
        "lsi_keywords",
        type_=postgresql.JSONB(),
        postgresql_using="lsi_keywords::jsonb"
    )

    op.alter_column(
        "blogs",
        "faq_schema",
        type_=postgresql.JSONB(),
        postgresql_using="faq_schema::jsonb"
    )


def downgrade():
    # Check if blogs table exists before altering
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    
    if "blogs" not in tables:
        print("Skipping downgrade: 'blogs' table does not exist")
        return
    
    # Only proceed if blogs table exists
    op.alter_column("blogs", "content", type_=sa.String(50))
    op.alter_column("blogs", "meta_title", type_=sa.String(50))
    op.alter_column("blogs", "meta_description", type_=sa.String(50))
    op.alter_column("blogs", "seo_slug", type_=sa.String(50))
    op.alter_column("blogs", "author", type_=sa.String(50))
    op.alter_column("blogs", "tags", type_=sa.String(50))
    op.alter_column("blogs", "lsi_keywords", type_=sa.Text())
    op.alter_column("blogs", "faq_schema", type_=sa.Text())
