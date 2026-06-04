"""KShopping backend API tests: auth + product CRUD with new product model (tagline, category, bullets, units_sold)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    env_path = "/app/frontend/.env"
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.strip().split("=", 1)[1]
                    break
BASE_URL = (BASE_URL or "").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@kshopping.ro"
ADMIN_PASSWORD = "KShop2026!Admin"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# -------------------- Health & Public products --------------------
def test_health(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


def test_list_products_has_2_with_new_fields(session):
    r = session.get(f"{API}/products")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 2, f"Expected >=2 products, got {len(data)}"
    cats = {p["category"] for p in data}
    assert "industrial" in cats, f"Missing 'industrial' category, got: {cats}"
    assert "auto" in cats, f"Missing 'auto' category, got: {cats}"
    for p in data:
        # new fields
        assert "tagline" in p, f"missing tagline: {p.get('name')}"
        assert "category" in p
        assert "bullets" in p and isinstance(p["bullets"], list)
        assert "units_sold" in p and isinstance(p["units_sold"], int)
        assert "_id" not in p


def test_get_metalfix_by_slug(session):
    r = session.get(f"{API}/products")
    products = r.json()
    metalfix = next((p for p in products if p["category"] == "industrial"), None)
    assert metalfix is not None
    r2 = session.get(f"{API}/products/{metalfix['slug']}")
    assert r2.status_code == 200
    d = r2.json()
    assert d["category"] == "industrial"
    assert "metal.FIX" in d["name"]
    assert len(d["bullets"]) >= 1
    assert d["units_sold"] > 0


def test_get_magicpen_by_slug(session):
    r = session.get(f"{API}/products")
    products = r.json()
    magicpen = next((p for p in products if p["category"] == "auto"), None)
    assert magicpen is not None
    r2 = session.get(f"{API}/products/{magicpen['slug']}")
    assert r2.status_code == 200
    d = r2.json()
    assert d["category"] == "auto"
    assert "Magic Pen" in d["name"]
    assert len(d["bullets"]) >= 1


def test_get_product_invalid_slug(session):
    r = session.get(f"{API}/products/invalid-slug-xyz-404")
    assert r.status_code == 404


# -------------------- Auth --------------------
def test_login_success(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    j = r.json()
    assert "token" in j and isinstance(j["token"], str) and len(j["token"]) > 10
    assert j["user"]["email"] == ADMIN_EMAIL
    assert j["user"]["role"] == "admin"


def test_login_wrong_password(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401


def test_login_wrong_email(session):
    r = session.post(f"{API}/auth/login", json={"email": "ghost@kshopping.ro", "password": "whatever"})
    assert r.status_code == 401


def test_me_with_token(session, auth_headers):
    r = session.get(f"{API}/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL
    assert r.json()["role"] == "admin"


def test_me_no_token():
    r = requests.get(f"{API}/auth/me")
    assert r.status_code == 401


def test_me_invalid_token():
    r = requests.get(f"{API}/auth/me", headers={"Authorization": "Bearer not-a-real-token"})
    assert r.status_code == 401


# -------------------- Admin product CRUD --------------------
def test_admin_list_requires_auth():
    r = requests.get(f"{API}/admin/products")
    assert r.status_code == 401


def test_admin_list_products(session, auth_headers):
    r = session.get(f"{API}/admin/products", headers=auth_headers)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) >= 2


def test_admin_create_industrial_product(session, auth_headers):
    payload = {
        "name": "TEST_Industrial Product",
        "tagline": "Test tagline industrial",
        "category": "industrial",
        "price": 49.99,
        "old_price": 99.99,
        "short_description": "Test short",
        "description": "Test long description",
        "image": "https://example.com/img.jpg",
        "images": ["https://example.com/img.jpg"],
        "bullets": ["bullet 1", "bullet 2", "bullet 3"],
        "benefits": ["b1", "b2"],
        "stock": 10,
        "rating": 4.5,
        "reviews_count": 5,
        "units_sold": 500,
        "paperform_url": "",
        "offer_ends_in_hours": 12,
        "active": True,
    }
    r = session.post(f"{API}/admin/products", json=payload, headers=auth_headers)
    assert r.status_code == 200, r.text
    created = r.json()
    pid = created["id"]
    try:
        assert created["category"] == "industrial"
        assert created["tagline"] == "Test tagline industrial"
        assert created["bullets"] == ["bullet 1", "bullet 2", "bullet 3"]
        assert created["units_sold"] == 500
        assert "_id" not in created

        # Verify via GET by slug
        r2 = session.get(f"{API}/products/{created['slug']}")
        assert r2.status_code == 200
        fetched = r2.json()
        assert fetched["category"] == "industrial"
        assert fetched["tagline"] == "Test tagline industrial"

        # Update category and units_sold
        r3 = session.put(
            f"{API}/admin/products/{pid}",
            json={"category": "auto", "units_sold": 999, "tagline": "Updated tagline"},
            headers=auth_headers,
        )
        assert r3.status_code == 200
        updated = r3.json()
        assert updated["category"] == "auto"
        assert updated["units_sold"] == 999
        assert updated["tagline"] == "Updated tagline"

        # Verify persistence
        r4 = session.get(f"{API}/products/{updated['slug']}")
        assert r4.status_code == 200
        assert r4.json()["category"] == "auto"
        assert r4.json()["units_sold"] == 999
    finally:
        # Cleanup
        session.delete(f"{API}/admin/products/{pid}", headers=auth_headers)

    # Verify deletion 404
    r6 = session.get(f"{API}/products/{created['slug']}")
    assert r6.status_code == 404


def test_admin_update_nonexistent(session, auth_headers):
    r = session.put(f"{API}/admin/products/does-not-exist-id", json={"price": 1.0}, headers=auth_headers)
    assert r.status_code == 404


def test_admin_delete_nonexistent(session, auth_headers):
    r = session.delete(f"{API}/admin/products/does-not-exist-id", headers=auth_headers)
    assert r.status_code == 404


def test_admin_create_requires_auth():
    r = requests.post(f"{API}/admin/products", json={"name": "x", "price": 1.0})
    assert r.status_code == 401
