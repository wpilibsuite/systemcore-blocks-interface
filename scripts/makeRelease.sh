#!/usr/bin/env bash

# This is for MAINTAINERS only.

# Make sure no silent failures
set -euo pipefail

# Ensure we're on main
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" != "main" ]]; then
  echo "Error: must be on main branch (currently on '$current_branch')" >&2
  exit 1
fi

# Read version from package.json
version=$(node -p "require('./package.json').version")
tag="v${version}"

# Build tag message
message="Release ${tag}"
if [[ $# -gt 0 ]]; then
  message="${message} - $*"
fi

echo "Creating tag ${tag}: \"${message}\""
if ! git tag -a "${tag}" -m "${message}"; then
  echo "Error: failed to create tag ${tag} — not pushing." >&2
  exit 1
fi

echo "Pushing ${tag} to upstream"
git push upstream "${tag}"
