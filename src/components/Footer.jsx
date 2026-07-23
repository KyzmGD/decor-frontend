import { useContext } from "react";
import { Link } from "react-router-dom";

import LanguageContext from "../context/LanguageContext";

function Footer() {
  const { t } = useContext(LanguageContext);

  return (
    <footer
      className="
        mt-auto
        border-t
        border-slate-200
        bg-white
        transition-colors
        duration-200
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          gap-4
          px-6
          py-8
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © 2026 Woodora
        </p>

        <nav
          aria-label={t("common.footerNavigation", "Footer navigation")}
          className="flex gap-5 text-sm"
        >
          <Link
            to="/"
            className="i18n-nav-item
              text-slate-500
              transition-colors
              hover:text-slate-950
              dark:text-slate-400
              dark:hover:text-white
            "
          >
            {t("common.home")}
          </Link>

          <Link
            to="/products"
            className="i18n-nav-item
              text-slate-500
              transition-colors
              hover:text-slate-950
              dark:text-slate-400
              dark:hover:text-white
            "
          >
            {t("common.products")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
