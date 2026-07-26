import {
  useContext,
  useEffect,
  useState
} from "react";
import {
  Save,
  X
} from "lucide-react";

import LanguageContext from "../../context/LanguageContext";

function CategoryForm({
  selectedCategory,
  onSubmit,
  onCancel,
  submitting = false
}) {
  const { t } = useContext(LanguageContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(selectedCategory?.name || "");
    setDescription(selectedCategory?.description || "");
  }, [selectedCategory]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim()
    });
  };

  const inputClasses =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98252] focus:ring-2 focus:ring-[#A98252]/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
        {t("admin.requiredFields")}
      </p>

      <div className="space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.name")} <span className="text-red-500">*</span>
          </span>
          <input
            required
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("admin.categoryNameHint")}
            className={inputClasses}
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {t("admin.categoryNameHelp")}
          </p>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.description")}
          </span>
          <textarea
            rows="4"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("admin.categoryDescriptionHint")}
            className={`${inputClasses} resize-y`}
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <X size={18} />
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#A98252] dark:hover:bg-[#BD996B]"
        >
          <Save size={18} />
          {submitting
            ? t("common.loading")
            : selectedCategory
              ? t("admin.updateCategory")
              : t("admin.createCategory")}
        </button>
      </div>
    </form>
  );
}

export default CategoryForm;
