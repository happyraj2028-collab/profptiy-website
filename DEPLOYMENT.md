# Profptiy Luxury Real Estate - Production Deployment Guide

This guide provides step-by-step instructions for deploying your luxury real estate application to production.

## Deployment Architecture

- **Frontend**: Next.js (Deployed on **Vercel**)
- **Backend**: Node.js / Express (Deployed on **Render**)
- **Database**: PostgreSQL (Hosted on **Supabase**)

---

## Step 1: Database Setup (Supabase PostgreSQL)

1. **Create a Supabase Account & Project**:
   - Go to [Supabase](https://supabase.com) and sign in.
   - Click on **New Project**.
   - Select your Organization, enter a **Project Name** (e.g., `profptiy-luxury-realty`), and set a secure **Database Password**.
   - Choose a Region close to your users (or close to your Render hosting region, e.g., AWS US East).
   - Click **Create new project**. Wait a few minutes for the database to provision.

2. **Get the Database Connection String**:
   - In the Supabase Dashboard, go to **Project Settings** (gear icon) -> **Database**.
   - Scroll down to the **Connection string** section.
   - Select **URI** and copy the connection string.
   - Use the **Transaction Pooler** URI (usually port `6543`) for Prisma.
   - The connection string will look like this:
     ```text
     postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
     ```
   - **Crucial**: Replace `[YOUR_PASSWORD]` with the database password you chose during project creation. Add `?pgbouncer=true&connection_limit=1` to the end of the string if it is not already present, as this is required for Serverless environment connection pooling.

---

## Step 2: Backend Configuration & Deployment (Render)

We have created a `render.yaml` Blueprint specification in the root of the workspace. This file defines all the configurations required for Render to provision and deploy your service.

1. **Push your code to GitHub**:
   - Make sure your project is committed and pushed to a GitHub repository (see the **GitHub Setup** section below).

2. **Deploy on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com).
   - Click **New +** and select **Blueprint**.
   - Connect your GitHub repository.
   - Render will detect the `render.yaml` file automatically.
   - Enter a **Service Group Name** (e.g., `profptiy-luxury`).
   - Define the required **Environment Variables** in the Render UI:
     - `DATABASE_URL`: The Supabase Connection String (from Step 1).
     - `JWT_SECRET`: A secure random string (e.g., generate one with `openssl rand -base64 32`).
     - `CLIENT_URL`: The URL of your Vercel frontend (e.g., `https://profptiy-luxury.vercel.app`). *Note: If you don't have this yet, you can use `*` temporarily or update it after Vercel deployment.*
     - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Your production SMTP mail server credentials (e.g., Resend, SendGrid, or Mailtrap for testing).
     - `EMAIL_FROM`: Send-from email address (e.g., `noreply@yourdomain.com`).
     - `EMAIL_TO`: Notification destination (e.g., `owner@yourdomain.com`).
   - Click **Apply**. Render will automatically install dependencies, run `npm run build` (which generates the Prisma Client and compiles TS to JS), run database migrations, and start your backend.

### Render Manual Build Settings (If not using Blueprint):
- **Service Type**: Web Service
- **Language**: Node
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npx prisma migrate deploy && npm start`

---

## Step 3: Frontend Configuration & Deployment (Vercel)

1. **Deploy on Vercel**:
   - Go to [Vercel](https://vercel.com) and log in.
   - Click **Add New** -> **Project**.
   - Import your GitHub repository.
   - Configure the following settings for the project:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
   - Expand the **Environment Variables** section and add:
     - `NEXT_PUBLIC_API_URL`: The URL of your deployed Render backend (including `/api`), e.g., `https://profptiy-backend.onrender.com/api`
   - Click **Deploy**. Vercel will automatically build and host your Next.js application.

2. **CORS Update**:
   - Once your Vercel deployment completes, copy the generated URL (e.g., `https://profptiy-luxury.vercel.app`).
   - Go back to your Render backend environment variables, and update `CLIENT_URL` to match this URL to allow secure CORS requests.

---

## Step 4: Database Migrations and Seeding

If you need to seed the production database with initial luxury listings and admin accounts:

1. **Run Database Push / Migrate Locally**:
   - Set the `DATABASE_URL` in `backend/.env` to your Supabase PostgreSQL URL.
   - Open terminal in the `backend` directory and run:
     ```bash
     npx prisma db push
     ```
     This will push the schema directly to your Supabase instance.
   
2. **Seed Initial Data**:
   - Run the seed script to populate settings, testimonials, listings, and default admin user (`admin@profptiy.com` with password `admin123`):
     ```bash
     npm run seed
     ```

---

## Step 5: Environment Variables Checklist

Ensure these variables are correctly configured in production:

### Backend (Render Environment)
| Variable Name | Description | Example Value |
| --- | --- | --- |
| `PORT` | Server listening port | `5000` |
| `NODE_ENV` | Mode of operation | `production` |
| `DATABASE_URL` | Supabase connection URI | `postgresql://postgres.[ID]:[PWD]@...` |
| `JWT_SECRET` | Secret key for JWT auth | `your-secure-secret-key` |
| `CLIENT_URL` | Frontend URL for CORS | `https://profptiy-luxury.vercel.app` |
| `SMTP_HOST` | SMTP Server Hostname | `smtp.resend.com` |
| `SMTP_PORT` | SMTP Port | `587` |
| `SMTP_USER` | SMTP Username | `resend` |
| `SMTP_PASS` | SMTP Password | `your-smtp-apikey` |
| `EMAIL_FROM` | From sender address | `noreply@yourdomain.com` |
| `EMAIL_TO` | Target contact address | `owner@yourdomain.com` |

### Frontend (Vercel Environment)
| Variable Name | Description | Example Value |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | API endpoint for requests | `https://profptiy-backend.onrender.com/api` |
