# Deploying We-Glow Aquarium on Vercel

## 1. Firebase project

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** → Sign-in method → **Email/Password**.
3. Create an admin user (Authentication → Users → Add user).
4. Enable **Cloud Firestore** (production mode).
5. Register a **Web app** and copy the config values.

## 2. Firestore rules

Deploy the rules in `firebase/firestore.rules` (Firebase Console → Firestore → Rules, or Firebase CLI):

- **products**: public read; write requires signed-in user (restrict emails in production via custom claims or tighten rules with your admin email list).
- **orders**: anyone can **create** at checkout; only signed-in users can read/update (admin dashboard).

For stricter admin-only writes, replace `isAdmin()` with an email allowlist or Firebase custom claims.

## 3. Environment variables on Vercel

In Vercel → Project → Settings → Environment Variables, add the same keys as `env.example`:

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Web app config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Optional; defaults to `{projectId}.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Optional |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Comma-separated emails allowed for `/admin` |

Redeploy after changing env vars.

## 4. Local development

```bash
cp env.example .env.local
# fill in Firebase values
npm install
npm run dev
```

On first load, the catalog seeds Firestore from `data/products.ts` if the `products` collection is empty.

## 5. Vercel deploy

```bash
npm run build
```

Connect the Git repository to Vercel or run `vercel` from the CLI. No extra build settings are required for the default Next.js App Router setup.

## 6. Post-deploy checks

- Storefront loads products from Firestore (`/products`, product detail pages).
- Checkout creates an order document in `orders`.
- `/admin/login` accepts your admin email/password.
- Admin can add/edit/delete products and change order status.
