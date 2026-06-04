from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import re
import unicodedata
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr

import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK using environment variables
# Required env vars: FIREBASE_TYPE, FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY_ID,
# FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_CLIENT_ID, FIREBASE_AUTH_URI,
# FIREBASE_TOKEN_URI, FIREBASE_AUTH_PROVIDER_X509_CERT_URL, FIREBASE_CLIENT_X509_CERT_URL
firebase_creds = {
    "type": os.environ.get("FIREBASE_TYPE", "service_account"),
    "project_id": os.environ.get("FIREBASE_PROJECT_ID"),
    "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.environ.get("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
    "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
    "auth_uri": os.environ.get("FIREBASE_AUTH_URI", "https://accounts.google.com/o/oauth2/auth"),
    "token_uri": os.environ.get("FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token"),
    "auth_provider_x509_cert_url": os.environ.get("FIREBASE_AUTH_PROVIDER_X509_CERT_URL", "https://www.googleapis.com/oauth2/v1/certs"),
    "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_X509_CERT_URL"),
}
cred = credentials.Certificate(firebase_creds)
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGO = "HS256"
JWT_EXP_HOURS = 12

app = FastAPI(title="KINT Store API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)


# -------------------- Helpers --------------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXP_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


async def get_current_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Get user from Firestore
    users_ref = db.collection('users')
    user_doc = users_ref.document(payload["sub"]).get()
    
    if not user_doc.exists:
        # Try to find by email (for backward compatibility)
        query = users_ref.where('email', '==', payload["sub"]).limit(1).get()
        if not query:
            raise HTTPException(status_code=401, detail="User not found")
        user_doc = query[0]
    
    user_data = user_doc.to_dict()
    if not user_data or user_data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    
    # Remove sensitive data
    user_data.pop('password_hash', None)
    return user_data


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower().strip().replace("_", "-")
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


# -------------------- Models --------------------
class LoginInput(BaseModel):
    email: EmailStr
    password: str


class ProductInput(BaseModel):
    name: str
    tagline: str = ""
    category: str = "general"  # industrial | auto | home | general
    price: float
    old_price: Optional[float] = None
    short_description: str = ""
    description: str = ""
    image: str = ""
    images: List[str] = []
    benefits: List[str] = []
    bullets: List[str] = []   # short selling points for hero
    problem: str = ""         # emotional problem description for frustration section
    problem_title: str = ""
    problem_points: List[str] = []   # what happens WITHOUT the product (pain)
    solution_title: str = ""
    solution_points: List[str] = []  # what the product does (gain)
    demo_video: str = ""      # URL to demo video (mp4)
    demo_gif: str = ""        # URL to demo GIF
    before_description: str = ""    # Description of the "before" state
    after_description: str = ""     # Description of the "after" state
    comparison_images: List[str] = []  # URLs for before/after comparison (at least 2)
    consequences: List[str] = []  # What happens if you don't act now
    urgency_message: str = ""   # Urgent message about acting now
    stock: int = 20
    rating: float = 4.8
    reviews_count: int = 0
    paperform_url: str = ""
    offer_ends_in_hours: int = 24
    units_sold: int = 0
    active: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    old_price: Optional[float] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    bullets: Optional[List[str]] = None
    problem: Optional[str] = None
    problem_title: Optional[str] = None
    problem_points: Optional[List[str]] = None
    solution_title: Optional[str] = None
    solution_points: Optional[List[str]] = None
    demo_video: Optional[str] = None
    demo_gif: Optional[str] = None
    before_description: Optional[str] = None
    after_description: Optional[str] = None
    comparison_images: Optional[List[str]] = None
    consequences: Optional[List[str]] = None
    urgency_message: Optional[str] = None
    stock: Optional[int] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    paperform_url: Optional[str] = None
    offer_ends_in_hours: Optional[int] = None
    units_sold: Optional[int] = None
    active: Optional[bool] = None


# -------------------- Auth --------------------
@api_router.post("/auth/login")
async def login(body: LoginInput):
    email = body.email.lower().strip()
    
    # Query Firestore for user by email
    users_ref = db.collection('users')
    query = users_ref.where('email', '==', email).limit(1).get()
    
    if not query:
        raise HTTPException(status_code=401, detail="Email sau parolă incorectă")
    
    user_doc = query[0]
    user_data = user_doc.to_dict()
    
    if not user_data or not verify_password(body.password, user_data["password_hash"]):
        raise HTTPException(status_code=401, detail="Email sau parolă incorectă")
    
    token = create_token(user_data["id"], user_data["email"])
    return {
        "token": token,
        "user": {
            "id": user_data["id"], 
            "email": user_data["email"], 
            "name": user_data.get("name", "Admin"), 
            "role": user_data.get("role", "admin")
        },
    }


@api_router.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return admin


@api_router.post("/auth/logout")
async def logout(admin: dict = Depends(get_current_admin)):
    return {"ok": True}


# -------------------- Public Products --------------------
@api_router.get("/products")
async def list_products():
    products_ref = db.collection('products')
    # Firestore requires an index for where + order_by on different fields
    # First get all active products, then sort in memory
    query = products_ref.where('active', '==', True).limit(500).get()
    
    products = []
    for doc in query:
        product = doc.to_dict()
        product['id'] = doc.id
        products.append(product)
    
    # Sort by created_at descending in memory
    products.sort(key=lambda x: x.get('created_at', ''), reverse=True)
    
    return products[:200]


@api_router.get("/products/{slug}")
async def get_product(slug: str):
    products_ref = db.collection('products')
    query = products_ref.where('slug', '==', slug).limit(1).get()
    
    if not query:
        raise HTTPException(status_code=404, detail="Produs negăsit")
    
    product = query[0].to_dict()
    product['id'] = query[0].id
    return product


# -------------------- Admin Products --------------------
@api_router.get("/admin/products")
async def admin_list_products(admin: dict = Depends(get_current_admin)):
    products_ref = db.collection('products')
    query = products_ref.order_by('created_at', direction=firestore.Query.DESCENDING).limit(500).get()
    
    products = []
    for doc in query:
        product = doc.to_dict()
        product['id'] = doc.id
        products.append(product)
    
    return products


@api_router.post("/admin/products")
async def admin_create_product(body: ProductInput, admin: dict = Depends(get_current_admin)):
    pid = str(uuid.uuid4())
    slug = slugify(body.name) + "-" + pid[:6]
    doc = body.model_dump()
    doc["id"] = pid
    doc["slug"] = slug
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["updated_at"] = doc["created_at"]
    
    # Add to Firestore
    products_ref = db.collection('products')
    products_ref.document(pid).set(doc)
    
    return doc


@api_router.put("/admin/products/{pid}")
async def admin_update_product(pid: str, body: ProductUpdate, admin: dict = Depends(get_current_admin)):
    products_ref = db.collection('products')
    product_doc = products_ref.document(pid).get()
    
    if not product_doc.exists:
        raise HTTPException(status_code=404, detail="Produs negăsit")
    
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    if "name" in update_data:
        update_data["slug"] = slugify(update_data["name"]) + "-" + pid[:6]
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    # Update in Firestore
    products_ref.document(pid).update(update_data)
    
    # Get updated document
    updated_doc = products_ref.document(pid).get()
    doc = updated_doc.to_dict()
    doc['id'] = pid
    return doc


@api_router.delete("/admin/products/{pid}")
async def admin_delete_product(pid: str, admin: dict = Depends(get_current_admin)):
    products_ref = db.collection('products')
    product_doc = products_ref.document(pid).get()
    
    if not product_doc.exists:
        raise HTTPException(status_code=404, detail="Produs negăsit")
    
    products_ref.document(pid).delete()
    return {"ok": True}


@api_router.get("/")
async def root():
    return {"message": "KINT Store API", "status": "ok"}


# -------------------- Seeding --------------------
DEMO_PRODUCTS = [
    {
        "name": "metal.FIX Adeziv Bicomponent",
        "tagline": "Rezistă până la 1420 kg · Lipește orice în 5 minute",
        "category": "industrial",
        "price": 79.00,
        "old_price": 159.00,
        "short_description": "Adeziv industrial bicomponent cu putere de oțel. Lipește metal, sticlă, ceramică, plastic și lemn instant — rezistent la căldură, îngheț și apă.",
        "description": "metal.FIX este adezivul bicomponent profesional care înlocuiește sudura. Mixt instant prin aplicator, formează o legătură industrială cu rezistență testată de 1420 kg — suficient pentru a susține greutatea unei mașini mici. Folosit de mecanici, constructori și meșteri din toată țara pentru reparații rapide și definitive.\n\nIdeal pentru: țevi sparte, metale crăpate, plastic auto, mobilier rupt, ceramică spartă, sticlă, lemn, fier forjat și absolut orice altceva.",
        "image": "https://customer-assets.emergentagent.com/job_cod-checkout/artifacts/mfdp0abx_WhatsApp%20Image%202026-05-17%20at%2021.38.48.jpeg",
        "images": [
            "https://customer-assets.emergentagent.com/job_cod-checkout/artifacts/mfdp0abx_WhatsApp%20Image%202026-05-17%20at%2021.38.48.jpeg",
            "https://images.unsplash.com/photo-1581094271901-8022df4466f9?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
            "https://images.unsplash.com/photo-1504148455328-c376907d081c?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
        ],
        "bullets": [
            "Rezistă până la 1420 kg",
            "Se întărește în 5 minute",
            "Rezistent la apă, căldură și îngheț",
            "Funcționează pe metal, sticlă, plastic, lemn, ceramică",
        ],
        "benefits": [
            "Putere industrială de 1420 kg — testat în condiții reale",
            "Aplicare ușoară prin aplicator bicomponent — fără mizerie",
            "Întărire rapidă în 5 minute, rezistență finală在 24h",
            "Rezistent la temperaturi extreme (-40°C până la +120°C)",
            "Impermeabil — perfect pentru reparații exterioare și auto",
            "Înlocuiește sudura pentru cele mai multe reparații casnice",
        ],
        "problem": "Te-ai trezit vreodată privind un obiect rupt și te-ai întrebat: 'Cum naiba îl repar?' Fie că e o țeavă spartă care inunda bucătăria, un suport metalic rupt de la mașină, sau obiectul tău preferat de decor care zace în bucăți — frustrarea e aceeași. Plătești sute de lei la service, aștepți zile întregi după un meseriaș, sau renunți și cumperi altul. Între timp, problema rămâne. Și te enervează. În fiecare zi.",
        "before_description": "Obiectul rupt zace undeva prin casă. De fiecare dată când îl vezi, te enervezi. Îl muți din loc în loc, promiți că îl vei repara 'cândva', dar timpul trece. Între time, funcționezi cu soluții improvizate care nu țin. Te-ai resemnat că 'așa e' și că va trebui să cumperi altul.",
        "after_description": "În 5 minute, obiectul e ca nou. Ba chiar mai rezistent decât înainte. Aplici metal.FIX, aștepți să se întărească, și gata — ai rezolvat o problemă care te enerva de luni de zile. Simți o satisfacție imensă. Ai economisit sute de lei și ore de așteptare. Și cel mai important: ai recâștigat controlul.",
        "comparison_images": [
            "https://images.unsplash.com/photo-1504148455328-c376907d081c?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
            "https://images.unsplash.com/photo-1581094271901-8022df4466f9?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85"
        ],
        "consequences": [
            "Problema se agravează în fiecare zi — o fisură mică devine o spargere completă",
            "Continui să plătești sute de lei la meseriași pentru reparații care nu țin",
            "Obiecte de valoare sentimentală ajung la gunoi pentru că nu le poți repara",
            "Te obișnuiești cu ideea că 'nu te pricepi' și renunți să mai încerci",
            "Pierzi încrederea în abilitățile tale practice și devii dependent de alții"
        ],
        "urgency_message": "În fiecare zi în care amâni, obiectul se deteriorează mai mult. Ceea ce azi se putea repara cu metal.FIX, mâine va necesita înlocuire completă. Nu lăsa problema să scape de sub control.",
        "problem_title": "Cunoști senzația asta?",
        "problem_points": [
            "Plătești sute de lei pentru sudură sau service la fiecare reparație",
            "Adezivii obișnuiți cedează la temperatură, apă sau greutate",
            "Pierzi ore căutând meseriași disponibili",
            "Obiecte de valoare sentimentală ajung la gunoi pentru că s-au rupt",
            "Reparațiile improvizate se desfac din nou în câteva zile",
        ],
        "solution_title": "Cu metal.FIX, problemele dispar",
        "solution_points": [
            "Repari singur orice obiect rupt în doar 5 minute",
            "Legătură industrială rezistentă până la 1420 kg, dovedită",
            "Funcționează pe metal, sticlă, plastic, lemn, ceramică",
            "Rezistent la căldură (-40°C → +120°C), apă, îngheț și UV",
            "Economisești sute de lei față de un meseriaș sau sudor",
        ],
        "stock": 47,
        "rating": 4.9,
        "reviews_count": 2138,
        "units_sold": 8420,
        "paperform_url": "",
        "offer_ends_in_hours": 24,
        "active": True,
    },
    {
        "name": "All Cars Magic Pen",
        "tagline": "Zgârieturile dispar instant · Pentru orice culoare de mașină",
        "category": "auto",
        "price": 59.00,
        "old_price": 129.00,
        "short_description": "Creionul magic care elimină zgârieturile superficiale de pe caroseria mașinii tale în mai puțin de 30 de secunde. Compatibil cu orice culoare.",
        "description": "All Cars Magic Pen este soluția revoluționară pentru zgârieturile inestetice de pe mașina ta. Formula unică reacționează cu lacul existent, umple microfisurile și restabilește luciul original — fără polish, fără mers la service, fără cheltuieli mari.\n\nFuncționează pe TOATE culorile de mașină datorită formulei transparente cu reflexivitate adaptivă. Trebuie doar să tamponezi ușor zona zgâriată, lași 30 de secunde și ștergi cu o cârpă moale. Rezultate vizibile garantate sau primești banii înapoi.",
        "image": "https://customer-assets.emergentagent.com/job_cod-checkout/artifacts/h3ijjenr_WhatsApp%20Image%202026-05-17%20at%2021.37.26.jpeg",
        "images": [
            "https://customer-assets.emergentagent.com/job_cod-checkout/artifacts/h3ijjenr_WhatsApp%20Image%202026-05-17%20at%2021.37.26.jpeg",
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
        ],
        "bullets": [
            "Funcționează pe orice culoare",
            "Rezultate în 30 de secunde",
            "Fără polish, fără service",
            "Rezistent la spălare și ploaie",
        ],
        "benefits": [
            "Elimină zgârieturile superficiale instant — fără polish",
            "Compatibil cu absolut orice culoare de caroserie",
            "Aplicare în mai puțin de 30 de secunde, oriunde te-ai afla",
            "Rezistent la spălări auto, ploaie și raze UV",
            "Economisești sute de lei față de service-ul auto",
            "Formula non-toxică, sigură pentru lacul original",
        ],
        "problem": "O simplă zgârietură pe caroserie îți strică ziua. Te uiți la ea de fiecare dată când te urci în mașină. Știi că scade valoarea de revânzare cu sute de euro. Service-ul te taxează 300-500 lei pentru o retușare care 'nu se vede oricum'. Polish-ul pe care l-ai cumpărat nu a făcut nimic. Iar zgârietura pare că se mărește pe zi ce trece. Te simți neputincios. Mașina ta — care ar trebui să fie mândria ta — are acum o cicatrice care îți amintește de momentul acela nefericit.",
        "before_description": "Mașina are o zgârietură urâtă care iese în evidență de la distanță. Te jenezi să parchezi lângă mașini scumpe. Când speli mașina, eviți să te uiți la acea zonă. Prietenii și familia observă și te întreabă 'ce-ai pățit acolo?'. Te simți ca și cum ai conduce o mașină 'avarie'.",
        "after_description": "Zgârietura a dispărut complet. Mașina arată ca ieșită din salon. Te urci în ea cu mândrie, fără să mai eviți privirea spre acea zonă. Când cineva îți spune 'ce mașină frumoasă!', zâmbești pentru că știi secretul. Ai economisit 400+ lei și ore de stat prin service-uri.",
        "comparison_images": [
            "https://images.unsplash.com/photo-1601362840466-4731d2453772?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85"
        ],
        "consequences": [
            "Zgârietura se transformă în rugina care se extinde sub lac",
            "Valoarea de revânzare scade cu 500-1000€ pentru o 'mașină avariată'",
            "Continui să amâni, iar problema devine permanentă",
            "Te obișnuiești cu ideea că mașina ta 'nu mai e ca nouă'",
            "Pierzi mândria de a deține o mașină îngrijită"
        ],
        "urgency_message": "Rugina nu așteaptă. Odată ce lacul e spart, oxidarea începe imediat. Ceea ce azi e doar o zgârietură cosmetică, în 3-6 luni devine o problemă structurală care costă mii de lei. Acum e momentul să acționezi.",
        "problem_title": "Te-ai săturat de zgârieturi?",
        "problem_points": [
            "O simplă zgârietură scade valoarea de revânzare a mașinii cu sute de euro",
            "Service-ul auto te taxează 200-500 lei pentru cea mai mică retușare",
            "Polish-ul tradițional durează ore și acoperă doar parțial",
            "Vopseaua de retuș nu se potrivește niciodată exact cu culoarea ta",
            "Zgârieturile netratate atrag rugina și se înrăutățesc în time",
        ],
        "solution_title": "Cu Magic Pen, problema e rezolvată",
        "solution_points": [
            "Aplici creionul → aștepți 30 secunde → ștergi → gata",
            "Formulă transparentă care se adaptează la ORICE culoare",
            "Îl folosești oriunde — în parcare, garaj, pe drum",
            "Rezistă la spălări auto repetate și la condiții meteo extreme",
            "Sub 60 lei vs. 300+ lei la service — economie evidentă",
        ],
        "stock": 23,
        "rating": 4.8,
        "reviews_count": 1647,
        "units_sold": 5293,
        "paperform_url": "",
        "offer_ends_in_hours": 12,
        "active": True,
    },
]


async def seed_admin():
    admin_email = os.environ["ADMIN_EMAIL"].lower().strip()
    admin_password = os.environ["ADMIN_PASSWORD"]
    
    users_ref = db.collection('users')
    query = users_ref.where('email', '==', admin_email).limit(1).get()
    
    if not query:
        # Create new admin user
        user_id = str(uuid.uuid4())
        user_data = {
            "id": user_id,
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        users_ref.document(user_id).set(user_data)
        logger.info(f"Admin seeded: {admin_email}")
    else:
        # Update password if needed
        user_doc = query[0]
        user_data = user_doc.to_dict()
        if not verify_password(admin_password, user_data["password_hash"]):
            users_ref.document(user_doc.id).update({
                "password_hash": hash_password(admin_password)
            })
            logger.info(f"Admin password updated: {admin_email}")


async def seed_products():
    products_ref = db.collection('products')
    query = products_ref.limit(1).get()
    
    if query:
        return  # Products already exist
    
    now = datetime.now(timezone.utc).isoformat()
    for p in DEMO_PRODUCTS:
        pid = str(uuid.uuid4())
        slug = slugify(p["name"]) + "-" + pid[:6]
        doc = {**p, "id": pid, "slug": slug, "created_at": now, "updated_at": now}
        products_ref.document(pid).set(doc)
    
    logger.info("Demo products seeded")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    await seed_admin()
    await seed_products()


@app.on_event("shutdown")
def shutdown_db_client():
    # Firebase Admin SDK doesn't require explicit shutdown
    pass