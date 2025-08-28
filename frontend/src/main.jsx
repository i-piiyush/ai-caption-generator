import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { PostProvider } from "./context/PostProvider.jsx"; // <-- Use named import
import "./index.css";

// The order of providers matters if one depends on the other.
// AuthProvider should be on the outside as PostProvider might need user data.
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <PostProvider>
        <App />
      </PostProvider>
    </AuthProvider>
  </BrowserRouter>
);
