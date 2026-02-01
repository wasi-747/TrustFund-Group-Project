# Frontend Pages

Complete reference for all page components.

---

## Page Overview

| Category           | Pages                                                         |
| ------------------ | ------------------------------------------------------------- |
| **Authentication** | Login, Register, ForgotPassword, ResetPassword                |
| **User**           | Dashboard, Profile, Settings, YourImpact                      |
| **Campaign**       | Discover, CampaignDetails, CampaignWizard                     |
| **Admin**          | AdminLogin, AdminDashboard                                    |
| **Resources**      | Resources, FundraisingTips, FundraisingIdeas, FundraisingBlog |
| **Categories**     | CrisisRelief, CharityFundraising, SocialImpactFunds           |

---

## Authentication Pages

### Login (`Login.jsx`)

User authentication page with email/password login.

**Features:**

- Email and password form
- OTP verification step
- GitHub OAuth button
- Remember me option
- Link to registration

**Flow:**

```
1. Enter credentials → Submit
2. OTP sent to email
3. Enter OTP → Verify
4. Redirect to Dashboard
```

---

### Register (`Register.jsx`)

New user registration page.

**Features:**

- Name, email, password fields
- Role selection (Contributor/Fundraiser)
- Password strength indicator
- Terms acceptance
- OTP verification

---

### ForgotPassword (`ForgotPassword.jsx`)

Password recovery initiation.

**Features:**

- Email input
- Reset link sent via email
- Success/error feedback

---

### ResetPassword (`ResetPassword.jsx`)

Set new password after reset.

**Features:**

- Token validation from URL
- New password input
- Password confirmation
- Strength requirements

---

## User Pages

### Dashboard (`Dashboard.jsx`)

Main user landing page after login.

**Features:**

- Campaign statistics
- Quick actions
- Recent activity
- Donation history
- Campaign cards grid

**Sections:**

```
┌──────────────────────────────────────┐
│           Welcome Banner             │
├──────────────┬───────────────────────┤
│   Stats      │   Quick Actions       │
├──────────────┴───────────────────────┤
│         Your Campaigns               │
├──────────────────────────────────────┤
│         Recent Donations             │
└──────────────────────────────────────┘
```

---

### Profile (`Profile.jsx`)

User profile display and editing.

**Features:**

- Avatar and cover image
- Bio and social links
- Top causes
- Highlights (pins & links)
- Public/private toggle
- Edit mode

**Editable Fields:**

- Name, username, bio
- Social media links
- Profile images
- Visibility settings

---

### Settings (`Settings.jsx`)

Account settings and preferences.

**Sections:**

1. **Account Info** - Email, password change
2. **Verification** - KYC document upload
3. **Notifications** - Email preferences
4. **Privacy** - Profile visibility
5. **Danger Zone** - Account deletion

**Verification Flow:**

```
1. Upload NID image
2. Enter NID number, phone, address
3. Submit for review
4. Admin approves/rejects
```

---

### YourImpact (`YourImpact.jsx`)

Donor statistics and contribution history.

**Features:**

- Total donated amount
- Campaigns supported
- Impact visualization
- Donation timeline
- Badges/achievements

---

## Campaign Pages

### Discover (`Discover.jsx`)

Browse all active campaigns.

**Features:**

- Campaign grid/list view
- Category filters
- Search functionality
- Sort options (newest, popular, ending soon)
- Pagination/infinite scroll

---

### CampaignDetails (`CampaignDetails.jsx`)

Single campaign view with all details.

**Sections:**

```
┌──────────────────────────────────────┐
│     Cover Image / Video              │
├──────────────────────────────────────┤
│  Title          │  Donate Button     │
│  Progress Bar   │  Share Button      │
├──────────────────────────────────────┤
│           Campaign Story             │
├──────────────┬───────────────────────┤
│  Milestones  │  Recent Donations     │
├──────────────┴───────────────────────┤
│          Campaign Wallet             │
└──────────────────────────────────────┘
```

**Features:**

- Real-time donation updates
- Milestone progress tracker
- Donation form
- Social sharing
- Campaign wallet transparency
- Owner actions (if owner)

---

### CampaignWizard (`CampaignWizard.jsx`)

Multi-step campaign creation form.

**Steps:**

1. **Location & Category**
   - Country selection
   - ZIP code
   - Category selection

2. **Goal & Beneficiary**
   - Target amount
   - Beneficiary type
   - Beneficiary name

3. **Story & Media**
   - Campaign title
   - Description (with AI enhancement)
   - Cover image upload
   - Video upload (optional)
   - YouTube link

4. **Milestones** (Optional)
   - Add milestone steps
   - Amount per milestone
   - Milestone descriptions

5. **Review & Submit**
   - Preview all details
   - Terms acceptance
   - Submit campaign

---

## Admin Pages

### AdminLogin (`AdminLogin.jsx`)

Admin-specific login portal.

**Features:**

- Admin credentials
- Enhanced security checks
- Redirect to admin dashboard

---

### AdminDashboard (`AdminDashboard.jsx`)

Platform administration panel.

**Sections:**

1. **Overview Stats**
   - Total users
   - Total campaigns
   - Total donations
   - Pending verifications

2. **User Verifications**
   - Pending verification requests
   - View submitted documents
   - Approve/Reject actions

3. **Milestone Approvals**
   - Pending milestone proofs
   - Review proof images
   - Release funds on approval

4. **Campaign Management**
   - All campaigns list
   - Ban/unban campaigns
   - Feature campaigns

---

## Resource Pages

### Resources (`Resources.jsx`)

Hub for fundraising resources and guides.

**Links to:**

- How to Start
- Fundraising Tips
- Fundraising Ideas
- Blog

---

### FundraisingTips (`FundraisingTips.jsx`)

Best practices for successful campaigns.

**Topics:**

- Writing compelling stories
- Setting realistic goals
- Promoting your campaign
- Engaging donors
- Milestone planning

---

### FundraisingIdeas (`FundraisingIdeas.jsx`)

Creative fundraising campaign ideas.

**Categories:**

- Medical
- Education
- Emergency
- Community
- Creative projects

---

### FundraisingBlog (`FundraisingBlog.jsx`)

Articles and success stories.

**Content:**

- Success stories
- Platform updates
- Tips and tricks
- Community highlights

---

## Category Pages

### CrisisRelief (`CrisisRelief.jsx`)

Campaigns for emergency and disaster relief.

---

### CharityFundraising (`CharityFundraising.jsx`)

Information for registered charities.

---

### SocialImpactFunds (`SocialImpactFunds.jsx`)

Social impact and community projects.

---

### NonprofitSignup (`NonprofitSignup.jsx`)

Special registration for nonprofit organizations.

---

## Payment Pages

### PaymentSuccess (`PaymentSuccess.jsx`)

Displayed after successful donation.

**Features:**

- Thank you message
- Donation receipt
- Social share options
- Return to campaign link

---

### PaymentFail (`PaymentFail.jsx`)

Displayed after failed payment.

**Features:**

- Error message
- Retry option
- Support contact
- Return to campaign link

---

## Page Wrapper

All pages use `PageWrapper` for consistent animations:

```jsx
<PageWrapper>
  <YourPage />
</PageWrapper>
```

Provides Framer Motion entrance/exit animations.
