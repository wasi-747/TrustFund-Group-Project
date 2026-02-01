# User Verification (KYC)

Know Your Customer verification process.

---

## Overview

User verification ensures platform trust by validating user identities before allowing campaign creation and fund withdrawals.

---

## Why Verification?

| Action           | Requires Verification |
| ---------------- | --------------------- |
| Browse campaigns | ❌ No                 |
| Make donations   | ❌ No                 |
| Create campaigns | ✅ Yes                |
| Withdraw funds   | ✅ Yes                |

---

## Verification Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Submit    │ ──▶ │   Pending   │ ──▶ │  Approved   │
│   Request   │     │   Review    │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Rejected   │
                    └─────────────┘
```

---

## Submitting Verification

### Required Documents

| Field      | Type | Description             |
| ---------- | ---- | ----------------------- |
| NID Number | Text | National ID card number |
| NID Image  | File | Photo of ID card        |
| Phone      | Text | Contact phone number    |
| Address    | Text | Current address         |

### API Endpoint

```
POST /api/verification/submit
Content-Type: multipart/form-data
Authorization: x-auth-token: <jwt>
```

### Request

```javascript
const formData = new FormData();
formData.append("nidNumber", "1234567890123");
formData.append("phone", "01712345678");
formData.append("address", "123 Main St, Dhaka");
formData.append("nidImage", fileInput.files[0]);

await axios.post("/api/verification/submit", formData, {
  headers: {
    "x-auth-token": token,
    "Content-Type": "multipart/form-data",
  },
});
```

### Data Storage

```javascript
user.verificationData = {
  nidNumber: "1234567890123",
  phone: "01712345678",
  address: "123 Main St, Dhaka",
  nidImage: "http://localhost:5000/uploads/nid-123.jpg",
  submittedAt: new Date(),
};
user.verificationStatus = "pending";
await user.save();
```

---

## Verification States

| Status       | `verificationStatus` | `isVerified` |
| ------------ | -------------------- | ------------ |
| Not Started  | `none`               | `false`      |
| Under Review | `pending`            | `false`      |
| Approved     | `approved`           | `true`       |
| Rejected     | `rejected`           | `false`      |

---

## Admin Review

### Viewing Pending Requests

```
GET /api/admin/verifications
Authorization: x-auth-token: <admin_jwt>
```

**Response:**

```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "verificationStatus": "pending",
    "verificationData": {
      "nidNumber": "1234567890123",
      "phone": "01712345678",
      "address": "123 Main St, Dhaka",
      "nidImage": "http://localhost:5000/uploads/nid-123.jpg",
      "submittedAt": "2026-01-15T..."
    }
  }
]
```

### Approving/Rejecting

```
PUT /api/admin/verify-user/:userId
Authorization: x-auth-token: <admin_jwt>
```

**Approve:**

```json
{
  "status": "approved"
}
```

**Reject:**

```json
{
  "status": "rejected"
}
```

### Backend Logic

```javascript
router.put("/verify-user/:id", auth, adminCheck, async (req, res) => {
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

  const user = await User.findById(req.params.id);

  user.verificationStatus = status;
  user.isVerified = status === "approved";
  await user.save();

  res.json({ msg: `User ${status}`, user });
});
```

---

## Frontend Integration

### Settings Page Section

```jsx
// Verification section in Settings.jsx
const VerificationSection = () => {
  const [formData, setFormData] = useState({
    nidNumber: "",
    phone: "",
    address: "",
    nidImage: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("nidNumber", formData.nidNumber);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("nidImage", formData.nidImage);

    try {
      await axios.post("/api/verification/submit", data, {
        headers: { "x-auth-token": token },
      });
      toast.success("Verification submitted!");
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
};
```

### Status Display

```jsx
const VerificationBadge = ({ user }) => {
  if (user.isVerified) {
    return <span className="badge badge-success">✓ Verified</span>;
  }

  if (user.verificationStatus === "pending") {
    return <span className="badge badge-warning">⏳ Pending Review</span>;
  }

  if (user.verificationStatus === "rejected") {
    return <span className="badge badge-error">✗ Rejected</span>;
  }

  return <span className="badge badge-ghost">Not Verified</span>;
};
```

---

## Protection Examples

### Campaign Creation

```javascript
// routes/campaign.js
router.post("/create", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user.isVerified) {
    return res.status(403).json({
      msg: "⛔ You must verify your account to create a campaign.",
    });
  }

  // Continue with campaign creation...
});
```

### Fund Withdrawal

```javascript
// routes/campaign.js
router.post("/:id/withdraw", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  const isKycOk = user?.isVerified || user?.verificationStatus === "approved";

  if (!isKycOk) {
    return res.status(403).json({
      msg: "Account verification required before withdrawals",
    });
  }

  // Continue with withdrawal...
});
```

---

## Admin Dashboard UI

### Verification Queue

```jsx
const VerificationQueue = () => {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const handleAction = async (userId, status) => {
    await axios.put(
      `/api/admin/verify-user/${userId}`,
      { status },
      { headers: { "x-auth-token": adminToken } },
    );
    fetchPendingVerifications(); // Refresh list
  };

  return (
    <div>
      <h2>Pending Verifications</h2>
      {pending.map((user) => (
        <div key={user._id} className="card">
          <p>Name: {user.name}</p>
          <p>NID: {user.verificationData.nidNumber}</p>
          <img src={user.verificationData.nidImage} alt="NID" />

          <button onClick={() => handleAction(user._id, "approved")}>
            ✓ Approve
          </button>
          <button onClick={() => handleAction(user._id, "rejected")}>
            ✗ Reject
          </button>
        </div>
      ))}
    </div>
  );
};
```

---

## Security Notes

### Document Storage

- NID images stored in `uploads/` directory
- Consider moving to cloud storage (S3) in production
- Implement access control for sensitive documents

### Data Privacy

- Verification data should only be accessible to:
  - The user themselves
  - Platform admins
- Never expose NID data in public APIs

### Future Enhancements

- Automated document verification (OCR)
- Additional verification methods (phone OTP)
- Re-verification for expired documents
- Audit logs for verification actions
