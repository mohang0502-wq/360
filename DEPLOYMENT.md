# Deployment

The project has two parts:

| Part | What it is | Build / start |
| --- | --- | --- |
| Frontend | React + Vite SPA, built to `dist/` (single `index.html` + the `public/` assets) | `npm run build` |
| API | Express + MySQL CMS API in `server/`, serves uploads from `server/uploads/` | `npm run server` |

## 1. Prerequisites

- Node.js 20+ and npm
- MySQL 8
- A reverse proxy with HTTPS (nginx examples below)

## 2. Environment

Copy `.env.example` to `.env` on the server and fill it in. Required in production:

| Variable | Notes |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| `NODE_ENV=production` | Enables production safeguards |
| `JWT_SECRET` | ≥ 32 random characters — the API will not start without it |
| `CORS_ORIGIN` | Your site origin(s), e.g. `https://360retouching.com,https://www.360retouching.com` |
| `VITE_API_URL` | Public API URL. **Read at build time** — rebuild the frontend after changing it |

Optional: `SMTP_*`, `SMTP_FROM`, `CONTACT_TO` for contact-form email notifications. Without them enquiries are still saved and visible in **Admin → Inquiries**.

## 3. Database

Fresh install:

```bash
mysql -u root -p -e "CREATE DATABASE 360_retouching CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
mysql -u root -p 360_retouching < server/schema.sql
npm run import:image-library   # optional: fills the portfolio from public/images
```

`schema.sql` is already current. `migrate:categories`, `migrate:site-settings` and `migrate:image-library` are only for **upgrading an older database** created before those columns existed.

Existing database (one-off, safe to re-run, preview first with `--dry`):

```bash
npm run migrate:image-urls -- --dry
npm run migrate:image-urls
```

This rewrites stored image URLs that contain a hard-coded host (`http://localhost:4000/uploads/…`) or an encoded `&` (`%26`) — the frontend already tolerates both, this just cleans the data.

**Change the admin password immediately** after first login (Admin → Settings). The seeded account `admin@360.com` uses a password that is visible in the source code.

## 4. Build and run

```bash
npm ci
npm run build                      # frontend → dist/
NODE_ENV=production npm run server # API on $PORT (default 4000)
```

Keep the API running with a process manager, e.g. `pm2 start server/api.js --name 360-api`.

`server/uploads/` holds every CMS upload — keep it on persistent storage and include it in backups together with the database. It is not in git.

## 5. nginx

```nginx
# Frontend
server {
  server_name 360retouching.com;
  root /var/www/360/dist;
  location / { try_files $uri $uri/ /index.html; }   # SPA routes + 404 page
  location ~* \.(jpg|jpeg|png|webp|avif|gif|svg)$ { expires 30d; access_log off; }
}

# API
server {
  server_name api.360retouching.com;
  client_max_body_size 12m;          # uploads are capped at 10 MB by the API
  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## 6. Verify

```bash
curl https://api.360retouching.com/api/health      # {"ok":true,"status":"mysql-connected"}
```

Against a **development / staging** API (never production — it creates and deletes test records):

```bash
API_URL=http://localhost:4000 ADMIN_PASSWORD=… npm run test:api
```

## Operational notes

- Health check: `GET /api/health`
- Logs: server errors are written to stdout/stderr (captured by pm2/systemd)
- No background jobs or scheduled tasks are required
- Login is throttled to 10 failed attempts per IP per 15 minutes (in memory — resets on restart)
