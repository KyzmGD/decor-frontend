import {
  useContext
} from "react";

import {
  Link,
  NavLink
} from "react-router-dom";
import {
  Heart,
  ShoppingBag
} from "lucide-react";

import AuthContext
  from "../context/AuthContext";

import LanguageContext
  from "../context/LanguageContext";

import PreferenceControls
  from "../components/PreferenceControls";
import WishlistContext
  from "../context/WishlistContext";
import CartContext
  from "../context/CartContext";

function Header() {
  const {
    user,
    logout
  } = useContext(AuthContext);

  const {
    t
  } = useContext(
    LanguageContext
  );

  const {
    wishlistCount
  } = useContext(WishlistContext);
  const visibleWishlistCount =
    user ? wishlistCount : 0;

  const {
    cartItems
  } = useContext(CartContext);

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  const navClass = ({
    isActive
  }) =>
    [
      "i18n-nav-item text-sm font-medium transition",
      isActive
        ? "text-slate-950 dark:text-white"
        : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
    ].join(" ");

  return (
    <header
      className="
        sticky
        top-0
        z-40
        border-b
        border-slate-200
        bg-white/95
        backdrop-blur
        transition-colors
        dark:border-slate-800
        dark:bg-slate-900/95
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          gap-6
          px-6
          py-4
        "
      >
        <Link
          to="/"
          className="
            flex
            shrink-0
            items-center
            gap-3
            text-2xl
            font-bold
            text-slate-950
            dark:text-white
          "
        >
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            width="40"
            height="40"
            decoding="async"
            className="
              h-10
              w-10
              shrink-0
              object-contain
            "
          />

          <span>Woodora</span>
        </Link>

        <nav
          className="
            hidden
            items-center
            gap-6
            md:flex
          "
        >
          <NavLink
            to="/"
            className={navClass}
          >
            {t("common.home")}
          </NavLink>

          <NavLink
            to="/products"
            className={navClass}
          >
            {t(
              "common.products"
            )}
          </NavLink>

          {user && (
            <NavLink
              to="/my-orders"
              className={
                navClass
              }
            >
              {t(
                "common.orders"
              )}
            </NavLink>
          )}
        </nav>

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          {user && (
            <>
          <Link
            to="/wishlist"
            aria-label={`${t("common.wishlist")} (${visibleWishlistCount})`}
            className="
              relative
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-slate-600
              hover:bg-stone-100
              hover:text-[#A98252]
              dark:text-stone-300
              dark:hover:bg-stone-800
            "
          >
            <Heart
              size={20}
              fill={visibleWishlistCount > 0 ? "currentColor" : "none"}
            />

            {visibleWishlistCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#A98252]
                  px-1
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                {visibleWishlistCount > 99 ? "99+" : visibleWishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label={`${t("common.cart")} (${cartCount})`}
            className="
              relative
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-600
              transition
              hover:bg-stone-100
              hover:text-[#A98252]
              dark:text-stone-300
              dark:hover:bg-stone-800
            "
          >
            <ShoppingBag size={20} />

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#A98252]
                  px-1
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
            </>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="
                  hidden
                  i18n-action
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-100
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                  sm:block
                "
              >
                {t(
                  "common.profile"
                )}
              </Link>

              {user.role ===
                "admin" && (
                <Link
                  to="/admin"
                  className="
                    rounded-lg
                    i18n-action
                    bg-slate-900
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-slate-800
                    dark:bg-white
                    dark:text-slate-900
                  "
                >
                  Admin
                </Link>
              )}

              <button
                type="button"
                onClick={logout}
                className="
                  rounded-lg
                  i18n-action
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-red-600
                  transition
                  hover:bg-red-50
                  dark:text-red-400
                  dark:hover:bg-red-950/40
                "
              >
                {t(
                  "common.logout"
                )}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="
                rounded-lg
                i18n-action
                bg-slate-900
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-slate-800
                dark:bg-white
                dark:text-slate-900
              "
            >
              {t(
                "common.login"
              )}
            </Link>
              )}

          <PreferenceControls
            compact
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
