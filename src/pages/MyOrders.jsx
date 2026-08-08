import {
  useContext,
  useEffect,
  useState
} from "react";
import {
  CheckCircle2,
  ChevronDown,
  CreditCard,
  PackageCheck,
  Truck,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import {
  cancelMyOrder,
  confirmOrderReceived,
  getMyOrders
} from "../api/orderApi";
import AuthContext from "../context/AuthContext";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";
import { formatCurrency } from "../utils/currency";

function MyOrders() {
  const { token } = useContext(AuthContext);
  const { t, language } = useContext(LanguageContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedHistoryIds, setExpandedHistoryIds] = useState(
    () => new Set()
  );

  const toggleHistory = (orderId) => {
    setExpandedHistoryIds((current) => {
      const next = new Set(current);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

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
              const statusHistory = order.statusHistory?.length
                ? order.statusHistory
                : [{
                    id: `current-${order.id}`,
                    status: order.status,
                    changedAt: order.updatedAt || order.createdAt
                  }];
              const historyExpanded = expandedHistoryIds.has(order.id);
              const visibleHistory = historyExpanded
                ? statusHistory
                : statusHistory.slice(-1);

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900"
                >
                  <header className="border-b border-stone-200 p-6 dark:border-stone-700">
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

                  {order.paymentMethod === "BANK_TRANSFER" && (
                    <section className="border-t border-stone-200 px-6 py-5 dark:border-stone-700">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <CreditCard size={20} className="text-[#A98252]" />
                          <div>
                            <h3 className="font-bold">
                              {t("user.paymentInformation")}
                            </h3>
                            <p className="mt-1 text-sm text-stone-500">
                              {t(`user.paymentStatus${order.paymentStatus || "PENDING"}`)}
                            </p>
                          </div>
                        </div>
                        <Link
                          to={`/transactions?transaction=${order.transactions?.[0]?.id || ""}`}
                          className="rounded-xl border border-[#A98252] px-4 py-2 text-sm font-semibold text-[#8B6A43] transition hover:bg-[#F7F0E6] dark:text-[#C5A26B]"
                        >
                          {t("user.viewPaymentDetails")}
                        </Link>
                      </div>
                    </section>
                  )}

                  <section className="border-t border-stone-200 px-6 py-6 dark:border-stone-700">
                    <h3 className="font-bold text-stone-900 dark:text-white">
                      {t("user.orderStatusHistory")}
                    </h3>
                    <p className="mt-1 text-sm text-stone-500">
                      {t("user.orderStatusHistoryDescription")}
                    </p>

                    <ol className="mt-5 space-y-0">
                      {visibleHistory.map((history, index) => {
                        const isLatest = history.status ===
                          statusHistory[statusHistory.length - 1]?.status &&
                          history.changedAt ===
                          statusHistory[statusHistory.length - 1]?.changedAt;
                        const hasNext = index < visibleHistory.length - 1;

                        return (
                          <li key={history.id} className="relative flex gap-4 pb-5 last:pb-0">
                            {hasNext && (
                              <span className="absolute left-[9px] top-5 h-[calc(100%-8px)] w-px bg-stone-200 dark:bg-stone-700" aria-hidden="true" />
                            )}
                            <span className={`relative z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-4 ${isLatest ? "border-[#A98252] bg-white dark:bg-stone-900" : "border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-900"}`} aria-hidden="true" />
                            <div className="min-w-0">
                              <p className={`font-semibold ${isLatest ? "text-[#8B6A43] dark:text-[#C5A26B]" : "text-stone-800 dark:text-stone-200"}`}>
                                {statusLabel(history.status)}
                              </p>
                              <time dateTime={history.changedAt} className="mt-1 block text-sm text-stone-500">
                                {new Date(history.changedAt).toLocaleString(
                                  language === "vi" ? "vi-VN" : "en-US"
                                )}
                              </time>
                            </div>
                          </li>
                        );
                      })}
                    </ol>

                    {statusHistory.length > 1 && (
                      <button
                        type="button"
                        onClick={() => toggleHistory(order.id)}
                        aria-expanded={historyExpanded}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8B6A43] transition hover:text-[#6F5234] dark:text-[#C5A26B]"
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${historyExpanded ? "rotate-180" : ""}`}
                        />
                        {historyExpanded
                          ? t("user.hideStatusHistory")
                          : t("user.showStatusHistory")}
                      </button>
                    )}
                  </section>

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
                      {["Completed", "Cancelled"].includes(order.status) && (
                        <div className={`text-sm font-semibold ${order.status === "Completed" ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                          {statusLabel(order.status)}
                        </div>
                      )}
                      {!canCancel &&
                        !canConfirmReceived &&
                        !["Completed", "Cancelled"].includes(order.status) && (
                          <div className="flex items-center gap-2 text-sm text-stone-500">
                            {order.status === "Shipping" && <Truck size={18} />}
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
