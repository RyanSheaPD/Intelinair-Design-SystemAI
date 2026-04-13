#!/usr/bin/env python3
"""Validate data/weather-hover-states.json.

Hover export UI is built client-side in pages/weather-hover-states.html (table + TOC + iframes).
Edit the JSON manifest and reload that page; legacy pages/weather-hover-states-export.html redirects there.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    path = ROOT / "data" / "weather-hover-states.json"
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    states = data.get("states")
    if not isinstance(states, list) or not states:
        print("error: states must be a non-empty list", file=sys.stderr)
        return 1
    for i, s in enumerate(states):
        if not isinstance(s, dict) or "query" not in s or "label" not in s:
            print(f"error: states[{i}] needs label and query", file=sys.stderr)
            return 1
    print("OK:", path, f"({len(states)} states)")
    print("Open pages/weather-hover-states.html over HTTP to view export.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
