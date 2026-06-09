# Profptiy Luxury Real Estate Portal

A full-stack, production-ready luxury real estate property dealing portal, featuring an Express.js/PostgreSQL backend, Next.js 14+ App Router frontend, a comprehensive custom CMS settings editor, dynamic analytics dashboards, and SMTP lead notification routing.

---

## 🛠 Technology Stack

### Frontend
* **Core**: Next.js 14+ (App Router), React 18, TypeScript.
* **Styling**: Tailwind CSS (custom luxury branding theme - obsidian backgrounds, champagne gold accents, glassmorphic structures).
* **Animations**: Framer Motion & CSS micro-animations.
* **Icons**: Lucide React.
* **SEO**: Dynamic XML Sitemaps, crawler robots regulations, and meta details sync.

### Backend
* **Server**: Node.js, Express.js, TypeScript.
* **Database**: PostgreSQL with Prisma ORM.
* **Security & Auth**: JWT Authentication (JSON Web Tokens), bcryptjs password hashing.
* **Mail Notifications**: Nodemailer SMTP integration.

---

## 📂 Folder Structure

```
profptiy-website/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Database schema mapping
│   ├── src/
│   │   ├── config/               # Database pool instantiator
│   │   ├── controllers/          # Business logic (auth, property catalog, leads)
│   │   ├── middleware/           # JWT verification guards
│   │   ├── services/             # Nodemailer notification alerts
│   │   ├── seed.ts               # Pre-seeding mock inventories
│   │   └── index.ts              # Express API router entry
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/                  # Next.js Page components (layouts, routes)
│   │   ├── components/           # Reusable widgets (Header, Footer, PropertyCard)
│   │   ├── context/              # Authentication and CMS settings states
│   │   └── lib/                  # Fetch API Client helper SDK
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.mjs
├── docker-compose.yml            # Single-command local PostgreSQL database
└── README.md                     # Documentation
```

---

## 🚀 Local Installation & Setup

### Prerequisites
* Node.js (v18+)
* npm
* Docker (Optional, for easy PostgreSQL launching)

### Step 1: Database Setup
You can host a PostgreSQL database locally using Docker or connect to a cloud service (e.g. Supabase, Neon).

To run PostgreSQL locally via Docker:
```bash
docker compose up -d
```
This starts a PostgreSQL instance on port `5432` with username `postgres`, password `postgres`, and database `luxury_real_estate`.

### Step 2: Backend Setup
1. Open the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables. Copy `.env.example` to `.env` and adjust database credentials and mail server accounts (e.g. Mailtrap SMTP keys):
   ```bash
   cp .env.example .env
   ```
4. Run Prisma database migrations to create tables in PostgreSQL:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed the database with the administrator login and sample mansions/reviews:
   ```bash
   npm run seed
   ```
6. Start the API development server (running on port `5000`):
   ```bash
   npm run dev
   ```

### Step 3: Frontend Setup
1. Open the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` (it is pre-configured to link to `http://localhost:5000/api`):
   ```bash
   cp .env.example .env
   ```
4. Start the Next.js development server (running on port `3000`):
   ```bash
   npm run dev
   ```

Now open [http://localhost:3000](http://localhost:3000) to view the luxury portal!

---

## 🔑 Default Administrative Credentials

Login credentials for the dashboard panel:
* **Portal URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
* **Username**: `admin@profptiy.com`
* **Password**: `admin123`

---

## 📈 Administrative Dashboard Actions

Sign in to manage the dynamic parts of the website:
1. **Manage Listings**: Add, edit, or archive mansions, villas, or penthouses (inputs accommodate specifications, image arrays, video tour embeds, and coordinates).
2. **Manage Leads**: Read buyer inquiries, follow viewing request dates, change lead states (New, Contacted, Resolved), or delete entry files.
3. **Manage Blogs**: Draft news articles, tags, and summary excerpts using the dynamic blog authoring form.
4. **Website Settings (CMS)**: Modify brand names, logos, phone numbers, WhatsApp links, Google Map embeds, and SEO page meta tags.

---

## 🌐 Production Deployment Guide

### Database Hosting
* Deploy the database on a managed service like **Supabase**, **Neon**, **Aiven**, or **Render PostgreSQL**.
* Secure database access with SSL connection parameters in the database URL.

### Backend Hosting
* Host the Node.js Express server on **Render**, **Heroku**, **Railway**, or **AWS Elastic Beanstalk**.
* Configure environment variables (like `JWT_SECRET` and `SMTP_PASS`) directly in the host dashboard.
* Update CORS origins on backend to allow queries from the production frontend domain.

### Frontend Hosting
* Host the Next.js frontend on **Vercel** or **Netlify** for serverless React rendering.
* Set the environment variable `NEXT_PUBLIC_API_URL` to point to the production backend API URL.

### Cloudflare CDN Configuration
1. Route domain names through Cloudflare for spam/DDoS protection.
2. Enable SSL/TLS encryption mode to **Full** or **Full (Strict)** to protect form submissions.
3. Enable Cloudflare caching and minification tools to improve speed and achieve 90+ PageSpeed audits.
