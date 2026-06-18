#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

rm -rf \
    "$SCRIPT_DIR/overlay/opt/blocks" \
    "$SCRIPT_DIR/venv" \
    "$SCRIPT_DIR/wheels" \
    "$SCRIPT_DIR/wheels_venv"

rm -f "$SCRIPT_DIR"/*.ipk

echo "Clean complete"
