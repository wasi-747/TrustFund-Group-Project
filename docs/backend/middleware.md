# Middleware

Express middleware used throughout the backend.

---

## Authentication Middleware

File: `backend/middleware/auth.js`

Verifies JWT tokens for protected routes.

### Usage

```javascript
const auth = require("../middleware/auth");

router.get("/protected", auth, (req, res) => {
  // req.user is available here
  res.json({ userId: req.user.id });
});
```

### Implementation

```javascript
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
```

### Token Payload

The JWT token contains:

```json
{
  "user": {
    "id": "user_mongodb_id",
    "role": "contributor"
  }
}
```

---

## Admin Middleware

File: `backend/middleware/admin.js`

Restricts routes to admin users only.

### Usage

```javascript
const auth = require("../middleware/auth");
const adminCheck = require("../middleware/admin");

// Must chain with auth middleware first
router.get("/admin-only", auth, adminCheck, (req, res) => {
  res.json({ message: "Admin access granted" });
});
```

### Implementation

```javascript
const adminCheck = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Access Denied: Admins Only" });
  }
};
```

!!! warning "Order Matters"
Always use `auth` middleware before `adminCheck`. The admin middleware depends on `req.user` being populated by the auth middleware.

---

## Upload Middleware

File: `backend/middleware/upload.js`

Handles file uploads using Multer.

### Configuration

```javascript
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|avif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

module.exports = upload;
```

### Usage Examples

**Single File Upload:**

```javascript
router.post("/upload", upload.single("image"), (req, res) => {
  res.json({ path: req.file.path });
});
```

**Multiple Files:**

```javascript
router.post(
  "/upload",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  (req, res) => {
    res.json({
      image: req.files.image?.[0]?.path,
      video: req.files.video?.[0]?.path,
    });
  },
);
```

### File Access

Uploaded files are served statically:

```javascript
// In server.js
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
```

Access URL: `http://localhost:5000/uploads/filename.jpg`

---

## Middleware Chain Examples

### Public Route (No Auth)

```javascript
router.get("/campaigns/all", async (req, res) => {
  // Anyone can access
});
```

### Authenticated Route

```javascript
router.post("/campaigns/create", auth, async (req, res) => {
  // Only logged-in users
});
```

### Authenticated + Verified Route

```javascript
router.post("/campaigns/create", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user.isVerified) {
    return res.status(403).json({ msg: "Verification required" });
  }
  // Verified users only
});
```

### Admin Route

```javascript
router.get("/admin/dashboard", auth, adminCheck, async (req, res) => {
  // Only admins
});
```

### Authenticated + File Upload

```javascript
router.put("/profile", auth, upload.single("avatar"), async (req, res) => {
  // Logged-in user with file upload
});
```

---

## Error Handling

Middleware errors should be handled gracefully:

```javascript
// Global error handler in server.js
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ msg: "File too large. Max 5MB allowed." });
    }
  }

  res.status(500).json({ msg: "Server Error" });
});
```
