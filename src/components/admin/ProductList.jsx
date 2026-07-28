import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Pencil,
  Trash2,
  Package
} from "lucide-react";
import {
  Fragment,
  useContext
} from "react";
import LanguageContext from "../../context/LanguageContext";
import { formatCurrency } from "../../utils/currency";
import ProductForm from "./ProductForm";

function ProductList({
  products,
  onEdit,
  onDelete,
  selectedProduct,
  categories,
  onSubmit,
  onCancel,
  submitting,
  sortConfig,
  onSort
}) {
  const { t } = useContext(LanguageContext);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={14} />;
    }

    return sortConfig.direction === "asc"
      ? <ArrowUp size={14} />
      : <ArrowDown size={14} />;
  };

  const getSortLabel = (key) => {
    if (sortConfig.key !== key) {
      return t("admin.sortDefault");
    }

    return sortConfig.direction === "asc"
      ? t("admin.sortLowestFirst")
      : t("admin.sortHighestFirst");
  };

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

            <th
              className="px-6 py-4 font-semibold"
              aria-sort={
                sortConfig.key === "price"
                  ? sortConfig.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <button
                type="button"
                onClick={() => onSort("price")}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-[#EDE6DC] hover:text-[#7A5A35] focus:outline-none focus:ring-2 focus:ring-[#A98252]/40 dark:hover:bg-[#2B241F] dark:hover:text-[#C5A26B]"
                title={getSortLabel("price")}
                aria-label={`${t("common.price")}: ${getSortLabel("price")}`}
              >
                {t("common.price")}
                {getSortIcon("price")}
              </button>
            </th>

            <th
              className="px-6 py-4 font-semibold"
              aria-sort={
                sortConfig.key === "stock"
                  ? sortConfig.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <button
                type="button"
                onClick={() => onSort("stock")}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-[#EDE6DC] hover:text-[#7A5A35] focus:outline-none focus:ring-2 focus:ring-[#A98252]/40 dark:hover:bg-[#2B241F] dark:hover:text-[#C5A26B]"
                title={getSortLabel("stock")}
                aria-label={`${t("common.stock")}: ${getSortLabel("stock")}`}
              >
                {t("common.stock")}
                {getSortIcon("stock")}
              </button>
            </th>

            <th className="px-6 py-4 text-right font-semibold">
              {t("common.actions")}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <Fragment key={product.id}>
            <tr
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
            {selectedProduct?.id === product.id && (
              <tr>
                <td
                  colSpan="5"
                  className="bg-slate-50 px-4 py-5 dark:bg-slate-950/70"
                >
                  <div className="mx-auto max-w-4xl rounded-2xl border border-[#A98252]/40 bg-white pt-6 shadow-sm dark:border-[#C5A26B]/50 dark:bg-slate-900">
                    <div className="px-6">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {t("admin.editProduct")}: {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {t("admin.formDescription")}
                      </p>
                    </div>
                    <ProductForm
                      selectedProduct={selectedProduct}
                      categories={categories}
                      onSubmit={onSubmit}
                      onCancel={onCancel}
                      submitting={submitting}
                    />
                  </div>
                </td>
              </tr>
            )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
