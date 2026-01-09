const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  // 1. Get token from header
  const token = req.header("x-auth-token");

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // 3. Verify token
  try {
    // ✅ CRITICAL: Must use process.env.JWT_SECRET to match the login route
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("❌ Auth Error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
