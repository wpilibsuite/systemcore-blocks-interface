#!/usr/bin/env bash

# Make sure no silent failures
set -euo pipefail

# Run from the repo root (one level above this script), regardless of where it's invoked from
cd "$(dirname "${BASH_SOURCE[0]}")/.."

npx npm-check-updates -i
# Remove node_modules too: packages with exact peer pins (e.g. vitest and @vitest/*)
# can't be resolved against the old versions still installed there.
rm -rf package-lock.json node_modules
npm install
