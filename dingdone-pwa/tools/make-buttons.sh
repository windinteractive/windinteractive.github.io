#!/usr/bin/env sh
# Regenerate icons/btn-bg.webp from the button artwork in svg/ using the Chromium
# that ships with this environment. No ImageMagick / librsvg / Pillow needed.
#
#   ./tools/make-buttons.sh
set -eu

cd "$(dirname "$0")/.."

CHROME="${CHROME:-$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome 2>/dev/null | head -1)}"
[ -x "$CHROME" ] || { echo "chromium not found; set CHROME=/path/to/chrome" >&2; exit 1; }

PORT=8778
python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
sleep 1

# The generator canvas needs same-origin access to the SVG, so it has to be served
# over http rather than opened as file://.
"$CHROME" --headless --disable-gpu --no-sandbox --virtual-time-budget=30000 \
  --dump-dom "http://127.0.0.1:$PORT/tools/make-buttons.html" 2>/dev/null \
  | python3 tools/write-icons.py
