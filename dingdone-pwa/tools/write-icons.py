"""Decode the data URLs emitted by the tools/make-*.html generators into icons/.

Reads the Chromium --dump-dom output on stdin; see tools/make-icons.sh and
tools/make-buttons.sh.
"""

import base64
import json
import pathlib
import re
import sys

dom = sys.stdin.read()

match = re.search(r'@@ICONS@@(.*?)@@ICONS@@', dom, re.S)
if not match:
    err = re.search(r'ERROR ([^<]*)', dom)
    sys.exit(f'icon generation failed: {err.group(1) if err else "no output found in DOM"}')

payload = json.loads(match.group(1))
box = payload.get('box')
if box:
    print(f"monogram bbox in 2048px raster: {box}")

written = [
    (name, pathlib.Path(name), base64.b64decode(url.split(',', 1)[1]))
    for name, url in payload.get('files', {}).items()
]

for name, path, data in written:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    print(f"  {name:36s} {len(data) / 1024:7.1f} KB")
