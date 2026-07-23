import {
  Pencil,
  Trash2,
  Package
} from "lucide-react";
import { useContext } from "react";
import LanguageContext from "../../context/LanguageContext";
import { formatCurrency } from "../../utils/currency";

function ProductList({
  products,
  onEdit,
  onDelete
}) {
  const { t } = useContext(LanguageContext);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4 font-semibold">
              {t("common.product")}
            </th>

            <th className="px-6 py-4 font-semibold">
              {t("common.categories")}
            </th>

            <th className="px-6 py-4 font-semibold">
              {t("common.price")}
            </th>

            <th className="px-6 py-4 font-semibold">
              {t("common.stock")}
            </th>

            <th className="px-6 py-4 text-right font-semibold">
              {t("common.actions")}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr
              key={product.id}
              className="transition-colors duration-200 hover:bg-[#F7F0E6] hover:shadow-[inset_3px_0_0_#A98252] dark:hover:bg-[#2B241F]"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <Package size={22} />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-slate-900">
                      {product.name}
                    </p>

                    <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                      {product.description || t("common.noDescription")}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {product.category?.name ||
                    product.Category?.name ||
                    t("common.uncategorized")}
                </span>
              </td>

              <td className="px-6 py-4 font-semibold text-slate-900">
                {formatCurrency(product.price)}
              </td>

              <td className="px-6 py-4">
                <span
                  className={[
                    "rounded-full px-3 py-1 text-sm font-medium",
                    Number(product.stock) > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  ].join(" ")}
                >
                  {product.stock || 0}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-[#A98252] hover:bg-[#F1E6D7] hover:text-[#7A5A35] dark:border-stone-700 dark:text-stone-300 dark:hover:border-[#C5A26B] dark:hover:bg-[#2B241F] dark:hover:text-[#C5A26B]"
                    title={t("common.edit")}
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(product.id)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-stone-700 dark:text-stone-300 dark:hover:border-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                    title={t("common.delete")}
                  >
                    <Trash2 size={17} />
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

export default ProductList;
