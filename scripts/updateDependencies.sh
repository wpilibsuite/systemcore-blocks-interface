#!/usr/bin/env bash

# Make sure no silent failures
set -euo pipefail

# Run from the repo root (one level above this script), regardless of where it's invoked from
cd "$(dirname "${BASH_SOURCE[0]}")/.."

npx npm-check-updates -i
rm -f package-lock.json
npm install
