import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { Link } from "react-router-dom";
import {
  Package,
  FolderTree,
  ShoppingCart,
  DollarSign,
  ArrowRight,
  UsersRound
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import { getProducts } from "../../api/adminProductApi";
import { getCategories } from "../../api/categoryApi";
import { getAllOrders } from "../../api/orderApi";
import {
  useContext
} from "react";

import LanguageContext
  from "../../context/LanguageContext";
import AuthContext from "../../context/AuthContext";
import { formatCurrency } from "../../utils/currency";
import SalesCategoryChart from "../../components/admin/SalesCategoryChart";
function AdminDashboard() {
  const { t } = useContext(LanguageContext);
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        productResponse,
        categoryResponse,
        orderResponse
      ] = await Promise.all([
        getProducts(),
        getCategories(),
        getAllOrders(token)
      ]);

      setProducts(productResponse.data || []);
      setCategories(categoryResponse.data || []);
      setOrders(orderResponse.data || []);

    } catch (error) {
      console.error("Load dashboard failed:", error);
    } finally {
      setLoading(false);
    }
  }, [
    token
  ]);

  useEffect(() => {
    Promise.resolve().then(loadDashboardData);
  }, [loadDashboardData]);

  const ordersInRange = useMemo(() => {
    const fromTime = dateFrom
      ? new Date(`${dateFrom}T00:00:00`).getTime()
      : Number.NEGATIVE_INFINITY;
    const toTime = dateTo
      ? new Date(`${dateTo}T23:59:59.999`).getTime()
      : Number.POSITIVE_INFINITY;

    return orders.filter((order) => {
      const orderTime = new Date(order.createdAt).getTime();
      return orderTime >= fromTime && orderTime <= toTime;
    });
  }, [dateFrom, dateTo, orders]);

  const completedOrdersInRange = useMemo(
    () => ordersInRange.filter(
      (order) => order.status === "Completed"
    ),
    [ordersInRange]
  );

  const revenue = useMemo(() => {
    return completedOrdersInRange
      .reduce((total, order) => {
      return total + Number(
        order.totalPrice ||
        order.totalAmount ||
        order.total ||
        0
      );
      }, 0);
  }, [completedOrdersInRange]);

  const categorySales = useMemo(() => {
    const categoriesById = new Map(
      categories.map((category) => [Number(category.id), category])
    );
    const salesByCategory = new Map();

    completedOrdersInRange.forEach((order) => {
      (order.OrderItems || []).forEach((item) => {
        const product = item.Product;
        const category = categoriesById.get(Number(product?.categoryId));
        const quantity = Number(item.quantity) || 0;

        if (!category || !product || quantity <= 0) return;

        if (!salesByCategory.has(category.id)) {
          salesByCategory.set(category.id, {
            id: category.id,
            name: category.name,
            quantity: 0,
            products: new Map()
          });
        }

        const categorySale = salesByCategory.get(category.id);
        categorySale.quantity += quantity;
        const currentProduct = categorySale.products.get(product.id);
        categorySale.products.set(product.id, {
          id: product.id,
          name: product.name,
          image: product.image,
          quantity: (currentProduct?.quantity || 0) + quantity
        });
      });
    });

    const totalSold = [...salesByCategory.values()].reduce(
      (total, category) => total + category.quantity,
      0
    );

    return [...salesByCategory.values()]
      .map((category) => ({
        ...category,
        products: [...category.products.values()].sort(
          (first, second) => second.quantity - first.quantity
        ),
        percentage: totalSold ? (category.quantity / totalSold) * 100 : 0
      }))
      .filter((category) => category.quantity > 0)
      .sort((first, second) => second.quantity - first.quantity);
  }, [categories, completedOrdersInRange]);

  const selectedCategory = categorySales.find(
    (category) => category.id === selectedCategoryId
  ) || categorySales[0] || null;

  const statistics = [
  {
    label: t(
      "admin.totalProducts"
    ),
    value: products.length,
    icon: Package
  },
  {
    label: t(
      "admin.totalCategories"
    ),
    value: categories.length,
    icon: FolderTree
  },
  {
    label: t(
      "admin.totalOrders"
    ),
    value: ordersInRange.length,
    icon: ShoppingCart
  },
  {
    label: t("admin.revenue"),
    value: formatCurrency(revenue),
    icon: DollarSign
  }
];

  const managementItems = [
    {
      title: t("admin.productManagement"),
      description: t("admin.productDescription"),
      to: "/admin/products",
      icon: Package
    },
    {
      title: t("admin.categoryManagement"),
      description: t("admin.categoryDescription"),
      to: "/admin/categories",
      icon: FolderTree
    },
    {
      title: t("admin.orderManagement"),
      description: t("admin.orderDescription"),
      to: "/admin/orders",
      icon: ShoppingCart
    },
    {
      title: t("admin.accountManagement", "Quản lý tài khoản"),
      description: t(
        "admin.accountDescription",
        "Theo dõi tài khoản người dùng, nhân viên và trạng thái truy cập"
      ),
      to: "/admin/accounts",
      icon: UsersRound
    }
  ];
  return (
    <AdminLayout
  title={t(
    "admin.dashboardTitle"
  )}
  description={t(
    "admin.dashboardDescription"
  )}
>
      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
          {t("admin.loadingDashboard")}
        </div>
      ) : (
        <>
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statistics.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                   className="
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-6
    text-slate-900
    shadow-sm
    transition-colors
    dark:border-slate-800
    dark:bg-slate-900
    dark:text-white
  "
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="i18n-card-label text-sm font-medium text-slate-500">
                        {item.label}
                      </p>

                      <p className="mt-3 text-3xl font-bold text-slate-900">
                        {item.value}
                      </p>
                    </div>

                    <div  className="
    rounded-2xl
    bg-slate-100
    p-3
    text-slate-700
    dark:bg-slate-800
    dark:text-slate-200
  ">
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("admin.soldByCategory")}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("admin.soldByCategoryDescription")}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("admin.dateFrom")}
                  <input type="date" value={dateFrom} max={dateTo || undefined} onChange={(event) => setDateFrom(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-[#A98252] focus:ring-2 focus:ring-[#A98252]/15 dark:border-slate-700 dark:bg-slate-950" />
                </label>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("admin.dateTo")}
                  <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => setDateTo(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-[#A98252] focus:ring-2 focus:ring-[#A98252]/15 dark:border-slate-700 dark:bg-slate-950" />
                </label>
              </div>
            </div>

            {(dateFrom || dateTo) && (
              <button type="button" onClick={() => { setDateFrom(""); setDateTo(""); }} className="mt-3 text-sm font-semibold text-[#8B6A43] hover:underline dark:text-[#C5A26B]">
                {t("admin.allTime")}
              </button>
            )}

            <div className="mt-7">
              <SalesCategoryChart
                data={categorySales}
                selectedCategoryId={selectedCategory?.id}
                onSelect={setSelectedCategoryId}
                labels={{
                  noSalesData: t("admin.noSalesData"),
                  chartAriaLabel: t("admin.chartAriaLabel"),
                  productsSold: t("admin.productsSold"),
                  productsSoldUnit: t("admin.productsSoldUnit")
                }}
              />
            </div>

            {selectedCategory && (
              <div className="mt-7 border-t border-slate-200 pt-6 dark:border-slate-800">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("admin.categorySalesDetails")}: {selectedCategory.name}</h3>
                  <span className="rounded-full bg-[#F1E6D7] px-3 py-1 text-sm font-semibold text-[#7A5A35] dark:bg-[#2B241F] dark:text-[#C5A26B]">{selectedCategory.quantity} {t("admin.productsSoldUnit")}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead><tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700"><th className="px-3 py-3">{t("common.product")}</th><th className="px-3 py-3 text-right">{t("admin.soldQuantity")}</th></tr></thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedCategory.products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-3 py-3"><div className="flex items-center gap-3">{product.image ? <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800"><Package size={17} /></div>}<span className="font-medium text-slate-800 dark:text-slate-100">{product.name}</span></div></td>
                          <td className="px-3 py-3 text-right font-bold text-slate-900 dark:text-white">{product.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          <section className="mt-8">
            <div className="mb-5">
              <h2 className="i18n-line-slot text-xl font-bold text-slate-900">
                {t("admin.storeManagement")}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {t("admin.quickAccess")}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {managementItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <Icon size={23} />
                    </div>

                    <h3 className="i18n-line-slot mt-5 text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-900">
                      {t("admin.openManagement")}
                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
