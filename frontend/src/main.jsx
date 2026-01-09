import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import axios from "axios";

// 👇 SMART SWITCH: Automatically detects if you are on Vercel or Localhost
const isLocal = window.location.hostname === "localhost";

axios.defaults.baseURL = isLocal
  ? "http://localhost:5000" // Local Backend
  : "https://your-backend-name.onrender.com"; // 👈 PASTE YOUR RENDER URL HERE

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
