#!/usr/bin/env python3
"""
Portfolio Studio Local Server & Launcher

Serves the portfolio website and the retro Macintosh Visual CMS (/studio/)
over localhost using only Python 3 standard library modules, with atomic saves
and automatic rolling backups for data/site-content.json.
"""

from __future__ import annotations

import argparse
import datetime
import http.server
import json
import os
from pathlib import Path
import shutil
import socketserver
import sys
import threading
import urllib.parse
import webbrowser

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
CONTENT_FILE = DATA_DIR / "site-content.json"
BACKUP_DIR = DATA_DIR / "backups"
MAX_BACKUPS = 20
MAX_BODY_BYTES = 10 * 1024 * 1024  # 10 MB safety limit

SAVE_LOCK = threading.Lock()


class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def validate_site_content(payload: object) -> tuple[bool, str]:
    """Validate the top-level structure of site-content.json."""
    if not isinstance(payload, dict):
        return False, "Payload must be a JSON object."

    version = payload.get("version")
    if isinstance(version, bool) or not isinstance(version, (int, float)):
        return False, "Field 'version' must be a number."

    site = payload.get("site")
    if not isinstance(site, dict):
        return False, "Field 'site' must be an object."

    tabs = payload.get("tabs")
    if not isinstance(tabs, list):
        return False, "Field 'tabs' must be an array."

    seen_ids: set[str] = set()
    for idx, tab in enumerate(tabs):
        if not isinstance(tab, dict):
            return False, f"tabs[{idx}] must be an object."
        tab_id = tab.get("id")
        if not isinstance(tab_id, str) or not tab_id.strip():
            return False, f"tabs[{idx}].id must be a non-empty string."
        if tab_id in seen_ids:
            return False, f"Duplicate tab id '{tab_id}'."
        seen_ids.add(tab_id)
        blocks = tab.get("blocks")
        if blocks is not None and not isinstance(blocks, dict):
            return False, f"tabs[{idx}].blocks must be an object."

    return True, ""


def prune_old_backups(backup_dir: Path, keep: int = MAX_BACKUPS) -> None:
    """Keep only the most recent `keep` backup JSON files."""
    backups = sorted(
        backup_dir.glob("site-content.*.json"),
        key=lambda p: (p.stat().st_mtime, p.name),
    )
    excess = len(backups) - keep
    if excess > 0:
        for old_file in backups[:excess]:
            try:
                old_file.unlink()
            except OSError:
                pass


def save_site_content(payload: dict) -> str:
    """Create a rolling backup and atomically write data/site-content.json."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    backup_filename = f"site-content.{timestamp}.json"
    backup_path = BACKUP_DIR / backup_filename
    formatted_json = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"

    with SAVE_LOCK:
        if CONTENT_FILE.exists():
            shutil.copy2(CONTENT_FILE, backup_path)
        else:
            backup_path.write_text(formatted_json, encoding="utf-8")

        prune_old_backups(BACKUP_DIR, MAX_BACKUPS)

        tmp_name = f".site-content.tmp.{os.getpid()}.{threading.get_ident()}.json"
        tmp_path = DATA_DIR / tmp_name
        try:
            with open(tmp_path, "w", encoding="utf-8", newline="\n") as fh:
                fh.write(formatted_json)
                fh.flush()
                os.fsync(fh.fileno())
            os.replace(tmp_path, CONTENT_FILE)
        except Exception:
            if tmp_path.exists():
                try:
                    tmp_path.unlink()
                except OSError:
                    pass
            raise

    return f"data/backups/{backup_filename}"


class StudioRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP handler serving static portfolio files plus Studio JSON API."""

    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".htm": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".mjs": "application/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".woff2": "font/woff2",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def _clean_path(self) -> str:
        return urllib.parse.urlsplit(self.path).path

    def end_headers(self) -> None:
        clean_path = self._clean_path()
        if clean_path == "/data/site-content.json" or clean_path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()

    def _send_json(self, status_code: int, data: dict) -> None:
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        clean_path = self._clean_path()
        if clean_path == "/api/health":
            self._send_json(200, {"ok": True, "mode": "local_studio"})
            return
        super().do_GET()

    def do_POST(self) -> None:
        clean_path = self._clean_path()
        if clean_path != "/api/save":
            self._send_json(404, {"ok": False, "error": "Not found"})
            return

        content_length_raw = self.headers.get("Content-Length")
        if content_length_raw is None:
            self._send_json(411, {"ok": False, "error": "Missing Content-Length header."})
            return

        try:
            content_length = int(content_length_raw)
        except ValueError:
            self._send_json(400, {"ok": False, "error": "Invalid Content-Length header."})
            return

        if content_length <= 0 or content_length > MAX_BODY_BYTES:
            self._send_json(400, {"ok": False, "error": "Request body size out of bounds."})
            return

        raw_body = self.rfile.read(content_length)
        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            self._send_json(400, {"ok": False, "error": f"Invalid JSON: {exc}"})
            return

        valid, err_msg = validate_site_content(payload)
        if not valid:
            self._send_json(400, {"ok": False, "error": err_msg})
            return

        try:
            backup_rel = save_site_content(payload)
        except OSError as exc:
            self._send_json(500, {"ok": False, "error": f"Failed to save content: {exc}"})
            return

        self._send_json(200, {"ok": True, "backup": backup_rel})

    def handle(self) -> None:
        try:
            super().handle()
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass

    def log_message(self, format: str, *args) -> None:
        message = format % args
        sys.stdout.write(f"[studio] {self.address_string()} - {message}\n")
        sys.stdout.flush()


def bind_server(host: str, start_port: int, max_attempts: int = 50) -> tuple[ThreadingHTTPServer, int]:
    """Bind to start_port or the next available port on host."""
    last_error: OSError | None = None
    for offset in range(max_attempts):
        port = start_port + offset
        try:
            server = ThreadingHTTPServer((host, port), StudioRequestHandler)
            return server, port
        except OSError as exc:
            last_error = exc
            continue
    raise RuntimeError(f"Could not bind any port in range {start_port}-{start_port + max_attempts - 1}: {last_error}")


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Launch the local Portfolio Studio server.")
    parser.add_argument(
        "--port",
        type=int,
        default=8765,
        help="Preferred TCP port on 127.0.0.1 (default: 8765; falls back to next free port if busy).",
    )
    parser.add_argument(
        "--no-open",
        action="store_true",
        help="Do not automatically open the Studio URL in the default browser.",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv if argv is not None else sys.argv[1:])
    host = "127.0.0.1"
    try:
        server, port = bind_server(host, args.port)
    except RuntimeError as exc:
        sys.stderr.write(f"Error: {exc}\n")
        return 1

    studio_url = f"http://{host}:{port}/studio/"
    site_url = f"http://{host}:{port}/"

    print("============================================================")
    print("  PORTFOLIO_STUDIO.APP // Local Visual CMS Server")
    print(f"  Project Root : {BASE_DIR}")
    print(f"  Studio URL   : {studio_url}")
    print(f"  Live Site    : {site_url}")
    print("  Press Ctrl+C to stop the server.")
    print("============================================================")
    sys.stdout.flush()

    if not args.no_open:
        threading.Timer(0.4, lambda: webbrowser.open(studio_url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Portfolio Studio server...")
    finally:
        server.server_close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
