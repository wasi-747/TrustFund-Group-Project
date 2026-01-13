const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    // OPTION A: Fast Check (If role is in token)
    if (req.user.role === "admin") {
      return next();
    }

    // OPTION B: Double Check (If role wasn't in token, check DB)
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    next();
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
