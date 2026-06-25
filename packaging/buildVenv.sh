#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/overlay/opt/blocks/venv"
WHEELS_DIR="$SCRIPT_DIR/wheels_venv"
PYTHON_VER="3.13"
SITE_PACKAGES="$VENV_DIR/lib/python${PYTHON_VER}/site-packages"
VENV_BIN="$VENV_DIR/bin"
"$SCRIPT_DIR/ensure_venv.sh"

echo "Cleaning previous venv..."
rm -rf "$VENV_DIR"
mkdir -p "$SITE_PACKAGES"
mkdir -p "$VENV_BIN"

echo "Downloading wheels..."
rm -rf "$WHEELS_DIR"
mkdir -p "$WHEELS_DIR"

echo "  Downloading robotpy-installer and dependencies..."
pip3 download \
  --extra-index-url https://wpilib.jfrog.io/artifactory/api/pypi/wpilib-python-release-2027/simple \
  --only-binary :all: \
  --platform linux_systemcore \
  --platform manylinux_2_38_aarch64 \
  --platform manylinux_2_35_aarch64 \
  --platform manylinux_2_28_aarch64 \
  --platform manylinux_2_17_aarch64 \
  --platform linux_aarch64 \
  --python-version 313 \
  --implementation cp \
  --abi cp313 \
  -d "$WHEELS_DIR" \
  robotpy-installer==2027.0.0a7

echo "Unpacking wheels..."
for whl in "$WHEELS_DIR"/*.whl; do
    echo "  $whl"
    unzip -q -o "$whl" -d "$SITE_PACKAGES/"
done

echo "Removing packages already on SystemCore..."
for pkg in packaging; do
    rm -rf "$SITE_PACKAGES/$pkg" "$SITE_PACKAGES/$pkg"-*.dist-info
done

echo "Generating entry points..."
python3 - <<PYEOF
import os, configparser

site_packages = "$SITE_PACKAGES"
venv_bin = "$VENV_BIN"
python_bin = "/opt/blocks/venv/bin/python3"

for entry in os.scandir(site_packages):
    if not entry.name.endswith(".dist-info"):
        continue
    ep_file = os.path.join(entry.path, "entry_points.txt")
    if not os.path.exists(ep_file):
        continue
    cp = configparser.ConfigParser()
    cp.read(ep_file)
    if not cp.has_section("console_scripts"):
        continue
    for name, target in cp.items("console_scripts"):
        mod, func = target.split(":")
        script_path = os.path.join(venv_bin, name)
        with open(script_path, "w") as f:
            f.write(f"#!{python_bin}\n")
            f.write("import sys\n")
            f.write(f"sys.path.insert(0, '{site_packages}')\n")
            f.write(f"from {mod.strip()} import {func.strip()}\n")
            f.write(f"sys.exit({func.strip()}())\n")
        os.chmod(script_path, 0o755)
        print(f"  Created {name} -> {target}")
PYEOF

echo "Writing pyvenv.cfg..."
cat > "$VENV_DIR/pyvenv.cfg" <<EOF
home = /bin
include-system-site-packages = true
version = 3.13.12
EOF

echo "Creating bin/python3 symlink..."
ln -sf /bin/python3 "$VENV_BIN/python3"
ln -sf /bin/python3 "$VENV_BIN/python${PYTHON_VER}"

echo "Writing activate script..."
cat > "$VENV_BIN/activate" <<'ACTIVATE'
deactivate () {
    if [ -n "${_OLD_VIRTUAL_PATH:-}" ]; then
        PATH="${_OLD_VIRTUAL_PATH}"; export PATH; unset _OLD_VIRTUAL_PATH
    fi
    if [ -n "${_OLD_VIRTUAL_PYTHONHOME:-}" ]; then
        PYTHONHOME="${_OLD_VIRTUAL_PYTHONHOME}"; export PYTHONHOME; unset _OLD_VIRTUAL_PYTHONHOME
    fi
    if [ -n "${_OLD_VIRTUAL_PS1:-}" ]; then
        PS1="${_OLD_VIRTUAL_PS1}"; export PS1; unset _OLD_VIRTUAL_PS1
    fi
    if [ -n "${_OLD_VIRTUAL_PYTHONPATH+x}" ]; then
        PYTHONPATH="${_OLD_VIRTUAL_PYTHONPATH}"; export PYTHONPATH; unset _OLD_VIRTUAL_PYTHONPATH
    fi
    unset VIRTUAL_ENV VIRTUAL_ENV_PROMPT
    [ -n "${BASH:-}" ] || [ -n "${ZSH_VERSION:-}" ] && hash -r 2>/dev/null
    [ "${1:-}" != "nondestructive" ] && unset -f deactivate
}

deactivate nondestructive

VIRTUAL_ENV="/opt/blocks/venv"
export VIRTUAL_ENV

_OLD_VIRTUAL_PATH="$PATH"
PATH="$VIRTUAL_ENV/bin:$PATH"
export PATH

_OLD_VIRTUAL_PYTHONPATH="${PYTHONPATH:-}"
PYTHONPATH="$VIRTUAL_ENV/lib/python3.13/site-packages${PYTHONPATH:+:$PYTHONPATH}"
export PYTHONPATH

if [ -n "${PYTHONHOME:-}" ]; then
    _OLD_VIRTUAL_PYTHONHOME="$PYTHONHOME"; unset PYTHONHOME
fi

if [ -z "${VIRTUAL_ENV_DISABLE_PROMPT:-}" ]; then
    _OLD_VIRTUAL_PS1="${PS1:-}"
    PS1="(blocks) ${PS1:-}"; export PS1
    VIRTUAL_ENV_PROMPT="(blocks) "; export VIRTUAL_ENV_PROMPT
fi

[ -n "${BASH:-}" ] || [ -n "${ZSH_VERSION:-}" ] && hash -r 2>/dev/null
ACTIVATE

chmod +x "$VENV_BIN/activate"

echo "Done. Venv at $VENV_DIR"
