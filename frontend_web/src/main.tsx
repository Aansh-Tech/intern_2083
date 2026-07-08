// src/main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./index.css"; // adjust path if your global CSS lives elsewhere

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);