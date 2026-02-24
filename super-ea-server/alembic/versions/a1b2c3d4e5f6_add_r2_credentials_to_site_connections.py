"""add r2 credentials to site connections

Revision ID: a1b2c3d4e5f6
Revises: ed8dc2ba68c9
Create Date: 2026-02-05 15:25:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'd79192f7b163'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add R2 storage credential columns to site_connections table."""
    op.add_column('site_connections', sa.Column('r2_account_id', sa.String(), nullable=True))
    op.add_column('site_connections', sa.Column('r2_access_key_id', sa.String(), nullable=True))
    op.add_column('site_connections', sa.Column('r2_secret_access_key', sa.String(), nullable=True))
    op.add_column('site_connections', sa.Column('r2_bucket_name', sa.String(), nullable=True))
    op.add_column('site_connections', sa.Column('r2_public_url', sa.String(), nullable=True))


def downgrade() -> None:
    """Remove R2 storage credential columns from site_connections table."""
    op.drop_column('site_connections', 'r2_public_url')
    op.drop_column('site_connections', 'r2_bucket_name')
    op.drop_column('site_connections', 'r2_secret_access_key')
    op.drop_column('site_connections', 'r2_access_key_id')
    op.drop_column('site_connections', 'r2_account_id')
