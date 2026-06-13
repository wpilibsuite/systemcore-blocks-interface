#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WHEELS_DIR="$SCRIPT_DIR/wheels"
VENV_DIR="$SCRIPT_DIR/overlay/opt/blocks/venv"
PYTHON_VER="3.13"
SITE_PACKAGES="$VENV_DIR/lib/python${PYTHON_VER}/site-packages"
VENV_BIN="$VENV_DIR/bin"
WPILIB_VER="2027.0.0a6.post1"

echo "Downloading wheels..."
mkdir -p "$WHEELS_DIR"
pip3 download \
  --extra-index-url https://wpilib.jfrog.io/artifactory/api/pypi/wpilib-python-release-2027/simple \
  --only-binary :all: \
  --platform linux_systemcore \
  --platform manylinux_2_38_aarch64 \
  --platform manylinux_2_37_aarch64 \
  --platform manylinux_2_36_aarch64 \
  --platform manylinux_2_35_aarch64 \
  --platform manylinux_2_34_aarch64 \
  --platform manylinux_2_33_aarch64 \
  --platform manylinux_2_32_aarch64 \
  --platform manylinux_2_31_aarch64 \
  --platform manylinux_2_30_aarch64 \
  --platform manylinux_2_29_aarch64 \
  --platform manylinux_2_28_aarch64 \
  --platform manylinux_2_27_aarch64 \
  --platform manylinux_2_26_aarch64 \
  --platform manylinux_2_25_aarch64 \
  --platform manylinux_2_24_aarch64 \
  --platform manylinux_2_23_aarch64 \
  --platform manylinux_2_22_aarch64 \
  --platform manylinux_2_21_aarch64 \
  --platform manylinux_2_20_aarch64 \
  --platform manylinux_2_19_aarch64 \
  --platform manylinux_2_18_aarch64 \
  --platform manylinux_2_17_aarch64 \
  --platform linux_aarch64 \
  --python-version 313 \
  --implementation cp \
  --abi cp313 \
  -d "$WHEELS_DIR" \
  "robotpy[wpilib]==$WPILIB_VER"

echo "Cleaning previous venv..."
rm -rf "$VENV_DIR"
mkdir -p "$SITE_PACKAGES"
mkdir -p "$VENV_BIN"

echo "Unpacking wheels..."
for whl in "$WHEELS_DIR"/*.whl; do
    echo "  $whl"
    unzip -q -o "$whl" -d "$SITE_PACKAGES/"
done

echo "Copying site_packages overlays..."
EXTRA_SITE_PACKAGES="$SCRIPT_DIR/site_packages"
if [ -d "$EXTRA_SITE_PACKAGES" ]; then
    for pkg_dir in "$EXTRA_SITE_PACKAGES"/*/; do
        echo "  $pkg_dir"
        cp -r "$pkg_dir" "$SITE_PACKAGES/"
    done
fi

echo "Copying blocks_base_classes..."
rsync -a --exclude='__pycache__' --exclude='*.egg-info' \
  "$SCRIPT_DIR/../runtime_python/blocks_base_classes/" \
  "$SITE_PACKAGES/blocks_base_classes/"

echo "Writing pyvenv.cfg..."
cat > "$VENV_DIR/pyvenv.cfg" <<EOF
home = /bin
include-system-site-packages = false
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
