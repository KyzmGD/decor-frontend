function CategoryList({
  categories,
  onEdit,
  onDelete
}) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {categories.map(
          (category) => (
            <tr
              key={category.id}
            >
              <td>
                {category.name}
              </td>

              <td>
                {category.description}
              </td>

              <td>
                <button
                  onClick={() =>
                    onEdit(category)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    onDelete(
                      category.id
                    )
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

export default CategoryList;