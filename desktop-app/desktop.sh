#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
# Hop up to the project root if launched from desktop-app/
[ -f package.json ] || cd ..

echo "=== LevelUp Desktop (Tauri dev) ==="

if ! command -v node >/dev/null 2>&1; then
    echo "Node.js not found. Run ./start.sh first."
    exit 1
fi

# Cargo: PATH first, then rustup default location.
if ! command -v cargo >/dev/null 2>&1; then
    if [ -x "$HOME/.cargo/bin/cargo" ]; then
        echo "Found Rust at \$HOME/.cargo/bin - adding to PATH..."
        export PATH="$HOME/.cargo/bin:$PATH"
    else
        echo "Rust not found. Installing rustup..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
        # shellcheck disable=SC1091
        source "$HOME/.cargo/env"
    fi
fi

if ! command -v cargo >/dev/null 2>&1; then
    echo "cargo still not on PATH. Open a new terminal and retry."
    exit 1
fi

echo "Using $(cargo --version)"

if [ ! -d "node_modules" ]; then
    echo "Installing JS dependencies..."
    npm install
fi

echo
echo "Launching LevelUp desktop. First run will compile Rust (~2-5 min)."
echo
npm run tauri:dev
