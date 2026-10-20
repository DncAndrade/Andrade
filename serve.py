"""
AVA · Servidor HTTP local rápido
================================
Substitui `python -m http.server` com:
  - HTTP/1.1 + keep-alive  → menos conexões/ida-e-volta pelo túnel
  - gzip automático        → ~70% menos bytes em js/css/html
  - Cache-Control          → assets reutilizados por 60s (recarga instantânea)

Uso:  python serve.py      (porta 8000, somente localhost — o túnel do
                             VS Code encaminha para esta porta)
"""
import gzip
import os
from email.utils import formatdate, parsedate_tz, mktime_tz
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 8000
BIND = "127.0.0.1"
ROOT = os.path.dirname(os.path.abspath(__file__))
COMPRESSIBLE = {".html", ".htm", ".css", ".js", ".svg", ".json", ".txt", ".map"}


class Handler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "AVA/1.0"

    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "application/javascript",
        ".mjs": "application/javascript",
        ".svg": "image/svg+xml",
    }

    def end_headers(self):
        # Políticas de cache: assets ficam 60s em cache; HTML sempre revalida
        path = self.path.split("?", 1)[0]
        if path.startswith("/assets/"):
            self.send_header("Cache-Control", "public, max-age=60")
        else:
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self):
        fs = self.translate_path(self.path)
        if os.path.isdir(fs) and self.path.endswith("/"):
            idx = os.path.join(fs, "index.html")
            if os.path.isfile(idx):
                fs = idx
        accept = self.headers.get("Accept-Encoding", "")
        if (
            os.path.isfile(fs)
            and os.path.splitext(fs)[1].lower() in COMPRESSIBLE
            and "gzip" in accept
        ):
            self.serve_gzip(fs)
            return
        super().do_GET()

    def serve_gzip(self, fs):
        try:
            with open(fs, "rb") as f:
                raw = f.read()
            mtime = os.path.getmtime(fs)
        except OSError:
            self.send_error(404, "File not found")
            return

        # Revalidação condicional (304)
        since = self.headers.get("If-Modified-Since")
        if since:
            t = parsedate_tz(since)
            if t and int(mtime) <= mktime_tz(t):
                self.send_response(304)
                self.end_headers()
                return

        data = gzip.compress(raw, 6)
        self.send_response(200)
        self.send_header("Content-Type", self.guess_type(fs))
        self.send_header("Content-Encoding", "gzip")
        self.send_header("Vary", "Accept-Encoding")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Last-Modified", formatdate(mtime, usegmt=True))
        self.end_headers()
        try:
            self.wfile.write(data)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def log_message(self, fmt, *args):
        """Silencioso — não polui o terminal do VS Code."""
        pass


def main():
    handler = partial(Handler, directory=ROOT)
    httpd = ThreadingHTTPServer((BIND, PORT), handler)
    httpd.daemon_threads = True
    print(f"[AVA] Servidor rapido em http://{BIND}:{PORT} (HTTP/1.1 + gzip + cache)")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
