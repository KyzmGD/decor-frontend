import {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  ArrowRight,
  Mail
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { getProducts } from "../api/productApi";
import { getCategories } from "../api/categoryApi";
import ProductCard from "../components/ProductCard";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";

function Home() {
  const { t } = useContext(LanguageContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
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
        console.error("Load homepage error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const popularProducts = useMemo(
    () => products.slice(0, 5),
    [products]
  );

  const newProducts = useMemo(
    () => [...products].reverse().slice(0, 4),
    [products]
  );

  const handleNewsletter = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    toast.success(t("user.newsletterSuccess"));
    setEmail("");
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,2.2fr)_minmax(280px,0.8fr)]">
          <article className="group relative min-h-[430px] overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
            <div className="relative flex min-h-[430px] max-w-2xl flex-col justify-end p-8 text-white sm:p-12">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#D9BA8C]">
                Woodora Collection
              </p>
              <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
                {t("user.heroTitle")}
              </h1>
              <p className="mt-5 max-w-lg text-base text-stone-200 sm:text-lg">
                {t("user.heroDescription")}
              </p>
              <Link
                to="/products"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[#A98252] px-6 py-3 font-semibold text-white hover:bg-[#BD996B]"
              >
                {t("user.shopCollection")}
                <ArrowRight size={18} />
              </Link>
            </div>
          </article>

          <article className="group relative min-h-[300px] overflow-hidden rounded-3xl lg:min-h-[430px]">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace"
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="relative flex h-full min-h-[300px] flex-col justify-end p-8 text-white lg:min-h-[430px]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9BA8C]">
                {t("user.curatedSpace")}
              </p>
              <h2 className="mt-3 text-3xl font-bold">
                {t("user.livingRoomEdit")}
              </h2>
              <Link
                to="/products"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
              >
                {t("user.exploreNow")}
                <ArrowRight size={17} />
              </Link>
            </div>
          </article>
        </section>

        <section className="py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A98252]">
                {t("user.selectedForYou")}
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                {t("user.popular")}
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden items-center gap-2 text-sm font-semibold text-stone-600 hover:text-[#A98252] sm:flex dark:text-stone-300"
            >
              {t("user.viewAll")}
              <ArrowRight size={17} />
            </Link>
          </div>

          {loading ? (
            <p className="py-16 text-center text-stone-500">
              {t("common.loading")}
            </p>
          ) : popularProducts.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-stone-500">
              {t("user.noProducts")}
            </p>
          )}
        </section>

        <section className="border-t border-stone-200 py-16 dark:border-stone-700">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A98252]">
              {t("user.justArrived")}
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {t("user.newArrivals")}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-t border-stone-200 py-16 md:grid-cols-[220px_minmax(0,1fr)] dark:border-stone-700">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A98252]">
              {t("user.browseBy")}
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {t("common.categories")}
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
              {t("user.categoryIntro")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((category, index) => {
              const categoryProduct = products.find(
                (product) =>
                  Number(product.categoryId) ===
                  Number(category.id)
              );
              const categoryImage =
                category.image ||
                categoryProduct?.image ||
                "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace";

              return (
                <Link
                  key={category.id}
                  to="/products"
                  className="
                    group
                    relative
                    min-h-48
                    overflow-hidden
                    rounded-2xl
                    border
                    border-stone-200
                    shadow-sm
                    hover:-translate-y-1
                    hover:border-[#A98252]
                    hover:shadow-lg
                    dark:border-stone-700
                  "
                >
                  <img
                    src={categoryImage}
                    alt={category.name}
                    loading="lazy"
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                      transition
                      duration-500
                      group-hover:scale-105
                    "
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/5" />
                  <div className="relative flex min-h-48 items-end justify-between p-5 text-white">
                    <div>
                      <span className="text-xs text-stone-300">
                        0{index + 1}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold">
                        {category.name}
                      </h3>
                    </div>
                    <ArrowRight
                      size={19}
                      className="transition group-hover:translate-x-1 group-hover:text-[#D9BA8C]"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <section className="border-y border-stone-200 bg-[#EDE6DC] px-6 py-16 text-center dark:border-stone-700 dark:bg-[#211C18]">
        <Mail
          size={28}
          className="mx-auto text-[#A98252]"
        />
        <h2 className="mt-4 text-3xl font-bold">
          {t("user.newsletterTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-stone-600 dark:text-stone-300">
          {t("user.newsletterDescription")}
        </p>
        <form
          onSubmit={handleNewsletter}
          className="mx-auto mt-7 flex max-w-lg flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("common.email")}
            required
            className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-5 py-3 outline-none focus:border-[#A98252] dark:border-stone-600 dark:bg-stone-900"
          />
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
          >
            {t("user.subscribe")}
          </button>
        </form>
      </section>
    </MainLayout>
  );
}

export default Home;
