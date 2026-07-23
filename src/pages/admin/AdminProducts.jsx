import {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Package,
  Search,
  Plus,
  RefreshCcw
} from "lucide-react";

import AuthContext from "../../context/AuthContext";
import AdminLayout from "../../layouts/AdminLayout";

import ProductForm from "../../components/admin/ProductForm";
import ProductList from "../../components/admin/ProductList";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../../api/adminProductApi";

import { getCategories } from "../../api/categoryApi";

import LanguageContext
  from "../../context/LanguageContext";
function AdminProducts() {
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

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
      console.error(error);
      setError(t("admin.loadProductsError"));
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword) ||
        product.category?.name?.toLowerCase().includes(keyword)
      );
    });
  }, [products, search]);

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError("");

      if (selectedProduct) {
        await updateProduct(
          selectedProduct.id,
          data,
          token
        );
      } else {
        await createProduct(
          data,
          token
        );
      }

      setSelectedProduct(null);
      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        t("admin.saveProductError")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("admin.confirmDeleteProduct")
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id, token);
      await loadData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        t("admin.deleteProductError")
      );
    }
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    setShowForm(false);
  };
const { t } =
  useContext(LanguageContext);
  return (
    <AdminLayout
  title={t(
    "admin.productManagement"
  )}
  description={t(
    "admin.productDescription"
  )}
>
      <div
  className="
    mb-6
    flex
    flex-col
    gap-4
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-5
    shadow-sm
    transition-colors
    dark:border-slate-800
    dark:bg-slate-900
    md:flex-row
    md:items-center
    md:justify-between
  "
>
        <div className="relative w-full md:max-w-md">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
  type="text"
  value={search}
  onChange={(event) =>
    setSearch(
      event.target.value
    )
  }
  placeholder={t(
    "admin.searchProduct"
  )}
  className="
    w-full
    rounded-xl
    border
    border-slate-200
    bg-white
    py-3
    pl-11
    pr-4
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-slate-900
    focus:ring-2
    focus:ring-slate-200
    dark:border-slate-700
    dark:bg-slate-950
    dark:text-white
    dark:focus:border-slate-500
    dark:focus:ring-slate-800
  "
/>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadData}
            className="i18n-toolbar-action flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:border-[#A98252] hover:bg-[#F7F0E6] hover:text-[#7A5A35] dark:border-stone-700 dark:text-stone-300 dark:hover:border-[#C5A26B] dark:hover:bg-[#2B241F] dark:hover:text-[#C5A26B]"
          >
            <RefreshCcw size={18} />
            {t("common.refresh")}
          </button>

          <button
  type="button"
  onClick={() => {
    setSelectedProduct(null);
    setShowForm(true);
  }}
  className="
    flex
    items-center
    justify-center
    i18n-toolbar-action
    gap-2
    rounded-xl
    bg-slate-900
    px-4
    py-3
    font-semibold
    text-white
    transition
    hover:bg-slate-800
    dark:bg-white
    dark:text-slate-900
    dark:hover:bg-slate-200
  "
>
  <Plus size={18} />

  {t(
    "admin.addProduct"
  )}
</button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="
  rounded-2xl
  border
  border-slate-200
  bg-white
  shadow-sm
  transition-colors
  dark:border-slate-800
  dark:bg-slate-900
">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedProduct
                  ? t("admin.editProduct")
                  : t("admin.addProduct")}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {t("admin.formDescription")}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-[#F7F0E6] hover:text-[#7A5A35] dark:hover:bg-[#2B241F] dark:hover:text-[#C5A26B]"
            >
              {t("common.close")}
            </button>
          </div>

          <ProductForm
            selectedProduct={selectedProduct}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={submitting}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
              <Package size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                {t("admin.productList")}
              </h2>

              <p className="text-sm text-slate-500">
                {t("admin.productCount").replace("{count}", filteredProducts.length)}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            {t("admin.loadingProducts")}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            {t("admin.noProducts")}
          </div>
        ) : (
          <ProductList
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;
