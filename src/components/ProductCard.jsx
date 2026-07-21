import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product._id}`}
    >
      <div
        className="
          border
          rounded-lg
          overflow-hidden
          hover:shadow-lg
          transition
        "
      >
        <img
          src={product.image}
          alt={product.name}
          className="
            h-60
            w-full
            object-cover
          "
        />

        <div className="p-4">

          <h3 className="font-semibold">
            {product.name}
          </h3>

          <p className="text-gray-500">
            ${product.price}
          </p>

        </div>

      </div>
    </Link>
  );
}

export default ProductCard;