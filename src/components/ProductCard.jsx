import { useContext } from "react";
import {
  Heart,
  Star
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate
} from "react-router-dom";

import AuthContext from "../context/AuthContext";
import LanguageContext from "../context/LanguageContext";
import WishlistContext from "../context/WishlistContext";
import { formatCurrency } from "../utils/currency";
import { getProductReviewSummary } from "../utils/reviews";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const {
    isInWishlist,
    toggleWishlist
  } = useContext(WishlistContext);

  const isFavorite =
    Boolean(user) && isInWishlist(product.id);
  const reviewSummary =
    getProductReviewSummary(product);

  const handleWishlist = () => {
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
  };

  return (
    <article
      className="
        product-card
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-stone-200
        bg-white
        shadow-sm
        transition-all
        duration-500
        hover:shadow-lg
        dark:border-stone-700
        dark:bg-stone-900
      "
    >
      {user && (
        <button
        type="button"
        onClick={handleWishlist}
        aria-label={
          isFavorite
            ? t("user.removeFromWishlist")
            : t("user.addedToWishlist")
        }
        aria-pressed={isFavorite}
        className={`
          absolute
          right-3
          top-3
          z-10
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border
          shadow-sm
          backdrop-blur
          ${
            isFavorite
              ? "border-[#A98252] bg-[#A98252] text-white"
              : "border-white/70 bg-white/90 text-stone-600 hover:text-[#A98252]"
          }
        `}
      >
        <Heart
          size={17}
          fill={isFavorite ? "currentColor" : "none"}
        />
        </button>
      )}

      <Link to={`/products/${product.id}`} className="block">
        <div className="overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="
              h-56
              w-full
              object-cover
              transition-transform
              duration-1000
              ease-out
              group-hover:scale-110
            "
          />
        </div>

        <div className="p-4">
          <h3 className="line-clamp-1 text-base font-semibold">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <Star
              size={14}
              fill="currentColor"
              className="text-[#A98252]"
            />
            <span className="font-semibold">
              {reviewSummary.rating.toFixed(1)}
            </span>
            <span className="text-stone-400">
              ({reviewSummary.count} {t("user.reviews")})
            </span>
          </div>
          <p className="mt-2 text-lg font-bold text-[#A98252]">
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
