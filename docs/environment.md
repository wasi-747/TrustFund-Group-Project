# Environment Variables

This page documents all environment variables required for the TrustFund backend.

---

## Configuration File

Create a `.env` file in the `backend/` directory with the following variables:

```env
# ===========================================
# SERVER CONFIGURATION
# ===========================================
PORT=5000
MONGO_URI=mongodb://localhost:27017/trustfund
SERVER_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# ===========================================
# AUTHENTICATION
# ===========================================
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_session_secret_here

# ===========================================
# PAYMENT GATEWAY (SSLCommerz)
# ===========================================
STORE_ID=your_sslcommerz_store_id
STORE_PASS=your_sslcommerz_store_password
IS_LIVE=false

# ===========================================
# AI SERVICES (Groq)
# ===========================================
GROQ_API_KEY=gsk_your_groq_api_key

# ===========================================
# EMAIL SERVICE (Nodemailer)
# ===========================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# ===========================================
# OAUTH PROVIDERS (Optional)
# ===========================================
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

---

## Variable Reference

### Server Configuration

| Variable       | Required | Description                       | Example                               |
| -------------- | -------- | --------------------------------- | ------------------------------------- |
| `PORT`         | Yes      | Port for the Express server       | `5000`                                |
| `MONGO_URI`    | Yes      | MongoDB connection string         | `mongodb://localhost:27017/trustfund` |
| `SERVER_URL`   | Yes      | Full backend URL (for callbacks)  | `http://localhost:5000`               |
| `FRONTEND_URL` | Yes      | Full frontend URL (for redirects) | `http://localhost:5173`               |

### Authentication

| Variable         | Required | Description                      | Example                  |
| ---------------- | -------- | -------------------------------- | ------------------------ |
| `JWT_SECRET`     | Yes      | Secret key for JWT token signing | Any secure random string |
| `SESSION_SECRET` | Yes      | Secret for express-session       | Any secure random string |

!!! danger "Security Warning"
Never commit your `.env` file to version control. Add it to `.gitignore`.

### Payment Gateway (SSLCommerz)

| Variable     | Required | Description                  | Example                            |
| ------------ | -------- | ---------------------------- | ---------------------------------- |
| `STORE_ID`   | Yes      | SSLCommerz merchant store ID | `test_store_123`                   |
| `STORE_PASS` | Yes      | SSLCommerz store password    | `test_store_123@ssl`               |
| `IS_LIVE`    | Yes      | Production mode flag         | `false` (sandbox) or `true` (live) |

!!! info "Getting SSLCommerz Credentials" 1. Register at [SSLCommerz](https://sslcommerz.com) 2. Create a store in sandbox mode for testing 3. Use sandbox credentials during development

### AI Services (Groq)

| Variable       | Required | Description                  | Example            |
| -------------- | -------- | ---------------------------- | ------------------ |
| `GROQ_API_KEY` | No\*     | API key for Groq AI services | `gsk_xxxxxxxxxxxx` |

\*Required only if using AI story enhancement features.

!!! tip "Getting a Groq API Key" 1. Sign up at [console.groq.com](https://console.groq.com) 2. Generate an API key from the dashboard 3. Free tier available for development

### Email Service

| Variable     | Required | Description                    | Example               |
| ------------ | -------- | ------------------------------ | --------------------- |
| `EMAIL_HOST` | Yes      | SMTP server host               | `smtp.gmail.com`      |
| `EMAIL_PORT` | Yes      | SMTP server port               | `587`                 |
| `EMAIL_USER` | Yes      | Email sender address           | `noreply@example.com` |
| `EMAIL_PASS` | Yes      | Email password or app password | App-specific password |

!!! warning "Gmail Configuration"
For Gmail, you must:

    1. Enable 2-Factor Authentication on your Google account
    2. Generate an **App Password** (not your regular password)
    3. Go to: Google Account → Security → 2-Step Verification → App passwords

### OAuth Providers (Optional)

| Variable               | Required | Description                    |
| ---------------------- | -------- | ------------------------------ |
| `GITHUB_CLIENT_ID`     | No       | GitHub OAuth App Client ID     |
| `GITHUB_CLIENT_SECRET` | No       | GitHub OAuth App Client Secret |

!!! info "Setting up GitHub OAuth" 1. Go to GitHub → Settings → Developer settings → OAuth Apps 2. Create a new OAuth App 3. Set Authorization callback URL to: `http://localhost:5000/api/auth/github/callback`

---

## Environment-Specific Configurations

### Development

```env
PORT=5000
IS_LIVE=false
FRONTEND_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

### Production

```env
PORT=5000
IS_LIVE=true
FRONTEND_URL=https://your-domain.com
SERVER_URL=https://api.your-domain.com
```

---

## Validation

To verify your environment is configured correctly:

```bash
cd backend
node test_key.js  # If available
```

Or start the server and check for connection messages:

```bash
npm start
# Should show: ✅ MongoDB Connected!
```
