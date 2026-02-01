# Setup and Installation

Follow these steps to get the TrustFund project running locally.

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download                           |
| -------- | ------- | ---------------------------------- |
| Node.js  | v18+    | [nodejs.org](https://nodejs.org)   |
| MongoDB  | v6+     | [mongodb.com](https://mongodb.com) |
| Git      | Latest  | [git-scm.com](https://git-scm.com) |

!!! note "MongoDB Options"
You can use either:

    - **Local MongoDB**: Install MongoDB Community Server
    - **MongoDB Atlas**: Free cloud-hosted database (recommended for beginners)

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TrustFund-Week1
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

!!! warning "Environment Configuration Required"
You must create a `.env` file before starting the server. See the [Environment Variables](environment.md) page for complete configuration.

Quick `.env` setup:

```env
# Server
PORT=5000
MONGO_URI=mongodb://localhost:27017/trustfund

# Authentication
JWT_SECRET=your_super_secret_jwt_key
SESSION_SECRET=your_session_secret

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# Payment Gateway (SSLCommerz)
STORE_ID=your_store_id
STORE_PASS=your_store_password
IS_LIVE=false

# AI (Groq)
GROQ_API_KEY=your_groq_api_key

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# OAuth (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Start the backend server:

=== "Production"
`bash
    npm start
    `

=== "Development (with auto-reload)"
`bash
    npx nodemon server.js
    `

The server will run on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

---

## Running the Application

Once both servers are running:

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account or login
3. Verify your account via email OTP
4. Start exploring campaigns!

### Default Ports

| Service     | URL                         | Description              |
| ----------- | --------------------------- | ------------------------ |
| Frontend    | `http://localhost:5173`     | React development server |
| Backend API | `http://localhost:5000`     | Express API server       |
| MongoDB     | `mongodb://localhost:27017` | Database (if local)      |

---

## Troubleshooting

??? question "MongoDB Connection Failed" - Ensure MongoDB is running locally or your Atlas URI is correct - Check if the `MONGO_URI` in `.env` is properly formatted - Verify network connectivity for cloud databases

??? question "CORS Errors" - The backend allows `http://localhost:5173` and `http://localhost:3000` by default - Update the CORS configuration in `server.js` if using different ports

??? question "Email OTP Not Received" - Check your spam/junk folder - Verify email credentials in `.env` - For Gmail, use an App Password (not your regular password)

??? question "Payment Gateway Errors" - Ensure SSLCommerz sandbox credentials are correctly set - Set `IS_LIVE=false` for testing

---

## Next Steps

- [Configure Environment Variables](environment.md)
- [Explore the API](backend/api.md)
- [Understand the Data Models](backend/models.md)
