"""Static contract tests for the Pet Shop sales workspace."""

from pathlib import Path
import unittest


ROOT = Path(__file__).parent
APP = (ROOT / "app.js").read_text(encoding="utf-8")
HTML = (ROOT / "index.html").read_text(encoding="utf-8")


class PetShopFrontendContractTests(unittest.TestCase):
    def test_navigation_and_seller_role_are_exposed(self) -> None:
        self.assertIn('data-section="pet-shop"', HTML)
        self.assertIn('data-login-role="shop_seller"', HTML)
        self.assertIn("shop_seller", APP)
        self.assertIn("shopkeeper@petclinic.local", APP)
        self.assertIn("isShopSellerSession", APP)

    def test_product_and_sales_workspaces_exist(self) -> None:
        self.assertIn("renderPetShopWorkspace", APP)
        self.assertIn("/shop/products", APP)
        self.assertIn("/shop/sales", APP)
        self.assertIn("/shop/stock-movements", APP)

    def test_sales_ui_supports_catalog_barcode_cart_and_invoice(self) -> None:
        for marker in (
            "barcode",
            "purchase_price",
            "sale_price",
            "shopCart",
            "invoice_number",
            "payment_method",
            "reorder_level",
        ):
            self.assertIn(marker, APP)

    def test_shop_reports_and_inventory_refresh_are_wired(self) -> None:
        self.assertIn("/shop/reports/summary", APP)
        self.assertIn("shopProductSearch", APP)
        self.assertIn("shopStockForm", APP)
        self.assertIn('["dashboard", "pet-shop"].includes(section)', APP)

    def test_javascript_syntax(self) -> None:
        import subprocess

        result = subprocess.run(
            ["node", "--check", str(ROOT / "app.js")],
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
