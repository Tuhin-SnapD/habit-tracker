#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "=== LevelUp Desktop (production build) ==="

if ! command -v node >/dev/null 2>&1; then
    echo "Node.js missing. Run ./start.sh first."
    exit 1
fi
if ! command -v cargo >/dev/null 2>&1; then
    echo "Rust missing. Run ./desktop.sh once to install it."
    exit 1
fi

if [ ! -f "src-tauri/icons/icon.icns" ]; then
    cat <<EOF

No icons in src-tauri/icons. The build will fail.
Drop a square PNG (>=1024x1024) into the project root as app-icon.png,
then run: npm run tauri:icon -- ./app-icon.png

EOF
    exit 1
fi

[ -d node_modules ] || npm install

echo
echo "Building LevelUp .dmg / .app. This compiles Rust in release mode and"
echo "bundles the frontend. Expect 3-8 minutes on the first run."
echo "Output: src-tauri/target/release/bundle/"
echo
npm run tauri:build
