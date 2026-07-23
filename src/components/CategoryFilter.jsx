import { useContext } from "react";
import LanguageContext from "../context/LanguageContext";

function CategoryFilter({
  categories,
  selectedCategory,
  onChange
}) {
  const { t } = useContext(LanguageContext);
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
        min-w-52
      "
    >
      <option value="">
        {t("user.allCategories")}
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
