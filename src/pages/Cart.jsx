import {
  useContext,
  useState
} from "react";
import {
  Mail,
  Minus,
  Plus,
  ShoppingBag,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate
} from "react-router-dom";

import CartContext from "../context/CartContext";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";

function Cart() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const {
    cartItems,
    removeFromCart,
    updateQuantity
  } = useContext(CartContext);

  const [coupon, setCoupon] = useState(
    localStorage.getItem("checkoutCoupon") || ""
  );
  const [appliedCoupon, setAppliedCoupon] = useState(
    localStorage.getItem("checkoutCoupon") || ""
  );
  const [email, setEmail] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );
  const discount =
    appliedCoupon === "WOODORA10"
      ? subtotal * 0.1
      : 0;
  const total = subtotal - discount;

  const applyCoupon = () => {
    const normalized = coupon.trim().toUpperCase();

    if (normalized !== "WOODORA10") {
      toast.error(t("user.invalidCoupon"));
      return;
    }

    setCoupon(normalized);
    setAppliedCoupon(normalized);
    localStorage.setItem("checkoutCoupon", normalized);
    toast.success(t("user.couponApplied"));
  };

  const goToCheckout = () => {
    if (!cartItems.length) {
      return;
    }

    navigate("/checkout");
  };

  const handleNewsletter = (event) => {
    event.preventDefault();
    toast.success(t("user.newsletterSuccess"));
    setEmail("");
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A98252]">
            Woodora
          </p>
          <h1 className="mt-2 text-4xl font-bold">
            {t("user.shoppingCart")}
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white py-20 text-center dark:border-stone-700 dark:bg-stone-900">
            <ShoppingBag
              size={42}
              className="mx-auto text-stone-300"
            />
            <h2 className="mt-5 text-xl font-bold">
              {t("user.emptyCart")}
            </h2>
            <Link
              to="/products"
              className="mt-7 inline-flex rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
            >
              {t("user.browseProducts")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section>
              <div className="hidden grid-cols-[minmax(0,1fr)_110px_120px_44px] gap-4 border-b border-stone-300 pb-3 text-xs font-semibold uppercase tracking-wider text-stone-500 md:grid dark:border-stone-700">
                <span>{t("common.product")}</span>
                <span>{t("common.price")}</span>
                <span>{t("common.total")}</span>
                <span />
              </div>

              <div className="divide-y divide-stone-200 dark:divide-stone-700">
                {cartItems.map((item) => (
                  <article
                    key={item.id}
                    className="grid gap-5 py-6 md:grid-cols-[minmax(0,1fr)_110px_120px_44px] md:items-center"
                  >
                    <div className="flex gap-4">
                      <Link
                        to={`/products/${item.id}`}
                        className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.id}`}
                          className="font-bold hover:text-[#A98252]"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-2 text-xs text-stone-500">
                          SKU: {item.sku || `WD-${item.id}`}
                        </p>
                        <div className="mt-4 flex h-9 w-fit items-center rounded-lg border border-stone-300 dark:border-stone-600">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            aria-label={t("user.decreaseQuantity")}
                            className="flex h-full w-9 items-center justify-center"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-9 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.min(
                                  Number(item.stock || 99),
                                  item.quantity + 1
                                )
                              )
                            }
                            aria-label={t("user.increaseQuantity")}
                            className="flex h-full w-9 items-center justify-center"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${Number(item.price).toFixed(2)}
                    </p>
                    <p className="font-bold text-[#A98252]">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={t("common.remove")}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={19} />
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-28 dark:border-stone-700 dark:bg-stone-900">
              <h2 className="text-xl font-bold">
                {t("user.orderSummary")}
              </h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-stone-500">{t("user.subtotal")}</dt>
                  <dd className="font-semibold">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">{t("user.shipping")}</dt>
                  <dd>{t("user.calculatedAtCheckout")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">{t("user.discount")}</dt>
                  <dd>-${discount.toFixed(2)}</dd>
                </div>
              </dl>

              <div className="mt-5 flex gap-2">
                <input
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value)}
                  placeholder={t("user.couponCode")}
                  className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none dark:border-stone-600"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="rounded-lg border border-stone-300 px-3 text-sm font-semibold hover:border-[#A98252] dark:border-stone-600"
                >
                  {t("user.apply")}
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-5 dark:border-stone-700">
                <span className="font-bold">{t("common.total")}</span>
                <span className="text-2xl font-bold text-[#A98252]">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={goToCheckout}
                className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white hover:bg-slate-800"
              >
                {t("user.proceedToCheckout")}
              </button>
            </aside>
          </div>
        )}
      </div>

      <section className="border-y border-stone-200 bg-[#EDE6DC] px-6 py-14 text-center dark:border-stone-700 dark:bg-[#211C18]">
        <Mail size={27} className="mx-auto text-[#A98252]" />
        <h2 className="mt-4 text-3xl font-bold">
          {t("user.newsletterTitle")}
        </h2>
        <form
          onSubmit={handleNewsletter}
          className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("common.email")}
            required
            className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-5 py-3 dark:border-stone-600 dark:bg-stone-900"
          />
          <button className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white">
            {t("user.subscribe")}
          </button>
        </form>
      </section>
    </MainLayout>
  );
}

export default Cart;
