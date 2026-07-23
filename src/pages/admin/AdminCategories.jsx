import {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  FolderTree,
  Plus,
  Search
} from "lucide-react";

import AuthContext from "../../context/AuthContext";
import AdminLayout from "../../layouts/AdminLayout";

import CategoryForm from "../../components/admin/CategoryForm";
import CategoryList from "../../components/admin/CategoryList";
import LanguageContext
  from "../../context/LanguageContext";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../api/categoryApi";

function AdminCategories() {
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      setCategories(response.data || []);
    } catch (error) {
      console.error(error);
      setError(t("admin.loadCategoriesError"));
    } finally {
      setLoading(false);
    }
  };
  const { t } =
  useContext(LanguageContext);
  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.name?.toLowerCase().includes(keyword) ||
        category.description?.toLowerCase().includes(keyword)
      );
    });
  }, [categories, search]);

  const handleSubmit = async (data) => {
    try {
      setError("");

      if (selectedCategory) {
        await updateCategory(
          selectedCategory.id,
          data,
          token
        );
      } else {
        await createCategory(data, token);
      }

      setSelectedCategory(null);
      setShowForm(false);

      await loadCategories();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        t("admin.saveCategoryError")
      );
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("admin.confirmDeleteCategory"))) {
      return;
    }

    try {
      await deleteCategory(id, token);
      await loadCategories();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        t("admin.deleteCategoryError")
      );
    }
  };

  return (
    <AdminLayout
  title={t("admin.categoryManagement")}
  description={t("admin.categoryDescription")}
>
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
  value={search}
  onChange={(event) =>
    setSearch(event.target.value)
  }
  placeholder={t("admin.searchCategory")}
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
    focus:border-slate-900
    focus:ring-2
    focus:ring-slate-200
    dark:border-slate-700
    dark:bg-slate-900
    dark:text-white
    dark:focus:border-slate-500
    dark:focus:ring-slate-800
  "
/>
        </div>

        <button
  type="button"
  onClick={() => {
    setSelectedCategory(null);
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
  {t("admin.addCategory")}
</button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedCategory
                ? t("admin.editCategory")
                : t("admin.addCategory")}
            </h2>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setSelectedCategory(null);
              }}
              className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              {t("common.close")}
            </button>
          </div>

          <CategoryForm
            selectedCategory={selectedCategory}
            onSubmit={handleSubmit}
          />
        </div>
      )}

      <div className="
    overflow-hidden
    rounded-2xl
    border
    border-slate-200
    bg-white
    shadow-sm
    transition-colors
    dark:border-slate-800
    dark:bg-slate-900
  ">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5">
          <div className="rounded-xl bg-slate-100 p-2.5">
            <FolderTree size={21} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              {t("admin.categoryList")}
            </h2>

            <p className="text-sm text-slate-500">
              {t("admin.categoryCount").replace("{count}", filteredCategories.length)}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            {t("admin.loadingCategories")}
          </div>
        ) : (
          <CategoryList
            categories={filteredCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminCategories;
