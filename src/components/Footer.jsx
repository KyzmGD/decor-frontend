import { useContext } from "react";
import { ChevronRight, Mail, MapPin, Phone } from "lucide-react";
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
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr_1fr]">
          <div>
            <p className="text-xl font-bold text-slate-950 dark:text-white">
              Woodora
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-950 dark:text-white">
              {t("footer.contactInformation")}
            </h2>
            <address className="mt-4 space-y-3 not-italic text-sm text-slate-500 dark:text-slate-400">
              <a
                href="tel:+84865936588"
                className="flex w-fit items-center gap-3 transition-colors hover:text-[#A98252]"
              >
                <Phone size={17} aria-hidden="true" />
                <span>
                  {t("common.phone")}: 0865936588
                </span>
              </a>
              <a
                href="mailto:info@woodora.site"
                className="flex w-fit items-center gap-3 transition-colors hover:text-[#A98252]"
              >
                <Mail size={17} aria-hidden="true" />
                <span>
                  {t("common.email")}: info@woodora.site
                </span>
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=XQMF%2B83%20Ha%20Dong%20Hanoi%20Vietnam"
                target="_blank"
                rel="noreferrer"
                className="flex w-fit items-start gap-3 transition-colors hover:text-[#A98252]"
              >
                <MapPin size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  {t("common.address")}: {t("footer.address")}
                </span>
              </a>
            </address>
          </div>

          <nav
            aria-label={t("footer.navigation")}
            className="w-full text-sm md:w-44 md:justify-self-end"
          >
            <h2 className="font-semibold text-slate-950 dark:text-white">
              {t("footer.explore")}
            </h2>
            <div className="mt-4 flex w-full flex-col gap-3">
              <Link
                to="/"
                className="group flex w-full items-center justify-start gap-2 text-left text-slate-500 transition-colors hover:text-[#A98252] dark:text-slate-400"
              >
                <ChevronRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                {t("common.home")}
              </Link>
              <Link
                to="/products"
                className="group flex w-full items-center justify-start gap-2 text-left text-slate-500 transition-colors hover:text-[#A98252] dark:text-slate-400"
              >
                <ChevronRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                {t("common.products")}
              </Link>
              <Link
                to="/wishlist"
                className="group flex w-full items-center justify-start gap-2 text-left text-slate-500 transition-colors hover:text-[#A98252] dark:text-slate-400"
              >
                <ChevronRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                {t("common.wishlist")}
              </Link>
              <Link
                to="/cart"
                className="group flex w-full items-center justify-start gap-2 text-left text-slate-500 transition-colors hover:text-[#A98252] dark:text-slate-400"
              >
                <ChevronRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                {t("common.cart")}
              </Link>
            </div>
          </nav>
        </div>

        <p className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          © 2026 Woodora. {t("footer.rightsReserved")}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
