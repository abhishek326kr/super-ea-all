"""Add scheduled status to BlogStatus enum

Revision ID: d3a8b9c5e7f1
Revises: ce759c814d32
Create Date: 2025-12-30 18:24:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd3a8b9c5e7f1'
down_revision: Union[str, Sequence[str], None] = 'ce759c814d32'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add 'scheduled' to the BlogStatus enum in forexfactory database
    # This targets the connected site database, not the admin database
    pass


def downgrade() -> None:
    """Downgrade schema."""
    # Note: PostgreSQL doesn't support removing enum values directly
    # This would require recreating the enum type
    pass
