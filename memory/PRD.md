# KShopping - Product Requirements Document

## Original Problem Statement
Magazin online de e-commerce "KShopping" / "Magazinul tău online":
- Landing page DEDICAT per produs (cu temă vizuală specifică niche-ului)
- Logo custom (inspirat din litera K cu chevron)
- Design îndrăzneț, conversion-focused pentru reclame Facebook Ads
- Afacere COD - plată doar la livrare
- Integrare Paperform pentru formularele de comandă

## Iterations
- **Iter 1 (initial)**: Design verde natural (skincare-themed) - respins de user
- **Iter 2 (current)**: Redesign complet — dark hero, orange CTA accent, logo SVG custom, per-category theming pentru landing pages (industrial=red, auto=blue, home=teal, general=orange)

## User Personas
- **Cumpărător din FB Ads**: Vine de pe o reclamă, vrea convingere rapidă, plată la livrare, comandă în <60s
- **Admin proprietar**: Adaugă/editează produse, selectează categoria (definește tema vizuală)

## Architecture
- **Backend**: FastAPI + Motor (MongoDB async), JWT Bearer auth, bcrypt
- **Frontend**: React 19 + React Router 7 + Tailwind + Framer Motion + Sonner
- **DB**: MongoDB (`users`, `products`)
- **Auth**: Single admin (admin@kshopping.ro), localStorage Bearer token

## Schema Produs (extended)
- `name`, `slug` (auto, ASCII)
- `tagline` (apare în hero strip)
- `category`: "industrial" | "auto" | "home" | "general" (determină tema vizuală)
- `price`, `old_price`, `stock`, `rating`, `reviews_count`, `units_sold`
- `short_description`, `description`
- `image`, `images[]` (galerie)
- `bullets[]` (3-4 puncte scurte lângă preț)
- `benefits[]` (lista detaliată din secțiunea dark)
- `paperform_url`
- `offer_ends_in_hours`
- `active`

## Theme System (`/app/frontend/src/lib/themes.js`)
Mapping category → culori + label + hero gradient. Landing page-ul folosește `getTheme(product.category)` pentru:
- Accent buttons & checks
- Hero strip gradient (red-zinc, blue-navy, teal-stone, orange-zinc)
- Benefits section dark background
- Category badge culoare

## Current Products (Feb 2026)
1. **metal.FIX Adeziv Bicomponent** (industrial, red theme) — 79 lei (de la 159), rezistă 1420 kg
2. **All Cars Magic Pen** (auto, blue theme) — 59 lei (de la 129), elimină zgârieturi auto în 30s

## Endpoints
- POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout
- GET /api/products, GET /api/products/:slug
- GET/POST/PUT/DELETE /api/admin/products[/:id]

## What's Been Implemented (Feb 2026)
- [x] Backend cu schema extinsă (category, tagline, bullets, units_sold)
- [x] 2 produse demo seed-uite (metal.FIX + Magic Pen)
- [x] Logo SVG custom (K + chevron geometric)
- [x] Homepage dark hero + orange CTA + 3-step "How it works" + reviews per category
- [x] Per-category themed product landing page (dynamic colors)
- [x] Hero strip cu icon + categorie + big stat per produs
- [x] Benefits section dark themed per categorie
- [x] Guarantee box conform temei
- [x] Reviews diferite per categorie (industrial/auto/general)
- [x] Admin dashboard cu Category dropdown + Tagline/Bullets/UnitsSold fields
- [x] Save button left-aligned (rezolvat overlap cu Emergent badge)
- [x] Testat 100% backend (17/17 pytest) + 100% frontend e2e

## Prioritized Backlog
### P1
- Adăugare link-uri Paperform reale per produs
- Adăugare produse reale ale utilizatorului
- Custom 404 page

### P2
- FB Pixel + Conversions API
- Upsell / cross-sell între produse
- Multi-imagini cu zoom
- Tracking analytics dashboard în admin
- Email notification la comandă nouă
- Coduri de reducere
- Bundle deals (X + Y la preț redus)

## Test Credentials
Vezi /app/memory/test_credentials.md
