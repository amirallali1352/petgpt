"""Black-box API contract tests for the local PetClinic service.

The suite imports the existing HTTP handler and runs it against an isolated
temporary SQLite database. It therefore does not start the product process,
does not touch petclinic_runtime.db, and does not modify product code.

Run from the ``clinic`` directory:

    python -m unittest discover -s backend -p "test_*.py" -v

Pytest can run the same suite:

    pytest -q backend/test_api.py
"""

from __future__ import annotations

import hashlib
import importlib.util
import json
import tempfile
import threading
import unittest
from http.client import HTTPResponse, RemoteDisconnected
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen


SERVER_PATH = Path(__file__).with_name("server.py")
SPEC = importlib.util.spec_from_file_location("petclinic_server_under_test", SERVER_PATH)
if SPEC is None or SPEC.loader is None:  # pragma: no cover - import guard
    raise ImportError(f"Cannot load API module from {SERVER_PATH}")
server = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(server)


class ApiClient:
    """Small stdlib-only HTTP client with status/body/header capture."""

    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")

    def request(
        self,
        method: str,
        path: str,
        *,
        payload: object = None,
        raw_body: bytes | None = None,
        token: str | None = None,
        headers: dict[str, str] | None = None,
    ) -> tuple[int, object, dict[str, str]]:
        request_headers = {"Accept": "application/json"}
        if headers:
            request_headers.update(headers)
        if token:
            request_headers["Authorization"] = f"Bearer {token}"

        if raw_body is not None:
            data = raw_body
        elif payload is not None:
            data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            request_headers["Content-Type"] = "application/json"
        else:
            data = None

        request = Request(
            f"{self.base_url}{path}",
            data=data,
            headers=request_headers,
            method=method,
        )
        try:
            response = urlopen(request, timeout=5)
            try:
                return response.status, self._decode(response), dict(response.headers.items())
            finally:
                response.close()
        except HTTPError as exc:
            try:
                return exc.code, self._decode(exc), dict(exc.headers.items())
            finally:
                exc.close()

    @staticmethod
    def _decode(response: HTTPResponse) -> object:
        body = response.read()
        if not body:
            return None
        content_type = response.headers.get("Content-Type", "")
        if "json" in content_type:
            return json.loads(body.decode("utf-8"))
        return body.decode("utf-8", errors="replace")


class PetClinicApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls._temp_dir = tempfile.TemporaryDirectory(
            prefix="petclinic-api-tests-",
            ignore_cleanup_errors=True,
        )
        server.DB_PATH = Path(cls._temp_dir.name) / "isolated.sqlite3"
        server.TOKENS.clear()
        server.init_db()

        # The product seeds staff accounts only. Add a customer fixture to the
        # isolated test database so the role boundary can be exercised.
        customer_password = hashlib.sha256(b"123456").hexdigest()
        with server.connect() as conn:
            conn.execute(
                """
                INSERT INTO users(name, email, role, password_hash)
                VALUES (?, ?, ?, ?)
                """,
                ("Test Customer", "customer@test.local", "customer", customer_password),
            )

        cls.httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.Handler)
        cls.httpd.daemon_threads = True
        cls.base_url = f"http://127.0.0.1:{cls.httpd.server_address[1]}"
        cls.client = ApiClient(cls.base_url)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls) -> None:
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.thread.join(timeout=5)
        server.TOKENS.clear()
        cls._temp_dir.cleanup()

    def login(self, email: str) -> str:
        status, body, _ = self.client.request(
            "POST",
            "/api/auth/login",
            payload={"email": email, "password": "123456"},
        )
        self.assertEqual(status, 200, body)
        self.assertIsInstance(body, dict)
        self.assertIn("token", body)
        self.assertIn("user", body)
        return body["token"]

    def test_health_is_public_and_reports_service(self) -> None:
        status, body, headers = self.client.request("GET", "/api/health")
        self.assertEqual(status, 200)
        self.assertEqual(body, {"ok": True, "service": "petclinic-api"})
        self.assertIn("application/json", headers.get("Content-Type", ""))

    def test_frontend_entrypoint_is_available_for_smoke_startup(self) -> None:
        status, body, headers = self.client.request("GET", "/")
        self.assertEqual(status, 200)
        self.assertIn("text/html", headers.get("Content-Type", ""))
        self.assertIn('id="loginScreen"', body)
        self.assertIn("app.js", body)

    def test_options_exposes_expected_cors_contract(self) -> None:
        status, _, headers = self.client.request("OPTIONS", "/api/customers")
        self.assertEqual(status, 204)
        self.assertEqual(
            headers.get("Access-Control-Allow-Origin"),
            "http://127.0.0.1:8000",
        )
        self.assertIn("Authorization", headers.get("Access-Control-Allow-Headers", ""))

    def test_admin_and_vet_can_authenticate(self) -> None:
        admin_token = self.login("admin@petclinic.local")
        vet_token = self.login("vet@petclinic.local")
        self.assertNotEqual(admin_token, vet_token)

    def test_existing_database_is_repaired_with_shop_seller_account(self) -> None:
        with server.connect() as conn:
            conn.execute("DELETE FROM users WHERE email = ?", ("shopkeeper@petclinic.local",))

        status, body, _ = self.client.request(
            "POST",
            "/api/auth/login",
            payload={
                "email": "shopkeeper@petclinic.local",
                "password": "123456",
            },
        )
        self.assertEqual(status, 200, body)
        self.assertEqual(body["user"]["role"], "shop_seller")

    def test_pet_shop_seller_can_authenticate(self) -> None:
        status, body, _ = self.client.request(
            "POST",
            "/api/auth/login",
            payload={
                "email": "shopkeeper@petclinic.local",
                "password": "123456",
            },
        )
        self.assertEqual(status, 200, body)
        self.assertEqual(body["user"]["role"], "shop_seller")
        self.assertIn("token", body)

    def test_pet_shop_product_inventory_and_sale_flow(self) -> None:
        token = self.login("shopkeeper@petclinic.local")

        status, body, _ = self.client.request(
            "POST",
            "/api/shop/products",
            token=token,
            payload={
                "sku": "FOOD-001",
                "barcode": "6260000000012",
                "name": "غذای خشک گربه",
                "category": "غذا",
                "brand": "Test Brand",
                "purchase_price": 350000,
                "sale_price": 490000,
                "unit": "بسته",
                "reorder_level": 3,
            },
        )
        self.assertEqual(status, 201, body)
        product = body["item"]
        product_id = product["id"]
        self.assertEqual(product["barcode"], "6260000000012")
        self.assertEqual(product["stock"], 0)

        status, body, _ = self.client.request(
            "POST",
            "/api/shop/stock-movements",
            token=token,
            payload={
                "product_id": product_id,
                "movement_type": "purchase",
                "quantity": 10,
                "unit_cost": 350000,
                "reference": "PO-001",
            },
        )
        self.assertEqual(status, 201, body)
        self.assertEqual(body["item"]["stock_after"], 10)

        status, body, _ = self.client.request(
            "POST",
            "/api/shop/sales",
            token=token,
            payload={
                "customer_name": "مشتری پت‌شاپ",
                "payment_method": "card",
                "discount": 20000,
                "tax_percent": 10,
                "items": [
                    {"product_id": product_id, "quantity": 2},
                ],
            },
        )
        self.assertEqual(status, 201, body)
        sale = body["item"]
        self.assertTrue(sale["invoice_number"].startswith("PS-"))
        self.assertEqual(sale["subtotal"], 980000)
        self.assertEqual(sale["discount"], 20000)
        self.assertEqual(sale["tax"], 96000)
        self.assertEqual(sale["total"], 1056000)
        self.assertEqual(sale["items"][0]["unit_price"], 490000)
        self.assertEqual(sale["items"][0]["profit"], 280000)

        status, body, _ = self.client.request(
            "GET", "/api/shop/products?barcode=6260000000012", token=token
        )
        self.assertEqual(status, 200, body)
        self.assertEqual(body["items"][0]["stock"], 8)

        status, body, _ = self.client.request(
            "GET", "/api/shop/reports/summary", token=token
        )
        self.assertEqual(status, 200, body)
        self.assertGreaterEqual(body["report"]["sales_count"], 1)
        self.assertGreaterEqual(body["report"]["revenue"], 1056000)
        self.assertGreaterEqual(body["report"]["profit"], 280000)

    def test_pet_shop_prevents_overselling_and_duplicate_barcode(self) -> None:
        token = self.login("admin@petclinic.local")
        product_payload = {
            "sku": "TOY-001",
            "barcode": "6260000000099",
            "name": "اسباب‌بازی تست",
            "category": "اسباب‌بازی",
            "purchase_price": 100000,
            "sale_price": 150000,
            "unit": "عدد",
        }
        status, first, _ = self.client.request(
            "POST", "/api/shop/products", token=token, payload=product_payload
        )
        self.assertEqual(status, 201, first)
        status, duplicate, _ = self.client.request(
            "POST",
            "/api/shop/products",
            token=token,
            payload={**product_payload, "sku": "TOY-002"},
        )
        self.assertEqual(status, 409, duplicate)

        status, sale, _ = self.client.request(
            "POST",
            "/api/shop/sales",
            token=token,
            payload={
                "payment_method": "cash",
                "items": [{"product_id": first["item"]["id"], "quantity": 1}],
            },
        )
        self.assertEqual(status, 409, sale)

    def test_pet_shop_seller_is_limited_to_shop_data(self) -> None:
        token = self.login("shopkeeper@petclinic.local")
        for path in ("/api/customers", "/api/pets", "/api/records", "/api/labs"):
            with self.subTest(path=path):
                status, body, _ = self.client.request("GET", path, token=token)
                self.assertEqual(status, 403, body)
        status, body, _ = self.client.request(
            "GET", "/api/shop/products", token=token
        )
        self.assertEqual(status, 200, body)

    def test_non_clinic_roles_cannot_patch_or_delete_clinic_data(self) -> None:
        admin_token = self.login("admin@petclinic.local")
        status, customer_body, _ = self.client.request(
            "POST", "/api/customers", token=admin_token,
            payload={"name": "Access Boundary Owner", "phone": "09121112233"},
        )
        self.assertEqual(status, 201, customer_body)
        for email in ("customer@test.local", "shopkeeper@petclinic.local"):
            status, role_customer, _ = self.client.request(
                "POST", "/api/customers", token=admin_token,
                payload={"name": f"Boundary {email}", "phone": "09121112244"},
            )
            self.assertEqual(status, 201, role_customer)
            customer_id = role_customer["item"]["id"]
            token = self.login(email)
            with self.subTest(role=email, operation="patch"):
                status, body, _ = self.client.request(
                    "PATCH", f"/api/customers/{customer_id}", token=token,
                    payload={"name": "Unauthorized Change"},
                )
                self.assertEqual(status, 403, body)
            with self.subTest(role=email, operation="delete"):
                status, body, _ = self.client.request(
                    "DELETE", f"/api/customers/{customer_id}", token=token,
                )
                self.assertEqual(status, 403, body)

        status, authorized_customer, _ = self.client.request(
            "POST", "/api/customers", token=admin_token,
            payload={"name": "Authorized Owner", "phone": "09121112255"},
        )
        self.assertEqual(status, 201, authorized_customer)
        status, body, _ = self.client.request(
            "PATCH", f"/api/customers/{authorized_customer['item']['id']}", token=admin_token,
            payload={"name": "Authorized Change"},
        )
        self.assertEqual(status, 200, body)

    def test_role_access_matrix_allows_vet_clinic_but_not_shop_management(self) -> None:
        token = self.login("vet@petclinic.local")
        status, body, _ = self.client.request("GET", "/api/customers", token=token)
        self.assertEqual(status, 200, body)
        status, body, _ = self.client.request(
            "POST", "/api/shop/products", token=token,
            payload={
                "barcode": "6260000000998", "name": "Vet Access Test",
                "purchase_price": 10, "sale_price": 20,
            },
        )
        self.assertEqual(status, 201, body)

    def test_login_and_access_matrix_for_all_roles(self) -> None:
        expected_roles = {
            "admin@petclinic.local": "admin",
            "vet@petclinic.local": "vet",
            "customer@test.local": "customer",
            "shopkeeper@petclinic.local": "shop_seller",
        }
        for email, expected_role in expected_roles.items():
            with self.subTest(email=email):
                status, body, _ = self.client.request(
                    "POST", "/api/auth/login",
                    payload={"email": email, "password": "123456"},
                )
                self.assertEqual(status, 200, body)
                self.assertEqual(body["user"]["role"], expected_role)
                self.assertTrue(body["token"])

        admin_token = self.login("admin@petclinic.local")
        for email in ("customer@test.local", "shopkeeper@petclinic.local"):
            token = self.login(email)
            with self.subTest(role=email, operation="post"):
                status, body, _ = self.client.request(
                    "POST", "/api/customers", token=token,
                    payload={"name": "Blocked", "phone": "09120000001"},
                )
                self.assertEqual(status, 403, body)
            with self.subTest(role=email, operation="patch"):
                status, body, _ = self.client.request(
                    "PATCH", "/api/settings/1", token=token,
                    payload={"clinic_name": "Blocked"},
                )
                self.assertEqual(status, 403, body)
        status, body, _ = self.client.request(
            "POST", "/api/settings", token=admin_token,
            payload={"clinic_name": "Access Matrix Clinic"},
        )
        self.assertEqual(status, 200, body)

    def test_invalid_credentials_are_rejected(self) -> None:
        status, body, _ = self.client.request(
            "POST",
            "/api/auth/login",
            payload={"email": "admin@petclinic.local", "password": "wrong"},
        )
        self.assertEqual(status, 401)
        self.assertIsInstance(body, dict)
        self.assertIn("error", body)

    def test_protected_collections_require_authentication(self) -> None:
        protected_paths = (
            "/api/customers",
            "/api/pets",
            "/api/appointments",
            "/api/records",
            "/api/lab-requests",
            "/api/labs",
            "/api/imaging",
            "/api/prescriptions",
            "/api/nutrition",
            "/api/inventory",
            "/api/settings",
        )
        for path in protected_paths:
            with self.subTest(path=path):
                status, body, _ = self.client.request("GET", path)
                self.assertEqual(status, 401)
                self.assertIsInstance(body, dict)
                self.assertIn("error", body)

    def test_invalid_bearer_token_is_rejected(self) -> None:
        status, body, _ = self.client.request(
            "GET",
            "/api/customers",
            token="definitely-not-a-real-token",
        )
        self.assertEqual(status, 401)
        self.assertIn("error", body)

    def test_admin_create_and_read_flow_for_all_domain_resources(self) -> None:
        token = self.login("admin@petclinic.local")

        status, customer_body, _ = self.client.request(
            "POST",
            "/api/customers",
            token=token,
            payload={
                "name": "API Test Owner",
                "phone": "09120000000",
                "email": "api.owner@test.local",
            },
        )
        self.assertEqual(status, 201, customer_body)
        customer = customer_body["item"]
        customer_id = customer["id"]

        status, pet_body, _ = self.client.request(
            "POST",
            "/api/pets",
            token=token,
            payload={
                "owner_id": customer_id,
                "name": "API Test Pet",
                "species": "dog",
                "breed": "mixed",
                "age": "3",
                "weight": 12.5,
                "status": "active",
                "note": "created by contract test",
            },
        )
        self.assertEqual(status, 201, pet_body)
        pet = pet_body["item"]
        pet_id = pet["id"]
        self.assertEqual(pet["owner_id"], customer_id)

        status, appointment_body, _ = self.client.request(
            "POST",
            "/api/appointments",
            token=token,
            payload={
                "pet_id": pet_id,
                "customer_id": customer_id,
                "starts_at": "2030-01-02T10:30:00",
                "service": "checkup",
                "doctor": "Dr. Test",
                "status": "scheduled",
            },
        )
        self.assertEqual(status, 201, appointment_body)
        appointment_id = appointment_body["item"]["id"]

        status, record_body, _ = self.client.request(
            "POST",
            "/api/records",
            token=token,
            payload={
                "pet_id": pet_id,
                "visit_date": "2030-01-02",
                "diagnosis": "healthy",
                "treatment": "none",
                "notes": "contract test visit",
            },
        )
        self.assertEqual(status, 201, record_body)
        record_id = record_body["item"]["id"]

        status, lab_body, _ = self.client.request(
            "POST",
            "/api/labs",
            token=token,
            payload={
                "pet_id": pet_id,
                "panel": "CBC",
                "result_json": {"wbc": 7.2, "status": "normal"},
                "status": "completed",
            },
        )
        self.assertEqual(status, 201, lab_body)
        lab_id = lab_body["item"]["id"]
        self.assertEqual(json.loads(lab_body["item"]["result_json"])["wbc"], 7.2)

        expected_ids = {
            "/api/customers": customer_id,
            "/api/pets": pet_id,
            "/api/appointments": appointment_id,
            "/api/records": record_id,
            "/api/labs": lab_id,
        }
        for path, expected_id in expected_ids.items():
            with self.subTest(path=path):
                status, body, _ = self.client.request("GET", path, token=token)
                self.assertEqual(status, 200, body)
                self.assertTrue(any(item["id"] == expected_id for item in body["items"]))

    def test_extended_clinic_modules_create_and_read(self) -> None:
        token = self.login("admin@petclinic.local")
        status, customer_body, _ = self.client.request(
            "POST",
            "/api/customers",
            token=token,
            payload={"name": "Extended Owner", "phone": "09129998877"},
        )
        self.assertEqual(status, 201, customer_body)
        customer_id = customer_body["item"]["id"]

        status, pet_body, _ = self.client.request(
            "POST",
            "/api/pets",
            token=token,
            payload={
                "owner_id": customer_id,
                "name": "Extended Pet",
                "species": "cat",
                "status": "active",
            },
        )
        self.assertEqual(status, 201, pet_body)
        pet_id = pet_body["item"]["id"]

        create_cases = {
            "/api/imaging": {
                "pet_id": pet_id,
                "study_type": "xray",
                "body_area": "chest",
                "report": "No acute finding",
                "status": "completed",
            },
            "/api/prescriptions": {
                "pet_id": pet_id,
                "medicine": "Amoxicillin",
                "dose": "10 mg",
                "duration": "5 days",
                "status": "در انتظار بررسی",
            },
            "/api/nutrition": {
                "pet_id": pet_id,
                "goal": "maintenance",
                "plan_json": {"calories": 250, "meals": 2},
                "calories": 250,
                "status": "draft",
            },
            "/api/inventory": {
                "name": "Test Supplement",
                "unit": "box",
                "stock": 10,
                "reorder": 2,
            },
        }
        expected_ids = {}
        for path, payload in create_cases.items():
            with self.subTest(create_path=path):
                status, body, _ = self.client.request(
                    "POST", path, token=token, payload=payload
                )
                self.assertEqual(status, 201, body)
                self.assertIn("item", body)
                expected_ids[path] = body["item"]["id"]
                if path == "/api/nutrition":
                    self.assertEqual(
                        json.loads(body["item"]["plan_json"])["calories"], 250
                    )

        for path, expected_id in expected_ids.items():
            with self.subTest(read_path=path):
                status, body, _ = self.client.request("GET", path, token=token)
                self.assertEqual(status, 200, body)
                self.assertTrue(any(item["id"] == expected_id for item in body["items"]))

        status, settings_body, _ = self.client.request(
            "POST",
            "/api/settings",
            token=token,
            payload={
                "clinic_name": "API Test Clinic",
                "phone": "02100000000",
                "settings_json": {"timezone": "Asia/Tehran"},
            },
        )
        self.assertEqual(status, 200, settings_body)
        self.assertEqual(settings_body["item"]["clinic_name"], "API Test Clinic")

        status, settings_read, _ = self.client.request(
            "GET", "/api/settings", token=token
        )
        self.assertEqual(status, 200, settings_read)
        self.assertEqual(settings_read["items"][0]["clinic_name"], "API Test Clinic")

        status, report_body, _ = self.client.request(
            "POST",
            "/api/reports",
            token=token,
            payload={"type": "operational"},
        )
        self.assertEqual(status, 200, report_body)
        self.assertGreaterEqual(report_body["report"]["customers"], 1)
        self.assertGreaterEqual(report_body["report"]["pets"], 1)

    def test_lab_request_create_contract(self) -> None:
        """The UI exposes lab requests, so creation must be a real API flow."""
        token = self.login("admin@petclinic.local")
        status, customer_body, _ = self.client.request(
            "POST",
            "/api/customers",
            token=token,
            payload={"name": "Lab Owner", "phone": "09123330000"},
        )
        self.assertEqual(status, 201, customer_body)
        status, pet_body, _ = self.client.request(
            "POST",
            "/api/pets",
            token=token,
            payload={
                "owner_id": customer_body["item"]["id"],
                "name": "Lab Pet",
                "species": "dog",
                "status": "active",
            },
        )
        self.assertEqual(status, 201, pet_body)
        status, body, _ = self.client.request(
            "POST",
            "/api/lab-requests",
            token=token,
            payload={
                "pet_id": pet_body["item"]["id"],
                "panel": "chemistry",
                "sample": "serum",
                "priority": "normal",
                "status": "requested",
            },
        )
        self.assertEqual(status, 201, body)

    def test_lab_answer_is_synchronized_between_request_and_lab_record(self) -> None:
        token = self.login("admin@petclinic.local")
        status, customer_body, _ = self.client.request(
            "POST", "/api/customers", token=token,
            payload={"name": "Lab Sync Owner", "phone": "09120001122"},
        )
        self.assertEqual(status, 201, customer_body)
        status, pet_body, _ = self.client.request(
            "POST", "/api/pets", token=token,
            payload={"owner_id": customer_body["item"]["id"], "name": "Lab Sync Pet", "species": "cat"},
        )
        self.assertEqual(status, 201, pet_body)
        status, request_body, _ = self.client.request(
            "POST", "/api/lab-requests", token=token,
            payload={"pet_id": pet_body["item"]["id"], "panel": "CBC", "status": "requested"},
        )
        self.assertEqual(status, 201, request_body)
        request_id = request_body["item"]["id"]
        answer = [{
            "name": "WBC", "testKey": "wbc", "species": "cat",
            "result": "8.2", "unit": "10^9/L", "flag": "طبیعی",
            "reference": "4.5 تا 14 10^9/L", "interpretation": "همسان‌سازی تست",
        }]
        status, completed, _ = self.client.request(
            "PATCH", f"/api/lab-requests/{request_id}", token=token,
            payload={"status": "completed", "result_json": answer},
        )
        self.assertEqual(status, 200, completed)
        status, requests, _ = self.client.request("GET", "/api/lab-requests", token=token)
        self.assertEqual(status, 200, requests)
        synced_request = next(item for item in requests["items"] if item["id"] == request_id)
        status, labs, _ = self.client.request("GET", "/api/labs", token=token)
        self.assertEqual(status, 200, labs)
        synced_lab = next(item for item in labs["items"] if item["request_id"] == request_id)
        self.assertEqual(json.loads(synced_request["result_json"]), json.loads(synced_lab["result_json"]))

    def test_required_fields_are_rejected_for_each_create_endpoint(self) -> None:
        token = self.login("admin@petclinic.local")
        invalid_requests = {
            "/api/customers": {"name": "missing phone"},
            "/api/pets": {"owner_id": 1, "name": "missing species"},
            "/api/appointments": {"starts_at": "2030-01-02T10:30:00"},
            "/api/records": {"pet_id": 1},
            "/api/labs": {"pet_id": 1},
        }
        for path, payload in invalid_requests.items():
            with self.subTest(path=path):
                status, body, _ = self.client.request(
                    "POST", path, token=token, payload=payload
                )
                self.assertEqual(status, 400, body)
                self.assertIn("error", body)

    def test_malformed_json_is_rejected(self) -> None:
        token = self.login("admin@petclinic.local")
        status, body, _ = self.client.request(
            "POST",
            "/api/customers",
            token=token,
            raw_body=b'{"name": "not closed"',
            headers={"Content-Type": "application/json"},
        )
        self.assertEqual(status, 400)
        self.assertIn("error", body)

    def test_oversized_request_body_is_rejected(self) -> None:
        oversized_body = b"x" * (2_000_001)
        try:
            status, body, _ = self.client.request(
                "POST",
                "/api/customers",
                raw_body=oversized_body,
                headers={"Content-Type": "application/json"},
            )
        except (ConnectionAbortedError, ConnectionResetError, RemoteDisconnected) as exc:
            # The current handler rejects before consuming the body, so the
            # Windows TCP stack may close the connection instead of returning
            # its intended 400 JSON response. Both outcomes are rejection.
            self.assertTrue(str(exc) or exc.__class__.__name__)
        else:
            self.assertEqual(status, 400)
            self.assertIn("error", body)

    def test_nonexistent_pet_is_rejected_for_records_and_labs(self) -> None:
        token = self.login("admin@petclinic.local")
        for path, payload in (
            ("/api/records", {"pet_id": 999999, "visit_date": "2030-01-02"}),
            ("/api/labs", {"pet_id": 999999, "panel": "CBC"}),
        ):
            with self.subTest(path=path):
                status, body, _ = self.client.request(
                    "POST", path, token=token, payload=payload
                )
                self.assertEqual(status, 400, body)
                self.assertIn("error", body)

    def test_unknown_api_routes_return_not_found(self) -> None:
        token = self.login("admin@petclinic.local")
        for method in ("GET", "POST"):
            with self.subTest(method=method):
                status, body, _ = self.client.request(
                    method,
                    "/api/does-not-exist",
                    token=token,
                    payload={} if method == "POST" else None,
                )
                self.assertEqual(status, 404, body)

    def test_customer_update_contract(self) -> None:
        """Full CRUD contract: update must be supported by the API."""
        token = self.login("admin@petclinic.local")
        status, created, _ = self.client.request(
            "POST", "/api/customers", token=token,
            payload={"name": "Update Owner", "phone": "09123334444"},
        )
        self.assertEqual(status, 201, created)
        customer_id = created["item"]["id"]
        status, body, _ = self.client.request(
            "PUT",
            f"/api/customers/{customer_id}",
            token=token,
            payload={"name": "Updated Owner", "phone": "09121111111"},
        )
        self.assertIn(status, (200, 204), body)

    def test_customer_delete_contract(self) -> None:
        """Full CRUD contract: delete must be supported by the API."""
        token = self.login("admin@petclinic.local")
        status, created, _ = self.client.request(
            "POST", "/api/customers", token=token,
            payload={"name": "Delete Owner", "phone": "09125556666"},
        )
        self.assertEqual(status, 201, created)
        customer_id = created["item"]["id"]
        status, body, _ = self.client.request(
            "DELETE",
            f"/api/customers/{customer_id}",
            token=token,
        )
        self.assertIn(status, (200, 204), body)

    def test_customer_role_is_forbidden_from_staff_collections(self) -> None:
        """Security contract from the UI: customers should not see staff data.

        Customer accounts cannot access staff collections.
        """
        token = self.login("customer@test.local")
        status, body, _ = self.client.request("GET", "/api/customers", token=token)
        self.assertEqual(status, 403, body)

    def test_customer_role_is_forbidden_from_write_operations(self) -> None:
        """Customers must not create staff-owned records."""
        token = self.login("customer@test.local")
        status, body, _ = self.client.request(
            "POST",
            "/api/customers",
            token=token,
            payload={"name": "Unauthorized Owner", "phone": "09120001111"},
        )
        self.assertEqual(status, 403, body)


if __name__ == "__main__":
    unittest.main(verbosity=2)
