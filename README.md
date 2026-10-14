# Hearthly Bakehouse

A bakery website with online ordering and a staff dashboard, built with **Next.js 16**, **React 19**, **Tailwind CSS** and **Firebase** (Auth + Firestore).

- **Storefront:** homepage, menu with categories and search, product pages with pack sizes, cart, Cash on Delivery checkout, table booking, contact form, recipes, about page and customer accounts.
- **Dashboard (`/admin`):** overview stats and revenue chart, orders (status updates, stock tracking, CSV export, printable order slips, abandoned checkouts), products, reservations, messages, customers and team roles, and store settings.
- **Local demo mode:** try the whole site and dashboard on `localhost` before Firebase is set up.

---

## Quick start

Requires **Node.js 20 or newer**.

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:3000>. With no Firebase keys set, the site runs in **local demo mode** (see below).

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |

---

## Local demo mode

When Firebase is **not** configured and the site is opened on a local host (`localhost`, `127.0.0.1`, `*.localhost`), sign-in and data run entirely in your browser:

- Go to **`/login`**. A **"Local demo mode"** panel offers one-click sign-in as **Admin**, **Manager**, **Confirmer** or **Customer**.
- The demo accounts (emails and password) are defined in [`src/data/demo.js`](src/data/demo.js).
- The dashboard comes with sample orders from the last two weeks, table bookings, messages, customers and the full menu.
- Everything you change (orders, products, settings, roles, new orders from checkout) is saved in the browser's `localStorage`.
- A **Demo mode** badge in the bottom-right corner has a **Reset** button that restores the sample data.

Limits: data stays in that one browser; Google sign-in, password reset and order emails are off; uploaded images are resized and stored in the browser instead of ImgBB.

Demo mode switches off automatically as soon as the Firebase keys are in `.env.local`, and it never runs on a deployed site.

---

## Connecting Firebase

