#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "=== LevelUp Desktop (Tauri dev) ==="

if ! command -v node >/dev/null 2>&1; then
    echo "Node.js not found. Run ./start.sh first."
    exit 1
fi

if ! command -v cargo >/dev/null 2>&1; then
    echo "Rust toolchain not found. Installing rustup..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
    # shellcheck disable=SC1091
    source "$HOME/.cargo/env"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing JS dependencies..."
    npm install
fi

echo
echo "Launching LevelUp desktop. First run will compile Rust (~2-5 min)."
echo
npm run tauri:dev
