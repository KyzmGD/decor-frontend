import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
    >
      <div
        className="
    bg-white
    rounded-2xl
    overflow-hidden
    shadow-sm
    hover:shadow-2xl
    hover:-translate-y-2
    transition-all
    duration-300
  "
      >
        <img
          src={product.image}
  alt={product.name}
  className="
    h-80
    w-full
    object-cover
    hover:scale-105
    transition
    duration-500
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
        <div className="p-5">

  <h3
    className="
      text-lg
      font-semibold
      mb-2
    "
  >
    {product.name}
  </h3>

  <p
    className="
      text-[#8B5E3C]
      font-bold
      text-xl
    "
  >
    ${product.price}
  </p>

</div>
      </div>
    </Link>
  );
}

export default ProductCard;