// src/app/App.tsx

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { AppRoutes } from "./routes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}