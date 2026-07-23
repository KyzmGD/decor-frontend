import {
  useContext,
  useEffect,
  useState
} from "react";

import MainLayout
  from "../layouts/MainLayout";

import ProductCard
  from "../components/ProductCard";

import {
  getProducts
} from "../api/productApi";

import {
  getCategories
} from "../api/categoryApi";
import LanguageContext from "../context/LanguageContext";

function Products() {
  const { t } = useContext(LanguageContext);

  const [
    products,
    setProducts
  ] = useState([]);

  const [
    filteredProducts,
    setFilteredProducts
  ] = useState([]);

  const [
    categories,
    setCategories
  ] = useState([]);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory
  ] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
  const response = await getProducts();
  const categoryResponse = await getCategories();

  console.log("CATEGORY RESPONSE", categoryResponse.data);

  // THÊM DÒNG NÀY
  console.log("FIRST PRODUCT:", response.data[0]);

  setProducts(response.data);
  setFilteredProducts(response.data);
  setCategories(categoryResponse.data);
};

  const handleSearch = (
    value
  ) => {

    setSearch(value);

    const filtered =
      products.filter(
        product =>
          product.name
            .toLowerCase()
            .includes(
              value.toLowerCase()
            )
      );

    setFilteredProducts(
      filtered
    );
  };

  const handleCategoryFilter = (categoryId) => {

  setSelectedCategory(categoryId);

  if (categoryId === null) {

    setFilteredProducts(products);

    return;
  }

  const filtered = products.filter(
    product =>
      Number(product.categoryId) === Number(categoryId)
  );

  setFilteredProducts(filtered);
};

  const handleSort =
    (value) => {

      const sorted =
        [...filteredProducts];

      if (
        value === "low"
      ) {

        sorted.sort(
          (a, b) =>
            a.price -
            b.price
        );

      } else if (
        value === "high"
      ) {

        sorted.sort(
          (a, b) =>
            b.price -
            a.price
        );

      }

      setFilteredProducts(
        sorted
      );
    };
  return (
    <MainLayout>

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-12
        "
      >

        {/* Hero */}

        <div
          className="
            mb-10
          "
        >

          <h1
            className="
              text-5xl
              font-bold
              text-gray-900
              mb-3
            "
          >
            {t("user.discoverTitle")}
          </h1>

          <p
            className="
              text-gray-500
              text-lg
            "
          >
            {t("user.heroDescription")}
          </p>

        </div>

        {/* Search + Sort */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            gap-4
            mb-8
          "
        >

          <input
            type="text"
            placeholder={t("user.searchProducts")}
            value={search}
            onChange={(e) =>
              handleSearch(
                e.target.value
              )
            }
            className="
              flex-1
              border
              rounded-2xl
              px-5
              py-3
              shadow-sm
              focus:outline-none
            "
          />

          <select
            onChange={(e) =>
              handleSort(
                e.target.value
              )
            }
            className="
              border
              rounded-2xl
              px-5
              py-3
              bg-white
              min-w-60
            "
          >
            <option value="">
              {t("user.sortProducts")}
            </option>

            <option value="low">
              {t("user.priceLowHigh")}
            </option>

            <option value="high">
              {t("user.priceHighLow")}
            </option>

          </select>

        </div>

        {/* Categories */}

        <div
          className="
            flex
            flex-wrap
            gap-3
            mb-10
          "
        >

          <button
            onClick={() =>
              handleCategoryFilter(
                null
              )
            }
            className={`
              px-5
              py-2
              rounded-full
              transition
              ${
                selectedCategory ===
                null
                  ? "bg-black text-white"
                  : "bg-white border"
              }
            `}
          >
            {t("user.allCategories")}
          </button>

          {categories.map(
            category => (

              <button
                key={category.id}
                onClick={() =>
                  handleCategoryFilter(
                    category.id
                  )
                }
                className={`
                  px-5
                  py-2
                  rounded-full
                  transition
                  ${
                    selectedCategory ===
                    category.id
                      ? "bg-black text-white"
                      : "bg-white border"
                  }
                `}
              >
                {category.name}
              </button>

            )
          )}

        </div>

        {/* Products */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            xl:grid-cols-5
            gap-8
          "
        >

          {filteredProducts.map(
            product => (

              <ProductCard
                key={product.id}
                product={product}
              />

            )
          )}

        </div>

      </div>

    </MainLayout>
  );
}

export default Products;
