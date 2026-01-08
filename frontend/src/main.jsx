import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios"; // 👈 Import Axios
import "./index.css";
import App from "./App.jsx";

// 👇 CONFIGURATION: Set the Global Base URL
// If .env.production exists (Vercel), use that. Otherwise (Localhost), use port 5000.
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
