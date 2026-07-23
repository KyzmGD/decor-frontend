import {
  useContext
} from "react";

import {
  Link,
  NavLink
} from "react-router-dom";

import {
  FolderTree,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart
} from "lucide-react";

import AuthContext
  from "../context/AuthContext";

import LanguageContext
  from "../context/LanguageContext";

import PreferenceControls
  from "../components/PreferenceControls";

function AdminLayout({
  children,
  title,
  description
}) {
  const {
    user,
    logout
  } = useContext(AuthContext);

  const {
    t
  } = useContext(
    LanguageContext
  );

  const menuItems = [
    {
      to: "/admin",
      label: t(
        "common.dashboard"
      ),
      icon: LayoutDashboard,
      end: true
    },
    {
      to: "/admin/products",
      label: t(
        "common.products"
      ),
      icon: Package
    },
    {
      to: "/admin/categories",
      label: t(
        "common.categories"
      ),
      icon: FolderTree
    },
    {
      to: "/admin/orders",
      label: t(
        "common.orders"
      ),
      icon: ShoppingCart
    }
  ];

  return (
    <div
      className="
        min-h-screen
        bg-slate-100
        text-slate-900
        transition-colors
        dark:bg-slate-950
        dark:text-slate-100
      "
    >
      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          w-64
          border-r
          border-[#493F36]
          bg-[#151210]
          text-white
          lg:block
        "
      >
        <div
          className="
            flex
            h-20
            items-center
            border-b
            border-slate-800
            px-6
          "
        >
          <Link
            to="/admin"
            className="
              flex
              items-center
              gap-3
              text-2xl
              font-bold
              tracking-tight
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
        </div>

        <nav className="space-y-2 p-4">
          {menuItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({
                    isActive
                  }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-[#A98252] text-white shadow-sm"
                        : "text-stone-300 hover:bg-[#2B241F] hover:text-white"
                    ].join(" ")
                  }
                >
                  <Icon
                    size={19}
                  />

                  {item.label}
                </NavLink>
              );
            }
          )}
        </nav>

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            border-t
            border-slate-800
            p-4
          "
        >
          <Link
            to="/"
            className="
              mb-2
              flex
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-slate-300
              transition
              hover:bg-[#2B241F]
              hover:text-white
            "
          >
            <Home size={19} />

            {t(
              "common.backToHome"
            )}
          </Link>

          <button
            type="button"
            onClick={logout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-red-300
              transition
              hover:bg-red-950
            "
          >
            <LogOut size={19} />

            {t(
              "common.logout"
            )}
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header
          className="
            sticky
            top-0
            z-30
            flex
            min-h-20
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white
            px-6
            py-4
            transition-colors
            dark:border-slate-800
            dark:bg-slate-900
            lg:px-8
          "
        >
          <div className="i18n-heading-slot">
            <h1
              className="
                text-xl
                font-bold
                text-slate-900
                dark:text-white
                whitespace-nowrap
              "
            >
              {title}
            </h1>

            {description && (
              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {description}
              </p>
            )}
          </div>

          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                hidden
                text-right
                sm:block
              "
            >
              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                {user?.fullname ||
                  user?.name ||
                  t(
                    "admin.administrator"
                  )}
              </p>

              <p
                className="
                  text-xs
                  capitalize
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {user?.role}
              </p>
            </div>

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-slate-900
                font-bold
                text-white
                dark:bg-white
                dark:text-slate-900
              "
            >
              {(
                user?.fullname ||
                user?.name ||
                "A"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <PreferenceControls
              compact
            />
          </div>
        </header>

        <main
          className="
            p-4
            sm:p-6
            lg:p-8
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
