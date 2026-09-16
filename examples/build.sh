#!/bin/bash
# Builds a .blocks_lib file for each example library.
#
# Usage: ./build.sh [example_dir ...]
# With no arguments, every directory here that has a metadata.json is built.
#
# Each example directory has metadata.json, and optional toolboxes/, components/, python_data/,
# locales/, and samples/ directories. The wheels are built from a python package in python/, and/or
# downloaded for the robot from the packages listed in requirements.txt. If there is a
# python_toolbox.json, toolboxes for the python modules and classes it lists are generated from the
# python data (see generate_python_toolboxes.mjs). The output is examples/build/<name>.blocks_lib.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGING_DIR="$SCRIPT_DIR/../packaging"
# Every example is built into this one directory.
BUILD_DIR="$SCRIPT_DIR/build"

if [ $# -eq 0 ]; then
    set -- "$SCRIPT_DIR"/*/metadata.json
    set -- "${@%/metadata.json}"
fi

for EXAMPLE in "$@"; do
    EXAMPLE_DIR="$(cd "$EXAMPLE" && pwd)"
    NAME="$(python3 -c 'import json, sys; print(json.load(open(sys.argv[1]))["name"])' "$EXAMPLE_DIR/metadata.json")"
    STAGING_DIR="$BUILD_DIR/.staging-$NAME"
    DOWNLOAD_DIR="$BUILD_DIR/.download-$NAME"
    OUTPUT="$BUILD_DIR/$NAME.blocks_lib"

    echo "Building $NAME..."
    rm -rf "$STAGING_DIR" "$DOWNLOAD_DIR" "$OUTPUT"
    mkdir -p "$STAGING_DIR/wheels"

    if [ -d "$EXAMPLE_DIR/python" ]; then
        python3 -m pip wheel --quiet --no-deps "$EXAMPLE_DIR/python" -w "$STAGING_DIR/wheels"
        # pip leaves build artifacts next to the source.
        rm -rf "$EXAMPLE_DIR/python/build" "$EXAMPLE_DIR/python/"*.egg-info
    fi
    if [ -f "$EXAMPLE_DIR/requirements.txt" ]; then
        # The robotpy installer downloads the wheels that are built for the robot.
        "$PACKAGING_DIR/ensure_venv.sh"
        "$PACKAGING_DIR/venv/bin/robotpy" installer download --no-deps \
            -r "$EXAMPLE_DIR/requirements.txt" --cache-root "$DOWNLOAD_DIR"
        cp "$DOWNLOAD_DIR/pip_cache/"*.whl "$STAGING_DIR/wheels/"
        rm -rf "$DOWNLOAD_DIR"
    fi

    cp "$EXAMPLE_DIR/metadata.json" "$STAGING_DIR/"
    ENTRIES=(metadata.json wheels)
    for DIR in toolboxes components python_data locales; do
        if [ -d "$EXAMPLE_DIR/$DIR" ]; then
            mkdir -p "$STAGING_DIR/$DIR"
            cp "$EXAMPLE_DIR/$DIR/"*.json "$STAGING_DIR/$DIR/"
            ENTRIES+=("$DIR")
        fi
    done
    if [ -f "$EXAMPLE_DIR/python_toolbox.json" ]; then
        node "$SCRIPT_DIR/generate_python_toolboxes.mjs" "$EXAMPLE_DIR" "$STAGING_DIR"
        for DIR in toolboxes locales; do
            if [ -d "$STAGING_DIR/$DIR" ] && [[ ! " ${ENTRIES[*]} " =~ " $DIR " ]]; then
                ENTRIES+=("$DIR")
            fi
        done
    fi
    if [ -d "$EXAMPLE_DIR/samples" ]; then
        cp -R "$EXAMPLE_DIR/samples" "$STAGING_DIR/"
        ENTRIES+=(samples)
    fi

    (cd "$STAGING_DIR" && python3 -m zipfile -c "$OUTPUT" "${ENTRIES[@]}")
    rm -rf "$STAGING_DIR"
    echo "  Created $OUTPUT"
done
