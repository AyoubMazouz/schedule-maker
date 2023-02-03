import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GlobalContextProvider } from "./Contexts/GlobalContext";
import { AuthProvider } from "./Contexts/AuthContext";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GlobalContextProvider>
          <App />
        </GlobalContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
