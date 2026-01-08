<<<<<<< HEAD
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, "mysecretkey123");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token is not valid" });
  }
};
=======
const jwt = require("jsonwebtoken"); module.exports = function (req, res, next) { const token = req.header("x-auth-token"); if (!token) return res.status(401).json({ message: "No token, authorization denied" }); try { const decoded = jwt.verify(token, "mysecretkey123"); req.user = decoded; next(); } catch (err) { res.status(400).json({ message: "Token is not valid" }); } };
>>>>>>> edc5603f128b58ed2653374d21d402b2cbd53632
