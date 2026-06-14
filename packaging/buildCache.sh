#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CACHE_DIR="$SCRIPT_DIR/overlay/opt/blocks/cache"

if [ -d "$CACHE_DIR" ]; then
    echo "Cache already exists at $CACHE_DIR, skipping."
    exit 0
fi

source "$SCRIPT_DIR/venv/bin/activate"
robotpy installer download-python --cache-root "$CACHE_DIR"
robotpy installer download robotpy --cache-root "$CACHE_DIR"
deactivate