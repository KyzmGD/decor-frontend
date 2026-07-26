import {
  useContext,
  useState
} from "react";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import CartContext from "../context/CartContext";
import LanguageContext from "../context/LanguageContext";
import WishlistContext from "../context/WishlistContext";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";

function Wishlist() {
  const { t } = useContext(LanguageContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState({});

  const getQuantity = (productId) =>
    quantities[productId] || 1;

  const updateQuantity = (product, nextQuantity) => {
    const stock = Math.max(Number(product.stock || 0), 0);

    setQuantities((current) => ({
      ...current,
      [product.id]: Math.min(
        Math.max(nextQuantity, 1),
        stock || 1
      )
    }));
  };

  const handleAddToCart = (product) => {
    if (Number(product.stock || 0) <= 0) {
      toast.error(t("user.outOfStock"));
      return;
    }

    addToCart(product, getQuantity(product.id));
    toast.success(t("user.addedToCart"));
  };

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
              <div key={product.id} className="min-w-0">
                <ProductCard product={product} />

                <div className="mt-3 flex gap-2">
                  <div className="flex h-11 shrink-0 items-center rounded-xl border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-900">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          product,
                          getQuantity(product.id) - 1
                        )
                      }
                      aria-label={t("user.decreaseQuantity")}
                      className="flex h-full w-9 items-center justify-center"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold">
                      {getQuantity(product.id)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          product,
                          getQuantity(product.id) + 1
                        )
                      }
                      aria-label={t("user.increaseQuantity")}
                      className="flex h-full w-9 items-center justify-center"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={Number(product.stock || 0) <= 0}
                    className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#A98252] dark:hover:bg-[#BD996B]"
                  >
                    <ShoppingCart size={16} className="shrink-0" />
                    <span className="truncate">
                      {Number(product.stock || 0) > 0
                        ? t("user.addToCart")
                        : t("user.outOfStock")}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default Wishlist;
