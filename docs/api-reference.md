# API Reference

Complete API endpoint reference for TrustFund.

---

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication:

```
Header: x-auth-token: <your_jwt_token>
```

---

## Quick Reference

### Authentication

| Method | Endpoint                | Auth | Description            |
| ------ | ----------------------- | ---- | ---------------------- |
| POST   | `/auth/register`        | ❌   | Register new user      |
| POST   | `/auth/login`           | ❌   | Login (sends OTP)      |
| POST   | `/auth/verify-otp`      | ❌   | Verify OTP, get token  |
| GET    | `/auth/me`              | ✅   | Get current user       |
| GET    | `/auth/github`          | ❌   | GitHub OAuth           |
| POST   | `/auth/forgot-password` | ❌   | Request password reset |
| POST   | `/auth/reset-password`  | ❌   | Reset password         |

### Campaigns

| Method | Endpoint                            | Auth | Description            |
| ------ | ----------------------------------- | ---- | ---------------------- |
| GET    | `/campaigns/all`                    | ❌   | List all campaigns     |
| GET    | `/campaigns/:id`                    | ❌   | Get single campaign    |
| POST   | `/campaigns/create`                 | ✅   | Create campaign        |
| DELETE | `/campaigns/:id`                    | ✅   | Delete campaign        |
| POST   | `/campaigns/donate/:id`             | ❌   | Record donation        |
| POST   | `/campaigns/:id/withdraw`           | ✅   | Withdraw funds         |
| PUT    | `/campaigns/milestone/submit-proof` | ✅   | Submit milestone proof |

### Payments

| Method | Endpoint                   | Auth | Description        |
| ------ | -------------------------- | ---- | ------------------ |
| POST   | `/payment/init`            | ✅   | Initialize payment |
| POST   | `/payment/success/:tranId` | ❌   | Success callback   |
| POST   | `/payment/fail/:tranId`    | ❌   | Failure callback   |
| POST   | `/payment/cancel/:tranId`  | ❌   | Cancel callback    |

### Users

| Method | Endpoint                | Auth | Description    |
| ------ | ----------------------- | ---- | -------------- |
| PUT    | `/users/profile-update` | ✅   | Update profile |

### Verification

| Method | Endpoint               | Auth | Description          |
| ------ | ---------------------- | ---- | -------------------- |
| POST   | `/verification/submit` | ✅   | Submit KYC documents |

### Admin

| Method | Endpoint                    | Auth     | Description               |
| ------ | --------------------------- | -------- | ------------------------- |
| GET    | `/admin/verifications`      | ✅ Admin | Get pending verifications |
| PUT    | `/admin/verify-user/:id`    | ✅ Admin | Approve/reject user       |
| GET    | `/admin/milestones/pending` | ✅ Admin | Get pending milestones    |
| PUT    | `/admin/milestone/approve`  | ✅ Admin | Approve milestone         |

### AI

| Method | Endpoint      | Auth | Description         |
| ------ | ------------- | ---- | ------------------- |
| POST   | `/ai/enhance` | ❌   | AI content features |

---

## Detailed Endpoints

### POST `/auth/register`

Register a new user account.

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

**Response:** `200 OK`

```json
{
  "message": "OTP sent to email."
}
```

**Errors:**

- `400` - User already exists
- `500` - Server error

---

### POST `/auth/login`

Login with credentials. Sends OTP to email.

**Request:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`

```json
{
  "message": "OTP sent to your email"
}
```

**Errors:**

- `400` - Invalid credentials

---

### POST `/auth/verify-otp`

Verify OTP and receive JWT token.

**Request:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "contributor"
}
```

**Errors:**

- `400` - Invalid OTP
- `400` - OTP expired

---

### GET `/auth/me`

Get current authenticated user.

**Headers:**

```
x-auth-token: <jwt_token>
```

**Response:** `200 OK`

```json
{
  "_id": "64abc...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "contributor",
  "isVerified": true,
  "avatar": "",
  "bio": "",
  "socials": {}
}
```

---

### GET `/campaigns/all`

Get all campaigns.

**Response:** `200 OK`

```json
[
  {
    "_id": "64abc...",
    "title": "Help Build a School",
    "description": "...",
    "targetAmount": 50000,
    "currentAmount": 12500,
    "category": "Education",
    "status": "active",
    "image": "http://localhost:5000/uploads/cover.jpg",
    "date": "2026-01-01T00:00:00.000Z"
  }
]
```

---

### GET `/campaigns/:id`

Get single campaign with full details.

**Response:** `200 OK`

```json
{
  "_id": "64abc...",
  "owner": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "title": "Help Build a School",
  "description": "Detailed story...",
  "targetAmount": 50000,
  "currentAmount": 12500,
  "category": "Education",
  "country": "Bangladesh",
  "zipCode": "1205",
  "beneficiaryType": "charity",
  "image": "http://localhost:5000/uploads/cover.jpg",
  "status": "active",
  "wallet": {
    "totalRaised": 12500,
    "lockedAmount": 7500,
    "availableBalance": 5000,
    "totalWithdrawn": 0
  },
  "milestones": [
    {
      "_id": "...",
      "title": "Phase 1",
      "amount": 10000,
      "status": "approved"
    }
  ],
  "donators": [
    {
      "name": "Anonymous",
      "amount": 500,
      "date": "2026-01-15T..."
    }
  ]
}
```

---

### POST `/campaigns/create`

Create a new campaign.

**Headers:**

```
x-auth-token: <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**

- `title` (string, required)
- `description` (string, required)
- `targetAmount` (number, required)
- `category` (string, required)
- `country` (string, required)
- `zipCode` (string, required)
- `beneficiaryType` (string, required)
- `image` (file, required)
- `video` (file, optional)
- `youtubeLink` (string, optional)
- `milestones` (JSON string, optional)

**Response:** `200 OK`

```json
{
  "_id": "64abc...",
  "title": "..."
  // ... full campaign object
}
```

**Errors:**

- `400` - Missing required fields
- `403` - User not verified

---

### POST `/payment/init`

Initialize SSLCommerz payment.

**Headers:**

```
x-auth-token: <jwt_token>
```

**Request:**

```json
{
  "campaignId": "64abc...",
  "amount": 500,
  "isAnonymous": false
}
```

**Response:** `200 OK`

```json
{
  "url": "https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?..."
}
```

**Errors:**

- `400` - Minimum donation is 50 BDT

---

### POST `/ai/enhance`

AI-powered content features.

**Request:**

```json
{
  "text": "Your story text here...",
  "action": "enhance"
}
```

**Actions:** `validate`, `suggest_title`, `enhance`

**Response (enhance):** `200 OK`

```json
{
  "result": "Enhanced text here..."
}
```

**Response (validate):** `200 OK`

```json
{
  "status": "valid"
}
```

**Response (suggest_title):** `200 OK`

```json
{
  "result": "Title 1 | Title 2 | Title 3 | Title 4"
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "msg": "Error message here"
}
```

Or:

```json
{
  "message": "Error message here"
}
```

---

## Status Codes

| Code  | Meaning                              |
| ----- | ------------------------------------ |
| `200` | Success                              |
| `400` | Bad Request (validation error)       |
| `401` | Unauthorized (no/invalid token)      |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found                            |
| `500` | Internal Server Error                |

---

## Rate Limiting

Currently not implemented. Consider adding for production:

- Auth endpoints: 5 requests/15 minutes
- AI endpoints: 20 requests/hour
- General: 100 requests/minute
