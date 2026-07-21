import {
  useContext
} from "react";

import ProductCreate
  from "./pages/admin/ProductCreate";

import ProductEdit
  from "./pages/admin/ProductEdit";
  
import ProductList
  from "./components/admin/ProductList";
import {
  Routes,
  Route
} from "react-router-dom";

import AuthContext
  from "./context/AuthContext";

import Home
  from "./pages/Home";

import ProductDetail
  from "./pages/ProductDetail";

import Login
  from "./pages/Login";

import Register
  from "./pages/Register";

import Cart
  from "./pages/Cart";

import Profile
  from "./pages/Profile";

import AdminDashboard
  from "./pages/admin/AdminDashboard";

import PrivateRoute
  from "./components/PrivateRoute";

import AdminRoute
  from "./components/AdminRoute";

function App() {

  const {
    user
  } = useContext(
    AuthContext
  );

  return (

    <Routes>

      <Route
        path="/"
        element={<Home />}
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
        path="/profile"
        element={
          <PrivateRoute
            user={user}
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
          >
            <Cart />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute
            user={user}
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
    >
      <ProductList />
    </AdminRoute>
  }
/>
<Route
  path="/admin/products/create"
  element={
    <AdminRoute user={user}>
      <ProductCreate />
    </AdminRoute>
  }
/>

<Route
  path="/admin/products/edit/:id"
  element={
    <AdminRoute user={user}>
      <ProductEdit />
    </AdminRoute>
  }
/>
    </Routes>

  );
}

export default App;