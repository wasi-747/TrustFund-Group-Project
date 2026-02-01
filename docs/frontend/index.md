# Frontend Overview

The TrustFund frontend is a React single-page application built with Vite.

---

## Architecture

```
frontend/
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # TailwindCSS config
├── postcss.config.js    # PostCSS config
├── public/              # Static assets
└── src/
    ├── main.jsx         # React entry point
    ├── App.jsx          # Main app component
    ├── App.css          # Global styles
    ├── index.css        # Tailwind imports
    ├── assets/          # Images, fonts
    ├── components/      # Reusable components
    ├── pages/           # Page components
    ├── context/         # React Context providers
    └── utils/           # Utilities (socket, etc.)
```

---

## Tech Stack

| Technology           | Purpose             | Version |
| -------------------- | ------------------- | ------- |
| **React**            | UI library          | v19.x   |
| **Vite**             | Build tool          | v7.x    |
| **TailwindCSS**      | Utility-first CSS   | v3.x    |
| **DaisyUI**          | Tailwind components | v5.x    |
| **React Router**     | Navigation          | v7.x    |
| **Axios**            | HTTP client         | v1.x    |
| **Framer Motion**    | Animations          | v12.x   |
| **Socket.IO Client** | Real-time           | v4.x    |
| **React Toastify**   | Notifications       | v11.x   |
| **React Icons**      | Icon library        | v5.x    |

---

## Application Entry

### `main.jsx`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### `App.jsx`

The main App component sets up:

1. **Context Providers** - Theme, Admin mode
2. **Router** - React Router with all routes
3. **Layout** - Navbar, Footer, Background
4. **Animations** - Framer Motion AnimatePresence

```jsx
function App() {
  return (
    <ThemeProvider>
      <AdminModeProvider>
        <Router>
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>{/* All routes defined here */}</Routes>
          </AnimatePresence>
          <Footer />
        </Router>
      </AdminModeProvider>
    </ThemeProvider>
  );
}
```

---

## Routing Structure

| Path               | Component            | Access               |
| ------------------ | -------------------- | -------------------- |
| `/`                | Redirect to `/login` | Public               |
| `/login`           | Login                | Public               |
| `/register`        | Register             | Public               |
| `/forgot-password` | ForgotPassword       | Public               |
| `/reset-password`  | ResetPassword        | Public               |
| `/dashboard`       | Dashboard            | Protected            |
| `/profile`         | Profile              | Protected            |
| `/settings`        | Settings             | Protected            |
| `/create-campaign` | CampaignWizard       | Protected + Verified |
| `/campaign/:id`    | CampaignDetails      | Public               |
| `/discover`        | Discover             | Public               |
| `/admin`           | AdminDashboard       | Admin Only           |
| `/resources`       | Resources            | Public               |
| `/your-impact`     | YourImpact           | Protected            |

---

## Key Features

### 🎨 Theming

- Dark/Light mode toggle
- Theme persisted in localStorage
- System preference detection

### 🔐 Authentication

- JWT token stored in localStorage
- Automatic token refresh
- Protected route guards

### 📱 Responsive Design

- Mobile-first approach
- TailwindCSS breakpoints
- Adaptive navigation

### ⚡ Real-time Updates

- Socket.IO integration
- Live donation notifications
- Connection status indicator

### 🎭 Animations

- Page transitions
- Component animations
- Interactive backgrounds

---

## Authentication Flow

```
1. User logs in → OTP sent to email
2. User enters OTP → JWT token returned
3. Token stored in localStorage
4. Token sent with all API requests
5. Protected routes check for valid token
```

### Token Handling

```javascript
// Store token after login
localStorage.setItem("token", token);

// Include token in API requests
axios.defaults.headers.common["x-auth-token"] = token;

// Remove token on logout
localStorage.removeItem("token");
```

---

## API Communication

All API calls use Axios with a base URL:

```javascript
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Example: Get all campaigns
const getCampaigns = async () => {
  const response = await axios.get(`${API_URL}/campaigns/all`);
  return response.data;
};

// Example: Create campaign (with auth)
const createCampaign = async (formData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/campaigns/create`, formData, {
    headers: {
      "x-auth-token": token,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
```

---

## Styling Approach

### TailwindCSS + DaisyUI

```jsx
// Using Tailwind utilities
<div className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
  <h1 className="text-2xl font-bold text-emerald-600">Hello</h1>
</div>

// Using DaisyUI components
<button className="btn btn-primary">Click me</button>
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
  </div>
</div>
```

### Dark Mode

```jsx
// Conditional dark mode classes
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content adapts to theme
</div>
```

---

## Related Documentation

- [Pages](pages.md) - Page component reference
- [Components](components.md) - Reusable component reference
- [Context](context.md) - State management with Context API
