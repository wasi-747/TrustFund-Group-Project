const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  // 1. Get token from header
  const token = req.header("x-auth-token");

  // Debugging Logs
  console.log("------------------------------------------------");
  console.log("🔍 AUTH MIDDLEWARE DEBUG:");
  console.log(
    "1. Token Received:",
    token ? `${token.substring(0, 10)}...` : "NONE"
  );

  // Check if secret exists
  if (!process.env.JWT_SECRET) {
    console.error(
      "❌ CRITICAL ERROR: process.env.JWT_SECRET is undefined! Check your .env file."
    );
    return res.status(500).json({ msg: "Server Error: Missing Config" });
  } else {
    console.log(
      "2. Secret Key Status: Present (Length: " +
        process.env.JWT_SECRET.length +
        ")"
    );
  }

  // 2. Check if no token
  if (!token) {
    console.log("❌ Result: No token found in header.");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // 3. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Result: Token Verified Successfully!");
    console.log("   User ID:", decoded.user.id);

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("❌ Result: VERIFICATION FAILED.");
    console.error("   Error Message:", err.message);
    // ^^^ THIS LINE IS KEY. Is it "invalid signature", "jwt malformed", or "jwt expired"?

    res.status(401).json({ msg: "Token is not valid" });
  }
  console.log("------------------------------------------------");
};
