const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

// --- THIS IS THE NEW LINE YOU NEED ---
app.use("/api/auth", require("./routes/auth")); 
// ------------------------------------

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});