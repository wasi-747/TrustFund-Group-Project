# Database Models

MongoDB schemas defined using Mongoose ODM.

---

## User Model

File: `backend/models/User.js`

Represents registered users on the platform.

### Schema

```javascript
const UserSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  username: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth users

  // OAuth
  githubId: { type: String, unique: true, sparse: true },

  // Role
  role: {
    type: String,
    enum: ["admin", "fundraiser", "contributor"],
    default: "contributor",
  },

  // Profile Images
  avatar: { type: String, default: "" },
  cover: { type: String, default: "" },

  // Profile Details
  bio: { type: String, default: "" },
  topCauses: { type: [String], default: [] },
  socials: {
    instagram: String,
    facebook: String,
    twitter: String,
    youtube: String,
    tiktok: String,
    linkedin: String,
    website: String,
  },

  // Highlights (Pins & Links)
  highlights: {
    pins: [
      {
        id: String,
        title: String,
        desc: String,
        link: String,
        color: { type: String, default: "bg-emerald-500" },
      },
    ],
    links: [
      {
        id: String,
        title: String,
        url: String,
      },
    ],
  },

  isPublic: { type: Boolean, default: true },

  // Verification (KYC)
  isVerified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ["none", "pending", "approved", "rejected"],
    default: "none",
  },
  verificationData: {
    nidNumber: String,
    nidImage: String,
    address: String,
    phone: String,
    submittedAt: Date,
  },

  // OTP & Reset
  otp: String,
  otpExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: { type: Date, default: Date.now },
});
```

### User Roles

| Role          | Permissions                                    |
| ------------- | ---------------------------------------------- |
| `admin`       | Full platform access, user/milestone approvals |
| `fundraiser`  | Create campaigns, manage own campaigns         |
| `contributor` | Donate to campaigns, basic profile features    |

### Verification Status Flow

```
none → pending → approved
                ↘ rejected
```

---

## Campaign Model

File: `backend/models/Campaign.js`

Represents fundraising campaigns.

### Schema

```javascript
const CampaignSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Step 1: Location & Category
  country: { type: String, required: true, default: "Bangladesh" },
  zipCode: { type: String, required: true },
  category: { type: String, required: true },

  // Step 2: Goal & Beneficiary
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  beneficiaryType: {
    type: String,
    enum: ["myself", "someone-else", "charity"],
    default: "myself",
  },
  beneficiaryName: { type: String },

  // Step 3: Media & Story
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Cover photo
  video: { type: String },
  youtubeLink: { type: String },

  // Status & Verification
  isVerified: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["active", "paused", "completed", "banned"],
    default: "active",
  },

  // Milestone Escrow Wallet
  releasedAmount: { type: Number, default: 0 },
  withdrawnAmount: { type: Number, default: 0 },
  wallet: {
    totalRaised: { type: Number, default: 0 },
    lockedAmount: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
  },

  // Milestones
  milestones: [
    {
      title: { type: String, required: true },
      description: { type: String },
      amount: { type: Number, required: true },
      status: {
        type: String,
        enum: ["locked", "pending_approval", "approved"],
        default: "locked",
      },
      proofUrl: { type: String },
      proofDescription: { type: String },
      submittedAt: { type: Date },
      updatedAt: { type: Date },
    },
  ],

  // Donation History
  donators: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String, default: "Anonymous" },
      amount: { type: Number, required: true },
      message: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],

  date: { type: Date, default: Date.now },
});
```

### Campaign Status

| Status      | Description                    |
| ----------- | ------------------------------ |
| `active`    | Accepting donations            |
| `paused`    | Temporarily stopped            |
| `completed` | Goal reached or manually ended |
| `banned`    | Removed by admin               |

### Milestone Status Flow

```
locked → pending_approval → approved
         (proof submitted)    (admin approved)
```

### Wallet System

The wallet tracks fund flow for transparency:

```
Donation arrives → totalRaised ↑, lockedAmount ↑

Milestone approved → lockedAmount ↓, availableBalance ↑

Withdrawal → availableBalance ↓, totalWithdrawn ↑
```

---

## Donation Model

File: `backend/models/Donation.js`

Tracks individual payment transactions.

### Schema

```javascript
const DonationSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: "BDT" },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Cancelled"],
    default: "Pending",
  },
  isAnonymous: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});
```

### Donation Status Flow

```
Pending → Paid (success)
        ↘ Failed (error)
        ↘ Cancelled (user cancelled)
```

---

## Transaction Model

File: `backend/models/Transaction.js`

Logs all financial movements for auditing.

### Schema

```javascript
const TransactionSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Withdrawal", "Donation"],
      required: true,
    },
    method: { type: String }, // e.g., "bKash", "Bank Transfer"
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Completed",
    },
    reference: { type: String }, // Transaction reference ID
  },
  { timestamps: true },
);
```

---

## Relationships Diagram

```
┌─────────┐       owns        ┌──────────┐
│  User   │ ───────────────── │ Campaign │
└─────────┘                   └──────────┘
     │                              │
     │ donates                      │ has
     ▼                              ▼
┌──────────┐                 ┌────────────┐
│ Donation │                 │ Milestones │
└──────────┘                 └────────────┘
     │                              │
     │ logged                       │
     ▼                              ▼
┌─────────────┐              ┌──────────┐
│ Transaction │              │ Donators │
└─────────────┘              └──────────┘
```

---

## Indexes

Recommended indexes for performance:

```javascript
// User
UserSchema.index({ email: 1 });
UserSchema.index({ githubId: 1 });

// Campaign
CampaignSchema.index({ owner: 1 });
CampaignSchema.index({ category: 1 });
CampaignSchema.index({ status: 1 });

// Donation
DonationSchema.index({ campaignId: 1 });
DonationSchema.index({ donorId: 1 });
DonationSchema.index({ transactionId: 1 });
```
