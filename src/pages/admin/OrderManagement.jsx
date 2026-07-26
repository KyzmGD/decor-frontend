import {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Search,
  ShoppingCart,
  RefreshCcw,
  Eye,
  AlertTriangle,
  ShieldCheck,
  X
} from "lucide-react";

import AuthContext from "../../context/AuthContext";
import LanguageContext from "../../context/LanguageContext";
import AdminLayout from "../../layouts/AdminLayout";
import { formatCurrency } from "../../utils/currency";

import {
  getAllOrders,
  updateOrderStatus,
  confirmLowStockOrder
} from "../../api/orderApi";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Shipping",
  "Delivered",
  "Completed",
  "Cancelled"
];

const ADMIN_TRANSITIONS = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Preparing", "Cancelled"],
  Preparing: ["Shipping", "Cancelled"],
  Shipping: ["Delivered"],
  Delivered: [],
  Completed: [],
  Cancelled: []
};

function OrderManagement() {
  const { token } = useContext(AuthContext);
  const { t, language } = useContext(LanguageContext);

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [needsConfirmationOnly, setNeedsConfirmationOnly] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllOrders(token);

      setOrders(response.data || []);
    } catch (error) {
      console.error("Load orders failed:", error);

      setError(
        error.response?.data?.message ||
        t("admin.loadOrdersError")
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName =
        order.recipientName ||
        order.User?.fullname ||
        order.User?.name ||
        order.user?.fullname ||
        order.user?.name ||
        order.fullname ||
        "";

      const customerEmail =
        order.User?.email ||
        order.user?.email ||
        order.email ||
        "";

      const orderId = String(order.id || "");

      const matchesSearch =
        !keyword ||
        customerName.toLowerCase().includes(keyword) ||
        customerEmail.toLowerCase().includes(keyword) ||
        orderId.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        order.status === statusFilter;

      const needsConfirmation =
        order.status === "Pending" &&
        order.requiresStockConfirmation &&
        !order.stockConfirmed;

      return (
        matchesSearch &&
        matchesStatus &&
        (!needsConfirmationOnly || needsConfirmation)
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    needsConfirmationOnly
  ]);

  const handleStatusChange = async (
    orderId,
    nextStatus
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");

      const response = await updateOrderStatus(
        orderId,
        nextStatus,
        token
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                ...response.data
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Update order status failed:",
        error
      );

      setError(
        error.response?.data?.message ||
        t("admin.updateOrderError")
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLowStockConfirmation = async (orderId) => {
    if (!window.confirm(t("admin.confirmLowStockPrompt"))) {
      return;
    }

    try {
      setConfirmingId(orderId);
      setError("");

      const response = await confirmLowStockOrder(
        orderId,
        token
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                ...response.data
              }
            : order
        )
      );
    } catch (error) {
      console.error("Confirm low stock order failed:", error);
      setError(
        error.response?.data?.message ||
        t("admin.confirmLowStockError")
      );
    } finally {
      setConfirmingId(null);
    }
  };

  const getStatusClasses = (status) => {
    switch (String(status).toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700";

      case "confirmed":
        return "bg-amber-50 text-amber-800";

      case "preparing":
        return "bg-orange-50 text-orange-700";

      case "shipping":
        return "bg-stone-200 text-stone-700";

      case "delivered":
        return "bg-sky-50 text-sky-700";

      case "completed":
        return "bg-emerald-50 text-emerald-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (String(status).toLowerCase()) {
      case "pending":
        return t("admin.pending");

      case "confirmed":
        return t("admin.confirmed");

      case "preparing":
        return t("admin.preparing");

      case "shipping":
        return t("admin.shipping");

      case "delivered":
        return t("admin.delivered");

      case "completed":
        return t("admin.completed");

      case "cancelled":
        return t("admin.cancelled");

      default:
        return status || t("admin.unknown");
    }
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleString(
      language === "vi" ? "vi-VN" : "en-US"
    );
  };

  return (
    <AdminLayout
      title={t("admin.orderManagement")}
      description={t("admin.orderDescription")}
    >
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-3 md:flex-row lg:max-w-3xl">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={t("admin.searchOrder")}
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            <option value="all">
              {t("admin.allStatuses")}
            </option>

            <option value="Pending">
              {t("admin.pending")}
            </option>

            <option value="Confirmed">
              {t("admin.confirmed")}
            </option>

            <option value="Preparing">
              {t("admin.preparing")}
            </option>

            <option value="Shipping">
              {t("admin.shipping")}
            </option>

            <option value="Delivered">
              {t("admin.delivered")}
            </option>

            <option value="Completed">
              {t("admin.completed")}
            </option>

            <option value="Cancelled">
              {t("admin.cancelled")}
            </option>
          </select>

          <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={needsConfirmationOnly}
              onChange={(event) =>
                setNeedsConfirmationOnly(event.target.checked)
              }
              className="h-4 w-4 accent-[#A98252]"
            />
            {t("admin.needsConfirmationOnly")}
          </label>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="i18n-toolbar-action flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:border-[#A98252] hover:bg-[#F7F0E6] hover:text-[#7A5A35] dark:border-stone-700 dark:text-stone-300 dark:hover:border-[#C5A26B] dark:hover:bg-[#2B241F] dark:hover:text-[#C5A26B]"
        >
          <RefreshCcw size={18} />
          {t("common.refresh")}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
              <ShoppingCart size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                {t("admin.orderList")}
              </h2>

              <p className="text-sm text-slate-500">
                {t("admin.orderCount").replace("{count}", filteredOrders.length)}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            {t("admin.loadingOrders")}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            {t("admin.noOrders")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4 font-semibold">
                    {t("admin.orderCode")}
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    {t("admin.customer")}
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    {t("admin.total")}
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    {t("admin.status")}
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    {t("admin.orderDate")}
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    {t("common.actions")}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const customerName =
                    order.recipientName ||
                    order.User?.fullname ||
                    order.User?.name ||
                    order.user?.fullname ||
                    order.user?.name ||
                    order.fullname ||
                    t("admin.unknownCustomer");

                  const customerEmail =
                    order.User?.email ||
                    order.user?.email ||
                    order.email ||
                    "";

                  const total =
                    order.totalPrice ||
                    order.totalAmount ||
                    order.total ||
                    0;

                  const needsConfirmation =
                    order.status === "Pending" &&
                    order.requiresStockConfirmation &&
                    !order.stockConfirmed;

                  const lowStockItems =
                    order.OrderItems?.filter(
                      (item) =>
                        Number(item.Product?.stock) <= 5
                    ) || [];

                  const allowedNextStatuses =
                    ADMIN_TRANSITIONS[order.status] || [];

                  return (
                    <tr
                      key={order.id}
                      className="transition-colors duration-200 hover:bg-[#F7F0E6] hover:shadow-[inset_3px_0_0_#A98252] dark:hover:bg-[#2B241F]"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">
                          #{order.id}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {order.User?.avatar ? (
                            <img
                              src={order.User.avatar}
                              alt=""
                              className="h-10 w-10 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDE6DC] font-bold text-[#7A5A35]">
                              {customerName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">
                              {customerName}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {customerEmail}
                            </p>

                            {needsConfirmation && (
                              <div className="mt-2 flex items-start gap-1.5 text-xs font-semibold text-amber-700">
                                <AlertTriangle
                                  size={14}
                                  className="mt-0.5 shrink-0"
                                />
                                <span>
                                  {t("admin.lowStockWarning")}
                                  {lowStockItems.length > 0 &&
                                    `: ${lowStockItems
                                      .map(
                                        (item) =>
                                          `${item.Product?.name} (${item.Product?.stock})`
                                      )
                                      .join(", ")}`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {formatCurrency(total)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-3 py-1 text-sm font-medium",
                            getStatusClasses(order.status)
                          ].join(" ")}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDateTime(order.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {needsConfirmation && (
                            <button
                              type="button"
                              disabled={confirmingId === order.id}
                              onClick={() =>
                                handleLowStockConfirmation(order.id)
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-[#A98252] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#7A5A35] hover:shadow-md disabled:opacity-50"
                            >
                              <ShieldCheck size={17} />
                              {confirmingId === order.id
                                ? t("common.loading")
                                : t("admin.confirmOrder")}
                            </button>
                          )}

                          <select
                            value={order.status || "Pending"}
                            disabled={
                              updatingId === order.id ||
                              confirmingId === order.id
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                order.id,
                                event.target.value
                              )
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option
                                key={status}
                                value={status}
                                disabled={
                                  status !== order.status &&
                                  (
                                    !allowedNextStatuses.includes(status) ||
                                    (
                                      needsConfirmation &&
                                      status === "Confirmed"
                                    )
                                  )
                                }
                              >
                                {getStatusLabel(status)}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-[#A98252] hover:bg-[#F1E6D7] hover:text-[#7A5A35] dark:border-stone-700 dark:text-stone-300 dark:hover:border-[#C5A26B] dark:hover:bg-[#2B241F] dark:hover:text-[#C5A26B]"
                            title={t("admin.viewDetails")}
                          >
                            <Eye size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-detail-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-sm font-medium text-[#A98252]">
                  {t("admin.orderCode")} #{selectedOrder.id}
                </p>
                <h2
                  id="order-detail-title"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  {t("admin.orderDetails")}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
                aria-label={t("common.close")}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <section className="grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2 dark:bg-stone-800">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-stone-400">
                    {t("admin.customer")}
                  </p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-stone-100">
                    {selectedOrder.recipientName ||
                      selectedOrder.User?.fullname ||
                      t("admin.unknownCustomer")}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-stone-300">
                    {selectedOrder.User?.email || "—"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-stone-300">
                    {selectedOrder.phone ||
                      selectedOrder.User?.phone ||
                      "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-stone-400">
                    {t("admin.deliveryAddress")}
                  </p>
                  <p className="mt-1 leading-6 text-slate-800 dark:text-stone-100">
                    {[
                      selectedOrder.address,
                      selectedOrder.User?.district,
                      selectedOrder.User?.city
                    ].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="font-bold text-slate-900">
                  {t("admin.orderTimeline")}
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[
                    [t("admin.orderedAt"), selectedOrder.createdAt],
                    [t("admin.confirmedAt"), selectedOrder.confirmedAt || selectedOrder.stockConfirmedAt],
                    [t("admin.shippingStartedAt"), selectedOrder.shippingStartedAt],
                    [t("admin.deliveredAt"), selectedOrder.deliveredAt]
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        {label}
                      </p>
                      <p className="mt-1 font-medium text-slate-900">
                        {formatDateTime(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="font-bold text-slate-900">
                  {t("admin.orderedProducts")}
                </h3>
                <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
                  {(selectedOrder.OrderItems || []).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4"
                    >
                      {item.Product?.image && (
                        <img
                          src={item.Product.image}
                          alt=""
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">
                          {item.Product?.name || `#${item.ProductId}`}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {t("common.quantity")}: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(
                          Number(item.price) * Number(item.quantity)
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                <span className="font-semibold text-slate-600">
                  {t("admin.total")}
                </span>
                <span className="text-xl font-bold text-[#A98252]">
                  {formatCurrency(selectedOrder.totalPrice || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default OrderManagement;
