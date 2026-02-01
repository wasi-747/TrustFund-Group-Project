# Payments

Payment processing with SSLCommerz integration.

---

## Overview

TrustFund uses **SSLCommerz** as the payment gateway for processing donations in Bangladesh (BDT currency).

---

## Payment Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Donate    │ ──▶ │  Init API   │ ──▶ │ SSLCommerz  │
│   Button    │     │   Call      │     │   Gateway   │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                           ┌───────────────────┼───────────────────┐
                           │                   │                   │
                           ▼                   ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │   Success   │     │    Fail     │     │   Cancel    │
                    │  Callback   │     │  Callback   │     │  Callback   │
                    └─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Update    │
                    │  Campaign   │
                    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Email &   │
                    │   Socket    │
                    └─────────────┘
```

---

## Configuration

### Environment Variables

```env
STORE_ID=your_sslcommerz_store_id
STORE_PASS=your_sslcommerz_store_password
IS_LIVE=false
```

### Sandbox vs Production

| Mode       | `IS_LIVE` | URL                      |
| ---------- | --------- | ------------------------ |
| Sandbox    | `false`   | sandbox.sslcommerz.com   |
| Production | `true`    | securepay.sslcommerz.com |

!!! warning "Testing"
Always use sandbox mode during development. Production mode processes real payments.

---

## Payment Initialization

### API Endpoint

```
POST /api/payment/init
```

### Request

```json
{
  "campaignId": "64abc123...",
  "amount": 500,
  "isAnonymous": false
}
```

### Validation

- Minimum donation: **৳50 BDT**
- User must be authenticated

### Process

1. Create pending Donation record
2. Build SSLCommerz payment data
3. Initialize payment session
4. Return gateway URL

### Response

```json
{
  "url": "https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q=..."
}
```

Frontend redirects user to this URL.

---

## SSLCommerz Data

```javascript
const data = {
  total_amount: amount,
  currency: "BDT",
  tran_id: uuidv4(),

  // Callback URLs
  success_url: `${SERVER_URL}/api/payment/success/${tran_id}`,
  fail_url: `${SERVER_URL}/api/payment/fail/${tran_id}`,
  cancel_url: `${SERVER_URL}/api/payment/cancel/${tran_id}`,
  ipn_url: `${SERVER_URL}/api/payment/ipn`,

  // Product Info
  product_name: "Donation",
  product_category: "Donation",
  product_profile: "general",

  // Customer Info
  cus_name: req.user.name,
  cus_email: req.user.email,
  cus_phone: "01711111111",
  cus_add1: "Dhaka",
  cus_city: "Dhaka",
  cus_country: "Bangladesh",

  // Shipping (required but not used)
  shipping_method: "NO",
  ship_name: "N/A",
  ship_add1: "N/A",
  ship_city: "N/A",
  ship_country: "Bangladesh",
};
```

---

## Callback Handlers

### Success Callback

```
POST /api/payment/success/:tranId
```

**Actions:**

1. Find donation by transaction ID
2. Update donation status to "Paid"
3. Update campaign:
   - Increment `currentAmount`
   - Add to `donators` array
   - Update wallet (totalRaised, lockedAmount)
4. Send email to campaign owner
5. Emit Socket.IO events
6. Redirect to frontend success page

### Fail Callback

```
POST /api/payment/fail/:tranId
```

**Actions:**

1. Update donation status to "Failed"
2. Redirect to frontend fail page

### Cancel Callback

```
POST /api/payment/cancel/:tranId
```

**Actions:**

1. Update donation status to "Cancelled"
2. Redirect to frontend (campaign page)

---

## Email Notification

On successful donation, campaign owner receives:

```html
Subject: 💰 New Donation: ৳500 for "Campaign Title"
┌─────────────────────────────────────────┐ │ 🎉 You Received a Donation! │
├─────────────────────────────────────────┤ │ Hello [Owner Name], │ │ │ │ Great
news! Someone just supported │ │ your cause. │ │ │ │
┌─────────────────────────────────┐ │ │ │ Donation Amount │ │ │ │ ৳500 │ │ │ │ │
│ │ │ Campaign: [Campaign Title] │ │ │ └─────────────────────────────────┘ │ │ │
│ [View Dashboard] │ └─────────────────────────────────────────┘
```

---

## Real-time Events

### `donation_received`

Emitted to all connected clients:

```javascript
io.emit("donation_received", {
  campaignId: donation.campaignId.toString(),
  amount: donation.amount,
});
```

### `new_donation`

Detailed donation info for live feeds:

```javascript
io.emit("new_donation", {
  campaignId: donation.campaignId.toString(),
  donation: {
    name: donorName,
    amount: donation.amount,
    date: new Date(),
    message: "",
  },
});
```

---

## Transaction Logging

All payments are logged in the Transaction model:

```javascript
await Transaction.create({
  campaign: campaignId,
  user: donorId,
  type: "Donation",
  amount: amount,
  status: "Completed",
  reference: transactionId,
});
```

---

## Frontend Integration

### Donation Form

```jsx
const handleDonate = async (amount, isAnonymous) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/payment/init`,
      { campaignId, amount, isAnonymous },
      { headers: { "x-auth-token": token } },
    );

    // Redirect to SSLCommerz
    window.location.href = response.data.url;
  } catch (error) {
    toast.error(error.response?.data || "Payment failed");
  }
};
```

### Success Page

```jsx
// PaymentSuccess.jsx
const PaymentSuccess = () => {
  return (
    <div className="text-center">
      <h1>🎉 Thank You!</h1>
      <p>Your donation was successful.</p>
      <Link to="/dashboard">Return to Dashboard</Link>
    </div>
  );
};
```

### Fail Page

```jsx
// PaymentFail.jsx
const PaymentFail = () => {
  return (
    <div className="text-center">
      <h1>❌ Payment Failed</h1>
      <p>Something went wrong with your payment.</p>
      <button onClick={() => window.history.back()}>Try Again</button>
    </div>
  );
};
```

---

## Security Considerations

### Validation

- Amount validated on backend (minimum ৳50)
- Campaign existence verified
- User authentication required

### IPN (Instant Payment Notification)

For production, implement IPN validation:

```javascript
router.post("/ipn", async (req, res) => {
  // Verify with SSLCommerz
  const { tran_id, val_id, amount, status } = req.body;

  // Validate transaction with SSLCommerz API
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validation = await sslcz.validate({ val_id });

  if (validation.status === "VALID") {
    // Process confirmed payment
  }
});
```

---

## Testing

### Sandbox Credentials

SSLCommerz provides test cards:

| Card Type | Number           | Expiry     | CVV |
| --------- | ---------------- | ---------- | --- |
| Visa      | 4111111111111111 | Any future | Any |
| Master    | 5111111111111118 | Any future | Any |

### Test Flow

1. Set `IS_LIVE=false`
2. Use sandbox store credentials
3. Make test donations
4. Verify all callbacks work
5. Check email delivery
6. Confirm Socket events fire
