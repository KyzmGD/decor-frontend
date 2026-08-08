import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  Link,
  NavLink,
  useNavigate
} from "react-router-dom";
import {
  Heart,
  Search,
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
import { getProducts } from "../api/productApi";

function Header() {
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchableProducts, setSearchableProducts] = useState(null);

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

  useEffect(() => {
    if (!searchOpen) {
      return undefined;
    }

    const closeSearch = (event) => {
      if (
        event.key === "Escape" ||
        (
          event.type === "mousedown" &&
          !searchContainerRef.current?.contains(event.target)
        )
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", closeSearch);
    document.addEventListener("keydown", closeSearch);

    return () => {
      document.removeEventListener("mousedown", closeSearch);
      document.removeEventListener("keydown", closeSearch);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen || searchableProducts !== null) {
      return undefined;
    }

    let active = true;

    getProducts()
      .then((response) => {
        if (active) {
          setSearchableProducts(response.data || []);
        }
      })
      .catch((error) => {
        console.error("Load search products failed:", error);

        if (active) {
          setSearchableProducts([]);
        }
      });

    return () => {
      active = false;
    };
  }, [searchOpen, searchableProducts]);

  const matchingProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query || !searchableProducts) {
      return [];
    }

    return searchableProducts
      .filter((product) =>
        product.name?.toLowerCase().includes(query)
      )
      .sort((first, second) => {
        const firstName = first.name.toLowerCase();
        const secondName = second.name.toLowerCase();
        const getMatchPriority = (name) => {
          if (name === query) return 0;
          if (name.startsWith(query)) return 1;
          return 2;
        };

        return (
          getMatchPriority(firstName) -
            getMatchPriority(secondName) ||
          firstName.localeCompare(secondName)
        );
      });
  }, [searchQuery, searchableProducts]);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();
    if (!query) {
      return;
    }

    navigate(`/products?search=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  };

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
        site-header
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
            brand-link
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
              brand-logo
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
            <>
              <NavLink
                to="/my-orders"
                className={navClass}
              >
                {t("common.orders")}
              </NavLink>
              <NavLink
                to="/transactions"
                className={navClass}
              >
                {t("common.transactions")}
              </NavLink>
            </>
          )}
        </nav>

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            ref={searchContainerRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label={t("common.search")}
              aria-expanded={searchOpen}
              aria-controls="header-search-panel"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-slate-600
                transition
                hover:bg-stone-100
                hover:text-[#A98252]
                dark:text-stone-300
                dark:hover:bg-stone-800
              "
            >
              <Search size={20} />
            </button>

            {searchOpen && (
              <form
                id="header-search-panel"
                onSubmit={handleSearch}
                role="search"
                className="fixed left-1/2 top-[76px] z-50 w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-stone-200 bg-white p-3 shadow-xl dark:border-stone-700 dark:bg-stone-900"
              >
                <div className="flex items-center gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder={t("user.searchProducts")}
                      autoFocus
                      required
                      className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-3 text-sm text-stone-900 outline-none focus:border-[#A98252] focus:ring-2 focus:ring-[#A98252]/20 dark:border-stone-600 dark:bg-stone-950 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    aria-label={t("common.search")}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A98252] text-white transition hover:bg-[#7A5A35]"
                  >
                    <Search size={18} />
                  </button>
                </div>

                {searchQuery.trim() && searchableProducts === null && (
                  <p className="px-2 pb-1 pt-3 text-sm text-stone-500">
                    {t("common.loading")}
                  </p>
                )}

                {matchingProducts.length > 0 && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700">
                    {matchingProducts.slice(0, 3).map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 border-b border-stone-100 p-3 text-left transition last:border-b-0 hover:bg-[#F7F0E6] dark:border-stone-800 dark:hover:bg-[#2B241F]"
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-400 dark:bg-stone-800">
                            <Search size={17} />
                          </div>
                        )}
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                            {product.name}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-stone-500 dark:text-stone-400">
                            {product.category?.name ||
                              product.Category?.name ||
                              t("common.uncategorized")}
                          </span>
                        </span>
                      </Link>
                    ))}

                    {matchingProducts.length > 3 && (
                      <button
                        type="submit"
                        className="w-full border-t border-stone-100 px-4 py-2.5 text-left text-sm font-semibold text-[#A98252] transition hover:bg-[#F7F0E6] dark:border-stone-800 dark:hover:bg-[#2B241F]"
                      >
                        {t("user.andMoreResults")}
                      </button>
                    )}
                  </div>
                )}
              </form>
            )}
          </div>

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
