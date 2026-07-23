import {
  useContext,
  useEffect,
  useState
} from "react";
import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  Truck,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";

import {
  cancelMyOrder,
  confirmOrderReceived,
  getMyOrders
} from "../api/orderApi";
import AuthContext from "../context/AuthContext";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";
import { formatCurrency } from "../utils/currency";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-blue-50 text-blue-700",
  Preparing: "bg-orange-50 text-orange-700",
  Shipping: "bg-violet-50 text-violet-700",
  Delivered: "bg-sky-50 text-sky-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700"
};

function MyOrders() {
  const { token } = useContext(AuthContext);
  const { t, language } = useContext(LanguageContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getMyOrders(token);
        setOrders(response.data || []);
      } catch (error) {
        console.error("Load my orders failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  const statusLabel = (status) => {
    const labels = {
      Pending: t("admin.pending"),
      Confirmed: t("admin.confirmed"),
      Preparing: t("admin.preparing"),
      Shipping: t("admin.shipping"),
      Delivered: t("admin.delivered"),
      Completed: t("admin.completed"),
      Cancelled: t("admin.cancelled")
    };
    return labels[status] || status;
  };

  const updateOrderLocally = (orderId, response) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              ...response.data
            }
          : order
      )
    );
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm(t("user.cancelOrderPrompt"))) {
      return;
    }

    try {
      setUpdatingId(orderId);
      const response = await cancelMyOrder(orderId, token);
      updateOrderLocally(orderId, response);
      toast.success(t("user.orderCancelled"));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        t("user.cancelOrderError")
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReceived = async (orderId) => {
    if (!window.confirm(t("user.receivedOrderPrompt"))) {
      return;
    }

    try {
      setUpdatingId(orderId);
      const response = await confirmOrderReceived(orderId, token);
      updateOrderLocally(orderId, response);
      toast.success(t("user.orderCompleted"));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        t("user.confirmReceivedError")
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="py-24 text-center">{t("common.loading")}</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A98252]">
            Woodora Account
          </p>
          <h1 className="mt-2 text-4xl font-bold">
            {t("user.myOrders")}
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white py-20 text-center dark:border-stone-700 dark:bg-stone-900">
            <PackageCheck
              size={42}
              className="mx-auto text-stone-300"
            />
            <p className="mt-5 text-lg font-semibold">
              {t("user.noOrders")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const canCancel = [
                "Pending",
                "Confirmed",
                "Preparing"
              ].includes(order.status);
              const canConfirmReceived =
                order.status === "Delivered";

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900"
                >
                  <header className="flex flex-col gap-4 border-b border-stone-200 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-stone-700">
                    <div>
                      <h2 className="text-lg font-bold">
                        {t("user.order")} #{order.id}
                      </h2>
                      <p className="mt-1 text-sm text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString(
                          language === "vi" ? "vi-VN" : "en-US"
                        )}
                      </p>
                    </div>
                    <span
                      className={`
                        w-fit
                        rounded-full
                        px-3
                        py-1.5
                        text-sm
                        font-semibold
                        ${STATUS_STYLES[order.status] || "bg-stone-100"}
                      `}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </header>

                  <div className="divide-y divide-stone-100 px-6 dark:divide-stone-800">
                    {order.OrderItems?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 py-5"
                      >
                        <img
                          src={item.Product?.image}
                          alt={item.Product?.name}
                          className="h-20 w-16 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">
                            {item.Product?.name}
                          </p>
                          <p className="mt-1 text-sm text-stone-500">
                            {t("common.quantity")}: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {formatCurrency(
                            Number(item.price) * item.quantity
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  <footer className="flex flex-col gap-4 bg-stone-50 p-6 sm:flex-row sm:items-center sm:justify-between dark:bg-stone-800">
                    <div>
                      <p className="text-sm text-stone-500">
                        {t("common.total")}
                      </p>
                      <p className="text-2xl font-bold text-[#A98252]">
                        {formatCurrency(order.totalPrice)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {canCancel && (
                        <button
                          type="button"
                          disabled={updatingId === order.id}
                          onClick={() => handleCancel(order.id)}
                          className="flex items-center gap-2 rounded-xl border border-red-300 px-5 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle size={18} />
                          {t("user.cancelOrder")}
                        </button>
                      )}
                      {canConfirmReceived && (
                        <button
                          type="button"
                          disabled={updatingId === order.id}
                          onClick={() => handleReceived(order.id)}
                          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                        >
                          <CheckCircle2 size={18} />
                          {t("user.receivedOrder")}
                        </button>
                      )}
                      {!canCancel &&
                        !canConfirmReceived &&
                        order.status !== "Cancelled" && (
                          <div className="flex items-center gap-2 text-sm text-stone-500">
                            {order.status === "Shipping" ? (
                              <Truck size={18} />
                            ) : (
                              <Clock3 size={18} />
                            )}
                            {statusLabel(order.status)}
                          </div>
                        )}
                    </div>
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default MyOrders;
