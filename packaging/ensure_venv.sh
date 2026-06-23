#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -d "$SCRIPT_DIR/venv" ]; then
    echo "Creating packaging venv..."
    python3 -m venv "$SCRIPT_DIR/venv"
    "$SCRIPT_DIR/venv/bin/pip" install "robotpy-installer==2027.0.0a7"
fi
