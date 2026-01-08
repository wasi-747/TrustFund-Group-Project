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

// ⚡ SETUP SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ Client Connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ Client Disconnected");
  });
});

// ✅ MIDDLEWARE (Must be BEFORE routes)
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// ✅ IMPORTANT: Make 'uploads' folder public so frontend can display images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error(err));

// ✅ DEFINE ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/campaigns", require("./routes/campaign"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/verification", require("./routes/verification"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin")); // 👈 Admin Route (Kept only this one)

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
