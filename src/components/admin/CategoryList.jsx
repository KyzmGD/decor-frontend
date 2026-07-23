import {
  FolderTree,
  Pencil,
  Trash2
} from "lucide-react";
import { useContext } from "react";
import LanguageContext
  from "../../context/LanguageContext";
function CategoryList({
  categories,
  onEdit,
  onDelete
}) {
  const { t } = useContext(LanguageContext);
  if (!categories?.length) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <FolderTree size={26} />
        </div>

        <h3 className="font-semibold text-slate-900">
          {t("common.noData")}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {t("admin.categoryDescription")}
        </p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
    <th className="w-[28%] px-6 py-4 font-semibold">
      {t("common.name")}
    </th>

    <th className="w-[52%] px-6 py-4 font-semibold">
      {t("common.description")}
    </th>

    <th className="w-[20%] px-6 py-4 text-right font-semibold">
      {t("common.actions")}
    </th>
  </tr>
</thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {categories.map((category) => (
            <tr
                key={category.id}
  className="
    transition
    hover:bg-slate-50
    dark:hover:bg-slate-800/60
  "
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <FolderTree size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">
  {category.name}
</p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      ID: #{category.id}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
  {category.description ||
    t("common.noData")}
</p>
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    title={t("common.edit")}
                    aria-label={`${t("common.edit")} ${category.name}`}
                    className="
                      inline-flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      text-slate-600
                      transition
                      hover:border-amber-300
                      hover:bg-amber-50
                      hover:text-amber-800
                      focus:outline-none
                      focus:ring-2
                      focus:ring-amber-200
                    "
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(category.id)}
                    title={t("common.delete")}
                    aria-label={`${t("common.delete")} ${category.name}`}
                    className="
                      inline-flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      text-slate-600
                      transition
                      hover:border-red-200
                      hover:bg-red-50
                      hover:text-red-600
                      focus:outline-none
                      focus:ring-2
                      focus:ring-red-200
                    "
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryList;
