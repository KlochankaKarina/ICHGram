import { createRoot } from "react-dom/client";
import "./app/styles/index.css";
import App from "./app/App.tsx";
import { BrowserRouter } from "react-router-dom";
import StoreProvider from "./app/providers/StoreProvider.tsx";
import { AuthProvider } from "./app/providers/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
   <StoreProvider>
    <AuthProvider>
         <App />
    </AuthProvider>
  </StoreProvider>
  </BrowserRouter>,
);
