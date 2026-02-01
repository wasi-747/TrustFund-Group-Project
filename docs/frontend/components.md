# Frontend Components

Reusable UI components used throughout the application.

---

## Component Overview

| Component               | Description                  |
| ----------------------- | ---------------------------- |
| `Navbar`                | Top navigation bar           |
| `Footer`                | Page footer                  |
| `CampaignCard`          | Campaign preview card        |
| `CampaignWallet`        | Wallet transparency display  |
| `MilestoneTracker`      | Milestone progress component |
| `InteractiveBackground` | Animated background          |
| `PageWrapper`           | Page animation wrapper       |
| `AdminRoute`            | Admin route guard            |

---

## Navigation Components

### Navbar (`Navbar.jsx`)

Main navigation component displayed on all pages.

**Features:**

- Logo and branding
- Navigation links
- Theme toggle (dark/light)
- User menu (logged in)
- Login/Register buttons (logged out)
- Mobile responsive menu

**Structure:**

```
┌───────────────────────────────────────────────────┐
│ Logo   |  Links...  |  Theme  |  Avatar/Login    │
└───────────────────────────────────────────────────┘
```

**Navigation Links:**

- Dashboard
- Discover
- Create Campaign
- Resources
- Admin (if admin)

---

### Footer (`Footer.jsx`)

Page footer with links and information.

**Sections:**

- About TrustFund
- Quick Links
- Resources
- Social Media
- Copyright

---

## Campaign Components

### CampaignCard (`CampaignCard.jsx`)

Card component for displaying campaign previews.

**Props:**

| Prop          | Type    | Description              |
| ------------- | ------- | ------------------------ |
| `campaign`    | Object  | Campaign data            |
| `showActions` | Boolean | Show edit/delete buttons |

**Display:**

```
┌─────────────────────────┐
│      Cover Image        │
├─────────────────────────┤
│ Category Badge          │
│ Title                   │
│ Description preview...  │
├─────────────────────────┤
│ Progress Bar            │
│ ৳5,000 / ৳10,000       │
├─────────────────────────┤
│ [View] [Donate]         │
└─────────────────────────┘
```

**Usage:**

```jsx
<CampaignCard campaign={campaignData} showActions={isOwner} />
```

---

### CampaignWallet (`CampaignWallet.jsx`)

Displays campaign fund transparency.

**Props:**

| Prop         | Type     | Description            |
| ------------ | -------- | ---------------------- |
| `wallet`     | Object   | Wallet data            |
| `isOwner`    | Boolean  | Enable withdraw button |
| `onWithdraw` | Function | Withdraw handler       |

**Display:**

```
┌─────────────────────────────┐
│       Campaign Wallet       │
├─────────────────────────────┤
│ Total Raised    ৳12,500     │
│ Locked          ৳7,500      │
│ Available       ৳5,000      │
│ Withdrawn       ৳0          │
├─────────────────────────────┤
│      [Withdraw Funds]       │
└─────────────────────────────┘
```

---

### MilestoneTracker (`MilestoneTracker.jsx`)

Visual milestone progress display.

**Props:**

| Prop            | Type     | Description              |
| --------------- | -------- | ------------------------ |
| `milestones`    | Array    | Milestone objects        |
| `isOwner`       | Boolean  | Show submit proof button |
| `onSubmitProof` | Function | Proof submission handler |

**Milestone States:**

- 🔒 Locked (gray)
- ⏳ Pending Approval (yellow)
- ✅ Approved (green)

**Display:**

```
Step 1: Foundation ✅ Approved
  └── ৳10,000

Step 2: Construction ⏳ Pending
  └── ৳20,000 [View Proof]

Step 3: Completion 🔒 Locked
  └── ৳20,000 [Submit Proof]
```

---

## Layout Components

### PageWrapper (`PageWrapper.jsx`)

Wraps pages with Framer Motion animations.

**Props:**

| Prop       | Type      | Description  |
| ---------- | --------- | ------------ |
| `children` | ReactNode | Page content |

**Animation:**

- Fade in on mount
- Slide up effect
- Fade out on unmount

**Usage:**

```jsx
<PageWrapper>
  <Dashboard />
</PageWrapper>
```

**Implementation:**

```jsx
import { motion } from "framer-motion";

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
```

---

### InteractiveBackground (`InteractiveBackground.jsx`)

Animated background component.

**Props:**

| Prop    | Type   | Description           |
| ------- | ------ | --------------------- |
| `theme` | String | `"light"` or `"dark"` |

**Features:**

- Animated gradient
- Floating particles
- Mouse interaction
- Performance optimized

---

## Auth Components

### AdminRoute (`AdminRoute.jsx`)

Route guard for admin-only pages.

**Usage:**

```jsx
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
```

**Implementation:**

```jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.user?.role !== "admin") {
      return <Navigate to="/dashboard" />;
    }
    return children;
  } catch {
    return <Navigate to="/login" />;
  }
};
```

---

## Form Components

### Common Form Patterns

**Input with Label:**

```jsx
<div className="form-control">
  <label className="label">
    <span className="label-text">Email</span>
  </label>
  <input
    type="email"
    className="input input-bordered"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
```

**File Upload:**

```jsx
<div className="form-control">
  <label className="label">
    <span className="label-text">Cover Image</span>
  </label>
  <input
    type="file"
    className="file-input file-input-bordered"
    accept="image/*"
    onChange={handleFileChange}
  />
</div>
```

**Submit Button:**

```jsx
<button type="submit" className="btn btn-primary" disabled={loading}>
  {loading ? <span className="loading loading-spinner"></span> : "Submit"}
</button>
```

---

## Notification Components

### Toast Notifications

Using React Toastify:

```jsx
import { toast } from "react-toastify";

// Success
toast.success("Campaign created successfully!");

// Error
toast.error("Something went wrong");

// Info
toast.info("Please verify your email");

// Warning
toast.warning("This action cannot be undone");
```

**Configuration in App.jsx:**

```jsx
<ToastContainer
  position="top-right"
  autoClose={3000}
  theme={theme === "light" ? "light" : "dark"}
/>
```

---

## Component Best Practices

1. **Props validation** - Use PropTypes or TypeScript
2. **Memoization** - Use `React.memo` for expensive renders
3. **Loading states** - Always show loading indicators
4. **Error handling** - Display user-friendly error messages
5. **Accessibility** - Include proper ARIA labels
6. **Responsive** - Test on multiple screen sizes
