import logging
import os
import shutil

logger = logging.getLogger(__name__)

DATA_DIR = os.path.expanduser('~systemcore/blocks')
DB_PATH = os.path.join(DATA_DIR, 'projects.db')

os.makedirs(DATA_DIR, exist_ok=True)

# Older versions of the backend stored the database alongside the code. If the
# database hasn't already been migrated, move it to its new location.
_OLD_DB_PATH = '/opt/blocks/backend/projects.db'
if not os.path.exists(DB_PATH) and os.path.exists(_OLD_DB_PATH):
    logger.info('Moving projects.db from %s to %s', _OLD_DB_PATH, DB_PATH)
    shutil.move(_OLD_DB_PATH, DB_PATH)
