import {
  useContext,
  useMemo,
  useState
} from "react";
import {
  Banknote,
  CreditCard,
  MapPin,
  PackageCheck,
  Truck
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { createOrder } from "../api/orderApi";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";

function Checkout() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const { t } = useContext(LanguageContext);

  const [form, setForm] = useState({
    recipientName: user?.fullname || user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    city: user?.city || "",
    district: user?.district || "",
    address: user?.address || "",
    note: ""
  });
  const [shippingMethod, setShippingMethod] =
    useState("STANDARD");
  const [paymentMethod, setPaymentMethod] =
    useState("COD");
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + Number(item.price) * item.quantity,
        0
      ),
    [cartItems]
  );
  const coupon =
    localStorage.getItem("checkoutCoupon") || "";
  const discount =
    coupon === "WOODORA10" ? subtotal * 0.1 : 0;
  const shippingFee =
    shippingMethod === "EXPRESS" ? 15 : 0;
  const total = subtotal - discount + shippingFee;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cartItems.length) {
      toast.error(t("user.cartEmptyError"));
      navigate("/cart");
      return;
    }

    try {
      setLoading(true);

      await createOrder(
        {
          items: cartItems,
          totalPrice: total,
          recipientName: form.recipientName,
          phone: form.phone,
          address: [
            form.address,
            form.district,
            form.city
          ].filter(Boolean).join(", "),
          shippingMethod,
          paymentMethod,
          shippingFee,
          discount,
          couponCode: coupon,
          note: form.note
        },
        token
      );

      clearCart();
      localStorage.removeItem("checkoutCoupon");
      toast.success(t("user.orderSuccess"));
      navigate("/my-orders");
    } catch (error) {
      console.error("Create order failed:", error);
      toast.error(
        error.response?.data?.message ||
        t("user.checkoutError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_420px]"
      >
        <div>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A98252]">
              Woodora
            </p>
            <h1 className="mt-2 text-4xl font-bold">
              {t("user.checkout")}
            </h1>
          </div>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 dark:border-stone-700 dark:bg-stone-900">
            <div className="flex items-center gap-3">
              <MapPin className="text-[#A98252]" size={22} />
              <h2 className="text-xl font-bold">
                {t("user.shippingInformation")}
              </h2>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-medium">
                  {t("common.fullName")}
                </span>
                <input
                  name="recipientName"
                  value={form.recipientName}
                  onChange={updateField}
                  required
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-medium">
                  {t("common.phone")}
                </span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  required
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-medium">
                  {t("common.email")}
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  required
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-medium">
                  {t("user.city")}
                </span>
                <input
                  name="city"
                  value={form.city}
                  onChange={updateField}
                  required
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-medium">
                  {t("user.district")}
                </span>
                <input
                  name="district"
                  value={form.district}
                  onChange={updateField}
                  required
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-medium">
                  {t("user.addressDetail")}
                </span>
                <input
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  required
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#A98252] dark:border-stone-600"
                />
              </label>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 dark:border-stone-700 dark:bg-stone-900">
            <div className="flex items-center gap-3">
              <Truck className="text-[#A98252]" size={22} />
              <h2 className="text-xl font-bold">
                {t("user.shippingMethod")}
              </h2>
            </div>
            <div className="mt-5 grid gap-3">
              {[
                {
                  value: "STANDARD",
                  label: t("user.standardShipping"),
                  detail: t("user.standardShippingDetail"),
                  price: t("user.free")
                },
                {
                  value: "EXPRESS",
                  label: t("user.expressShipping"),
                  detail: t("user.expressShippingDetail"),
                  price: "$15.00"
                }
              ].map((method) => (
                <label
                  key={method.value}
                  className={`
                    flex
                    cursor-pointer
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    p-4
                    ${
                      shippingMethod === method.value
                        ? "border-[#A98252] bg-amber-50/50 dark:bg-stone-800"
                        : "border-stone-200 dark:border-stone-700"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={method.value}
                    checked={shippingMethod === method.value}
                    onChange={(event) =>
                      setShippingMethod(event.target.value)
                    }
                    className="accent-[#A98252]"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{method.label}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      {method.detail}
                    </p>
                  </div>
                  <span className="font-semibold">{method.price}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 dark:border-stone-700 dark:bg-stone-900">
            <div className="flex items-center gap-3">
              <CreditCard className="text-[#A98252]" size={22} />
              <h2 className="text-xl font-bold">
                {t("user.paymentMethod")}
              </h2>
            </div>
            <div className="mt-5 grid gap-3">
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-stone-200 p-4 dark:border-stone-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                  className="accent-[#A98252]"
                />
                <Banknote size={21} />
                <span className="font-semibold">
                  {t("user.cashOnDelivery")}
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-stone-200 p-4 dark:border-stone-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === "BANK_TRANSFER"}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                  className="accent-[#A98252]"
                />
                <CreditCard size={21} />
                <span className="font-semibold">
                  {t("user.bankTransfer")}
                </span>
              </label>
            </div>

            {paymentMethod === "BANK_TRANSFER" && (
              <div className="mt-4 rounded-xl bg-stone-50 p-4 text-sm leading-6 dark:bg-stone-800">
                {t("user.bankTransferInstruction")}
              </div>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-28 dark:border-stone-700 dark:bg-stone-900">
          <div className="flex items-center gap-3">
            <PackageCheck className="text-[#A98252]" size={22} />
            <h2 className="text-xl font-bold">
              {t("user.orderSummary")}
            </h2>
          </div>

          <div className="mt-6 max-h-[360px] space-y-4 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-20 w-16 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A98252] px-1 text-[10px] font-bold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    SKU: {item.sku || `WD-${item.id}`}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <dl className="mt-6 space-y-3 border-t border-stone-200 pt-5 text-sm dark:border-stone-700">
            <div className="flex justify-between">
              <dt className="text-stone-500">{t("user.subtotal")}</dt>
              <dd>${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">{t("user.shipping")}</dt>
              <dd>${shippingFee.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">{t("user.discount")}</dt>
              <dd>-${discount.toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-5 dark:border-stone-700">
            <span className="font-bold">{t("common.total")}</span>
            <span className="text-2xl font-bold text-[#A98252]">
              ${total.toFixed(2)}
            </span>
          </div>

          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-medium">
              {t("user.orderNote")}
            </span>
            <textarea
              name="note"
              value={form.note}
              onChange={updateField}
              rows="3"
              placeholder={t("user.orderNotePlaceholder")}
              className="w-full rounded-xl border border-stone-300 p-3 text-sm outline-none dark:border-stone-600"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !cartItems.length}
            className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading
              ? t("user.placingOrder")
              : t("user.placeOrder")}
          </button>
        </aside>
      </form>
    </MainLayout>
  );
}

export default Checkout;
