import {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star
} from "lucide-react";

import { getCategories } from "../api/categoryApi";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";
import { getProductReviewSummary } from "../utils/reviews";

function Products() {
  const { t } = useContext(LanguageContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minimumRating, setMinimumRating] = useState("0");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          productResponse,
          categoryResponse
        ] = await Promise.all([
          getProducts(),
          getCategories()
        ]);

        setProducts(productResponse.data || []);
        setCategories(categoryResponse.data || []);
      } catch (error) {
        console.error("Load products failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const minPrice =
      minimumPrice === "" ? 0 : Number(minimumPrice);
    const maxPrice =
      maximumPrice === "" ? Infinity : Number(maximumPrice);
    const minRating = Number(minimumRating);

    const filtered = products.filter((product) => {
      const summary = getProductReviewSummary(product);
      const matchesSearch =
        !keyword ||
        product.name?.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword);
      const matchesCategory =
        categoryId === "all" ||
        Number(product.categoryId) === Number(categoryId);
      const matchesPrice =
        Number(product.price) >= minPrice &&
        Number(product.price) <= maxPrice;
      const matchesStock =
        !inStockOnly || Number(product.stock) > 0;
      const matchesRating =
        summary.rating >= minRating;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesStock &&
        matchesRating
      );
    });

    return [...filtered].sort((first, second) => {
      switch (sortBy) {
        case "price-low":
          return Number(first.price) - Number(second.price);
        case "price-high":
          return Number(second.price) - Number(first.price);
        case "rating":
          return (
            getProductReviewSummary(second).rating -
            getProductReviewSummary(first).rating
          );
        case "name":
          return first.name.localeCompare(second.name);
        default:
          return (
            new Date(second.createdAt || 0) -
            new Date(first.createdAt || 0)
          );
      }
    });
  }, [
    products,
    search,
    categoryId,
    minimumPrice,
    maximumPrice,
    inStockOnly,
    minimumRating,
    sortBy
  ]);

  const resetFilters = () => {
    setSearch("");
    setCategoryId("all");
    setMinimumPrice("");
    setMaximumPrice("");
    setInStockOnly(false);
    setMinimumRating("0");
    setSortBy("newest");
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A98252]">
            Woodora Collection
          </p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            {t("user.discoverTitle")}
          </h1>
          <p className="mt-3 text-lg text-stone-500">
            {t("user.heroDescription")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 lg:sticky lg:top-28 dark:border-stone-700 dark:bg-stone-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#A98252]" />
                <h2 className="font-bold">{t("user.filters")}</h2>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                title={t("user.resetFilters")}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-[#F7F0E6] hover:text-[#A98252]"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  {t("common.categories")}
                </span>
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-[#A98252] dark:border-stone-600"
                >
                  <option value="all">{t("user.allCategories")}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold">
                  {t("user.priceRange")}
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    value={minimumPrice}
                    onChange={(event) => setMinimumPrice(event.target.value)}
                    placeholder={t("user.minimum")}
                    className="min-w-0 rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-[#A98252] dark:border-stone-600"
                  />
                  <input
                    type="number"
                    min="0"
                    value={maximumPrice}
                    onChange={(event) => setMaximumPrice(event.target.value)}
                    placeholder={t("user.maximum")}
                    className="min-w-0 rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-[#A98252] dark:border-stone-600"
                  />
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-semibold">
                  {t("user.minimumRating")}
                </legend>
                <div className="space-y-2">
                  {[4, 3, 0].map((rating) => (
                    <label
                      key={rating}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="minimumRating"
                        value={rating}
                        checked={Number(minimumRating) === rating}
                        onChange={(event) => setMinimumRating(event.target.value)}
                        className="accent-[#A98252]"
                      />
                      {rating === 0 ? (
                        t("user.anyRating")
                      ) : (
                        <>
                          <span>{rating}+</span>
                          <Star
                            size={15}
                            fill="currentColor"
                            className="text-[#A98252]"
                          />
                        </>
                      )}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(event) => setInStockOnly(event.target.checked)}
                  className="h-4 w-4 accent-[#A98252]"
                />
                {t("user.inStockOnly")}
              </label>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-7 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold hover:border-[#A98252] hover:bg-[#F7F0E6] hover:text-[#7A5A35] dark:border-stone-600"
            >
              {t("user.resetFilters")}
            </button>
          </aside>

          <section>
            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-stone-700 dark:bg-stone-900">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t("user.searchProducts")}
                  className="w-full rounded-xl border border-stone-300 py-3 pl-11 pr-4 outline-none focus:border-[#A98252] dark:border-stone-600"
                />
              </div>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="min-w-56 rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
              >
                <option value="newest">{t("user.newest")}</option>
                <option value="price-low">{t("user.priceLowHigh")}</option>
                <option value="price-high">{t("user.priceHighLow")}</option>
                <option value="rating">{t("user.bestRated")}</option>
                <option value="name">{t("user.nameAZ")}</option>
              </select>
            </div>

            <p className="mb-5 text-sm text-stone-500">
              {t("user.resultCount").replace(
                "{count}",
                filteredProducts.length
              )}
            </p>

            {loading ? (
              <p className="py-20 text-center text-stone-500">
                {t("common.loading")}
              </p>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-stone-200 py-20 text-center dark:border-stone-700">
                <p className="font-semibold">{t("user.noProducts")}</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 text-sm font-semibold text-[#A98252]"
                >
                  {t("user.resetFilters")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default Products;
