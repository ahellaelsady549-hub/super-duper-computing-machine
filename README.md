# REFLECT Graduation Events & Supplies

## Phase 1–5

### Phase 5: Admin Dashboard
Implemented:
- Admin-only JWT-protected API
- Admin dashboard statistics
- Product CRUD
- Category CRUD
- Customer listing
- Retail order management
- Retail order status/payment status updates
- Group-order management
- Group-order status updates
- Quote creation from group orders
- Quote management/status updates
- Revenue summary
- Recent orders and group requests
- Responsive admin UI
- Admin login
- Admin session/logout

### Admin access
For local development, open the site and double-click the REFLECT logo to open the admin login screen.

The admin account can be created by the existing seed script when:
```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

Then:
```bash
cd backend
npm run seed
```

### Important security note
Admin APIs require both a valid JWT and the `admin` role. Customer tokens cannot access `/api/admin/*`.

### Phase 5 APIs
- GET `/api/admin/dashboard`
- CRUD `/api/admin/products`
- CRUD `/api/admin/categories`
- GET `/api/admin/customers`
- GET/PUT `/api/admin/orders`
- GET/PUT `/api/admin/group-orders`
- GET/POST/PUT `/api/admin/quotes`

Image/media upload management can be expanded in the next hardening phase; product CRUD currently accepts image URLs and gallery URLs.

## Phase 6
- Product reviews with moderation (pending/approved/rejected)
- Customer notifications center
- FAQ management and public FAQ section
- Gallery management and public gallery section
- WhatsApp contact CTA
- Engagement/content admin section

## Gen Z visual refresh
- First screen is the customer authentication experience (register/login) before the storefront.
- Brand logo uses the supplied REFLECT graduation logo asset.
- Egyptian Arabic / casual Gen-Z copy on the auth experience and footer.
- Added responsive split-screen auth layout, neon/electric accent gradients, micro-interactions, floating elements, focus states and reduced-motion support.
- Added a richer storefront footer with quick links and social placeholders.
- Preview: `preview.html`

## Payment demo + customer tracking
- Checkout supports simulated Paymob, Fawry, and bank transfer methods.
- Bank transfer supports Banque Misr, National Bank of Egypt, and Alexandria Bank as selectable demo banks.
- Customer account includes purchase history and a dedicated order-tracking timeline.
- Admin login email is prefilled as `reflect@gmail.com`; configure `ADMIN_PASSWORD` in the backend `.env` and run the seed to create/update that admin account.
- No real payment gateway is connected in this version.
