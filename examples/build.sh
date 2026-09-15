#!/bin/bash
# Builds a .blocks_lib file for each example library.
#
# Usage: ./build.sh [example_dir ...]
# With no arguments, every directory here that has a metadata.json is built.
#
# Each example directory has metadata.json, a python package in python/, and optional toolboxes/
# and components/ directories. The output is <example_dir>/build/<name>.blocks_lib.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ $# -eq 0 ]; then
    set -- "$SCRIPT_DIR"/*/metadata.json
    set -- "${@%/metadata.json}"
fi

for EXAMPLE in "$@"; do
    EXAMPLE_DIR="$(cd "$EXAMPLE" && pwd)"
    NAME="$(python3 -c 'import json, sys; print(json.load(open(sys.argv[1]))["name"])' "$EXAMPLE_DIR/metadata.json")"
    BUILD_DIR="$EXAMPLE_DIR/build"
    STAGING_DIR="$BUILD_DIR/staging"
    OUTPUT="$BUILD_DIR/$NAME.blocks_lib"

    echo "Building $NAME..."
    rm -rf "$STAGING_DIR" "$OUTPUT"
    mkdir -p "$STAGING_DIR/wheels"

    python3 -m pip wheel --quiet --no-deps "$EXAMPLE_DIR/python" -w "$STAGING_DIR/wheels"
    # pip leaves build artifacts next to the source.
    rm -rf "$EXAMPLE_DIR/python/build" "$EXAMPLE_DIR/python/"*.egg-info

    cp "$EXAMPLE_DIR/metadata.json" "$STAGING_DIR/"
    ENTRIES=(metadata.json wheels)
    for DIR in toolboxes components; do
        if [ -d "$EXAMPLE_DIR/$DIR" ]; then
            mkdir -p "$STAGING_DIR/$DIR"
            cp "$EXAMPLE_DIR/$DIR/"*.json "$STAGING_DIR/$DIR/"
            ENTRIES+=("$DIR")
        fi
    done

    (cd "$STAGING_DIR" && python3 -m zipfile -c "$OUTPUT" "${ENTRIES[@]}")
    rm -rf "$STAGING_DIR"
    echo "  Created $OUTPUT"
done