1. Create a project in the [Firebase console](https://console.firebase.google.com) and add a **Web app**.
2. Enable **Authentication → Sign-in method → Email/Password** (and **Google** if you want it).
3. Create a **Firestore database** (production mode).
4. Copy the env file and fill in the web app config:

   ```bash
   cp .env.example .env.local
   ```

5. Put your project ID in [`.firebaserc`](.firebaserc), then deploy the security rules (needs the [Firebase CLI](https://firebase.google.com/docs/cli)):

   ```bash
   firebase deploy --only firestore:rules
   ```

6. Restart `npm run dev`.

### Create the first admin

Roles are stored on each user's document in Firestore (`users/{uid}.role`), not as separate logins.

1. In [`firestore.rules`](firestore.rules), add your email to `bootstrapAdmins()`, e.g. `return ["you@example.com"];`, and deploy the rules.
2. Register at `/register` and verify your email from the link Firebase sends.
3. Sign in, open `/admin` and click **Claim admin access**.
4. Remove your email from `bootstrapAdmins()` and deploy the rules again.

From then on, give staff their roles in **Dashboard → Customers & Team**.

### Load the menu

The storefront shows a built-in sample menu until Firestore has products. In **Dashboard → Overview**, click **Import sample menu** to copy it into Firestore and start editing, or add your own products.

---

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase web app config |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical site URL for the sitemap and metadata, e.g. `https://www.example.com` |
| `IMGBB_API_KEY` | For uploads | Image uploads from the dashboard ([imgbb.com](https://api.imgbb.com)) |
| `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY` | Optional | Email alert to the admin for every new order ([EmailJS](https://www.emailjs.com)) |
| `ADMIN_EMAIL` | Optional | Where new-order emails are sent |

`.env.local` is git-ignored. Never commit real keys. **Dashboard → Settings → Integrations** shows whether email alerts are configured.

---

## Roles and permissions

| Role | Can do |
| --- | --- |
| **admin** | Everything, including changing team roles and deleting orders |
| **manager** | Orders, products, reservations, messages and store settings |
| **confirmer** | View the dashboard, update order and reservation status |
| **customer** | No dashboard access; sees their own orders at `/account` |

Permissions are enforced twice: in the UI ([`src/lib/admin.js`](src/lib/admin.js)) and in [`firestore.rules`](firestore.rules), which is what actually protects the data.

---

## Firestore collections

| Collection | Contents | Written by |
| --- | --- | --- |
| `products` | Menu items (title, category, price, pack-size options, stock, images, ingredients) | Admin / manager |
| `orders` | Cash on Delivery orders with items, address and status | Checkout (create), staff (status, notes) |
| `checkouts` | Unfinished checkouts, shown as "Incomplete" in Orders | Checkout |
| `reservations` | Table bookings from `/book-a-table` | Visitors (create), staff (status) |
| `messages` | Contact form messages | Visitors (create), staff (read/unread) |
| `users` | Profiles and roles; also stores signed-in customers' carts | Users / admin |
| `settings/store` | Homepage text and images, delivery charges, contact details, social links | Admin / manager |
| `email_indices` | Email → uid lookup for password reset checks | Auth flow |

Order status flow: **Pending → Confirmed → Baking → Out for Delivery → Delivered** (or **Cancelled**). Confirming an order deducts stock, and cancelling a confirmed order puts the stock back.

---

## Project structure

```
src/
  app/                    Routes (App Router)
    page.jsx              Homepage
    products/             Menu and product pages
    about/ recipes/ contact/ book-a-table/
    checkout/ login/ register/ account/
    admin/                Dashboard: overview, orders, products, reservations,
                          messages, customers, settings
    api/upload            Image upload to ImgBB (staff only)
    api/send-email        New-order email via EmailJS
  components/
    home/                 Homepage sections (Hero, MenuCategories, BakedWithLove, ...)
    layout/               Navbar, Footer, CartDrawer
    product/              Menu grid, product card, product detail
    admin/                Dashboard UI kit, product form, image cropper, order slips
    ui/                   Logo, decorative doodles, demo badge
  context/                Auth, cart, products, settings, toasts
  data/                   Sample menu, demo data, Pakistan provinces/cities, image map
  lib/
    config.js             Store name, categories, nav links, default settings, currency
    db.js                 Firestore calls (switches to the demo store in demo mode)
    firebase.js           Firebase initialisation
    demo*.js              Local demo mode (detection, data store, sign-in)
    server/               Server-side product loading and revalidation
public/images/            Homepage photos and cut-outs (see CREDITS.md)
firestore.rules           Security rules
```

---

## Customising

- **Store name and logo text:** `STORE_NAME`, `STORE_DOMAIN` and `STORE_FULL_NAME` in [`src/lib/config.js`](src/lib/config.js).
- **Colours:** the `forest`, `honey`, `cream` and `tile` colours in [`tailwind.config.js`](tailwind.config.js).
- **Fonts:** Montserrat (headings and body) and Caveat (handwritten accents), loaded in [`src/app/layout.jsx`](src/app/layout.jsx).
- **Categories and navigation:** `CATEGORIES` and `NAV_LINKS` in `src/lib/config.js`.
- **Homepage text and images, delivery charges, contact details:** edit them live in **Dashboard → Settings**.
- **Homepage photos:** replace the files in [`public/images/`](public/images) with your own, keeping the same names. Sources and licences for the current placeholders are in [`public/images/CREDITS.md`](public/images/CREDITS.md).
- **Currency and checkout region:** prices are in Pakistani rupees (`formatPrice` in `src/lib/config.js`), and checkout and Firestore rules expect a Pakistani address and mobile number (`src/data/pakistan.js`, `firestore.rules`).

---

## Deploying

The site deploys to any Next.js host. On **Vercel**:

1. Import the repository.
2. Add the environment variables from the table above, including `NEXT_PUBLIC_SITE_URL`.
3. In Firebase → Authentication → Settings, add your domain to **Authorized domains**.
4. Make sure the Firestore rules are deployed (`firebase deploy --only firestore:rules`).

Product pages are pre-rendered and refreshed hourly. Saving a product in the dashboard revalidates its page right away.
