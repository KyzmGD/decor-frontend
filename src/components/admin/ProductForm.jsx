import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  Image,
  Save,
  X
} from "lucide-react";

import LanguageContext from "../../context/LanguageContext";

const inputClasses =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98252] focus:ring-2 focus:ring-[#A98252]/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

function ProductForm({
  selectedProduct,
  categories,
  onSubmit,
  onCancel,
  submitting = false
}) {
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    categoryId: ""
  });
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setForm({
      name: selectedProduct?.name || "",
      description: selectedProduct?.description || "",
      price: selectedProduct?.price ?? "",
      stock: selectedProduct?.stock ?? "",
      image: selectedProduct?.image || "",
      categoryId: selectedProduct?.categoryId ?? ""
    });
    setImageFailed(false);
  }, [selectedProduct]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));

    if (field === "image") {
      setImageFailed(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 pt-0">
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
        {t("admin.requiredFields")}
      </p>

      <div className="grid gap-5 md:grid-cols-[280px_minmax(0,1fr)] md:items-start">
        <label className="block md:col-start-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.name")} <span className="text-red-500">*</span>
          </span>
          <input
            required
            autoFocus
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder={t("admin.productNameHint")}
            className={inputClasses}
          />
        </label>

        <label className="block md:col-start-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.description")}
          </span>
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder={t("admin.productDescriptionHint")}
            className={`${inputClasses} resize-y`}
          />
        </label>

        <label className="block md:col-start-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.price")} <span className="text-red-500">*</span>
          </span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) => updateField("price", event.target.value)}
            className={inputClasses}
          />
        </label>

        <label className="block md:col-start-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.stock")} <span className="text-red-500">*</span>
          </span>
          <input
            required
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={(event) => updateField("stock", event.target.value)}
            className={inputClasses}
          />
        </label>

        <label className="block md:col-start-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.categories")} <span className="text-red-500">*</span>
          </span>
          <select
            required
            value={form.categoryId}
            onChange={(event) =>
              updateField("categoryId", event.target.value)
            }
            className={inputClasses}
          >
            <option value="">{t("common.selectCategory")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {!categories.length && (
            <p className="mt-2 text-sm text-amber-700">
              {t("admin.noCategoriesHint")}
            </p>
          )}
        </label>

        <label className="block md:col-start-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.imageUrl")}
          </span>
          <input
            type="url"
            value={form.image}
            onChange={(event) => updateField("image", event.target.value)}
            placeholder="https://..."
            className={inputClasses}
          />
        </label>

        <div className="order-first md:col-start-1 md:row-start-1 md:row-span-6">
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("admin.imagePreview")}
          </p>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
            {form.image && !imageFailed ? (
              <img
                src={form.image}
                alt=""
                onError={() => setImageFailed(true)}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="text-center text-slate-400">
                <Image size={28} className="mx-auto" />
                <p className="mt-2 text-sm">
                  {imageFailed
                    ? t("admin.invalidImageUrl")
                    : t("admin.imagePreviewEmpty")}
                </p>
              </div>
            )}
          </div>
        </div>
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
          disabled={submitting || !categories.length}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#A98252] dark:hover:bg-[#BD996B]"
        >
          <Save size={18} />
          {submitting
            ? t("common.loading")
            : selectedProduct
              ? t("admin.updateProduct")
              : t("admin.createProduct")}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
