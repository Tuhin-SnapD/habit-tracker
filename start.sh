#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

echo "=== LevelUp Habit Tracker ==="

# Step 1: ensure Node.js is installed
if ! command -v node >/dev/null 2>&1; then
    echo "Node.js was not found."
    if command -v brew >/dev/null 2>&1; then
        echo "Installing Node.js via Homebrew..."
        brew install node
    else
        echo "Homebrew is not installed. Install it first with:"
        echo '  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
        echo "Or install Node.js LTS manually from https://nodejs.org/ then re-run this script."
        exit 1
    fi
fi

# Step 2: install dependencies if missing
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (first run only)..."
    npm install
fi

# Step 3: launch dev server
echo
echo "Starting dev server. The app will open at http://localhost:5173"
echo "Press Ctrl+C to stop."
echo
npm run dev
