import {
  useContext
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import AuthContext
  from "../context/AuthContext";

import CartContext
  from "../context/CartContext";

function Header() {

  const {
    user,
    logout
  } = useContext(
    AuthContext
  );
const {
  cartItems
} = useContext(
  CartContext
);

  const navigate =
    useNavigate();
const cartCount =
  cartItems.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );
  const handleLogout = () => {

    logout();

    navigate("/");
  };

  return (

    <header className="bg-white shadow">

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          h-16
          flex
          items-center
          justify-between
        "
      >

        {/* Logo */}

        <Link
          to="/"
          className="
    flex
    items-center
    gap-3
  "
        >
          <img
            src="/logo.png"
            alt="Woodora"
            className="w-20 h-20"
          />

          <span
            className="
    text-3xl
    font-bold
    italic
    tracking-wide
  "
          >
            Woodora
          </span>
        </Link>

        {/* Navigation */}

        <nav
          className="
            flex
            items-center
            gap-6
          "
        >

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
  Products
</Link>

          {user && (
            <>
              <Link to="/cart">
  Cart ({cartCount})
</Link>

              <Link to="/profile">
                Profile
              </Link>
              <Link
                to="/my-orders"
              >
                My Orders
              </Link>
            </>
          )}

        </nav>

        {/* Right Side */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          {!user ? (
            <>
              <Link
                to="/login"
                className="
                  px-4
                  py-2
                  border
                  rounded
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  px-4
                  py-2
                  bg-black
                  text-white
                  rounded
                "
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span
                className="
                  text-sm
                  font-medium
                "
              >
                Hello, {user.fullname}
              </span>

              {user.role ===
  "admin" && (

  <div
    className="
      flex
      gap-2
    "
  >

    <Link
      to="/admin"
      className="
        px-4
        py-2
        bg-blue-600
        text-white
        rounded
      "
    >
      Dashboard
    </Link>

    <Link
      to="/admin/orders"
      className="
        px-4
        py-2
        bg-green-600
        text-white
        rounded
      "
    >
      Orders
    </Link>

  </div>

)}

              <button
                onClick={
                  handleLogout
                }
                className="
                  px-4
                  py-2
                  border
                  rounded
                "
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>

    </header>

  );
}

export default Header;