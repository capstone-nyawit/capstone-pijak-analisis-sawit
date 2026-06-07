"""drop_invitations_table

Revision ID: 2b9ac34db5da
Revises: 417761cdcdaa
Create Date: 2026-05-27 13:38:38.368433

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2b9ac34db5da'
down_revision: Union[str, Sequence[str], None] = '417761cdcdaa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_index(op.f('ix_invitations_id'), table_name='invitations')
    op.drop_index(op.f('ix_invitations_code'), table_name='invitations')
    op.drop_table('invitations')


def downgrade() -> None:
    """Downgrade schema."""
    op.create_table('invitations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('code', sa.String(length=50), nullable=False),
    sa.Column('company_id', sa.Integer(), nullable=False),
    sa.Column('expired_at', sa.DateTime(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_invitations_code'), 'invitations', ['code'], unique=True)
    op.create_index(op.f('ix_invitations_id'), 'invitations', ['id'], unique=False)
