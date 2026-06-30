#!/usr/bin/env python3
"""Audiolyte static file server with quote API, caching, ETags, and gzip support."""
import http.server
import gzip
import io
import json
import os
import sys
import time
import urllib.parse
from http.server import ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3001
BIND = sys.argv[2] if len(sys.argv) > 2 else '100.106.7.56'
DIR = os.path.dirname(os.path.abspath(__file__))
QUOTES_DIR = os.path.join(DIR, 'quotes')
os.makedirs(QUOTES_DIR, exist_ok=True)

# Cache durations in seconds
CACHE_IMAGE = 604800       # 7 days
CACHE_CSS_JS = 86400       # 1 day
CACHE_HTML = 0             # no-cache

# File types eligible for gzip compression
TEXT_EXTENSIONS = {'.html', '.htm', '.css', '.js', '.json', '.xml', '.svg', '.txt', '.md'}

# Image extensions eligible for long cache
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.avif'}


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests - static files only, API paths return 404."""
        if self.path.startswith('/api/'):
            self._json(404, {'ok': False, 'error': 'Not found'})
            return
        super().do_GET()

    def do_POST(self):
        if self.path == '/api/quote':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body)
            except Exception:
                self._json(400, {'ok': False, 'error': 'Invalid JSON'})
                return

            name = (data.get('name') or '').strip()
            email = (data.get('email') or '').strip()
            phone = (data.get('phone') or '').strip()
            msg = (data.get('message') or '').strip()
            items = data.get('items', [])

            if not name or not email:
                self._json(400, {'ok': False, 'error': 'Naam en e-mail zijn verplicht.'})
                return

            quote = {
                'id': str(int(time.time() * 1000)),
                'created': time.strftime('%Y-%m-%d %H:%M:%S'),
                'name': name,
                'email': email,
                'phone': phone,
                'message': msg,
                'items': items,
            }

            fname = f"quote-{quote['id']}.json"
            with open(os.path.join(QUOTES_DIR, fname), 'w', encoding='utf-8') as f:
                json.dump(quote, f, indent=2)

            self._json(200, {'ok': True, 'id': quote['id']})
        else:
            self._json(404, {'ok': False, 'error': 'Not found'})

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def _json(self, status, data):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_head(self):
        """Serve file with Cache-Control, ETag, Last-Modified, and gzip compression."""
        path = self.translate_path(self.path)

        # Directory handling - look for index files
        if os.path.isdir(path):
            for index in ('index.html', 'index.htm'):
                index_path = os.path.join(path, index)
                if os.path.exists(index_path):
                    path = index_path
                    break
            else:
                return self.list_directory(path)

        # Check file exists
        if not os.path.exists(path):
            return self.send_error(404, 'File not found')

        # Open file
        try:
            f = open(path, 'rb')
        except OSError:
            return self.send_error(404, 'File not found')

        st = os.stat(path)
        mtime = st.st_mtime
        size = st.st_size
        etag = f'W/"{int(mtime):x}-{size:x}"'

        # Conditional GET - If-None-Match
        if_none_match = self.headers.get('If-None-Match')
        if if_none_match:
            # Strip whitespace and quotes for comparison
            req_etag = if_none_match.strip().strip('"')
            our_etag = etag.strip().strip('"')
            if req_etag == our_etag:
                f.close()
                self.send_response(304)
                self.send_header('ETag', etag)
                self.end_headers()
                return None

        # Conditional GET - If-Modified-Since
        if_modified_since = self.headers.get('If-Modified-Since')
        if if_modified_since:
            try:
                ims = time.mktime(time.strptime(if_modified_since, '%a, %d %b %Y %H:%M:%S %Z'))
                if mtime <= ims:
                    f.close()
                    self.send_response(304)
                    self.send_header('ETag', etag)
                    self.end_headers()
                    return None
            except (ValueError, OSError):
                pass

        # Determine content type
        ctype = self.guess_type(path)

        # Determine cache policy based on file extension
        _, ext = os.path.splitext(path)
        ext = ext.lower()

        if ext in IMAGE_EXTENSIONS:
            cache_max_age = CACHE_IMAGE
        elif ext in ('.css', '.js'):
            cache_max_age = CACHE_CSS_JS
        elif ext in ('.html', '.htm'):
            cache_max_age = CACHE_HTML
        else:
            cache_max_age = 0

        cache_control = f'public, max-age={cache_max_age}' if cache_max_age > 0 else 'no-cache'

        # Check if client accepts gzip for text assets
        can_gzip = (
            ext in TEXT_EXTENSIONS and
            'gzip' in self.headers.get('Accept-Encoding', '').lower()
        )

        if can_gzip:
            raw = f.read()
            f.close()
            compressed = gzip.compress(raw)
            self.send_response(200)
            self.send_header('Content-Encoding', 'gzip')
            self.send_header('Content-Length', str(len(compressed)))
            self.send_header('Content-Type', ctype)
            self.send_header('ETag', etag)
            self.send_header('Last-Modified', self.date_time_string(mtime))
            self.send_header('Cache-Control', cache_control)
            self.send_header('Vary', 'Accept-Encoding')
            self.end_headers()
            return io.BytesIO(compressed)

        # Normal serving without compression
        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(size))
        self.send_header('Last-Modified', self.date_time_string(mtime))
        self.send_header('ETag', etag)
        self.send_header('Cache-Control', cache_control)
        self.end_headers()
        return f

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def log_message(self, fmt, *a):
        pass  # quiet


if __name__ == '__main__':
    ThreadingHTTPServer((BIND, PORT), Handler).serve_forever()
