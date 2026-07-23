import { useContext } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate
} from "react-router-dom";

import AuthContext from "../context/AuthContext";
import LanguageContext from "../context/LanguageContext";
import WishlistContext from "../context/WishlistContext";

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
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-stone-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-xl
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
          h-10
          w-10
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
          size={19}
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
              h-80
              w-full
              object-cover
              transition
              duration-500
              group-hover:scale-105
            "
          />
        </div>

        <div className="p-5">
          <h3 className="line-clamp-1 text-lg font-semibold">
            {product.name}
          </h3>
          <p className="mt-2 text-xl font-bold text-[#A98252]">
            ${product.price}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
