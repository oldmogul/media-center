#!/usr/bin/env python3
"""Serve the UMC site and proxy UGov chatbot calls to xAI (SpaceXAI)."""
from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PORT = int(os.environ.get("PORT", "5173"))
XAI_URL = "https://api.x.ai/v1/chat/completions"
MODEL = os.environ.get("XAI_MODEL", "grok-4.6")

SYSTEM = (
    "You are UGov, the official chatbot of the Uganda Media Centre. "
    "You are trained on Ugandan government affairs (ministries, NIRA IDs, passports, "
    "URA taxes, PDM, UNEB, health lines, press, languages, radio) and you may also "
    "answer ordinary general questions briefly and helpfully. Keep replies under 90 words. "
    "Official, clear tone. If the user has a personal legal, land, court or medical-diagnosis "
    "case, do not guess — tell them to WhatsApp the Uganda Media Centre on "
    "+256 312 261 525, +256 414 254 461 or +256 414 237 141."
)


def load_env() -> None:
    env = ROOT / ".env"
    if not env.exists():
        return
    for line in env.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, val = line.split("=", 1)
        os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))


load_env()


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        if self.path.startswith("/api/"):
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

    def do_POST(self) -> None:
        if self.path.split("?", 1)[0] != "/api/ugov-chat":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length") or 0)
        try:
            body = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            self._json(400, {"error": "invalid json"})
            return
        key = os.environ.get("XAI_API_KEY") or "test-key"
        lang = body.get("lang") or "en"
        spoken = "Luganda" if lang == "lg" else "Kiswahili" if lang == "sw" else "English"
        incoming = body.get("messages") or []
        messages = [{"role": "system", "content": SYSTEM + " Reply in " + spoken + "."}]
        for m in incoming[-8:]:
            role = m.get("role") if isinstance(m, dict) else None
            content = m.get("content") if isinstance(m, dict) else None
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": str(content)})
        req = urllib.request.Request(
            XAI_URL,
            data=json.dumps({"model": MODEL, "temperature": 0.4, "messages": messages}).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer " + key,
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=45) as resp:
                raw = resp.read()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(raw)
        except urllib.error.HTTPError as err:
            self._json(err.code, {"error": err.read().decode("utf-8", "ignore")[:400]})
        except Exception as err:
            self._json(502, {"error": str(err)})

    def _json(self, code: int, payload: dict) -> None:
        data = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt: str, *args) -> None:
        if str(args[0]).startswith("POST /api/"):
            super().log_message(fmt, *args)


if __name__ == "__main__":
    os.chdir(ROOT)
    key = os.environ.get("XAI_API_KEY") or "test-key"
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print("UMC server http://127.0.0.1:%s  grok=%s  key=%s" % (
        PORT, MODEL, "set" if key and key != "test-key" else "test-key"
    ), flush=True)
    httpd.serve_forever()
