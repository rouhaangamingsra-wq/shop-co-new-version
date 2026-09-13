# ShopCo — Fashion E-commerce + Admin Dashboard

A complete fashion e-commerce platform with a customer-facing storefront and a separate admin dashboard. Built with React, Vite, Tailwind CSS, Express, and JSON-file storage.

## Project Structure

```
ROUHAAAAN ULTIMATE PROJECT/
├── server/   # Express API (JSON storage + Multer image upload)
├── client/   # Customer-facing storefront (Vite + React + Tailwind)
└── admin/    # Admin dashboard (Vite + React + Tailwind, dark navy/purple theme)
```

## Quick Start

Open three terminals:

```bash
# 1. Backend API (port 4000)
cd server
npm install
npm run dev

# 2. Customer storefront (port 5173)
cd client
npm install
npm run dev

# 3. Admin dashboard (port 5174)
cd admin
npm install
npm run dev
```

Then visit:
- Storefront: http://localhost:5173
- Admin: http://localhost:5174 (or click "Admin Login" in the storefront mobile menu)
- API: http://localhost:4000/api

## Admin Access

Only the admin email can access the dashboard:

```
Email:    admin.shopco@gmail.com
Password: 123456789
```

Any other email is rejected with "Access denied."

## Features

### Customer Storefront
- Home (hero, new arrivals, top selling, browse by dress style, testimonials, newsletter)
- Product listing with filters (category, price, color, size, dress style) + sorting
- Category pages (`/category/:category`)
- Product details (image gallery, color/size selection, quantity, reviews, related products)
- Cart with quantity controls + order summary
- Checkout (contact, delivery, payment — mocked)
- Wishlist + toast notifications (persisted in localStorage)
- Fully responsive (desktop / tablet / mobile with hamburger nav + filter drawer)

### Admin Dashboard
- Dark navy `#101832` + purple `#6C4DFF` theme
- Sidebar: Default, Analytics, Invoice, CRM, Blog, Statistics, Data, Chart, Users, Customer, Order, Products, Categories, Settings
- Dashboard: stat cards, sales area chart (Recharts), recent orders, recent customers, product performance
- **Working CRUD** for Orders, Users, Customers, Products, Categories
- Product image upload via Multer
- Collapsible mobile sidebar
- Admin-gated login

### Backend (Express)
- JSON-file storage in `server/data/` (products, users, orders, categories)
- Multer image upload to `server/uploads/`
- REST CRUD endpoints for all entities
- `/api/stats` for dashboard aggregates
- `/api/auth/login` returns `isAdmin` based on email
- Seeded with 16 products, 10 users, 12 orders, 4 categories on first run

## Tech Stack
- React + Vite + JavaScript
- Tailwind CSS
- React Router
- Lucide React icons
- Recharts (admin dashboard chart)
- Express + Multer (backend)
