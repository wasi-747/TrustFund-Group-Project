# Context (State Management)

React Context API usage for global state management.

---

## Overview

TrustFund uses React Context for:

- **Theme management** - Dark/Light mode
- **Admin mode** - Admin-specific UI states

---

## ThemeContext

File: `src/context/ThemeContext.jsx`

Manages application-wide theme (dark/light mode).

### Provider Setup

```jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem("theme");
    if (saved) return saved;

    // Then check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    // Update localStorage
    localStorage.setItem("theme", theme);

    // Update document class for Tailwind
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

### Usage in Components

```jsx
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>{theme === "light" ? "🌙" : "☀️"}</button>
  );
}
```

### Conditional Styling

```jsx
const { theme } = useTheme();

return (
  <div
    className={`
    p-4 rounded-lg
    ${theme === "dark" ? "bg-gray-800" : "bg-white"}
  `}
  >
    Content
  </div>
);
```

Or use Tailwind dark mode classes:

```jsx
<div className="bg-white dark:bg-gray-800">Content</div>
```

---

## AdminContext

File: `src/context/AdminContext.jsx`

Manages admin mode state for UI customization.

### Provider Setup

```jsx
import { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const AdminModeProvider = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);

  const enableAdminMode = () => setIsAdminMode(true);
  const disableAdminMode = () => setIsAdminMode(false);
  const toggleAdminMode = () => setIsAdminMode((prev) => !prev);

  return (
    <AdminContext.Provider
      value={{
        isAdminMode,
        enableAdminMode,
        disableAdminMode,
        toggleAdminMode,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminMode = () => useContext(AdminContext);
```

### Usage

```jsx
import { useAdminMode } from "../context/AdminContext";

function CampaignCard({ campaign }) {
  const { isAdminMode } = useAdminMode();

  return (
    <div className="card">
      <h3>{campaign.title}</h3>

      {isAdminMode && (
        <div className="admin-controls">
          <button>Ban Campaign</button>
          <button>Feature Campaign</button>
        </div>
      )}
    </div>
  );
}
```

---

## App Provider Structure

In `App.jsx`, providers are nested:

```jsx
function App() {
  return (
    <ThemeProvider>
      <AdminModeProvider>
        <Router>
          <AppContent />
        </Router>
      </AdminModeProvider>
    </ThemeProvider>
  );
}
```

!!! note "Provider Order"
ThemeProvider should wrap everything since many components need theme access. AdminModeProvider is nested inside since it has fewer consumers.

---

## Creating Custom Context

Template for new contexts:

```jsx
// src/context/YourContext.jsx
import { createContext, useContext, useState } from "react";

// 1. Create context
const YourContext = createContext();

// 2. Create provider
export const YourProvider = ({ children }) => {
  const [state, setState] = useState(initialValue);

  const actions = {
    doSomething: () => {
      /* ... */
    },
    doSomethingElse: () => {
      /* ... */
    },
  };

  return (
    <YourContext.Provider value={{ state, ...actions }}>
      {children}
    </YourContext.Provider>
  );
};

// 3. Create hook for easy access
export const useYour = () => {
  const context = useContext(YourContext);
  if (!context) {
    throw new Error("useYour must be used within YourProvider");
  }
  return context;
};
```

---

## Best Practices

### 1. Split Contexts by Domain

Don't put everything in one giant context:

```jsx
// ✅ Good - Separate concerns
<ThemeProvider>
  <AuthProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </AuthProvider>
</ThemeProvider>

// ❌ Bad - One massive context
<AppProvider>
  <App />
</AppProvider>
```

### 2. Memoize Context Values

Prevent unnecessary re-renders:

```jsx
import { useMemo } from "react";

const value = useMemo(
  () => ({
    theme,
    toggleTheme,
  }),
  [theme],
);

return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
```

### 3. Use Custom Hooks

Always create a custom hook for context access:

```jsx
// ✅ Good
const { theme } = useTheme();

// ❌ Bad
const { theme } = useContext(ThemeContext);
```

### 4. Handle Missing Provider

```jsx
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
```

---

## Potential Future Contexts

Consider adding:

- **AuthContext** - Current user state, login/logout functions
- **NotificationContext** - Global notification queue
- **SocketContext** - Socket.IO connection management
- **CartContext** - If implementing donation cart feature
