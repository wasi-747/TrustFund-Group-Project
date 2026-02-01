# Backend Overview

The TrustFund backend is a Node.js/Express server that provides a RESTful API for the crowdfunding platform.

---

## Architecture

```
backend/
├── server.js           # Main entry point
├── package.json        # Dependencies
├── .env               # Environment variables
├── middleware/        # Express middleware
│   ├── auth.js        # JWT authentication
│   ├── admin.js       # Admin role verification
│   └── upload.js      # File upload (Multer)
├── models/            # Mongoose schemas
│   ├── User.js
│   ├── Campaign.js
│   ├── Donation.js
│   └── Transaction.js
├── routes/            # API route handlers
│   ├── auth.js        # Authentication
│   ├── campaign.js    # Campaign CRUD
│   ├── payment.js     # Payment processing
│   ├── user.js        # User profiles
│   ├── admin.js       # Admin operations
│   ├── verification.js # KYC verification
│   └── ai.js          # AI features
├── uploads/           # Uploaded files storage
└── utils/
    └── sendEmail.js   # Email utility
```

---

## Core Technologies

| Technology      | Purpose              | Version |
| --------------- | -------------------- | ------- |
| **Express.js**  | Web framework        | v5.x    |
| **Mongoose**    | MongoDB ODM          | v9.x    |
| **Socket.IO**   | Real-time events     | v4.x    |
| **Passport.js** | OAuth authentication | v0.7    |
| **Multer**      | File uploads         | v2.x    |
| **JWT**         | Token authentication | v9.x    |
| **SSLCommerz**  | Payment gateway      | v1.2    |
| **Groq SDK**    | AI features          | v0.37   |
| **Nodemailer**  | Email sending        | v7.x    |

---

## Server Entry Point

The main server (`server.js`) initializes:

1. **Express App** - Core web framework
2. **Socket.IO** - Real-time bi-directional communication
3. **MongoDB Connection** - Database via Mongoose
4. **Session & Passport** - Authentication setup
5. **Route Registration** - All API endpoints

```javascript
// Simplified server.js structure
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Make io available to routes
app.set("io", io);

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/campaigns", require("./routes/campaign"));
app.use("/api/payment", require("./routes/payment"));
// ... more routes

server.listen(5000);
```

---

## Key Features

### 🔐 Authentication

- JWT-based authentication
- OTP verification via email
- GitHub OAuth integration
- Role-based access control (admin, fundraiser, contributor)

### 📦 Campaign Management

- Full CRUD operations
- Image/video uploads
- Milestone-based fund release
- Escrow wallet system

### 💰 Payment Processing

- SSLCommerz integration (Bangladesh)
- Secure donation flow
- Transaction logging
- Email notifications on donation

### 🔄 Real-time Updates

- Socket.IO for live notifications
- Donation received events
- Fund withdrawal events

### 🤖 AI Integration

- Story validation
- Content enhancement
- Title suggestions

---

## Security Features

| Feature          | Implementation               |
| ---------------- | ---------------------------- |
| Password Hashing | bcryptjs with salt rounds    |
| JWT Tokens       | 5-day expiration             |
| CORS             | Whitelist-based origins      |
| File Upload      | Size limits, type validation |
| KYC Verification | NID document upload          |
| Admin Protection | Role-based middleware        |

---

## Related Documentation

- [API Routes](api.md) - Complete API endpoint reference
- [Data Models](models.md) - Mongoose schema documentation
- [Middleware](middleware.md) - Authentication & upload middleware
- [WebSocket Events](websockets.md) - Real-time event reference
