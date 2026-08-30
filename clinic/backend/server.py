import hashlib
import json
import secrets
import sqlite3
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
# The original petclinic.db is a legacy export with a different schema.
# Keep it untouched and use a dedicated runtime database for the API.
DB_PATH = ROOT / "petclinic_runtime.db"
HOST, PORT = "127.0.0.1", 8001
TOKENS = {}


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    with connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
              role TEXT NOT NULL CHECK(role IN ('admin','vet','customer')),
              password_hash TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS customers (
              id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
              phone TEXT NOT NULL, email TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS pets (
              id INTEGER PRIMARY KEY AUTOINCREMENT, owner_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
              name TEXT NOT NULL, species TEXT NOT NULL, breed TEXT, age TEXT, weight REAL,
              status TEXT NOT NULL DEFAULT 'پایدار', note TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS appointments (
              id INTEGER PRIMARY KEY AUTOINCREMENT, pet_id INTEGER REFERENCES pets(id) ON DELETE SET NULL,
              customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL, starts_at TEXT NOT NULL,
              service TEXT NOT NULL, doctor TEXT, status TEXT NOT NULL DEFAULT 'در انتظار',
              note TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS records (
              id INTEGER PRIMARY KEY AUTOINCREMENT, pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
              visit_date TEXT NOT NULL, diagnosis TEXT, treatment TEXT, notes TEXT,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS lab_results (
              id INTEGER PRIMARY KEY AUTOINCREMENT, pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
              panel TEXT NOT NULL, result_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'ثبت‌شده',
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS audit_log (
              id INTEGER PRIMARY KEY AUTOINCREMENT, actor TEXT, action TEXT NOT NULL,
              entity TEXT NOT NULL, entity_id INTEGER, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        if conn.execute("SELECT COUNT(*) FROM users").fetchone()[0] == 0:
            digest = hashlib.sha256(b"123456").hexdigest()
            conn.executemany(
                "INSERT INTO users(name,email,role,password_hash) VALUES (?,?,?,?)",
                [("مریم احمدی", "admin@petclinic.local", "admin", digest),
                 ("دکتر پارسا", "vet@petclinic.local", "vet", digest)],
            )


def as_dict(row):
    return dict(row) if row else None


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def send_json(self, status, payload):
        data = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Access-Control-Allow-Origin", "http://127.0.0.1:8000")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "http://127.0.0.1:8000")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def body(self):
        length = int(self.headers.get("Content-Length", 0))
        if length > 2_000_000:
            raise ValueError("درخواست بیش از حد بزرگ است")
        return json.loads(self.rfile.read(length).decode() or "{}")

    def user(self):
        token = self.headers.get("Authorization", "").removeprefix("Bearer ").strip()
        item = TOKENS.get(token)
        if not item or item["expires"] < time.time():
            self.send_json(401, {"error": "احراز هویت لازم است"})
            return None
        return item

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/health":
            return self.send_json(200, {"ok": True, "service": "petclinic-api"})
        if not path.startswith("/api/"):
            return self.static(path)
        if not self.user():
            return
        queries = {
            "/api/customers": "SELECT * FROM customers ORDER BY id DESC",
            "/api/pets": """SELECT p.*, c.name owner_name FROM pets p JOIN customers c ON c.id=p.owner_id ORDER BY p.id DESC""",
            "/api/appointments": """SELECT a.*, p.name pet_name, c.name customer_name FROM appointments a
                                  LEFT JOIN pets p ON p.id=a.pet_id LEFT JOIN customers c ON c.id=a.customer_id
                                  ORDER BY starts_at DESC""",
            "/api/records": "SELECT r.*, p.name pet_name FROM records r JOIN pets p ON p.id=r.pet_id ORDER BY visit_date DESC",
            "/api/labs": "SELECT l.*, p.name pet_name FROM lab_results l JOIN pets p ON p.id=l.pet_id ORDER BY l.id DESC",
        }
        sql = queries.get(path)
        if not sql:
            return self.send_json(404, {"error": "مسیر پیدا نشد"})
        with connect() as conn:
            return self.send_json(200, {"items": [as_dict(r) for r in conn.execute(sql)]})

    def do_POST(self):
        path = urlparse(self.path).path
        try:
            payload = self.body()
        except (ValueError, json.JSONDecodeError) as exc:
            return self.send_json(400, {"error": str(exc)})
        if path == "/api/auth/login":
            email, password = str(payload.get("email", "")).lower().strip(), str(payload.get("password", ""))
            digest = hashlib.sha256(password.encode()).hexdigest()
            with connect() as conn:
                row = conn.execute("SELECT id,name,email,role FROM users WHERE lower(email)=? AND password_hash=?",
                                   (email, digest)).fetchone()
            if not row:
                return self.send_json(401, {"error": "ایمیل یا رمز عبور نادرست است"})
            token = secrets.token_urlsafe(32)
            TOKENS[token] = {"id": row["id"], "name": row["name"], "role": row["role"], "expires": time.time() + 86400}
            return self.send_json(200, {"token": token, "user": as_dict(row)})
        actor = self.user()
        if not actor:
            return
        specs = {
            "/api/customers": ("customers", ("name", "phone"), ("name", "phone", "email")),
            "/api/pets": ("pets", ("owner_id", "name", "species"), ("owner_id", "name", "species", "breed", "age", "weight", "status", "note")),
            "/api/appointments": ("appointments", ("starts_at", "service"), ("pet_id", "customer_id", "starts_at", "service", "doctor", "status", "note")),
            "/api/records": ("records", ("pet_id", "visit_date"), ("pet_id", "visit_date", "diagnosis", "treatment", "notes")),
            "/api/labs": ("lab_results", ("pet_id", "panel"), ("pet_id", "panel", "result_json", "status")),
        }
        spec = specs.get(path)
        if not spec:
            return self.send_json(404, {"error": "مسیر پیدا نشد"})
        table, required, fields = spec
        missing = [f for f in required if payload.get(f) in (None, "")]
        if missing:
            return self.send_json(400, {"error": "فیلدهای الزامی: " + ", ".join(missing)})
        if "pet_id" in payload:
            with connect() as conn:
                exists = conn.execute("SELECT 1 FROM pets WHERE id=?", (payload["pet_id"],)).fetchone()
            if not exists:
                return self.send_json(400, {"error": "حیوان انتخاب‌شده پیدا نشد"})
        values = []
        for field in fields:
            value = payload.get(field)
            if field == "result_json" and not isinstance(value, str):
                value = json.dumps(value or {}, ensure_ascii=False)
            values.append(value)
        with connect() as conn:
            columns = ",".join(fields)
            placeholders = ",".join("?" for _ in fields)
            cur = conn.execute(f"INSERT INTO {table}({columns}) VALUES ({placeholders})", values)
            conn.execute("INSERT INTO audit_log(actor,action,entity,entity_id) VALUES (?,?,?,?)",
                         (actor["name"], "create", table, cur.lastrowid))
            row = conn.execute(f"SELECT * FROM {table} WHERE id=?", (cur.lastrowid,)).fetchone()
        return self.send_json(201, {"item": as_dict(row)})

    def static(self, path):
        relative = path.lstrip("/") or "index.html"
        target = (ROOT / relative).resolve()
        if ROOT not in target.parents and target != ROOT or not target.is_file():
            return self.send_json(404, {"error": "فایل پیدا نشد"})
        content = target.read_bytes()
        content_type = {".html": "text/html", ".js": "text/javascript", ".css": "text/css"}.get(target.suffix, "application/octet-stream")
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)


if __name__ == "__main__":
    init_db()
    print(f"PetClinic API: http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
