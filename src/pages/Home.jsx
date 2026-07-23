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

      <section
  className="
    relative
    h-[700px]
  "
>

  <img
    src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
    "
  />

  <div
    className="
      absolute
      inset-0
      bg-black/40
    "
  />

  <div
    className="
      relative
      h-full
      flex
      flex-col
      justify-center
      items-center
      text-white
      text-center
    "
  >

    <h1
      className="
        text-7xl
        font-bold
      "
    >
      Timeless Furniture
    </h1>

    <p
      className="
        mt-6
        text-xl
        max-w-xl
      "
    >
      Premium furniture crafted
      for modern living spaces.
    </p>

    <button
      className="
        mt-8
        bg-[#8B5E3C]
        px-8
        py-4
        rounded-xl
        text-lg
      "
    >
      Shop Collection
    </button>

  </div>

</section>

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
    text-4xl
    font-bold
    text-center
    mb-12
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
    gap-8
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