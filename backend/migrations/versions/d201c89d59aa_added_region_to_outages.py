"""Added region to outages

Revision ID: d201c89d59aa
Revises: 9a46b0d61b64
Create Date: 2025-01-04 23:23:14.575714

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd201c89d59aa'
down_revision = '9a46b0d61b64'
branch_labels = None
depends_on = None


def upgrade():
    # Step 1: Add the column with a default value
    with op.batch_alter_table('outages') as batch_op:
        batch_op.add_column(sa.Column('region', sa.String(length=100), nullable=True, server_default='Unknown'))

    # Step 2: Alter the column to be NOT NULL
    with op.batch_alter_table('outages') as batch_op:
        batch_op.alter_column('region', existing_type=sa.String(length=100), nullable=False, server_default=None)


def downgrade():
    with op.batch_alter_table('outages') as batch_op:
        batch_op.drop_column('region')
