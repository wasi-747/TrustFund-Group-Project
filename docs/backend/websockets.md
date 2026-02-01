# WebSocket Events

Real-time communication using Socket.IO.

---

## Overview

TrustFund uses Socket.IO to provide real-time updates for:

- New donations
- Fund withdrawals
- Live campaign updates

---

## Server Setup

```javascript
// server.js
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Make io available to routes
app.set("io", io);

// Connection handling
io.on("connection", (socket) => {
  console.log("⚡ Client Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client Disconnected");
  });
});
```

---

## Events Reference

### `donation_received`

Emitted when a successful donation is processed.

**Payload:**

```json
{
  "campaignId": "64abc123...",
  "amount": 500
}
```

**Emitter:** `routes/payment.js` (after payment success)

```javascript
io.emit("donation_received", {
  campaignId: donation.campaignId.toString(),
  amount: donation.amount,
});
```

---

### `new_donation`

Emitted with full donation details for live donation feed.

**Payload:**

```json
{
  "campaignId": "64abc123...",
  "donation": {
    "name": "John Doe",
    "amount": 500,
    "date": "2026-01-15T10:30:00Z",
    "message": "Good luck!"
  }
}
```

**Emitter:** `routes/campaign.js` (donate endpoint)

```javascript
io.emit("new_donation", {
  campaignId: campaign._id,
  donation: {
    name: name || "Anonymous",
    amount: numericAmount,
    date: new Date(),
    message,
  },
});
```

---

### `funds_withdrawn`

Emitted when campaign owner withdraws funds.

**Payload:**

```json
{
  "campaignId": "64abc123...",
  "amount": 5000,
  "withdrawnAmount": 5000,
  "wallet": {
    "totalRaised": 12500,
    "lockedAmount": 2500,
    "availableBalance": 0,
    "totalWithdrawn": 5000
  }
}
```

**Emitter:** `routes/campaign.js` (withdraw endpoint)

---

## Client Integration

### React Setup

```javascript
// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
```

### Listening to Events

```jsx
// CampaignDetails.jsx
import { useEffect, useState } from "react";
import socket from "../utils/socket";

function CampaignDetails({ campaignId }) {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    // Listen for donation updates
    socket.on("donation_received", (data) => {
      if (data.campaignId === campaignId) {
        setCurrentAmount((prev) => prev + data.amount);
      }
    });

    // Listen for new donation details
    socket.on("new_donation", (data) => {
      if (data.campaignId === campaignId) {
        setDonations((prev) => [data.donation, ...prev]);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off("donation_received");
      socket.off("new_donation");
    };
  }, [campaignId]);

  return (
    <div>
      <h2>Raised: ৳{currentAmount}</h2>
      <ul>
        {donations.map((d, i) => (
          <li key={i}>
            {d.name} donated ৳{d.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Connection Management

### Client Connection Status

```jsx
import { useEffect, useState } from "react";
import socket from "../utils/socket";

function ConnectionStatus() {
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <span className={connected ? "text-green-500" : "text-red-500"}>
      {connected ? "🟢 Live" : "🔴 Offline"}
    </span>
  );
}
```

### Manual Reconnection

```javascript
// Reconnect manually
socket.connect();

// Disconnect
socket.disconnect();
```

---

## Room-Based Events (Future)

For campaign-specific rooms (optional enhancement):

```javascript
// Server
socket.on("join_campaign", (campaignId) => {
  socket.join(`campaign_${campaignId}`);
});

// Emit to specific campaign
io.to(`campaign_${campaignId}`).emit("donation_received", data);

// Client
socket.emit("join_campaign", campaignId);
```

---

## Debugging

Enable Socket.IO debugging:

```javascript
// Browser console
localStorage.debug = "socket.io-client:*";
```

Server-side logging is built-in:

```
⚡ Client Connected: abc123xyz
❌ Client Disconnected
```
