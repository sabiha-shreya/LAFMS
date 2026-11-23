# Campus Lost & Found Management System
## Vercel Deployment Guide

> **Backend converted**: PHP → Node.js/Express (serverless-ready)
> **UI preserved**: Zero visual changes — every page looks identical to the original

---

## Project Structure

```
LAFMS/
├── api/
│   └── index.js          ← Express app (Vercel serverless entrypoint)
├── lib/
│   ├── auth.js           ← Session middleware, bcrypt, CSRF helpers
│   ├── db.js             ← MySQL + embedded SQLite (sql.js) dual-mode DB
│   ├── matching.js       ← Item matching algorithm (PHP similar_text port)
│   └── seedData.js       ← Pre-seeded demo data from your MySQL dump
├── views/                ← HTML generators (1:1 replicas of PHP pages)
├── css/                  ← Original CSS files (unchanged)
├── images/               ← Original images (unchanged)
├── uploads/              ← User-uploaded images
├── js/                   ← Original JS files (unchanged)
├── *.html                ← Original login/register HTML files (unchanged)
├── server.js             ← Local dev server (node server.js)
├── vercel.json           ← Vercel deployment config
├── .env.example          ← Environment variable template
└── package.json
```

---

## Running Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
npm start
# or
node server.js
```

### 3. Open in browser
| Page | URL |
|------|-----|
| **User Login** | http://localhost:3000/login.html |
| **Register** | http://localhost:3000/register.html |
| **Dashboard** | http://localhost:3000/dashboard.php |
| **Admin Login** | http://localhost:3000/admin-login.html |
| **Admin Dashboard** | http://localhost:3000/admin-dashboard.php |

### Demo Credentials (pre-loaded from your database)
| Role | Email / Username | Password |
|------|-----------------|----------|
| **User** | shreyasabiha@gmail.com | 123456 |
| **User** | sabihajahan870@gmail.com | 1234567 |
| **Admin** | admin | 12345 |

> **No database setup needed for local testing** — the app automatically uses an embedded SQLite database pre-loaded with all your demo data.

---

## Deploying to Vercel

### Option A: Via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Vercel-ready"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click **"Import Git Repository"**
   - Select your repository

3. **Set environment variables** (in Vercel Project → Settings → Environment Variables):

   ```
   SESSION_SECRET = any_long_random_string_here
   ```

   For a real MySQL database (optional — without it, embedded SQLite runs):
   ```
   DATABASE_URL = mysql://user:password@host:3306/campus_lost_found
   ```

4. **Deploy** — Click Deploy and your site goes live!

---

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from your project directory
cd E:\Antigravity\LAFMS
vercel

# Follow the prompts, then set env variables
vercel env add SESSION_SECRET
# Type your secret and press Enter
```

---

## Connecting a Free Cloud MySQL Database

For persistent data on Vercel (instead of embedded SQLite), connect any free MySQL service:

| Service | Free Tier | Setup |
|---------|-----------|-------|
| **TiDB Serverless** | 5GB free | [tidbcloud.com](https://tidbcloud.com) |
| **Railway** | 500MB free | [railway.app](https://railway.app) |
| **Aiven** | 5GB trial | [aiven.io](https://aiven.io) |

### Setup steps:
1. Create a free MySQL database on any of the above
2. Import your schema by running the **`Dump20261122.sql`** file in their SQL console
3. Copy the connection URL and add to Vercel env variables:
   ```
   DATABASE_URL = mysql://user:pass@host:port/campus_lost_found?ssl={"rejectUnauthorized":true}
   ```
4. Redeploy (`vercel --prod` or push to GitHub)

---

## How It Works

### Session Persistence (Serverless-safe)
Instead of PHP file-based sessions (which break across serverless invocations), the app uses **`cookie-session`** — session data is encrypted and stored in the user's browser cookie. This means:
- Sessions persist across any number of serverless Lambda invocations
- No server-side session storage needed
- Works identically on Vercel, Railway, or any host

### Database Fallback
```
Has DATABASE_URL or DB_HOST? → Connect to MySQL
No database credentials?     → Use embedded SQLite (sql.js)
```
The embedded SQLite is pre-loaded with all your demo data, so the app works **out of the box** with zero configuration.

### File Uploads
- **Local**: Files saved to `uploads/` folder
- **Vercel**: Files saved to `/tmp/lafms_uploads/` (ephemeral, Vercel's writable temp dir)
  - For persistent uploads on Vercel, connect **Vercel Blob** or **Cloudinary** and update `api/index.js` multer storage

---

## All Supported URLs

All original `.php` URLs continue to work exactly as before:

### User Routes
| URL | Description |
|-----|-------------|
| `/login.html` | User login page |
| `/register.html` | Registration page |
| `POST /login.php` | Login form handler |
| `POST /register.php` | Register form handler |
| `/dashboard.php` | User dashboard |
| `/add-lost-item.php` | Report a lost item |
| `/add-found-item.php` | Report a found item |
| `/view-items.php` | Browse all approved items |
| `/item-details.php?id=X&type=lost\|found` | Item details |
| `/search-item.php` | Search items |
| `/my-matches.php` | View your matches |
| `/view-claim.php?match_id=X` | View a claim |
| `/approved-claim-details.php?match_id=X` | Approved claim details |
| `/notifications.php` | Notifications |
| `POST /claim-item.php` | Submit a claim |
| `POST /approve-claim.php` | Approve a claim (finder) |
| `POST /reject-claim.php` | Reject a claim (finder) |
| `POST /match-action.php` | Confirm receipt/return |
| `POST /mark-notification-read.php` | Mark notification read (AJAX) |
| `POST /delete-notification.php` | Delete notification (AJAX) |
| `/logout.php` | Logout |

### Admin Routes
| URL | Description |
|-----|-------------|
| `/admin-login.html` | Admin login page |
| `POST /admin-login.php` | Admin login handler |
| `/admin-dashboard.php` | Admin dashboard |
| `/pending-posts.php` | Review pending posts |
| `POST /approve-post.php` | Approve a post + run matching |
| `POST /reject-post.php` | Reject a post |
| `/delete-posts.php` | Delete posts |
| `/manage-users.php` | Manage registered users |
| `/returned-items.php` | View returned items |
| `/admin-approved-claims.php` | View all approved claims |
| `/view-lost-items.php` | Browse all lost items |
| `/view-found-items.php` | Browse all found items |
| `/admin-logout.php` | Admin logout |

