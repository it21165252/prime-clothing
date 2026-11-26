# Prime Clothing

Customer storefront for **primeclothing.lk**, the biker-focused clothing line from the Prime Racing family.
Built with Vite, React 19, TypeScript, Tailwind CSS v4 and Framer Motion. Started from the Prime Racing web app as a template, stripped down to the customer side only.

## Run locally

```bash
npm install
npm run dev -- --port 5174
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home: hero, category tiles, new arrivals, "Built for the ride" banner, best sellers, newsletter |
| `/collections/:handle` | Collection with filter and sort (`all`, `new-in`, `best-sellers`, `tees`, `hoodies`, `jackets`, `pants`, `riding-gear`, `accessories`) |
| `/search?q=` | Search results (same grid and filters) |
| `/products/:slug` | Product page: gallery, colour, size, size guide, add to bag, accordions, related products |
| `/cart` | Bag page (the bag drawer opens from the header) |
| `/checkout` | Checkout (cash on delivery, bank transfer, card placeholder) |
| `/order-confirmation/:id` | Order confirmation |
| `/account/login` | Sign in / join |
| `/account` | Profile with order history and details |
| `/pages/:slug` | Info pages (`delivery`, `returns`, `size-guide`, `contact`, `about`, `terms`, `privacy`) |

## Data and backend (demo)

- `src/data/products.ts` is a **demo catalogue** (20 products) using Unsplash stock photos. Replace with real products and photography.
- Auth, orders and newsletter signups run against a **localStorage mock** (`src/services/mock.ts`) behind the interfaces in `src/services/types.ts`.
  `src/services/index.ts` is the single switch point. To go live, create a dedicated Prime Clothing Supabase project (do not reuse Prime Racing's), implement the same interfaces, and fill in `.env.local` from `.env.example`.
- The cart persists in localStorage with colour and size variants.

## Coming Soon page

`primeclothing.lk` and `www.primeclothing.lk` show only a Coming Soon page (every route, no header or footer).
Everything else (localhost, 127.0.0.1, LAN IPs, `*.vercel.app`) shows the full store. The logic lives in `src/lib/comingSoon.ts` and is applied in `src/main.tsx`; the page is `src/pages/ComingSoonPage.tsx`.

- **Preview locally:** open http://localhost:5174/coming-soon or add `?coming-soon=1` to any URL (works on Vercel previews too).
- **Force on or off:** set `VITE_COMING_SOON=true` (show it everywhere) or `VITE_COMING_SOON=false` (never show it, e.g. on launch day). Leave it empty to use the domain rule.
- Notify-me signups are stored in the browser only (demo newsletter service) until a backend exists.
