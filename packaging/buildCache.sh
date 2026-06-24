#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CACHE_DIR="$SCRIPT_DIR/overlay/opt/blocks/cache"
BBC_SRC="$SCRIPT_DIR/../runtime_python/blocks_base_classes"

PIP_CACHE_DIR="$CACHE_DIR/pip_cache"
mkdir -p "$PIP_CACHE_DIR"

# Rebuild the wheel if any source file is newer than the existing wheel
EXISTING_WHL=$(ls "$PIP_CACHE_DIR"/blocks_base_classes*.whl 2>/dev/null | head -1)
if [ -z "$EXISTING_WHL" ] || [ -n "$(find "$BBC_SRC" -newer "$EXISTING_WHL" \( -name "*.py" -o -name "pyproject.toml" \))" ]; then
    echo "Building blocks_base_classes wheel..."
    rm -f "$PIP_CACHE_DIR"/blocks_base_classes*.whl
    pip3 wheel --no-deps "$BBC_SRC" -w "$PIP_CACHE_DIR"
else
    echo "blocks_base_classes wheel is up to date, skipping."
fi

if [ -d "$CACHE_DIR" ] && [ "$(ls "$PIP_CACHE_DIR"/*.whl 2>/dev/null | wc -l)" -gt 1 ]; then
    echo "Cache already exists at $CACHE_DIR, skipping robotpy download."
    exit 0
fi

"$SCRIPT_DIR/ensure_venv.sh"

source "$SCRIPT_DIR/venv/bin/activate"
robotpy installer download-python --cache-root "$CACHE_DIR"
robotpy installer download robotpy --cache-root "$CACHE_DIR"
robotpy installer download robotpy-rev --cache-root "$CACHE_DIR"
deactivate
