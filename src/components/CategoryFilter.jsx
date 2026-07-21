function CategoryFilter({
  categories,
  selectedCategory,
  onChange
}) {
  return (
    <select
      value={selectedCategory}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="
        border
        px-4
        py-2
        rounded
      "
    >
      <option value="">
        All Categories
      </option>

      {categories.map((category) => (
        <option
          key={category.id}
          value={category.id}
        >
          {category.name}
        </option>
      ))}
    </select>
  );
}

export default CategoryFilter;