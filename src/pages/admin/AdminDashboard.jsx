import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  FolderTree,
  ShoppingCart,
  DollarSign,
  ArrowRight
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import { getProducts } from "../../api/adminProductApi";
import { getCategories } from "../../api/categoryApi";
import {
  useContext
} from "react";

import LanguageContext
  from "../../context/LanguageContext";
function AdminDashboard() {
  const { t, language } = useContext(LanguageContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [
        productResponse,
        categoryResponse
      ] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      setProducts(productResponse.data || []);
      setCategories(categoryResponse.data || []);

    } catch (error) {
      console.error("Load dashboard failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const revenue = useMemo(() => {
    return orders.reduce((total, order) => {
      return total + Number(
        order.totalPrice ||
        order.totalAmount ||
        order.total ||
        0
      );
    }, 0);
  }, [orders]);

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
    value: orders.length,
    icon: ShoppingCart
  },
  {
    label: t(
      "admin.revenue"
    ),
    value:
      revenue.toLocaleString(
        language === "vi" ? "vi-VN" : "en-US"
      ) + " ₫",
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
