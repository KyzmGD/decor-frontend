import {
  useContext,
  useState
} from "react";

import {
  Image,
  ImagePlus,
  Save,
  Upload,
  X
} from "lucide-react";

import LanguageContext from "../../context/LanguageContext";

const inputClasses =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98252] focus:ring-2 focus:ring-[#A98252]/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const getInitialForm = (product) => {
  const images = [
    ...new Set(
      [
        product?.image,
        ...(Array.isArray(product?.images) ? product.images : [])
      ].filter(Boolean)
    )
  ].slice(0, MAX_IMAGES);

  return {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price ?? "",
    stock: product?.stock ?? "",
    images,
    categoryId: product?.categoryId ?? ""
  };
};

const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function ProductForm({
  selectedProduct,
  categories,
  onSubmit,
  onCancel,
  submitting = false
}) {
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState(() =>
    getInitialForm(selectedProduct)
  );
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    setImageError("");

    if (!files.length) {
      return;
    }

    if (form.images.length + files.length > MAX_IMAGES) {
      setImageError(
        t("admin.maximumImages").replace("{count}", MAX_IMAGES)
      );
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setImageError(t("admin.imageFilesOnly"));
      return;
    }

    if (files.some((file) => file.size > MAX_IMAGE_SIZE)) {
      setImageError(t("admin.imageTooLarge"));
      return;
    }

    try {
      const uploadedImages = await Promise.all(
        files.map(readImageFile)
      );

      setForm((current) => ({
        ...current,
        images: [
          ...new Set([...current.images, ...uploadedImages])
        ].slice(0, MAX_IMAGES)
      }));
    } catch (error) {
      console.error("Read product images failed:", error);
      setImageError(t("admin.imageUploadError"));
    }
  };

  const addImageUrl = () => {
    const nextImage = imageUrl.trim();

    if (!nextImage) {
      return;
    }

    if (form.images.length >= MAX_IMAGES) {
      setImageError(
        t("admin.maximumImages").replace("{count}", MAX_IMAGES)
      );
      return;
    }

    setForm((current) => ({
      ...current,
      images: [...new Set([...current.images, nextImage])]
    }));
    setImageUrl("");
    setImageError("");
  };

  const removeImage = (imageToRemove) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter(
        (image) => image !== imageToRemove
      )
    }));
  };

  const makePrimaryImage = (primaryImage) => {
    setForm((current) => ({
      ...current,
      images: [
        primaryImage,
        ...current.images.filter((image) => image !== primaryImage)
      ]
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.images[0] || "",
      images: form.images,
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
            step="1000"
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

        <div className="block md:col-start-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t("common.imageUrl")}
          </span>
          <div className="flex items-start gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              className={inputClasses}
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="mt-2 inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-[#A98252] hover:text-[#7A5A35] dark:border-slate-700 dark:text-slate-200"
            >
              <ImagePlus size={18} />
              {t("admin.addImage")}
            </button>
          </div>
        </div>

        <div className="order-first md:col-start-1 md:row-start-1 md:row-span-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t("admin.productImages")} ({form.images.length}/{MAX_IMAGES})
            </p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#A98252] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#7A5A35]">
              <Upload size={15} />
              {t("admin.uploadImages")}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="sr-only"
              />
            </label>
          </div>

          {form.images.length ? (
            <div className="grid grid-cols-2 gap-3">
              {form.images.map((image, index) => (
                <div
                  key={`${image.slice(0, 40)}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950"
                >
                  <button
                    type="button"
                    onClick={() => makePrimaryImage(image)}
                    title={t("admin.makePrimaryImage")}
                    className="h-full w-full"
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-slate-950/75 px-2 py-1 text-[10px] font-bold uppercase text-white">
                      {t("admin.primaryImage")}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    aria-label={t("admin.removeImage")}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow transition group-hover:opacity-100 focus:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
              <div className="text-center text-slate-400">
                <Image size={28} className="mx-auto" />
                <p className="mt-2 text-sm">
                  {t("admin.imagePreviewEmpty")}
                </p>
              </div>
            </div>
          )}

          {imageError && (
            <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
              {imageError}
            </p>
          )}
          <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {t("admin.imageUploadHelp")}
          </p>
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
