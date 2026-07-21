import {
  useContext
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import AuthContext
  from "../context/AuthContext";

function Header() {

  const {
    user,
    logout
  } = useContext(
    AuthContext
  );

  const navigate =
    useNavigate();

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
            text-2xl
            font-bold
          "
        >
          CMC Decor
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

          <Link to="/">
            Products
          </Link>

          {user && (
            <>
              <Link to="/cart">
                Cart
              </Link>

              <Link to="/profile">
                Profile
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