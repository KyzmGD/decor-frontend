import { useContext } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import LanguageContext from "../context/LanguageContext";
import WishlistContext from "../context/WishlistContext";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";

function Wishlist() {
  const { t } = useContext(LanguageContext);
  const { wishlistItems } = useContext(WishlistContext);

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A98252] text-white">
            <Heart size={23} fill="currentColor" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {t("common.wishlist")}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-stone-300">
              {wishlistItems.length} {t("common.products").toLowerCase()}
            </p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm dark:border-stone-700 dark:bg-stone-900">
            <Heart
              size={42}
              className="mx-auto text-stone-300 dark:text-stone-600"
            />
            <h2 className="mt-5 text-xl font-bold">
              {t("user.emptyWishlist")}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-slate-500 dark:text-stone-300">
              {t("user.emptyWishlistDescription")}
            </p>
            <Link
              to="/products"
              className="mt-7 inline-flex rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
            >
              {t("user.browseProducts")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default Wishlist;
