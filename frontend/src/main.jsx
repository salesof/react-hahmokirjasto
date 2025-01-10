import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/style.css";
import App from "./App.jsx";
import { UserProvider } from "./components/UserContext.jsx";

createRoot(document.getElementById("main")).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
