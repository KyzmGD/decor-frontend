import {
  useContext,
  useState,
  useEffect
} from "react";
import LanguageContext from "../../context/LanguageContext";

function ProductForm({
  selectedProduct,
  categories,
  onSubmit
}) {
  const { t } = useContext(LanguageContext);

  const [name, setName] =
    useState("");

  const [
    description,
    setDescription
  ] = useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [image, setImage] =
    useState("");

  const [
    categoryId,
    setCategoryId
  ] = useState("");

  useEffect(() => {

    if (selectedProduct) {

      setName(
        selectedProduct.name
      );

      setDescription(
        selectedProduct.description || ""
      );

      setPrice(
        selectedProduct.price
      );

      setStock(
        selectedProduct.stock
      );

      setImage(
        selectedProduct.image || ""
      );

      setCategoryId(
        selectedProduct.categoryId
      );

    } else {

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImage("");
      setCategoryId("");

    }

  }, [selectedProduct]);

  const handleSubmit = (
    e
  ) => {

    e.preventDefault();

    onSubmit({
      name,
      description,
      price,
      stock,
      image,
      categoryId
    });
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

      <input
        type="number"
        placeholder={t("common.price")}
        value={price}
        onChange={(e) =>
          setPrice(
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

      <input
        type="number"
        placeholder={t("common.stock")}
        value={stock}
        onChange={(e) =>
          setStock(
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

      <input
        type="text"
        placeholder={t("common.imageUrl")}
        value={image}
        onChange={(e) =>
          setImage(
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

      <select
        value={categoryId}
        onChange={(e) =>
          setCategoryId(
            e.target.value
          )
        }
        className="
          border
          p-2
          w-full
          mb-3
        "
      >
        <option value="">
          {t("common.selectCategory")}
        </option>

        {categories.map(
          (category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          )
        )}
      </select>

      <button
        type="submit"
        className="
          bg-black
          text-white
          px-4
          py-2
        "
      >
        {selectedProduct
          ? `${t("common.update")} ${t("common.product")}`
          : `${t("common.create")} ${t("common.product")}`}
      </button>

    </form>
  );
}

export default ProductForm;
