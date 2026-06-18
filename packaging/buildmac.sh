#!/bin/bash

set -e

# Extract package info from control/control file
if [ ! -f "control/control" ]; then
    echo "Error: control/control not found!"
    echo "Create a control/control file with package metadata"
    exit 1
fi

PACKAGE_NAME=$(grep "^Package:" control/control | cut -d' ' -f2- | tr -d ' ')
PACKAGE_VERSION=$(node -p "require('../package.json').version")

# Validate required fields
if [ -z "$PACKAGE_NAME" ] || [ -z "$PACKAGE_VERSION" ]; then
    echo "Err: Package must be set in control/control; version is read from package.json"
    exit 1
fi

PACKAGE_DIR="${PACKAGE_NAME}_${PACKAGE_VERSION}"
BUILD_DIR="build"
IPK_FILE="${PACKAGE_NAME}_${PACKAGE_VERSION}.ipk"

# macOS fix: prevent BSD tar from embedding AppleDouble (._*) files
# and extended attributes in the archives. Harmless on Linux.
export COPYFILE_DISABLE=1

echo "Building IPK package from overlay structure..."
echo "Package: ${IPK_FILE}"

if [ ! -d "overlay" ]; then
    echo "overlay/ directory not found"
    exit 1
fi

if [ ! -d "control" ]; then
    echo "Error: control/ directory not found!"
    echo "Create control/ with control, postinst, prerm, postrm files"
    exit 1
fi

echo "Cleaning previous build..."
rm -rf "$BUILD_DIR"
rm -f "$IPK_FILE"   # important: 'ar r' appends to an existing archive
mkdir -p "$BUILD_DIR/$PACKAGE_DIR"

echo "Copying overlay structure..."
cp -R overlay/* "$BUILD_DIR/$PACKAGE_DIR/"

echo "Copying CONTROL files..."
mkdir -p "$BUILD_DIR/$PACKAGE_DIR/CONTROL"
cp control/* "$BUILD_DIR/$PACKAGE_DIR/CONTROL/"
awk '/^Package:/{print; print "Version: '"$PACKAGE_VERSION"'"; next}1' "$BUILD_DIR/$PACKAGE_DIR/CONTROL/control" > "$BUILD_DIR/$PACKAGE_DIR/CONTROL/control.tmp" && mv "$BUILD_DIR/$PACKAGE_DIR/CONTROL/control.tmp" "$BUILD_DIR/$PACKAGE_DIR/CONTROL/control"

echo "Setting file permissions..."

# Make scripts executable
find "$BUILD_DIR/$PACKAGE_DIR" -name "*.py" -exec chmod +x {} \;

if [ -d "$BUILD_DIR/$PACKAGE_DIR/CONTROL" ]; then
    chmod +x "$BUILD_DIR/$PACKAGE_DIR/CONTROL"/* 2>/dev/null || true
fi

find "$BUILD_DIR/$PACKAGE_DIR" -name "*.sh" -exec chmod +x {} \;

# Strip macOS junk that may have been copied in
find "$BUILD_DIR" \( -name ".DS_Store" -o -name "._*" \) -delete

echo "Building IPK dir structure"
cd "$BUILD_DIR"

# Tar flags: macOS bsdtar uses --uid/--gid/--uname/--gname,
# GNU tar uses --owner/--group. Files inside an IPK should be
# owned by root, not your Mac user account.
if tar --version 2>/dev/null | grep -q "GNU tar"; then
    TAR_OWNER_FLAGS=(--owner=0 --group=0 --numeric-owner)
else
    TAR_OWNER_FLAGS=(--uid 0 --gid 0 --uname root --gname root)
fi

echo "Creating data.tar.gz"
tar "${TAR_OWNER_FLAGS[@]}" --exclude='CONTROL' --exclude='.DS_Store' \
    -czf data.tar.gz -C "$PACKAGE_DIR" .

echo "Creating control.tar.gz"
tar "${TAR_OWNER_FLAGS[@]}" --exclude='.DS_Store' \
    -czf control.tar.gz -C "$PACKAGE_DIR/CONTROL" .

echo "Creating debian-binary"
echo "2.0" > debian-binary

echo "Creating IPK..."
# c = create, S = skip symbol table (silences ranlib warning on macOS
# and keeps __.SYMDEF out of the archive, which would break opkg).
# Member order matters: debian-binary must be first.
ar rcS "../${IPK_FILE}" debian-binary control.tar.gz data.tar.gz

cd ..

# Sanity check: the archive must contain exactly these three members in order
EXPECTED=$'debian-binary\ncontrol.tar.gz\ndata.tar.gz'
ACTUAL=$(ar t "$IPK_FILE")
if [ "$ACTUAL" != "$EXPECTED" ]; then
    echo "WARNING: unexpected IPK contents:"
    echo "$ACTUAL"
    exit 1
fi

echo ""
echo "IPK package created."
echo "Package: ${IPK_FILE}"
echo ""
echo "Package structure:"
echo "  CONTROL files:"
find control -type f | sort | sed 's/^/    /'
echo "  Overlay files (will be installed):"
find overlay -type f | sort | sed 's/^overlay/    /' | head -15

if [ "$(find overlay -type f | wc -l)" -gt 15 ]; then
    echo "    ... and $(($(find overlay -type f | wc -l) - 15)) more files"
fi

rm -rf "$BUILD_DIR"

echo ""
echo "Build complete"
