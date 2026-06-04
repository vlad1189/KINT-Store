# Test Credentials

## Admin User
- Email: admin@kshopping.ro
- Password: KShop2026!Admin
- Role: admin
- Login URL: /admin/login
- Dashboard: /admin

## Auth API Endpoints
- POST /api/auth/login  → returns { token, user }
- GET  /api/auth/me     → Authorization: Bearer <token>
- POST /api/auth/logout

## Product API Endpoints
- GET    /api/products              (public list)
- GET    /api/products/:slug        (public detail)
- POST   /api/admin/products        (admin)
- PUT    /api/admin/products/:id    (admin)
- DELETE /api/admin/products/:id    (admin)
