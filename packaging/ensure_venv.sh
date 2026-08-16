#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/versions.sh"

if [ ! -d "$SCRIPT_DIR/venv" ]; then
    echo "Creating packaging venv..."
    python3 -m venv "$SCRIPT_DIR/venv"
    "$SCRIPT_DIR/venv/bin/pip" install "robotpy-installer==$ROBOTPY_INSTALLER_VERSION"
fi
