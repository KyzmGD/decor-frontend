import {
  useEffect,
  useState,
  useContext
} from "react";

import { useParams }
  from "react-router-dom";

import MainLayout
  from "../layouts/MainLayout";

import {
  getProductById
} from "../api/productApi";

import CartContext
  from "../context/CartContext";

function ProductDetail() {

  const { id } =
    useParams();
console.log(useContext(CartContext));
  const { addToCart } =
    useContext(CartContext);

  const [product, setProduct] =
    useState(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct =
    async () => {

      const response =
        await getProductById(id);

      setProduct(response.data);
    };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <MainLayout>
      <div className="
    max-w-7xl
    mx-auto
    px-6
    py-16
    grid
    md:grid-cols-2
    gap-16
  ">

        <img
          src={product.image}
          alt={product.name}
          className="
  rounded-2xl
  shadow-lg
"
        />

        <h1 className="text-4xl font-bold mt-6">
          {product.name}
        </h1>

        <p className="text-2xl mt-4">
          ${product.price}
        </p>

        <p className="mt-4">
          {product.description}
        </p>

        <button
          onClick={() =>{
            console.log("clicked");
            addToCart(product)
          }
          }
          className="
  mt-8
  bg-[#8B5E3C]
  hover:bg-[#734A2D]
  text-white
  px-8
  py-4
  rounded-xl
  font-semibold
  transition
"
        >
          Add To Cart
        </button>

      </div>
    </MainLayout>
  );
}

export default ProductDetail;