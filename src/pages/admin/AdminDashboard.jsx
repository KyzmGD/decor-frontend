import {
  useState,
  useEffect,
  useContext
} from "react";

import AuthContext
  from "../../context/AuthContext";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../api/categoryApi";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../../api/adminProductApi";

import CategoryForm
  from "../../components/admin/CategoryForm";

import CategoryList
  from "../../components/admin/CategoryList";

import ProductForm
  from "../../components/admin/ProductForm";

import ProductList
  from "../../components/admin/ProductList";

import MainLayout
  from "../../layouts/MainLayout";

import {
  Link
} from "react-router-dom";

function AdminDashboard() {

  const { token } =
    useContext(AuthContext);

  const [activeTab,
    setActiveTab] =
    useState("products");

  const [categories,
    setCategories] =
    useState([]);

  const [products,
    setProducts] =
    useState([]);

  const [
    selectedCategory,
    setSelectedCategory
  ] = useState(null);

  const [
    selectedProduct,
    setSelectedProduct
  ] = useState(null);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories =
    async () => {

      const response =
        await getCategories();

      setCategories(
        response.data
      );
    };

  const loadProducts =
    async () => {

      const response =
        await getProducts();

      setProducts(
        response.data
      );
    };

  // CATEGORY

  const handleCategorySubmit =
    async (data) => {

      if (
        selectedCategory
      ) {

        await updateCategory(
          selectedCategory.id,
          data,
          token
        );

      } else {

        await createCategory(
          data,
          token
        );
      }

      setSelectedCategory(
        null
      );

      loadCategories();
    };

  const handleCategoryDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete category?"
        )
      ) {
        return;
      }

      await deleteCategory(
        id,
        token
      );

      loadCategories();
    };

  // PRODUCT

  const handleProductSubmit =
    async (data) => {

      if (
        selectedProduct
      ) {

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

      setSelectedProduct(
        null
      );

      loadProducts();
    };

  const handleProductDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete product?"
        )
      ) {
        return;
      }

      await deleteProduct(
        id,
        token
      );

      loadProducts();
    };

  return (
   <MainLayout>
    <div
      className="
        max-w-7xl
        mx-auto
        p-6
      "
    >

      <h1
        className="
          text-4xl
          font-bold
          mb-6
        "
      >
        Admin Dashboard
      </h1>
      <div
  className="
    mb-6
    flex
    gap-4
  "
>

  <Link
    to="/admin/orders"
    className="
      bg-black
      text-white
      px-4
      py-2
      rounded
    "
  >
    Orders
  </Link>

</div>
      <div
        className="
          flex
          gap-4
          mb-6
        "
      >

        <button
          onClick={() =>
            setActiveTab(
              "products"
            )
          }
          className="
            bg-blue-500
            text-white
            px-4
            py-2
          "
        >
          Products
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "categories"
            )
          }
          className="
            bg-green-500
            text-white
            px-4
            py-2
          "
        >
          Categories
        </button>

      </div>

      {activeTab ===
        "products" && (
        <>
          <ProductForm
            selectedProduct={
              selectedProduct
            }
            categories={
              categories
            }
            onSubmit={
              handleProductSubmit
            }
          />

          <ProductList
            products={
              products
            }
            onEdit={
              setSelectedProduct
            }
            onDelete={
              handleProductDelete
            }
          />
        </>
      )}

      {activeTab ===
        "categories" && (
        <>
          <CategoryForm
            selectedCategory={
              selectedCategory
            }
            onSubmit={
              handleCategorySubmit
            }
          />

          <CategoryList
            categories={
              categories
            }
            onEdit={
              setSelectedCategory
            }
            onDelete={
              handleCategoryDelete
            }
          />
        </>
      )}

    </div>
  </MainLayout> 
  );
}

export default AdminDashboard;