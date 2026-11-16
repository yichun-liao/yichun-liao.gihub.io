#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "Starting Portfolio Studio..."

if command -v python3 >/dev/null 2>&1; then
  exec python3 studio/server.py "$@"
elif command -v python >/dev/null 2>&1; then
  exec python studio/server.py "$@"
else
  echo ""
  echo "[ERROR] Python 3 is required to launch Portfolio Studio."
  echo "Install Python 3 from https://www.python.org/ or via Homebrew (brew install python)."
  read -r -p "Press Return to close..."
  exit 1
fi
