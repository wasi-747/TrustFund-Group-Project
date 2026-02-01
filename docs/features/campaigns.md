# Campaigns

Complete guide to campaign management in TrustFund.

---

## Overview

Campaigns are the core of TrustFund, allowing users to create fundraising projects with:

- Rich media (images, videos)
- Milestone-based fund release
- Transparent wallet system
- Real-time donation tracking

---

## Campaign Lifecycle

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Created    │ ──▶ │    Active    │ ──▶ │  Completed   │
│   (Draft)    │     │ (Accepting)  │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Paused     │
                     │ (Temporary)  │
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Banned     │
                     │ (By Admin)   │
                     └──────────────┘
```

---

## Creating a Campaign

### Prerequisites

1. User must be logged in
2. User must be **verified** (KYC completed)

### Campaign Wizard Steps

#### Step 1: Location & Category

| Field    | Type   | Required |
| -------- | ------ | -------- |
| Country  | Select | Yes      |
| ZIP Code | Text   | Yes      |
| Category | Select | Yes      |

**Categories:**

- Medical
- Education
- Emergency
- Community
- Animals
- Environment
- Sports
- Creative
- Other

#### Step 2: Goal & Beneficiary

| Field            | Type   | Required          |
| ---------------- | ------ | ----------------- |
| Target Amount    | Number | Yes               |
| Beneficiary Type | Select | Yes               |
| Beneficiary Name | Text   | If "someone-else" |

**Beneficiary Types:**

- `myself` - Fundraising for yourself
- `someone-else` - On behalf of another person
- `charity` - For a registered organization

#### Step 3: Story & Media

| Field        | Type     | Required |
| ------------ | -------- | -------- |
| Title        | Text     | Yes      |
| Description  | Textarea | Yes      |
| Cover Image  | File     | Yes      |
| Video        | File     | No       |
| YouTube Link | URL      | No       |

**AI Enhancement:**

- Validate story quality
- Suggest titles
- Improve grammar and tone

#### Step 4: Milestones (Optional)

Define fund release milestones:

```json
[
  {
    "title": "Phase 1 - Planning",
    "amount": 10000,
    "description": "Initial research and permits"
  },
  {
    "title": "Phase 2 - Construction",
    "amount": 25000,
    "description": "Building materials and labor"
  }
]
```

#### Step 5: Review & Submit

Preview all details before submission.

---

## Campaign Data Structure

```javascript
{
  owner: ObjectId,

  // Location
  country: "Bangladesh",
  zipCode: "1205",
  category: "Medical",

  // Goal
  targetAmount: 50000,
  currentAmount: 12500,
  beneficiaryType: "myself",

  // Content
  title: "Help Me Get Surgery",
  description: "Full story here...",
  image: "http://localhost:5000/uploads/cover.jpg",
  video: null,
  youtubeLink: "https://youtube.com/...",

  // Status
  isVerified: true,
  status: "active",

  // Wallet
  wallet: {
    totalRaised: 12500,
    lockedAmount: 7500,
    availableBalance: 5000,
    totalWithdrawn: 0
  },

  // Milestones
  milestones: [...],

  // Donors
  donators: [...],

  date: "2026-01-01T..."
}
```

---

## Milestone System

### How It Works

1. Campaign owner defines milestones with amounts
2. Donations land in **locked** escrow
3. Owner submits proof of milestone completion
4. Admin reviews and approves
5. Funds move to **available balance**
6. Owner can withdraw available funds

### Milestone States

| State              | Description                              |
| ------------------ | ---------------------------------------- |
| `locked`           | Waiting for previous milestones or proof |
| `pending_approval` | Proof submitted, awaiting admin          |
| `approved`         | Verified, funds released                 |

### Submitting Proof

```javascript
// API Request
PUT /api/campaigns/milestone/submit-proof

// Form Data
{
  campaignId: "...",
  milestoneId: "...",
  description: "Phase 1 completed - see attached photos",
  proof: <file>
}
```

### Admin Approval

```javascript
// API Request
PUT /api/admin/milestone/approve

{
  campaignId: "...",
  milestoneId: "..."
}
```

**Effect:**

- Milestone status → `approved`
- `lockedAmount` decreased by milestone amount
- `availableBalance` increased by same amount

---

## Wallet System

### Fund Flow

```
                    ┌─────────────────┐
                    │    Donation     │
                    └────────┬────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────┐
│                   CAMPAIGN WALLET                   │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────┐    ┌──────────────────────────┐ │
│  │ totalRaised  │    │      lockedAmount        │ │
│  │   ৳12,500    │    │         ৳7,500           │ │
│  └──────────────┘    └──────────────────────────┘ │
│                              │                     │
│                              │ (Milestone Approved)│
│                              ▼                     │
│                      ┌──────────────────────────┐ │
│                      │   availableBalance       │ │
│                      │        ৳5,000            │ │
│                      └──────────────────────────┘ │
│                              │                     │
│                              │ (Withdrawal)        │
│                              ▼                     │
│                      ┌──────────────────────────┐ │
│                      │    totalWithdrawn        │ │
│                      │          ৳0              │ │
│                      └──────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

### Withdrawal

Requirements:

- User is campaign owner
- User is KYC verified
- Sufficient available balance

```javascript
POST /api/campaigns/:id/withdraw

{
  amount: 5000,
  method: "bKash",
  accountNumber: "01712345678"
}
```

---

## Donations

### Making a Donation

1. Go to campaign page
2. Enter amount (minimum ৳50)
3. Choose anonymous or public
4. Pay via SSLCommerz
5. Redirected back on success

### Donation Record

```javascript
{
  campaignId: ObjectId,
  donorId: ObjectId,
  transactionId: "uuid-v4",
  amount: 500,
  currency: "BDT",
  status: "Paid",
  isAnonymous: false,
  date: Date
}
```

### Real-time Updates

When donation is successful:

1. Campaign `currentAmount` updated
2. Donor added to `donators` array
3. Socket emits `donation_received` event
4. Email sent to campaign owner

---

## Campaign Display

### Campaign Card

Shows on discover/dashboard:

- Cover image
- Title
- Progress bar
- Amount raised / goal
- Category badge

### Campaign Details Page

Full information:

- Media gallery
- Complete story
- Milestone tracker
- Donation history
- Wallet transparency
- Donate button
- Share buttons

---

## Search & Discovery

### Filtering Options

- Category
- Status (active only for public)
- Sort by: newest, popular, ending soon

### Future Enhancements

- Full-text search
- Location-based filtering
- Tags/keywords
- Verified badge filter
