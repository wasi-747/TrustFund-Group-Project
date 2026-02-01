# Authentication

Complete guide to the TrustFund authentication system.

---

## Overview

TrustFund implements a secure multi-factor authentication system:

1. **Email/Password** - Traditional credentials
2. **OTP Verification** - 6-digit code sent via email
3. **JWT Tokens** - Stateless session management
4. **OAuth** - GitHub social login

---

## Authentication Flow

### Registration

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Register  │ ──▶ │  OTP Sent   │ ──▶ │   Verify    │
│    Form     │     │  to Email   │     │    OTP      │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Login     │
                                        │   Page      │
                                        └─────────────┘
```

### Login

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │ ──▶ │  OTP Sent   │ ──▶ │   Verify    │
│    Form     │     │  to Email   │     │    OTP      │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  JWT Token  │
                                        │  Returned   │
                                        └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  Dashboard  │
                                        └─────────────┘
```

---

## JWT Token

### Structure

The JWT contains:

```json
{
  "user": {
    "id": "mongodb_user_id",
    "role": "contributor"
  },
  "iat": 1706745600,
  "exp": 1707177600
}
```

### Configuration

- **Expiration**: 5 days
- **Algorithm**: HS256
- **Secret**: Configured via `JWT_SECRET` env variable

### Frontend Storage

```javascript
// After successful OTP verification
localStorage.setItem("token", response.data.token);

// Include in API requests
axios.defaults.headers.common["x-auth-token"] = token;
```

### Backend Verification

```javascript
// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
```

---

## OTP System

### Generation

```javascript
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
```

### Storage

OTP is stored in the User document:

```javascript
user.otp = otp;
user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
await user.save();
```

### Verification

```javascript
if (user.otp !== otp) {
  return res.status(400).json({ message: "Invalid OTP" });
}
if (user.otpExpires < Date.now()) {
  return res.status(400).json({ message: "OTP Expired" });
}

// Clear OTP after use
user.otp = undefined;
user.otpExpires = undefined;
```

### Email Template

```
Subject: Login Verification

Your Login OTP is: 123456

This code expires in 10 minutes.
```

---

## GitHub OAuth

### Setup

1. Create OAuth App at GitHub Developer Settings
2. Configure callback URL: `http://localhost:5000/api/auth/github/callback`
3. Set environment variables:
   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

### Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Click      │ ──▶ │  GitHub     │ ──▶ │  Callback   │
│  "GitHub"   │     │  Auth Page  │     │  Handler    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Create/Find │
                                        │    User     │
                                        └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  Redirect   │
                                        │  with JWT   │
                                        └─────────────┘
```

### Implementation

```javascript
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        // Create new user
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          githubId: profile.id,
          isVerified: true,
        });
        await user.save();
      }

      return done(null, user);
    },
  ),
);
```

---

## Password Reset

### Request Reset

```
POST /api/auth/forgot-password
{ "email": "user@example.com" }
```

1. Generate reset token
2. Save hashed token with expiry (1 hour)
3. Send email with reset link

### Reset Password

```
POST /api/auth/reset-password
{
  "token": "reset_token",
  "password": "new_password"
}
```

1. Verify token not expired
2. Hash new password
3. Update user
4. Clear reset token

---

## Role-Based Access

### User Roles

| Role          | Description          |
| ------------- | -------------------- |
| `admin`       | Full platform access |
| `fundraiser`  | Can create campaigns |
| `contributor` | Can donate only      |

### Frontend Protection

```jsx
// AdminRoute.jsx
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  const decoded = jwtDecode(token);
  if (decoded.user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};
```

### Backend Protection

```javascript
// Admin-only middleware
const adminCheck = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Access Denied: Admins Only" });
  }
};

// Usage
router.get("/admin/data", auth, adminCheck, handler);
```

---

## Security Best Practices

### Password Handling

- Passwords hashed with bcryptjs (10 salt rounds)
- Never stored in plain text
- Never returned in API responses

```javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

### Token Security

- Use HTTPS in production
- Short token expiration
- Secure cookie options for sessions

### Rate Limiting (Recommended)

```javascript
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts",
});

router.post("/login", loginLimiter, handler);
```

---

## Troubleshooting

??? question "OTP not received" - Check spam folder - Verify email configuration in `.env` - Check server logs for email errors

??? question "Token expired errors" - Tokens expire after 5 days - Re-login to get new token - Check system clock sync

??? question "GitHub OAuth failing" - Verify callback URL matches exactly - Check client ID/secret - Ensure proper scopes (user:email)
