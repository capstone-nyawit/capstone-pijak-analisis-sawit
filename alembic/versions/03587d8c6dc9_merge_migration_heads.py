"""Merge migration heads

Revision ID: 03587d8c6dc9
Revises: 6f58fff38724, e5f4b7d910df
Create Date: 2026-06-13 12:18:56.779525

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '03587d8c6dc9'
down_revision: Union[str, Sequence[str], None] = ('6f58fff38724', 'e5f4b7d910df')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
