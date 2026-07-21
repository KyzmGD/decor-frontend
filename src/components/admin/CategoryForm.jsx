import {
  useState,
  useEffect
} from "react";

function CategoryForm({
  selectedCategory,
  onSubmit
}) {

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
        placeholder="Category Name"
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
        placeholder="Description"
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
          ? "Update Category"
          : "Create Category"}
      </button>

    </form>
  );
}

export default CategoryForm;