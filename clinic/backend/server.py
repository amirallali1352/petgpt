import hashlib
import json
import secrets
import sqlite3
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

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


def ensure_column(conn, table, column, definition):
    columns = {row["name"] for row in conn.execute(f"PRAGMA table_info({table})")}
    if column not in columns:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


def init_db():
    with connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
              role TEXT NOT NULL CHECK(role IN ('admin','vet','customer','shop_seller')),
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
            CREATE TABLE IF NOT EXISTS lab_requests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
              panel TEXT NOT NULL, sample TEXT, priority TEXT NOT NULL DEFAULT 'normal',
              reason TEXT, doctor TEXT, status TEXT NOT NULL DEFAULT 'requested',
              accession_number TEXT, result_json TEXT NOT NULL DEFAULT '{}',
              received_at TEXT, completed_at TEXT,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS lab_results (
              id INTEGER PRIMARY KEY AUTOINCREMENT, pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
              panel TEXT NOT NULL, result_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'ثبت‌شده',
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS imaging_studies (
              id INTEGER PRIMARY KEY AUTOINCREMENT, pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
              study_type TEXT NOT NULL, body_area TEXT NOT NULL, report TEXT, file_name TEXT,
              status TEXT NOT NULL DEFAULT 'ثبت‌شده', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS prescriptions (
              id INTEGER PRIMARY KEY AUTOINCREMENT, pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
              medicine TEXT NOT NULL, dose TEXT, duration TEXT, instructions TEXT, dispensed TEXT NOT NULL DEFAULT 'تحویل نشده',
              note TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS nutrition_plans (
              id INTEGER PRIMARY KEY AUTOINCREMENT, pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
              goal TEXT NOT NULL, calories REAL, plan_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'پیش‌نویس',
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS pharmacy_inventory (
              id INTEGER PRIMARY KEY AUTOINCREMENT, medicine_key TEXT UNIQUE, name TEXT NOT NULL,
              category TEXT, medicine_form TEXT, stock REAL NOT NULL DEFAULT 0,
              unit TEXT NOT NULL DEFAULT 'واحد', reorder REAL NOT NULL DEFAULT 0,
              updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS clinic_settings (
              id INTEGER PRIMARY KEY CHECK(id=1), clinic_name TEXT, phone TEXT, address TEXT,
              settings_json TEXT NOT NULL DEFAULT '{}', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS audit_log (
              id INTEGER PRIMARY KEY AUTOINCREMENT, actor TEXT, action TEXT NOT NULL,
              entity TEXT NOT NULL, entity_id INTEGER, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS products (
              id INTEGER PRIMARY KEY AUTOINCREMENT, sku TEXT UNIQUE,
              barcode TEXT UNIQUE NOT NULL, name TEXT NOT NULL, category TEXT,
              brand TEXT, description TEXT,
              purchase_price REAL NOT NULL DEFAULT 0 CHECK(purchase_price >= 0),
              sale_price REAL NOT NULL DEFAULT 0 CHECK(sale_price >= 0),
              unit TEXT NOT NULL DEFAULT 'unit', stock REAL NOT NULL DEFAULT 0 CHECK(stock >= 0),
              reorder_level REAL NOT NULL DEFAULT 0 CHECK(reorder_level >= 0),
              active INTEGER NOT NULL DEFAULT 1,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS stock_movements (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
              movement_type TEXT NOT NULL, quantity REAL NOT NULL CHECK(quantity > 0),
              unit_cost REAL NOT NULL DEFAULT 0 CHECK(unit_cost >= 0),
              stock_before REAL NOT NULL, stock_after REAL NOT NULL,
              reference TEXT, note TEXT, actor TEXT,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS sales (
              id INTEGER PRIMARY KEY AUTOINCREMENT, invoice_number TEXT UNIQUE NOT NULL,
              customer_name TEXT, customer_phone TEXT,
              payment_method TEXT NOT NULL DEFAULT 'cash',
              subtotal REAL NOT NULL DEFAULT 0, discount REAL NOT NULL DEFAULT 0,
              tax_percent REAL NOT NULL DEFAULT 0, tax REAL NOT NULL DEFAULT 0,
              total REAL NOT NULL DEFAULT 0, profit REAL NOT NULL DEFAULT 0,
              status TEXT NOT NULL DEFAULT 'completed', note TEXT, actor TEXT,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, cancelled_at TEXT
            );
            CREATE TABLE IF NOT EXISTS sale_items (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              sale_id INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
              product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
              quantity REAL NOT NULL CHECK(quantity > 0), unit_price REAL NOT NULL CHECK(unit_price >= 0),
              unit_cost REAL NOT NULL CHECK(unit_cost >= 0), subtotal REAL NOT NULL, profit REAL NOT NULL
            );
            """
        )
        user_schema = conn.execute(
            "SELECT sql FROM sqlite_master WHERE type='table' AND name='users'"
        ).fetchone()
        if user_schema and "shop_seller" not in (user_schema["sql"] or ""):
            conn.execute("ALTER TABLE users RENAME TO users_legacy")
            conn.execute(
                """CREATE TABLE users (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
                  role TEXT NOT NULL CHECK(role IN ('admin','vet','customer','shop_seller')),
                  password_hash TEXT NOT NULL
                )"""
            )
            conn.execute(
                "INSERT INTO users(id,name,email,role,password_hash) "
                "SELECT id,name,email,role,password_hash FROM users_legacy"
            )
            conn.execute("DROP TABLE users_legacy")
        for table, column, definition in [
            ("imaging_studies", "file_data", "TEXT"),
            ("imaging_studies", "file_type", "TEXT"),
            ("imaging_studies", "file_size", "INTEGER"),
            ("imaging_studies", "priority", "TEXT"),
            ("imaging_studies", "reason", "TEXT"),
            ("prescriptions", "status", "TEXT NOT NULL DEFAULT 'در انتظار بررسی'"),
            ("prescriptions", "priority", "TEXT"),
            ("prescriptions", "quantity", "TEXT"),
            ("prescriptions", "medicine_key", "TEXT"),
            ("prescriptions", "category", "TEXT"),
            ("prescriptions", "medicine_form", "TEXT"),
            ("prescriptions", "dispense_staff", "TEXT"),
            ("prescriptions", "dispense_receiver", "TEXT"),
            ("prescriptions", "dispensed_at", "TEXT"),
            ("prescriptions", "dispensed_quantity", "REAL NOT NULL DEFAULT 0"),
            ("nutrition_plans", "bcs", "INTEGER"),
            ("nutrition_plans", "rer", "REAL"),
            ("nutrition_plans", "mer", "REAL"),
            ("nutrition_plans", "water_ml", "REAL"),
            ("nutrition_plans", "species", "TEXT"),
            ("nutrition_plans", "weight", "REAL"),
            ("nutrition_plans", "diseases_json", "TEXT"),
            ("nutrition_plans", "medications_json", "TEXT"),
            ("nutrition_plans", "ingredients_json", "TEXT"),
            ("nutrition_plans", "notes", "TEXT"),
            ("records", "details_json", "TEXT NOT NULL DEFAULT '{}'"),
            ("lab_results", "request_id", "INTEGER"),
            ("lab_requests", "doctor", "TEXT"),
            ("lab_requests", "accession_number", "TEXT"),
            ("lab_requests", "result_json", "TEXT NOT NULL DEFAULT '{}'"),
            ("lab_requests", "received_at", "TEXT"),
            ("lab_requests", "completed_at", "TEXT"),
        ]:
            ensure_column(conn, table, column, definition)
        conn.execute(
            "UPDATE prescriptions SET status=CASE WHEN dispensed='تحویل به مالک' OR dispensed='تحویل از داروخانه' "
            "THEN 'تحویل‌شده' ELSE COALESCE(status, 'در انتظار بررسی') END WHERE status IS NULL OR status=''"
        )
        if conn.execute("SELECT COUNT(*) FROM pharmacy_inventory").fetchone()[0] == 0:
            conn.executemany(
                "INSERT INTO pharmacy_inventory(medicine_key,name,category,medicine_form,stock,unit,reorder) VALUES (?,?,?,?,?,?,?)",
                [
                    ("amoxicillin", "آموکسی‌سیلین", "آنتی‌بیوتیک", "قرص", 24, "بسته", 8),
                    ("meloxicam", "ملوکسیکام", "ضددرد و ضدالتهاب", "قرص", 16, "بسته", 5),
                    ("fenbendazole", "فنبندازول", "ضدانگل", "قرص", 12, "بسته", 4),
                    ("omeprazole", "امپرازول", "گوارشی", "کپسول", 9, "بسته", 3),
                    ("joint-supplement", "مکمل مفاصل", "مکمل", "پودر", 18, "بسته", 6),
                ],
            )
        if conn.execute("SELECT COUNT(*) FROM users").fetchone()[0] == 0:
            digest = hashlib.sha256(b"123456").hexdigest()
            conn.executemany(
                "INSERT INTO users(name,email,role,password_hash) VALUES (?,?,?,?)",
                [("مریم احمدی", "admin@petclinic.local", "admin", digest),
                 ("دکتر پارسا", "vet@petclinic.local", "vet", digest)],
            )
        digest = hashlib.sha256(b"123456").hexdigest()
        conn.execute(
            "INSERT OR IGNORE INTO users(name,email,role,password_hash) VALUES (?,?,?,?)",
            ("فروشنده پت‌شاپ", "shopkeeper@petclinic.local", "shop_seller", digest),
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
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "http://127.0.0.1:8000")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
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

    @staticmethod
    def money(value):
        return round(float(value or 0), 2)

    @staticmethod
    def number(value, field, minimum=0):
        try:
            result = float(str(value).replace(",", "."))
        except (TypeError, ValueError):
            raise ValueError(f"{field} must be a number")
        if result < minimum:
            raise ValueError(f"{field} must be at least {minimum}")
        return result

    def shop_get(self, path, query):
        with connect() as conn:
            if path == "/api/shop/products":
                clauses, values = [], []
                if query.get("q", [None])[0]:
                    term = f"%{query['q'][0].strip()}%"
                    clauses.append("(name LIKE ? OR sku LIKE ? OR barcode LIKE ? OR brand LIKE ?)")
                    values.extend([term, term, term, term])
                if query.get("barcode", [None])[0]:
                    clauses.append("barcode=?")
                    values.append(query["barcode"][0].strip())
                if query.get("active", [None])[0] is not None:
                    active = query["active"][0].lower()
                    if active in {"1", "true", "yes"}:
                        clauses.append("active=1")
                    elif active in {"0", "false", "no"}:
                        clauses.append("active=0")
                sql = "SELECT * FROM products"
                if clauses:
                    sql += " WHERE " + " AND ".join(clauses)
                sql += " ORDER BY id DESC"
                return self.send_json(200, {"items": [as_dict(r) for r in conn.execute(sql, values)]})
            if path == "/api/shop/stock-movements":
                rows = conn.execute(
                    """SELECT m.*, p.name product_name, p.barcode
                       FROM stock_movements m JOIN products p ON p.id=m.product_id
                       ORDER BY m.id DESC"""
                )
                return self.send_json(200, {"items": [as_dict(r) for r in rows]})
            if path == "/api/shop/sales":
                rows = [as_dict(r) for r in conn.execute("SELECT * FROM sales ORDER BY id DESC")]
                for sale in rows:
                    sale["items"] = [
                        as_dict(r) for r in conn.execute(
                            """SELECT i.*, p.name product_name, p.barcode
                               FROM sale_items i JOIN products p ON p.id=i.product_id
                               WHERE i.sale_id=? ORDER BY i.id""", (sale["id"],)
                        )
                    ]
                return self.send_json(200, {"items": rows})
            if path == "/api/shop/reports/summary":
                totals = conn.execute(
                    """SELECT COUNT(*) sales_count,
                              COALESCE(SUM(CASE WHEN status='completed' THEN subtotal ELSE 0 END),0) subtotal,
                              COALESCE(SUM(CASE WHEN status='completed' THEN discount ELSE 0 END),0) discount,
                              COALESCE(SUM(CASE WHEN status='completed' THEN tax ELSE 0 END),0) tax,
                              COALESCE(SUM(CASE WHEN status='completed' THEN total ELSE 0 END),0) revenue,
                              COALESCE(SUM(CASE WHEN status='completed' THEN profit ELSE 0 END),0) profit
                       FROM sales"""
                ).fetchone()
                inventory = conn.execute(
                    """SELECT COUNT(*) product_count,
                              COALESCE(SUM(stock * purchase_price),0) inventory_value,
                              COALESCE(SUM(CASE WHEN stock <= reorder_level THEN 1 ELSE 0 END),0) low_stock_count,
                              COALESCE(SUM(stock),0) total_units
                       FROM products WHERE active=1"""
                ).fetchone()
                report = {**as_dict(totals), **as_dict(inventory)}
                report["revenue"] = self.money(report["revenue"])
                report["profit"] = self.money(report["profit"])
                report["inventory_value"] = self.money(report["inventory_value"])
                report["low_stock"] = [
                    as_dict(r) for r in conn.execute(
                        "SELECT id,sku,barcode,name,stock,reorder_level FROM products "
                        "WHERE active=1 AND stock<=reorder_level ORDER BY stock,name"
                    )
                ]
                return self.send_json(200, {"report": report})
        return self.send_json(404, {"error": "مسیر پت‌شاپ پیدا نشد"})

    def shop_post(self, path, payload, actor):
        if path == "/api/shop/products":
            required = ("barcode", "name")
            missing = [f for f in required if payload.get(f) in (None, "")]
            if missing:
                return self.send_json(400, {"error": "required fields: " + ", ".join(missing)})
            try:
                purchase = self.number(payload.get("purchase_price", 0), "purchase_price")
                sale = self.number(payload.get("sale_price", 0), "sale_price")
                stock = self.number(payload.get("stock", 0), "stock")
                reorder = self.number(payload.get("reorder_level", 0), "reorder_level")
            except ValueError as exc:
                return self.send_json(400, {"error": str(exc)})
            fields = ("sku", "barcode", "name", "category", "brand", "description",
                      "purchase_price", "sale_price", "unit", "stock", "reorder_level", "active")
            values = [payload.get("sku"), str(payload["barcode"]).strip(), str(payload["name"]).strip(),
                      payload.get("category"), payload.get("brand"), payload.get("description"),
                      purchase, sale, payload.get("unit") or "unit", stock, reorder,
                      1 if payload.get("active", True) not in (False, 0, "0") else 0]
            try:
                with connect() as conn:
                    cur = conn.execute(
                        f"INSERT INTO products({','.join(fields)}) VALUES ({','.join('?' for _ in fields)})",
                        values,
                    )
                    product_id = cur.lastrowid
                    if stock:
                        conn.execute(
                            """INSERT INTO stock_movements
                               (product_id,movement_type,quantity,unit_cost,stock_before,stock_after,reference,actor)
                               VALUES (?,?,?,?,?,?,?,?)""",
                            (product_id, "opening", stock, purchase, 0, stock, "opening", actor["name"]),
                        )
                    conn.execute(
                        "INSERT INTO audit_log(actor,action,entity,entity_id) VALUES (?,?,?,?)",
                        (actor["name"], "create", "products", product_id),
                    )
                    row = conn.execute("SELECT * FROM products WHERE id=?", (product_id,)).fetchone()
                return self.send_json(201, {"item": as_dict(row)})
            except sqlite3.IntegrityError as exc:
                return self.send_json(409, {"error": "barcode or sku already exists", "detail": str(exc)})

        if path == "/api/shop/stock-movements":
            required = ("product_id", "movement_type", "quantity")
            missing = [f for f in required if payload.get(f) in (None, "")]
            if missing:
                return self.send_json(400, {"error": "required fields: " + ", ".join(missing)})
            if payload["movement_type"] not in {"purchase", "adjustment", "return", "opening"}:
                return self.send_json(400, {"error": "invalid movement_type"})
            try:
                quantity = self.number(payload["quantity"], "quantity", 0.000001)
                unit_cost = self.number(payload.get("unit_cost", 0), "unit_cost")
                if payload["movement_type"] == "adjustment" and payload.get("direction") == "out":
                    quantity = -quantity
            except ValueError as exc:
                return self.send_json(400, {"error": str(exc)})
            with connect() as conn:
                conn.execute("BEGIN IMMEDIATE")
                product = conn.execute("SELECT * FROM products WHERE id=?", (payload["product_id"],)).fetchone()
                if not product:
                    return self.send_json(404, {"error": "product not found"})
                before = float(product["stock"])
                after = before + quantity
                if after < 0:
                    return self.send_json(409, {"error": "insufficient stock"})
                conn.execute("UPDATE products SET stock=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
                             (after, product["id"]))
                cur = conn.execute(
                    """INSERT INTO stock_movements
                       (product_id,movement_type,quantity,unit_cost,stock_before,stock_after,reference,note,actor)
                       VALUES (?,?,?,?,?,?,?,?,?)""",
                    (product["id"], payload["movement_type"], abs(quantity), unit_cost,
                     before, after, payload.get("reference"), payload.get("note"), actor["name"]),
                )
                conn.execute("INSERT INTO audit_log(actor,action,entity,entity_id) VALUES (?,?,?,?)",
                             (actor["name"], "create", "stock_movements", cur.lastrowid))
                row = conn.execute("SELECT * FROM stock_movements WHERE id=?", (cur.lastrowid,)).fetchone()
            return self.send_json(201, {"item": as_dict(row)})

        if path == "/api/shop/sales":
            items = payload.get("items")
            if not isinstance(items, list) or not items:
                return self.send_json(400, {"error": "at least one sale item is required"})
            try:
                discount = self.number(payload.get("discount", 0), "discount")
                tax_percent = self.number(payload.get("tax_percent", 0), "tax_percent")
            except ValueError as exc:
                return self.send_json(400, {"error": str(exc)})
            with connect() as conn:
                conn.execute("BEGIN IMMEDIATE")
                normalized, subtotal, profit = [], 0, 0
                for item in items:
                    try:
                        product_id = int(item["product_id"])
                        quantity = self.number(item["quantity"], "quantity", 0.000001)
                    except (KeyError, TypeError, ValueError) as exc:
                        return self.send_json(400, {"error": f"invalid sale item: {exc}"})
                    product = conn.execute("SELECT * FROM products WHERE id=? AND active=1", (product_id,)).fetchone()
                    if not product:
                        return self.send_json(404, {"error": f"product {product_id} not found or inactive"})
                    if float(product["stock"]) < quantity:
                        return self.send_json(409, {"error": f"insufficient stock for {product['name']}"})
                    unit_price = self.number(item.get("unit_price", product["sale_price"]), "unit_price")
                    line_subtotal = self.money(unit_price * quantity)
                    line_profit = self.money((unit_price - float(product["purchase_price"])) * quantity)
                    subtotal = self.money(subtotal + line_subtotal)
                    profit = self.money(profit + line_profit)
                    normalized.append((product, quantity, unit_price, line_subtotal, line_profit))
                if discount > subtotal:
                    return self.send_json(400, {"error": "discount cannot exceed subtotal"})
                tax = self.money((subtotal - discount) * tax_percent / 100)
                total = self.money(subtotal - discount + tax)
                invoice = f"PS-{int(time.time() * 1000) % 100000000:08d}-{secrets.token_hex(2).upper()}"
                cur = conn.execute(
                    """INSERT INTO sales(invoice_number,customer_name,customer_phone,payment_method,
                       subtotal,discount,tax_percent,tax,total,profit,note,actor)
                       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
                    (invoice, payload.get("customer_name"), payload.get("customer_phone"),
                     payload.get("payment_method", "cash"), subtotal, discount, tax_percent, tax,
                     total, profit, payload.get("note"), actor["name"]),
                )
                sale_id = cur.lastrowid
                for product, quantity, unit_price, line_subtotal, line_profit in normalized:
                    conn.execute(
                        """INSERT INTO sale_items(sale_id,product_id,quantity,unit_price,unit_cost,subtotal,profit)
                           VALUES (?,?,?,?,?,?,?)""",
                        (sale_id, product["id"], quantity, unit_price, product["purchase_price"], line_subtotal, line_profit),
                    )
                    before, after = float(product["stock"]), float(product["stock"]) - quantity
                    conn.execute("UPDATE products SET stock=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
                                 (after, product["id"]))
                    conn.execute(
                        """INSERT INTO stock_movements
                           (product_id,movement_type,quantity,unit_cost,stock_before,stock_after,reference,actor)
                           VALUES (?,?,?,?,?,?,?,?)""",
                        (product["id"], "sale", quantity, product["purchase_price"], before, after, invoice, actor["name"]),
                    )
                conn.execute("INSERT INTO audit_log(actor,action,entity,entity_id) VALUES (?,?,?,?)",
                             (actor["name"], "create", "sales", sale_id))
                row = as_dict(conn.execute("SELECT * FROM sales WHERE id=?", (sale_id,)).fetchone())
                row["items"] = [as_dict(r) for r in conn.execute("SELECT * FROM sale_items WHERE sale_id=?", (sale_id,))]
            return self.send_json(201, {"item": row})

        if path.startswith("/api/shop/sales/") and path.endswith("/return"):
            try:
                sale_id = int(path.split("/")[-2])
            except ValueError:
                return self.send_json(400, {"error": "invalid sale id"})
            return self.return_sale(sale_id, actor)
        return self.send_json(404, {"error": "مسیر پت‌شاپ پیدا نشد"})

    def return_sale(self, sale_id, actor):
        with connect() as conn:
            conn.execute("BEGIN IMMEDIATE")
            sale = conn.execute("SELECT * FROM sales WHERE id=?", (sale_id,)).fetchone()
            if not sale:
                return self.send_json(404, {"error": "sale not found"})
            if sale["status"] != "completed":
                return self.send_json(409, {"error": "sale is already cancelled or returned"})
            items = conn.execute("SELECT * FROM sale_items WHERE sale_id=?", (sale_id,)).fetchall()
            for item in items:
                product = conn.execute("SELECT * FROM products WHERE id=?", (item["product_id"],)).fetchone()
                before, after = float(product["stock"]), float(product["stock"]) + float(item["quantity"])
                conn.execute("UPDATE products SET stock=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
                             (after, product["id"]))
                conn.execute(
                    """INSERT INTO stock_movements
                       (product_id,movement_type,quantity,unit_cost,stock_before,stock_after,reference,actor)
                       VALUES (?,?,?,?,?,?,?,?)""",
                    (product["id"], "return", item["quantity"], item["unit_cost"], before, after,
                     sale["invoice_number"], actor["name"]),
                )
            conn.execute("UPDATE sales SET status='returned', cancelled_at=CURRENT_TIMESTAMP WHERE id=?", (sale_id,))
            conn.execute("INSERT INTO audit_log(actor,action,entity,entity_id) VALUES (?,?,?,?)",
                         (actor["name"], "return", "sales", sale_id))
            row = as_dict(conn.execute("SELECT * FROM sales WHERE id=?", (sale_id,)).fetchone())
        return self.send_json(200, {"item": row})

    def shop_patch(self, resource, record_id, payload, actor):
        if resource == "/api/shop/products":
            allowed = {"sku", "barcode", "name", "category", "brand", "description",
                       "purchase_price", "sale_price", "unit", "reorder_level", "active"}
            fields = [f for f in payload if f in allowed]
            if not fields:
                return self.send_json(400, {"error": "no editable fields supplied"})
            values = []
            try:
                for field in fields:
                    value = payload[field]
                    if field in {"purchase_price", "sale_price", "reorder_level"}:
                        value = self.number(value, field)
                    if field == "active":
                        value = 1 if value not in (False, 0, "0") else 0
                    values.append(value)
            except ValueError as exc:
                return self.send_json(400, {"error": str(exc)})
            try:
                with connect() as conn:
                    current = conn.execute("SELECT * FROM products WHERE id=?", (record_id,)).fetchone()
                    if not current:
                        return self.send_json(404, {"error": "product not found"})
                    conn.execute(f"UPDATE products SET {','.join(f+'=?' for f in fields)}, updated_at=CURRENT_TIMESTAMP WHERE id=?",
                                 values + [record_id])
                    conn.execute("INSERT INTO audit_log(actor,action,entity,entity_id) VALUES (?,?,?,?)",
                                 (actor["name"], "update", "products", record_id))
                    row = conn.execute("SELECT * FROM products WHERE id=?", (record_id,)).fetchone()
                return self.send_json(200, {"item": as_dict(row)})
            except sqlite3.IntegrityError as exc:
                return self.send_json(409, {"error": "barcode or sku already exists", "detail": str(exc)})
        if resource == "/api/shop/sales":
            status = payload.get("status")
            if status not in {"cancelled", "returned"}:
                return self.send_json(400, {"error": "only cancelled or returned status is supported"})
            return self.return_sale(record_id, actor)
        return self.send_json(404, {"error": "مسیر پت‌شاپ پیدا نشد"})

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/health":
            return self.send_json(200, {"ok": True, "service": "petclinic-api"})
        if not path.startswith("/api/"):
            return self.static(path)
        actor = self.user()
        if not actor:
            return
        if path.startswith("/api/shop/"):
            if actor["role"] not in {"admin", "vet", "shop_seller"}:
                return self.send_json(403, {"error": "دسترسی به پت‌شاپ مجاز نیست"})
            return self.shop_get(path, parse_qs(urlparse(self.path).query))
        if actor["role"] in {"customer", "shop_seller"}:
            return self.send_json(403, {"error": "دسترسی کارکنان برای مشتری مجاز نیست"})
        queries = {
            "/api/customers": "SELECT * FROM customers ORDER BY id DESC",
            "/api/pets": """SELECT p.*, c.name owner_name FROM pets p JOIN customers c ON c.id=p.owner_id ORDER BY p.id DESC""",
            "/api/appointments": """SELECT a.*, p.name pet_name, c.name customer_name FROM appointments a
                                  LEFT JOIN pets p ON p.id=a.pet_id LEFT JOIN customers c ON c.id=a.customer_id
                                  ORDER BY starts_at DESC""",
            "/api/records": "SELECT r.*, p.name pet_name FROM records r JOIN pets p ON p.id=r.pet_id ORDER BY visit_date DESC",
            "/api/lab-requests": """SELECT r.*, p.name pet_name, c.name customer_name
                                   FROM lab_requests r
                                   JOIN pets p ON p.id=r.pet_id
                                   LEFT JOIN customers c ON c.id=p.owner_id
                                   ORDER BY r.id DESC""",
            "/api/labs": "SELECT l.*, p.name pet_name FROM lab_results l JOIN pets p ON p.id=l.pet_id ORDER BY l.id DESC",
            "/api/imaging": "SELECT i.*, p.name pet_name, c.name owner_name FROM imaging_studies i JOIN pets p ON p.id=i.pet_id JOIN customers c ON c.id=p.owner_id ORDER BY i.id DESC",
            "/api/prescriptions": "SELECT x.*, p.name pet_name, c.name owner_name FROM prescriptions x JOIN pets p ON p.id=x.pet_id JOIN customers c ON c.id=p.owner_id ORDER BY x.id DESC",
            "/api/nutrition": "SELECT n.*, p.name pet_name FROM nutrition_plans n JOIN pets p ON p.id=n.pet_id ORDER BY n.id DESC",
            "/api/inventory": "SELECT * FROM pharmacy_inventory ORDER BY name COLLATE NOCASE",
            "/api/settings": "SELECT * FROM clinic_settings WHERE id=1",
        }
        sql = queries.get(path)
        if not sql:
            return self.send_json(404, {"error": "مسیر پیدا نشد"})
        query = parse_qs(urlparse(self.path).query)
        pet_id = query.get("pet_id", [None])[0]
        status = query.get("status", [None])[0]
        if pet_id or status:
            clauses = []
            if pet_id:
                clauses.append("pet_id=?")
            if status and path in {"/api/appointments", "/api/lab-requests"}:
                clauses.append("status=?")
            if clauses:
                values = ([pet_id] if pet_id else []) + ([status] if status and path in {"/api/appointments", "/api/lab-requests"} else [])
                order_index = sql.upper().rfind(" ORDER BY ")
                order = sql[order_index:] if order_index >= 0 else ""
                sql = (sql[:order_index] if order_index >= 0 else sql) + " WHERE " + " AND ".join(clauses) + order
            else:
                values = []
        else:
            values = []
        with connect() as conn:
            return self.send_json(200, {"items": [as_dict(r) for r in conn.execute(sql, values)]})

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
        if path.startswith("/api/shop/"):
            if actor["role"] not in {"admin", "vet", "shop_seller"}:
                return self.send_json(403, {"error": "دسترسی به پت‌شاپ مجاز نیست"})
            return self.shop_post(path, payload, actor)
        if actor["role"] in {"customer", "shop_seller"}:
            return self.send_json(403, {"error": "مشتری اجازه ثبت یا تغییر اطلاعات کلینیک را ندارد"})
        if path == "/api/settings":
            allowed = {"clinic_name", "phone", "address", "settings_json"}
            values = {key: payload[key] for key in payload if key in allowed}
            if "settings_json" in values and not isinstance(values["settings_json"], str):
                values["settings_json"] = json.dumps(values["settings_json"], ensure_ascii=False)
            if not values:
                return self.send_json(400, {"error": "تنظیماتی برای ذخیره ارسال نشده است"})
            with connect() as conn:
                existing = conn.execute("SELECT id FROM clinic_settings WHERE id=1").fetchone()
                if existing:
                    conn.execute(
                        f"UPDATE clinic_settings SET {','.join(k + '=?' for k in values)}, updated_at=CURRENT_TIMESTAMP WHERE id=1",
                        list(values.values()),
                    )
                else:
                    values.setdefault("clinic_name", "کلینیک دامپزشکی")
                    values.setdefault("phone", "")
                    values.setdefault("address", "")
                    values.setdefault("settings_json", "{}")
                    conn.execute("INSERT INTO clinic_settings(id,clinic_name,phone,address,settings_json) VALUES (?,?,?,?,?)",
                                 (1, values["clinic_name"], values["phone"], values["address"], values["settings_json"]))
                row = conn.execute("SELECT * FROM clinic_settings WHERE id=1").fetchone()
            return self.send_json(200, {"item": as_dict(row)})
        if path == "/api/reports":
            with connect() as conn:
                report = {
                    "customers": conn.execute("SELECT COUNT(*) FROM customers").fetchone()[0],
                    "pets": conn.execute("SELECT COUNT(*) FROM pets").fetchone()[0],
                    "appointments": conn.execute("SELECT COUNT(*) FROM appointments").fetchone()[0],
                    "records": conn.execute("SELECT COUNT(*) FROM records").fetchone()[0],
                    "labs": conn.execute("SELECT COUNT(*) FROM lab_results").fetchone()[0],
                    "prescriptions": conn.execute("SELECT COUNT(*) FROM prescriptions").fetchone()[0],
                    "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "type": payload.get("type", "عملیاتی"),
                }
            return self.send_json(200, {"report": report})
        if path == "/api/lab-requests":
            required = ("pet_id", "panel")
            missing = [field for field in required if payload.get(field) in (None, "")]
            if missing:
                return self.send_json(400, {"error": "required fields: " + ", ".join(missing)})
            fields = ["pet_id", "panel", "sample", "priority", "reason", "doctor", "status", "accession_number", "result_json"]
            with connect() as conn:
                if not conn.execute("SELECT 1 FROM pets WHERE id=?", (payload["pet_id"],)).fetchone():
                    return self.send_json(400, {"error": "selected pet was not found"})
                values = [payload.get(field) for field in fields]
                values[3] = values[3] or "normal"
                if not isinstance(values[-1], str):
                    values[-1] = json.dumps(values[-1] or {}, ensure_ascii=False)
                values[6] = values[6] or "requested"
                cur = conn.execute(
                    f"INSERT INTO lab_requests({','.join(fields)}) VALUES ({','.join('?' for _ in fields)})",
                    values,
                )
                conn.execute("INSERT INTO audit_log(actor,action,entity,entity_id) VALUES (?,?,?,?)",
                             (actor["name"], "create", "lab_requests", cur.lastrowid))
                row = conn.execute("SELECT * FROM lab_requests WHERE id=?", (cur.lastrowid,)).fetchone()
            return self.send_json(201, {"item": as_dict(row)})
        specs = {
            "/api/customers": ("customers", ("name", "phone"), ("name", "phone", "email")),
            "/api/pets": ("pets", ("owner_id", "name", "species"), ("owner_id", "name", "species", "breed", "age", "weight", "status", "note")),
            "/api/appointments": ("appointments", ("starts_at", "service"), ("pet_id", "customer_id", "starts_at", "service", "doctor", "status", "note")),
            "/api/records": ("records", ("pet_id", "visit_date"), ("pet_id", "visit_date", "diagnosis", "treatment", "notes", "details_json")),
            "/api/labs": ("lab_results", ("pet_id", "panel"), ("pet_id", "panel", "result_json", "status")),
            "/api/lab-requests": ("lab_requests", ("pet_id", "panel"), ("pet_id", "panel", "sample", "priority", "reason", "status")),
            "/api/imaging": ("imaging_studies", ("pet_id", "study_type", "body_area"), ("pet_id", "study_type", "body_area", "report", "file_name", "file_type", "file_size", "file_data", "priority", "reason", "status")),
            "/api/prescriptions": ("prescriptions", ("pet_id", "medicine"), ("pet_id", "medicine", "medicine_key", "category", "medicine_form", "dose", "duration", "instructions", "quantity", "priority", "dispensed", "status", "note")),
            "/api/nutrition": ("nutrition_plans", ("pet_id", "goal", "plan_json"), ("pet_id", "goal", "calories", "plan_json", "status", "bcs", "rer", "mer", "water_ml", "species", "weight", "diseases_json", "medications_json", "ingredients_json", "notes")),
            "/api/inventory": ("pharmacy_inventory", ("name", "unit"), ("medicine_key", "name", "category", "medicine_form", "stock", "unit", "reorder")),
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
        insert_fields = [field for field in fields if field in payload and payload[field] not in (None, "")]
        values = []
        for field in insert_fields:
            value = payload.get(field)
            if field.endswith("_json") and not isinstance(value, str):
                value = json.dumps(value or {}, ensure_ascii=False)
            if table == "appointments" and field == "status":
                value = {
                    "Ø¯Ø± Ø§Ù†ØªØ¸Ø§Ø±": "scheduled",
                    "ØªØ£ÛŒÛŒØ¯ Ø´Ø¯Ù‡": "confirmed",
                    "Ø¯Ø± Ø­Ø§Ù„ ÙˆÛŒØ²ÛŒØª": "in_progress",
                    "ØªÚ©Ù…ÛŒÙ„ Ø´Ø¯Ù‡": "completed",
                    "Ù„ØºÙˆ Ø´Ø¯Ù‡": "cancelled",
                }.get(value, value)
            if field in {"file_data", "plan_json"} and isinstance(value, str) and len(value) > 1_800_000:
                return self.send_json(413, {"error": "حجم داده فایل یا جیره بیش از حد مجاز است"})
            values.append(value)
        with connect() as conn:
            columns = ",".join(insert_fields)
            placeholders = ",".join("?" for _ in insert_fields)
            cur = conn.execute(f"INSERT INTO {table}({columns}) VALUES ({placeholders})", values)
            conn.execute("INSERT INTO audit_log(actor,action,entity,entity_id) VALUES (?,?,?,?)",
                         (actor["name"], "create", table, cur.lastrowid))
            row = conn.execute(f"SELECT * FROM {table} WHERE id=?", (cur.lastrowid,)).fetchone()
        return self.send_json(201, {"item": as_dict(row)})

    def do_PATCH(self):
        path = urlparse(self.path).path
        actor = self.user()
        if not actor:
            return
        try:
            payload = self.body()
            resource, raw_id = path.rsplit("/", 1)
            record_id = int(raw_id)
        except (ValueError, json.JSONDecodeError):
            return self.send_json(400, {"error": "درخواست نامعتبر است"})
        if resource.startswith("/api/shop/"):
            if actor["role"] not in {"admin", "vet", "shop_seller"}:
                return self.send_json(403, {"error": "دسترسی به پت‌شاپ مجاز نیست"})
            return self.shop_patch(resource, record_id, payload, actor)
        if actor["role"] not in {"admin", "vet"}:
            return self.send_json(403, {"error": "role is not allowed to edit clinic data"})
        if resource == "/api/lab-requests":
            allowed = {"panel", "sample", "priority", "reason", "doctor", "status", "accession_number", "result_json", "received_at", "completed_at"}
            if payload.get("status") not in (None, "requested", "sampling", "received", "processing", "completed", "cancelled"):
                return self.send_json(400, {"error": "invalid laboratory request status"})
            with connect() as conn:
                current = conn.execute("SELECT * FROM lab_requests WHERE id=?", (record_id,)).fetchone()
            if not current:
                return self.send_json(404, {"error": "record not found"})
            if payload.get("status") in {"received", "processing", "completed"}:
                payload.setdefault("accession_number", current["accession_number"] or f"LAB-{int(time.time() * 1000) % 1000000:06d}")
            if payload.get("status") == "received":
                payload.setdefault("received_at", time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()))
            if payload.get("status") == "completed":
                payload.setdefault("completed_at", time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()))
            fields = [field for field in payload if field in allowed]
            if not fields:
                return self.send_json(400, {"error": "no editable fields supplied"})
            with connect() as conn:
                current = conn.execute("SELECT * FROM lab_requests WHERE id=?", (record_id,)).fetchone()
                values = []
                for field in fields:
                    value = payload[field]
                    if field == "result_json" and not isinstance(value, str):
                        value = json.dumps(value or [], ensure_ascii=False)
                    values.append(value)
                conn.execute(f"UPDATE lab_requests SET {','.join(field + '=?' for field in fields)} WHERE id=?",
                             values + [record_id])
                if payload.get("status") == "completed" and payload.get("result_json") is not None:
                    result_json = payload["result_json"] if isinstance(payload["result_json"], str) else json.dumps(payload["result_json"], ensure_ascii=False)
                    existing_result = conn.execute("SELECT id FROM lab_results WHERE request_id=? ORDER BY id DESC LIMIT 1", (record_id,)).fetchone()
                    if existing_result:
                        conn.execute("UPDATE lab_results SET panel=?, result_json=?, status=? WHERE id=?",
                                     (payload.get("panel", current["panel"]), result_json, "completed", existing_result["id"]))
                    else:
                        conn.execute(
                            "INSERT INTO lab_results(request_id,pet_id,panel,result_json,status) VALUES (?,?,?,?,?)",
                            (record_id, current["pet_id"], payload.get("panel", current["panel"]), result_json, "completed"),
                        )
                conn.execute("INSERT INTO audit_log(actor,action,entity,entity_id) VALUES (?,?,?,?)",
                             (actor["name"], "update", "lab_requests", record_id))
                row = conn.execute("SELECT * FROM lab_requests WHERE id=?", (record_id,)).fetchone()
            return self.send_json(200, {"item": as_dict(row)})
        table = {"customers": "customers", "pets": "pets", "appointments": "appointments",
                 "records": "records", "lab-requests": "lab_requests", "labs": "lab_results", "imaging": "imaging_studies",
                 "prescriptions": "prescriptions", "nutrition": "nutrition_plans",
                 "inventory": "pharmacy_inventory"}.get(resource.rsplit("/", 1)[-1])
        if not table:
            return self.send_json(404, {"error": "مسیر پیدا نشد"})
        allowed = {
            "customers": {"name", "phone", "email"}, "pets": {"owner_id", "name", "species", "breed", "age", "weight", "status", "note"},
            "appointments": {"pet_id", "customer_id", "starts_at", "service", "doctor", "status", "note"},
                  "records": {"visit_date", "diagnosis", "treatment", "notes", "details_json"}, "lab_results": {"request_id", "panel", "result_json", "status"},
            "imaging_studies": {"study_type", "body_area", "report", "file_name", "file_type", "file_size", "file_data", "priority", "reason", "status"},
            "prescriptions": {"medicine", "medicine_key", "category", "medicine_form", "dose", "duration", "instructions", "quantity", "priority", "dispensed", "status", "note", "dispense_staff", "dispense_receiver", "dispensed_at"},
            "nutrition_plans": {"goal", "calories", "plan_json", "status", "bcs", "rer", "mer", "water_ml", "species", "weight", "diseases_json", "medications_json", "ingredients_json", "notes"},
            "pharmacy_inventory": {"medicine_key", "name", "category", "medicine_form", "stock", "unit", "reorder"},
        }[table]
        fields = [field for field in payload if field in allowed]
        if not fields:
            return self.send_json(400, {"error": "فیلد قابل ویرایش وجود ندارد"})
        values = []
        for field in fields:
            value = payload[field]
            if field.endswith("_json") and not isinstance(value, str):
                value = json.dumps(value or {}, ensure_ascii=False)
            if field in {"file_data", "plan_json"} and isinstance(value, str) and len(value) > 1_800_000:
                return self.send_json(413, {"error": "حجم داده فایل یا جیره بیش از حد مجاز است"})
            values.append(value)
        with connect() as conn:
            current = conn.execute(f"SELECT * FROM {table} WHERE id=?", (record_id,)).fetchone()
            if not current:
                return self.send_json(404, {"error": "رکورد پیدا نشد"})
            if table == "prescriptions" and ("status" in payload or "dispensed" in payload):
                return self.update_prescription(conn, actor, record_id, current, payload)
            conn.execute(f"UPDATE {table} SET {','.join(field + '=?' for field in fields)} WHERE id=?", values + [record_id])
            conn.execute("INSERT INTO audit_log(actor,action,entity,entity_id) VALUES (?,?,?,?)",
                         (actor["name"], "update", table, record_id))
            row = conn.execute(f"SELECT * FROM {table} WHERE id=?", (record_id,)).fetchone()
        return self.send_json(200, {"item": as_dict(row)})

    do_PUT = do_PATCH

    def update_prescription(self, conn, actor, record_id, current, payload):
        raw_status = payload.get("status") or current["status"] or "در انتظار بررسی"
        status_aliases = {
            "درانتظاربررسی": "در انتظار بررسی",
            "درحال آمادهسازی": "در حال آماده‌سازی",
            "درحالآمادهسازی": "در حال آماده‌سازی",
            "آمادهتحویل": "آماده تحویل",
            "تحویلشده": "تحویل‌شده",
        }
        next_status = status_aliases.get(str(raw_status).replace("\u200c", "").replace(" ", ""), raw_status)
        if payload.get("dispensed") in {"تحویل به مالک", "تحویل از داروخانه"}:
            next_status = "تحویل‌شده"
        if next_status not in {"در انتظار بررسی", "در حال آماده‌سازی", "آماده تحویل", "تحویل‌شده"}:
            return self.send_json(400, {"error": "وضعیت نسخه معتبر نیست"})
        fields = [field for field in payload if field in {
            "medicine", "medicine_key", "category", "medicine_form", "dose", "duration",
            "instructions", "quantity", "priority", "dispensed", "status", "note",
            "dispense_staff", "dispense_receiver", "dispensed_at"
        }]
        values = [payload[field] for field in fields]
        old_status = current["status"] or "در انتظار بررسی"
        old_qty = float(current["dispensed_quantity"] or 0)
        new_qty = old_qty
        if old_status != "تحویل‌شده" and next_status == "تحویل‌شده":
            requested_qty = payload.get(
                "dispensed_quantity",
                payload.get("quantity", current["quantity"] or 1),
            )
            try:
                requested_qty = float(str(requested_qty).replace(",", ".").split()[0])
            except (TypeError, ValueError):
                requested_qty = 1
            requested_qty = max(requested_qty, 1)
            inventory = conn.execute(
                "SELECT * FROM pharmacy_inventory WHERE medicine_key=? OR lower(name)=lower(?) LIMIT 1",
                (current["medicine_key"], current["medicine"]),
            ).fetchone()
            if inventory and float(inventory["stock"]) < requested_qty:
                return self.send_json(409, {"error": f"موجودی {inventory['name']} برای تحویل کافی نیست"})
            if inventory:
                conn.execute(
                    "UPDATE pharmacy_inventory SET stock=stock-?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
                    (requested_qty, inventory["id"]),
                )
            new_qty = requested_qty
            if "dispensed" not in payload:
                fields.append("dispensed")
                values.append("تحویل به مالک")
            if "dispensed_at" not in payload:
                fields.append("dispensed_at")
                values.append(time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()))
        elif old_status == "تحویل‌شده" and next_status != "تحویل‌شده" and old_qty:
            inventory = conn.execute(
                "SELECT * FROM pharmacy_inventory WHERE medicine_key=? OR lower(name)=lower(?) LIMIT 1",
                (current["medicine_key"], current["medicine"]),
            ).fetchone()
            if inventory:
                conn.execute(
                    "UPDATE pharmacy_inventory SET stock=stock+?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
                    (old_qty, inventory["id"]),
                )
            new_qty = 0
            fields.extend(["dispensed_quantity", "dispensed_at"])
            values.extend([0, None])
        if "status" not in fields:
            fields.append("status")
            values.append(next_status)
        if "dispensed_quantity" not in fields:
            fields.append("dispensed_quantity")
            values.append(new_qty)
        if "dispensed" not in fields and next_status != "تحویل‌شده":
            fields.append("dispensed")
            values.append("تحویل نشده")
        conn.execute(f"UPDATE prescriptions SET {','.join(field + '=?' for field in fields)} WHERE id=?",
                     values + [record_id])
        conn.execute("INSERT INTO audit_log(actor,action,entity,entity_id) VALUES (?,?,?,?)",
                     (actor["name"], "update", "prescriptions", record_id))
        row = conn.execute("SELECT * FROM prescriptions WHERE id=?", (record_id,)).fetchone()
        return self.send_json(200, {"item": as_dict(row)})

    def do_DELETE(self):
        path = urlparse(self.path).path
        actor = self.user()
        if not actor:
            return
        if actor["role"] not in {"admin", "vet"}:
            return self.send_json(403, {"error": "role is not allowed to delete clinic data"})
        try:
            resource, raw_id = path.rsplit("/", 1)
            record_id = int(raw_id)
        except ValueError:
            return self.send_json(400, {"error": "شناسه نامعتبر است"})
        table = {"customers": "customers", "pets": "pets", "appointments": "appointments",
                 "records": "records", "labs": "lab_results", "imaging": "imaging_studies",
                 "prescriptions": "prescriptions", "nutrition": "nutrition_plans",
                 "inventory": "pharmacy_inventory"}.get(resource.rsplit("/", 1)[-1])
        if not table:
            return self.send_json(404, {"error": "مسیر پیدا نشد"})
        with connect() as conn:
            cur = conn.execute(f"DELETE FROM {table} WHERE id=?", (record_id,))
            if not cur.rowcount:
                return self.send_json(404, {"error": "رکورد پیدا نشد"})
            conn.execute("INSERT INTO audit_log(actor,action,entity,entity_id) VALUES (?,?,?,?)",
                         (self.headers.get("Authorization", "")[:32], "delete", table, record_id))
        return self.send_json(200, {"deleted": record_id})

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
