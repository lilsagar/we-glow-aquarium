# We-Glow Aquarium

Premium aquarium ecommerce demo (Nepal, NPR) built with Next.js 16, Tailwind CSS 4, Firebase Firestore, and Firebase Auth for admin.

## Getting started

```bash
cp env.example .env.local
# Add Firebase web app credentials and admin emails
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin dashboard: [/admin/login](http://localhost:3000/admin/login).

On first run, an empty Firestore `products` collection is seeded from `data/products.ts`.

## Firebase & Vercel

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Firestore rules, admin auth setup, and Vercel environment variables.
