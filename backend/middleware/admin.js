const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    // 1. Fetch the user from the DB
    const user = await User.findById(req.user.id);

    // 2. Check if they are an Admin
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    // 3. Allowed!
    next();
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
