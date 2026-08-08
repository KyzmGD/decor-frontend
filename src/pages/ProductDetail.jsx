import {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Heart,
  Minus,
  Plus,
  Star,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getProductById,
  getProducts
} from "../api/productApi";
import {
  getReviews,
  createReview,
  deleteReview
} from "../api/reviewApi";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import LanguageContext from "../context/LanguageContext";
import WishlistContext from "../context/WishlistContext";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import { formatCurrency } from "../utils/currency";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { t } = useContext(LanguageContext);
  const {
    isInWishlist,
    toggleWishlist
  } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [thumbnailPage, setThumbnailPage] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          productResponse,
          productsResponse,
          reviewsResponse
        ] = await Promise.all([
          getProductById(id),
          getProducts(),
          getReviews(id)
        ]);

        setProduct(productResponse.data);
        setAllProducts(productsResponse.data || []);
        setReviews(reviewsResponse.data || []);
        setSelectedImage(0);
        setThumbnailPage(0);
        setQuantity(1);
      } catch (error) {
        console.error("Load product detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) {
      return [];
    }

    const images = Array.isArray(product.images)
      ? product.images
      : [];

    return [...new Set(
      [product.image, ...images].filter(Boolean)
    )];
  }, [product]);

  const thumbnailPageCount = Math.ceil(gallery.length / 6);
  const visibleThumbnails = gallery.slice(
    thumbnailPage * 6,
    thumbnailPage * 6 + 6
  );

  const showThumbnailPage = (nextPage) => {
    const boundedPage = Math.min(
      Math.max(nextPage, 0),
      thumbnailPageCount - 1
    );

    setThumbnailPage(boundedPage);
    setSelectedImage(boundedPage * 6);
  };

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    const sameCategory = allProducts.filter(
      (item) =>
        item.id !== product.id &&
        Number(item.categoryId) === Number(product.categoryId)
    );

    const fallback = allProducts.filter(
      (item) => item.id !== product.id
    );

    return (
      sameCategory.length ? sameCategory : fallback
    ).slice(0, 4);
  }, [allProducts, product]);

  if (loading) {
    return (
      <MainLayout>
        <p className="py-24 text-center">
          {t("common.loading")}
        </p>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <p className="py-24 text-center">
          {t("user.noProducts")}
        </p>
      </MainLayout>
    );
  }

  const stock = Math.max(Number(product.stock || 0), 0);
  const isFavorite =
    Boolean(user) && isInWishlist(product.id);
  const categoryName =
    product.Category?.name ||
    product.category?.name ||
    t("common.uncategorized");

  const requireLogin = () => {
    if (user) {
      return true;
    }

    toast.error(t("user.loginToContinue"));
    navigate("/login");
    return false;
  };

  const handleAddToCart = () => {
    if (!requireLogin()) {
      return;
    }

    if (stock <= 0) {
      toast.error(t("user.outOfStock"));
      return;
    }

    addToCart(product, quantity);
    toast.success(t("user.addedToCart"));
  };

  const handleWishlist = () => {
    if (!requireLogin()) {
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

  const handleReview = async (event) => {
    event.preventDefault();

    if (!requireLogin() || !comment.trim()) {
      return;
    }

    try {
      const res = await createReview(
        id,
        { rating, comment: comment.trim() },
        token
      );

      setReviews((prev) => [res.data, ...prev]);
      setComment("");
      setRating(5);
      toast.success(t("user.reviewSuccess"));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gửi đánh giá thất bại"
      );
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm(t("user.deleteReviewPrompt"))) return;

    try {
      setDeletingReviewId(reviewId);
      await deleteReview(reviewId, token);
      setReviews((current) =>
        current.filter((review) => review.id !== reviewId)
      );
      toast.success(t("user.reviewDeleted"));
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("user.deleteReviewError")
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <Link to="/">{t("common.home")}</Link>
          <span>/</span>
          <Link to="/products">{t("common.products")}</Link>
          <span>/</span>
          {product.categoryId ? (
            <Link
              to={`/products?category=${encodeURIComponent(product.categoryId)}`}
              className="transition-colors hover:text-[#A98252]"
            >
              {categoryName}
            </Link>
          ) : (
            <span>{categoryName}</span>
          )}
          <span>/</span>
          <span
            aria-current="page"
            className="text-stone-900 dark:text-stone-100"
          >
            {product.name}
          </span>
        </nav>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <div className="relative flex flex-col gap-4 sm:block sm:pl-[100px]">
            <div className="order-1 aspect-square overflow-hidden rounded-3xl bg-stone-100 dark:bg-stone-800">
              <img
                src={gallery[selectedImage] || product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="order-2 flex gap-3 overflow-x-auto sm:hidden">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={[
                    "h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2",
                    selectedImage === index
                      ? "border-[#A98252]"
                      : "border-stone-200 dark:border-stone-700"
                  ].join(" ")}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div
              className={[
                "absolute inset-y-0 left-0 hidden w-20 sm:grid",
                thumbnailPageCount > 1
                  ? "grid-rows-[32px_minmax(0,1fr)_32px] gap-2"
                  : "grid-rows-1"
              ].join(" ")}
            >
              {thumbnailPageCount > 1 && (
                <button
                  type="button"
                  onClick={() => showThumbnailPage(thumbnailPage - 1)}
                  disabled={thumbnailPage === 0}
                  aria-label={t("user.previousProductImages")}
                  className="flex h-8 w-full items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 transition hover:border-[#A98252] hover:bg-[#A98252] hover:text-white disabled:cursor-not-allowed disabled:opacity-35 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
                >
                  <ChevronUp size={18} />
                </button>
              )}

              <div
                className="grid min-h-0 gap-2"
                style={{
                  gridTemplateRows: "repeat(6, minmax(0, 1fr))"
                }}
              >
                {visibleThumbnails.map((image, index) => {
                  const galleryIndex = thumbnailPage * 6 + index;

                  return (
                  <button
                    key={`${image}-${galleryIndex}`}
                    type="button"
                    onClick={() => setSelectedImage(galleryIndex)}
                    className={`
                      w-20
                      min-h-0
                      overflow-hidden
                      rounded-xl
                      border-2
                      ${
                        selectedImage === galleryIndex
                          ? "border-[#A98252]"
                          : "border-stone-200 dark:border-stone-700"
                      }
                    `}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                  );
                })}
              </div>

              {thumbnailPageCount > 1 && (
                <button
                  type="button"
                  onClick={() => showThumbnailPage(thumbnailPage + 1)}
                  disabled={thumbnailPage === thumbnailPageCount - 1}
                  aria-label={t("user.nextProductImages")}
                  className="flex h-8 w-full items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 transition hover:border-[#A98252] hover:bg-[#A98252] hover:text-white disabled:cursor-not-allowed disabled:opacity-35 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
                >
                  <ChevronDown size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#A98252]">
              {product.Category?.name ||
                product.category?.name ||
                t("common.uncategorized")}
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 text-3xl font-bold text-[#A98252]">
              {formatCurrency(product.price)}
            </p>

          <div className="mt-6 flex items-center gap-2">
              <div className="flex text-[#A98252]">
                {(() => {
                  const avg = reviews.length
                    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                    : 0;
                  return [1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={17}
                      fill={star <= Math.round(avg) ? "currentColor" : "none"}
                    />
                  ));
                })()}
              </div>
              {reviews.length > 0 && (
                <span className="text-sm font-semibold text-[#A98252]">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                </span>
              )}
              <span className="text-sm text-stone-500">
                ({reviews.length} {t("user.reviews")})
              </span>
            </div>

            <p className="mt-7 leading-7 text-stone-600 dark:text-stone-300">
              {product.description || t("common.noDescription")}
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ${
                    stock > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }
                `}
              >
                {stock > 0
                  ? `${t("common.stock")}: ${stock}`
                  : t("user.outOfStock")}
              </span>
            </div>

            {user && (
              <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex h-12 items-center rounded-xl border border-stone-300 dark:border-stone-600">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) => Math.max(1, value - 1))
                  }
                  aria-label={t("user.decreaseQuantity")}
                  className="flex h-full w-11 items-center justify-center"
                >
                  <Minus size={17} />
                </button>
                <span className="w-10 text-center font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.min(stock || 1, value + 1)
                    )
                  }
                  aria-label={t("user.increaseQuantity")}
                  className="flex h-full w-11 items-center justify-center"
                >
                  <Plus size={17} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className="h-12 flex-1 rounded-xl bg-slate-900 px-6 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {t("user.addToCart")}
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                aria-label={t("common.wishlist")}
                aria-pressed={isFavorite}
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  ${
                    isFavorite
                      ? "border-[#A98252] bg-[#A98252] text-white"
                      : "border-stone-300 hover:border-[#A98252] hover:text-[#A98252] dark:border-stone-600"
                  }
                `}
              >
                <Heart
                  size={20}
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </button>
              </div>
            )}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-stone-200 bg-white p-7 sm:p-10 dark:border-stone-700 dark:bg-stone-900">
          <h2 className="text-2xl font-bold">
            {t("user.productInformation")}
          </h2>
          <div className="mt-6 grid gap-6 text-sm sm:grid-cols-2">
            <div className="border-b border-stone-200 pb-4 dark:border-stone-700">
              <span className="text-stone-500">{t("common.name")}</span>
              <p className="mt-1 font-semibold">{product.name}</p>
            </div>
            <div className="border-b border-stone-200 pb-4 dark:border-stone-700">
              <span className="text-stone-500">{t("common.categories")}</span>
              <p className="mt-1 font-semibold">
                {product.Category?.name ||
                  product.category?.name ||
                  t("common.uncategorized")}
              </p>
            </div>
          </div>
          <p className="mt-7 leading-7 text-stone-600 dark:text-stone-300">
            {product.description || t("common.noDescription")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-7 sm:p-10 dark:border-stone-700 dark:bg-stone-900">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold">
                {t("user.customerReviews")}
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                {reviews.length} {t("user.reviews")}
              </p>
            </div>
          </div>

          {user && (
            <form
              onSubmit={handleReview}
              className="mt-8 rounded-2xl bg-stone-50 p-5 dark:bg-stone-800"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`${star} ${t("user.stars")}`}
                    className="text-[#A98252]"
                  >
                    <Star
                      size={21}
                      fill={star <= rating ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={t("user.writeReview")}
                required
                rows="3"
                className="mt-4 w-full rounded-xl border border-stone-300 bg-white p-4 outline-none focus:border-[#A98252] dark:border-stone-600 dark:bg-stone-900"
              />
              <button
                type="submit"
                className="mt-3 rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white"
              >
                {t("user.submitReview")}
              </button>
            </form>
          )}

          <div className="mt-8 space-y-4">
            {reviews.length === 0 ? (
              <p className="py-8 text-center text-stone-500">
                {t("user.noReviews")}
              </p>
            ) : (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="border-t border-stone-200 pt-5 dark:border-stone-700"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">{review.name}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex text-[#A98252]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={15}
                            fill={star <= review.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      {user &&
                        (user.role === "admin" ||
                          Number(review.userId) === Number(user.id)) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={deletingReviewId === review.id}
                            title={t("user.deleteReview")}
                            aria-label={`${t("user.deleteReview")} ${review.name}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                    </div>
                  </div>
                  <p className="mt-3 text-stone-600 dark:text-stone-300">
                    {review.comment}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="py-16">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-3xl font-bold">
                {t("user.relatedProducts")}
              </h2>
              <div className="hidden gap-2 sm:flex">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300">
                  <ChevronLeft size={18} />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

    </MainLayout>
  );
}

export default ProductDetail;
