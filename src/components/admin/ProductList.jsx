function ProductList({
  products,
  onEdit,
  onDelete
}) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Category</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>

            <td>
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover"
              />
            </td>

            <td>{product.name}</td>

            <td>
              ${product.price}
            </td>

            <td>
              {product.stock}
            </td>

            <td>
              {product.Category?.name}
            </td>

            <td>
              <button
                onClick={() =>
                  onEdit(product)
                }
                className="
                  bg-yellow-500
                  text-white
                  px-3
                  py-1
                  mr-2
                "
              >
                Edit
              </button>

              <button
                onClick={() =>
                  onDelete(
                    product.id
                  )
                }
                className="
                  bg-red-500
                  text-white
                  px-3
                  py-1
                "
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductList;