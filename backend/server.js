const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // <--- Import Path

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Make the 'uploads' folder public so the frontend can see images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error(err));

<<<<<<< HEAD
app.use("/api/auth", require("./routes/auth"));
app.use("/api/campaigns", require("./routes/campaign"));
=======
// --- THIS IS THE NEW LINE YOU NEED ---
app.use("/api/auth", require("./routes/auth")); 
// ------------------------------------
>>>>>>> d32546ce34539d6b08013170cca67db1821eb437

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});