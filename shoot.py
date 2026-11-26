"""Take the four Japan in Numbers screenshots with headless Camoufox (Firefox).

Viewport 1280x800 for desktop shots (long side 1280, the gate's max) and
390x844 for the phone shot (short side 390, above the gate's 360 minimum).
The site is served over local HTTP so its ES modules load; each shot loads
its hash route, waits for the app to render, then saves a JPEG (quality
80) so every file stays under the gate's 256 KiB cap.

Run with the dev server up first: `node serve.ts` in this directory
(listens on 127.0.0.1:8080).
"""
import json
import os
import sys

from playwright.sync_api import sync_playwright

BIN = os.path.expanduser("~/workspace/ai-studio/scratch/camoufox-bin/camoufox")
BASE = "http://127.0.0.1:8080/"
WORK = "/home/hatch/workspace/makefun/best-national-statistics-site-v2"
OUT = os.path.join(WORK, "screenshots")


def main() -> int:
    with open(os.path.join(WORK, "shots.json")) as f:
        shots = json.load(f)
    os.makedirs(OUT, exist_ok=True)
    with sync_playwright() as p:
        browser = p.firefox.launch(executable_path=BIN, headless=True, timeout=90000)
        for shot in shots:
            w = shot["viewport"]["width"]
            h = shot["viewport"]["height"]
            page = browser.new_page(viewport={"width": w, "height": h})
            errors = []
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(BASE + shot["path"], wait_until="load", timeout=30000)
            # NOTE: in this Camoufox build, Playwright's evaluate runs in a
            # different JS realm from the page's own module scripts, so
            # window.__shotReady is invisible to it (verified with a minimal
            # repro: module sets the flag and renders the DOM, evaluate sees
            # the DOM but not the flag). Wait on the DOM instead: the app
            # rendered with at least one chart.
            page.wait_for_function(
                "document.getElementById('app').children.length > 0 && document.querySelectorAll('svg').length > 0",
                timeout=15000,
            )
            page.wait_for_timeout(400)
            path = os.path.join(OUT, shot["file"])
            page.screenshot(path=path, type="jpeg", quality=80)
            size = os.path.getsize(path)
            print(f"{shot['file']}: {size} bytes, console errors: {errors}", flush=True)
            if errors:
                print("FAILED on errors", flush=True)
                return 1
            if size > 262144:
                print("FAILED: over 256 KiB", flush=True)
                return 1
            page.close()
        browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
