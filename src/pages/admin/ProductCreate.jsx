import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import MainLayout
  from "../../layouts/MainLayout";

import {
  createProduct
} from "../../api/adminProductApi";

import {
  getCategories
} from "../../api/categoryApi";

function ProductCreate() {

  const navigate =
    useNavigate();

  const [categories,
    setCategories] =
    useState([]);

  const [formData,
    setFormData] =
    useState({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: "",
      categoryId: ""
    });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories =
    async () => {

      const response =
        await getCategories();

      setCategories(
        response.data
      );
    };

  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value
      });
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      await createProduct(
        formData
      );

      navigate(
        "/admin/products"
      );
    };

  return (
    <MainLayout>

      <div
        className="
          max-w-3xl
          mx-auto
          py-10
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
          Add Product
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="
            space-y-4
          "
        >

          <input
            name="name"
            placeholder="Name"
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
            "
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
            "
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
            "
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
            "
          />

          <input
            name="image"
            placeholder="Image URL"
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
            "
          />

          <select
            name="categoryId"
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
            "
          >

            <option value="">
              Select Category
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={
                    category.id
                  }
                >
                  {category.name}
                </option>
              )
            )}

          </select>

          <button
            className="
              bg-black
              text-white
              px-6
              py-3
            "
          >
            Save
          </button>

        </form>

      </div>

    </MainLayout>
  );
}

export default ProductCreate;