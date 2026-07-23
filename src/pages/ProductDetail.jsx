import {
  useEffect,
  useState,
  useContext
} from "react";

import {
  useNavigate,
  useParams
}
  from "react-router-dom";

import MainLayout
  from "../layouts/MainLayout";

import {
  getProductById
} from "../api/productApi";

import CartContext
  from "../context/CartContext";
import LanguageContext from "../context/LanguageContext";
import WishlistContext from "../context/WishlistContext";
import AuthContext from "../context/AuthContext";
import { Heart } from "lucide-react";

import toast
  from "react-hot-toast";

function ProductDetail() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const { id } =
    useParams();
console.log(useContext(CartContext));
  const { addToCart } =
    useContext(CartContext);
  const {
    isInWishlist,
    toggleWishlist
  } = useContext(WishlistContext);

  const [product, setProduct] =
    useState(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct =
    async () => {

      const response =
        await getProductById(id);

      setProduct(response.data);
    };

  if (!product) {
    return <p className="p-10">{t("common.loading")}</p>;
  }

  return (
    <MainLayout>
      <div className="
    max-w-7xl
    mx-auto
    px-6
    py-16
    grid
    md:grid-cols-2
    gap-16
  ">

        <img
          src={product.image}
          alt={product.name}
          className="
  rounded-2xl
  shadow-lg
"
        />

        <h1 className="text-4xl font-bold mt-6">
          {product.name}
        </h1>

        <p className="text-2xl mt-4">
          ${product.price}
        </p>

        <p className="mt-4">
          {product.description}
        </p>

        {user && (
          <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              addToCart(product);
              toast.success(t("user.addedToCart"));
            }}
            className="
              rounded-xl
              bg-slate-900
              px-8
              py-4
              font-semibold
              text-white
              hover:bg-slate-800
            "
          >
            {t("user.addToCart")}
          </button>

          <button
            type="button"
            onClick={() => {
              if (!user) {
                toast.error(t("user.loginToWishlist"));
                navigate("/login");
                return;
              }

              const added = toggleWishlist(product);
              toast.success(
                t(
                  added
                    ? "user.addedToWishlist"
                    : "user.removedFromWishlist"
                )
              );
            }}
            aria-pressed={
              Boolean(user) &&
              isInWishlist(product.id)
            }
            className={`
              flex
              items-center
              gap-2
              rounded-xl
              border
              px-6
              py-4
              font-semibold
              ${
                user && isInWishlist(product.id)
                  ? "border-[#A98252] bg-[#A98252] text-white"
                  : "border-stone-300 hover:border-[#A98252] hover:text-[#A98252] dark:border-stone-600"
              }
            `}
          >
            <Heart
              size={19}
              fill={
                user && isInWishlist(product.id)
                  ? "currentColor"
                  : "none"
              }
            />
            {t("common.wishlist")}
          </button>
          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default ProductDetail;
