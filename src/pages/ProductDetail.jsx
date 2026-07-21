import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import { getProductById }
  from "../api/productApi";

function ProductDetail() {

  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const response =
        await getProductById(id);

      setProduct(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">

        <img
          src={product.image}
          alt={product.name}
          className="w-full max-w-md"
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

      </div>
    </MainLayout>
  );
}

export default ProductDetail;