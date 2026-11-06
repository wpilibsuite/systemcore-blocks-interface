#!/bin/bash

# Copyright (c) FIRST and other WPILib contributors.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/versions.sh"
VENV_PIP="$SCRIPT_DIR/venv/bin/pip"
VENV_PYTHON="$SCRIPT_DIR/venv/bin/python3"

if [ ! -d "$SCRIPT_DIR/venv" ]; then
    echo "Creating packaging venv..."
    python3 -m venv "$SCRIPT_DIR/venv"
fi

# Reinstall when versions.sh pins a different version than the one in the venv.
INSTALLED_VERSION=$("$VENV_PIP" show robotpy-installer 2>/dev/null | sed -n 's/^Version: //p')
if [ "$INSTALLED_VERSION" != "$ROBOTPY_INSTALLER_VERSION" ]; then
    echo "Installing robotpy-installer $ROBOTPY_INSTALLER_VERSION (was ${INSTALLED_VERSION:-not installed})..."
    "$VENV_PIP" install "robotpy-installer==$ROBOTPY_INSTALLER_VERSION"
fi

# The robotpy meta package says which robotpy-installer versions work with it, so check that
# the pin in versions.sh is one of them for the robotpy version in cacheRequirements.txt.
"$VENV_PYTHON" - "$SCRIPT_DIR/cacheRequirements.txt" "$ROBOTPY_INSTALLER_VERSION" <<'PYEOF'
import json, sys, urllib.request
from packaging.requirements import Requirement
from packaging.version import Version

requirements_file, installer_version = sys.argv[1], Version(sys.argv[2])

robotpy = None
with open(requirements_file) as f:
    for line in f:
        line = line.split("#")[0].strip()
        if line and Requirement(line).name == "robotpy":
            robotpy = Requirement(line)
if robotpy is None:
    sys.exit(f"robotpy is not in {requirements_file}")

pins = [s.version for s in robotpy.specifier if s.operator == "=="]
if len(pins) != 1:
    sys.exit(f"robotpy must be pinned with == in {requirements_file}")
robotpy_version = pins[0]

url = f"https://pypi.org/pypi/robotpy/{robotpy_version}/json"
with urllib.request.urlopen(url) as response:
    requires_dist = json.load(response)["info"]["requires_dist"] or []

for requirement in map(Requirement, requires_dist):
    if requirement.name != "robotpy-installer":
        continue
    if requirement.marker and not requirement.marker.evaluate({"extra": ""}):
        continue
    if installer_version not in requirement.specifier:
        sys.exit(
            f"robotpy {robotpy_version} needs robotpy-installer{requirement.specifier}, "
            f"but versions.sh pins {installer_version}. Update ROBOTPY_INSTALLER_VERSION."
        )
PYEOF
