import {
  useContext
} from "react";

import {
  Moon,
  Sun
} from "lucide-react";

import ThemeContext
  from "../context/ThemeContext";

import LanguageContext
  from "../context/LanguageContext";

function PreferenceControls({
  darkBackground = false
}) {
  const {
    theme,
    toggleTheme
  } = useContext(ThemeContext);

  const {
    language,
    setLanguage,
    t
  } = useContext(
    LanguageContext
  );

  const controlStyle =
    darkBackground
      ? `
          border-slate-700
          bg-slate-900
          text-slate-200
          hover:bg-slate-800
        `
      : `
          border-slate-200
          bg-white
          text-slate-700
          hover:bg-slate-50
          dark:border-slate-700
          dark:bg-slate-900
          dark:text-slate-200
          dark:hover:bg-slate-800
        `;

  return (
    <div className="flex shrink-0 items-center gap-2">
      <div
        role="group"
        aria-label={t("common.language")}
        className={`
          flex
          h-10
          w-24
          overflow-hidden
          rounded-xl
          border
          p-1
          ${controlStyle}
        `}
      >
        {["vi", "en"].map(
          (option) => {
            const isActive =
              language === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setLanguage(option)
                }
                aria-pressed={isActive}
                aria-label={
                  option === "vi"
                    ? t("common.vietnamese")
                    : t("common.english")
                }
                className={`
                  flex
                  h-full
                  flex-1
                  items-center
                  justify-center
                  rounded-lg
                  text-xs
                  font-bold
                  tracking-wide
                  transition
                  ${
                    isActive
                      ? "bg-[#A98252] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:text-stone-300 dark:hover:text-white"
                  }
                `}
              >
                {option.toUpperCase()}
              </button>
            );
          }
        )}
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        title={
          theme === "dark"
            ? t(
                "common.lightMode"
              )
            : t(
                "common.darkMode"
              )
        }
        className={`
          inline-flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          transition
          ${controlStyle}
        `}
      >
        {theme === "dark" ? (
          <Sun size={18} />
        ) : (
          <Moon size={18} />
        )}
      </button>
    </div>
  );
}

export default PreferenceControls;
