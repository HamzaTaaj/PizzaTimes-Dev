# How to Start Server for Blog API

## Problem
The blog API endpoint needs a server running. You have two options:

## Option 1: Start server.js (Recommended for Local Dev)

```bash
# Terminal 1 - Start backend server
node server.js

# Terminal 2 - Start frontend
npm run dev
```

Or use the combined command:
```bash
npm run dev:local
```

## Option 2: Use Vercel Dev (For Production-like Environment)

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Start Vercel dev server (runs serverless functions locally)
vercel dev
```

## Option 3: Deploy to Vercel

The `/api/get-shopify-blogs.ts` file will work automatically when deployed to Vercel.

Make sure to set these environment variables in Vercel:
- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_ADMIN_ACCESS_TOKEN`
