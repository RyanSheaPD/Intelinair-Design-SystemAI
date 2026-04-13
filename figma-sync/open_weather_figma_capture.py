#!/usr/bin/env python3
"""Open one agmri-weather.html URL with Figma HTML→Design hash; wait for delayed capture."""
import subprocess
import sys
import time
from urllib.parse import quote


def main() -> None:
    if len(sys.argv) < 3:
        print(
            "Usage: open_weather_figma_capture.py CAPTURE_UUID 'view=map&figmaHover=…' [port]",
            file=sys.stderr,
        )
        sys.exit(1)
    cid = sys.argv[1]
    q = sys.argv[2]
    port = sys.argv[3] if len(sys.argv) > 3 else "8901"
    delay_ms = sys.argv[4] if len(sys.argv) > 4 else "4500"
    base = f"http://localhost:{port}/pages/weather/agmri-weather.html"
    ep = quote(f"https://mcp.figma.com/mcp/capture/{cid}/submit", safe="")
    url = f"{base}?{q}#figmacapture={cid}&figmaendpoint={ep}&figmadelay={delay_ms}"
    subprocess.run(["open", url], check=False)
    time.sleep(14)


if __name__ == "__main__":
    main()
