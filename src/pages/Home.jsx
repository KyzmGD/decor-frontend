import {
  useEffect,
  useState
} from "react";

import MainLayout
  from "../layouts/MainLayout";

import HeroBanner
  from "../components/HeroBanner";

import ProductCard
  from "../components/ProductCard";

import CategoryFilter
  from "../components/CategoryFilter";

import {
  getProducts
} from "../api/productApi";

import {
  getCategories
} from "../api/categoryApi";

function Home() {

  const [
    products,
    setProducts
  ] = useState([]);

  const [
    categories,
    setCategories
  ] = useState([]);

  const [
    selectedCategory,
    setSelectedCategory
  ] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadCategories =
    async () => {

      try {

        const response =
          await getCategories();

        setCategories(
          response.data
        );

      } catch (error) {

        console.error(
          "Load categories error:",
          error
        );

      }
    };

  const loadProducts =
    async () => {

      try {

        console.log(
          "Selected category:",
          selectedCategory
        );

        const response =
          await getProducts(
            selectedCategory
          );

        console.log(
          "Products returned:",
          response.data
        );

        setProducts(
          response.data
        );

      } catch (error) {

        console.error(
          "Load products error:",
          error
        );

      }
    };

  return (
    <MainLayout>

      <HeroBanner />

      <section
        className="
          max-w-7xl
          mx-auto
          px-6
          py-12
        "
      >

        <h2
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
          Featured Products
        </h2>

        <div className="mb-6">

          <CategoryFilter
            categories={categories}
            selectedCategory={
              selectedCategory
            }
            onChange={
              setSelectedCategory
            }
          />
          <p>Selected: {selectedCategory}</p>
<p>Products: {products.length}</p>

        </div>

        {products.length === 0 ? (

          <div
            className="
              text-center
              py-10
              text-gray-500
            "
          >
            No products found
          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-4
              gap-6
            "
          >

            {products.map(
              (product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              )
            )}

          </div>

        )}

      </section>

    </MainLayout>
  );
}

export default Home;