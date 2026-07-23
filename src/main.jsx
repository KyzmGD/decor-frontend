import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter
} from "react-router-dom";

import {
  Toaster
} from "react-hot-toast";

import App from "./App";

import {
  AuthProvider
} from "./context/AuthContext";

import {
  CartProvider
} from "./context/CartContext";
import {
  WishlistProvider
} from "./context/WishlistContext";

import {
  ThemeProvider
} from "./context/ThemeContext";

import {
  LanguageProvider
} from "./context/LanguageContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Toaster />
                <App />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
