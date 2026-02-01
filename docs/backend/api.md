# API Routes

Complete reference for all backend API endpoints.

---

## Route Overview

| Prefix              | Handler           | Description              |
| ------------------- | ----------------- | ------------------------ |
| `/api/auth`         | `auth.js`         | Authentication & OAuth   |
| `/api/campaigns`    | `campaign.js`     | Campaign CRUD operations |
| `/api/payment`      | `payment.js`      | Payment processing       |
| `/api/users`        | `user.js`         | User profile management  |
| `/api/admin`        | `admin.js`        | Admin-only operations    |
| `/api/verification` | `verification.js` | KYC verification         |
| `/api/ai`           | `ai.js`           | AI content features      |

---

## Authentication Routes

### `POST /api/auth/register`

Register a new user account.

**Request Body:**

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

---

### `POST /api/auth/login`

Login with email and password. Sends OTP to email.

**Request Body:**

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

---

### `POST /api/auth/verify-otp`

Verify OTP and receive JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "role": "contributor"
}
```

---

### `GET /api/auth/me`

Get current authenticated user. **Requires Authentication**

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
  "isVerified": false
}
```

---

### `GET /api/auth/github`

Initiate GitHub OAuth flow.

**Response:** Redirects to GitHub authorization page.

---

### `POST /api/auth/forgot-password`

Request password reset email.

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

---

### `POST /api/auth/reset-password`

Reset password with token.

**Request Body:**

```json
{
  "token": "reset_token_here",
  "password": "newSecurePassword123"
}
```

---

## Campaign Routes

### `GET /api/campaigns/all`

Get all campaigns (public).

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
    "image": "http://localhost:5000/uploads/image.jpg"
  }
]
```

---

### `GET /api/campaigns/:id`

Get single campaign by ID.

**Response:** `200 OK`

```json
{
  "_id": "64abc...",
  "owner": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "title": "Help Build a School",
  "description": "Detailed campaign story...",
  "targetAmount": 50000,
  "currentAmount": 12500,
  "milestones": [
    {
      "_id": "...",
      "title": "Foundation",
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
  ],
  "wallet": {
    "totalRaised": 12500,
    "lockedAmount": 7500,
    "availableBalance": 5000,
    "totalWithdrawn": 0
  }
}
```

---

### `POST /api/campaigns/create`

Create a new campaign. **Requires Authentication & Verification**

**Headers:**

```
x-auth-token: <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**

| Field             | Type        | Required | Description                         |
| ----------------- | ----------- | -------- | ----------------------------------- |
| `title`           | string      | Yes      | Campaign title                      |
| `description`     | string      | Yes      | Campaign story                      |
| `targetAmount`    | number      | Yes      | Fundraising goal                    |
| `category`        | string      | Yes      | Campaign category                   |
| `country`         | string      | Yes      | Country                             |
| `zipCode`         | string      | Yes      | ZIP/Postal code                     |
| `beneficiaryType` | string      | Yes      | `myself`, `someone-else`, `charity` |
| `image`           | file        | Yes      | Cover image                         |
| `video`           | file        | No       | Campaign video                      |
| `youtubeLink`     | string      | No       | YouTube embed URL                   |
| `milestones`      | JSON string | No       | Array of milestones                 |

**Milestones JSON:**

```json
[
  { "title": "Phase 1", "amount": 10000, "description": "..." },
  { "title": "Phase 2", "amount": 20000, "description": "..." }
]
```

---

### `DELETE /api/campaigns/:id`

Delete a campaign. **Requires Authentication (Owner only)**

---

### `POST /api/campaigns/donate/:id`

Record a donation (manual/test endpoint).

**Request Body:**

```json
{
  "amount": 500,
  "name": "Anonymous",
  "message": "Good luck!"
}
```

---

### `POST /api/campaigns/:id/withdraw`

Withdraw available funds. **Requires Authentication & KYC**

**Request Body:**

```json
{
  "amount": 5000,
  "method": "bKash",
  "accountNumber": "01712345678"
}
```

---

### `PUT /api/campaigns/milestone/submit-proof`

Submit milestone completion proof. **Requires Authentication**

**Form Data:**

| Field         | Type   | Description       |
| ------------- | ------ | ----------------- |
| `campaignId`  | string | Campaign ID       |
| `milestoneId` | string | Milestone ID      |
| `description` | string | Proof description |
| `proof`       | file   | Proof image       |

---

## Payment Routes

### `POST /api/payment/init`

Initialize SSLCommerz payment. **Requires Authentication**

**Request Body:**

```json
{
  "campaignId": "64abc...",
  "amount": 500,
  "isAnonymous": false
}
```

**Response:**

```json
{
  "url": "https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?..."
}
```

---

### `POST /api/payment/success/:tranId`

Payment success callback (called by SSLCommerz).

---

### `POST /api/payment/fail/:tranId`

Payment failure callback.

---

## Admin Routes

All admin routes require authentication AND admin role.

### `GET /api/admin/verifications`

Get pending user verification requests.

---

### `PUT /api/admin/verify-user/:id`

Approve or reject user verification.

**Request Body:**

```json
{
  "status": "approved"
}
```

---

### `GET /api/admin/milestones/pending`

Get all pending milestone approvals.

---

### `PUT /api/admin/milestone/approve`

Approve milestone and release funds.

**Request Body:**

```json
{
  "campaignId": "64abc...",
  "milestoneId": "milestone_id"
}
```

---

## User Routes

### `PUT /api/users/profile-update`

Update user profile. **Requires Authentication**

**Form Data:**

| Field        | Type    | Description         |
| ------------ | ------- | ------------------- |
| `name`       | string  | Display name        |
| `username`   | string  | Username            |
| `bio`        | string  | Profile bio         |
| `isPublic`   | boolean | Profile visibility  |
| `avatar`     | file    | Profile picture     |
| `cover`      | file    | Cover image         |
| `topCauses`  | JSON    | Causes array        |
| `socials`    | JSON    | Social links object |
| `highlights` | JSON    | Pins and links      |

---

## Verification Routes

### `POST /api/verification/submit`

Submit KYC verification. **Requires Authentication**

**Form Data:**

| Field       | Type   | Description        |
| ----------- | ------ | ------------------ |
| `nidNumber` | string | National ID number |
| `phone`     | string | Phone number       |
| `address`   | string | Address            |
| `nidImage`  | file   | NID document image |

---

## AI Routes

### `POST /api/ai/enhance`

AI-powered content enhancement.

**Request Body:**

```json
{
  "text": "Your campaign story draft...",
  "action": "enhance"
}
```

**Actions:**

| Action          | Description                            |
| --------------- | -------------------------------------- |
| `validate`      | Check if story meets quality standards |
| `suggest_title` | Generate 4 title suggestions           |
| `enhance`       | Improve grammar and tone               |

---

## Error Responses

All endpoints return consistent error formats:

```json
{
  "message": "Error description",
  "msg": "Alternative message field"
}
```

**Common HTTP Status Codes:**

| Code  | Meaning                              |
| ----- | ------------------------------------ |
| `200` | Success                              |
| `400` | Bad Request / Validation Error       |
| `401` | Unauthorized                         |
| `403` | Forbidden (insufficient permissions) |
| `404` | Resource Not Found                   |
| `500` | Server Error                         |
