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
  ShieldCheck
} from "lucide-react";

import AuthContext from "../../context/AuthContext";
import LanguageContext from "../../context/LanguageContext";
import AdminLayout from "../../layouts/AdminLayout";

import {
  getAllOrders,
  updateOrderStatus,
  confirmLowStockOrder
} from "../../api/orderApi";

function OrderManagement() {
  const { token } = useContext(AuthContext);
  const { t, language } = useContext(LanguageContext);

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
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
        order.user?.fullname ||
        order.user?.name ||
        order.fullname ||
        "";

      const customerEmail =
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

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (
    orderId,
    nextStatus
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");

      await updateOrderStatus(
        orderId,
        nextStatus,
        token
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: nextStatus
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

      case "processing":
        return "bg-amber-50 text-amber-800";

      case "shipping":
        return "bg-stone-200 text-stone-700";

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

      case "processing":
        return t("admin.confirmed");

      case "shipping":
        return t("admin.shipping");

      case "completed":
        return t("admin.completed");

      case "cancelled":
        return t("admin.cancelled");

      default:
        return status || t("admin.unknown");
    }
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

            <option value="Processing">
              {t("admin.confirmed")}
            </option>

            <option value="Shipping">
              {t("admin.shipping")}
            </option>

            <option value="Completed">
              {t("admin.completed")}
            </option>

            <option value="Cancelled">
              {t("admin.cancelled")}
            </option>
          </select>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="i18n-toolbar-action flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
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
                    order.user?.fullname ||
                    order.user?.name ||
                    order.fullname ||
                    t("admin.unknownCustomer");

                  const customerEmail =
                    order.user?.email ||
                    order.email ||
                    "";

                  const total =
                    order.totalPrice ||
                    order.totalAmount ||
                    order.total ||
                    0;

                  const needsConfirmation =
                    order.requiresStockConfirmation &&
                    !order.stockConfirmed;

                  const lowStockItems =
                    order.OrderItems?.filter(
                      (item) =>
                        Number(item.Product?.stock) < 4
                    ) || [];

                  return (
                    <tr
                      key={order.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">
                          #{order.id}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div>
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
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {Number(total).toLocaleString(
                          language === "vi" ? "vi-VN" : "en-US"
                        )}{" "}
                        ₫
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
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              language === "vi" ? "vi-VN" : "en-US"
                            )
                          : "—"}
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
                              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
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
                            <option value="Pending">
                              {t("admin.pending")}
                            </option>

                            <option
                              value="Processing"
                              disabled={needsConfirmation}
                            >
                              {t("admin.confirmed")}
                            </option>

                            <option
                              value="Shipping"
                              disabled={needsConfirmation}
                            >
                              {t("admin.shipping")}
                            </option>

                            <option
                              value="Completed"
                              disabled={needsConfirmation}
                            >
                              {t("admin.completed")}
                            </option>

                            <option value="Cancelled">
                              {t("admin.cancelled")}
                            </option>
                          </select>

                          <button
                            type="button"
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
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
    </AdminLayout>
  );
}

export default OrderManagement;
