import { useContext } from "react";
import {
  Routes,
  Route
} from "react-router-dom";

import AuthContext
  from "./context/AuthContext";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";

import AdminDashboard
  from "./pages/admin/AdminDashboard";

import AdminProducts
  from "./pages/admin/AdminProducts";

import AdminCategories
  from "./pages/admin/AdminCategories";

import OrderManagement
  from "./pages/admin/OrderManagement";

import PrivateRoute
  from "./components/PrivateRoute";

import AdminRoute
  from "./components/AdminRoute";

function App() {
  const {
    user,
    loading
  } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetail />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/wishlist"
        element={
          <PrivateRoute
            user={user}
            loading={loading}
          >
            <Wishlist />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute
            user={user}
            loading={loading}
          >
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <PrivateRoute
            user={user}
            loading={loading}
          >
            <Cart />
          </PrivateRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <PrivateRoute
            user={user}
            loading={loading}
          >
            <Checkout />
          </PrivateRoute>
        }
      />

      <Route
        path="/my-orders"
        element={
          <PrivateRoute
            user={user}
            loading={loading}
          >
            <MyOrders />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute
            user={user}
            loading={loading}
          >
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <AdminRoute
            user={user}
            loading={loading}
          >
            <AdminProducts />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <AdminRoute
            user={user}
            loading={loading}
          >
            <AdminCategories />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminRoute
            user={user}
            loading={loading}
          >
            <OrderManagement />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
