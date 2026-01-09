const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
const server = http.createServer(app);

// ✅ DYNAMIC ORIGINS (Allows Localhost AND Vercel)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5172",
  "https://trustfund-frontend.vercel.app", // Your Vercel URL
];

// ⚡ SETUP SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Use the list above
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ Client Connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ Client Disconnected");
  });
});

// ✅ MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ROBUST CORS CONFIG (Crucial for live deployment)
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allows tokens/cookies if needed
  })
);

// ✅ STATIC FOLDER (Still useful for local testing)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ DEFINE ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/campaigns", require("./routes/campaign"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/verification", require("./routes/verification"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));

// ✅ CRITICAL FIX FOR RENDER: Use process.env.PORT
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
