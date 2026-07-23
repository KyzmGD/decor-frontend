import {
  useContext,
  useState,
  useEffect
} from "react";
import LanguageContext from "../../context/LanguageContext";

function CategoryForm({
  selectedCategory,
  onSubmit
}) {
  const { t } = useContext(LanguageContext);

  const [name, setName] =
    useState("");

  const [
    description,
    setDescription
  ] = useState("");

  useEffect(() => {

  if (selectedCategory) {

    setName(
      selectedCategory.name
    );

    setDescription(
      selectedCategory.description || ""
    );

  } else {

    setName("");
    setDescription("");

  }

}, [selectedCategory]);

  const handleSubmit = (
    e
  ) => {

    e.preventDefault();

    onSubmit({
      name,
      description
    });

    setName("");
    setDescription("");
  };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="
        border
        p-4
        mb-6
      "
    >

      <input
        type="text"
        placeholder={t("common.name")}
        value={name}
        onChange={(e) =>
          setName(
            e.target.value
          )
        }
        className="
          border
          p-2
          w-full
          mb-3
        "
      />

      <textarea
        placeholder={t("common.description")}
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
        className="
          border
          p-2
          w-full
          mb-3
        "
      />

      <button
        type="submit"
        className="
          bg-black
          text-white
          px-4
          py-2
        "
      >
        {selectedCategory
          ? `${t("common.update")} ${t("common.categories")}`
          : `${t("common.create")} ${t("common.categories")}`}
      </button>

    </form>
  );
}

export default CategoryForm;
