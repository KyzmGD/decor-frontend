import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import MainLayout
  from "../../layouts/MainLayout";

import {
  getProduct,
  updateProduct
} from "../../api/adminProductApi";

function ProductEdit() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [formData,
    setFormData] =
    useState({});

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct =
    async () => {

      const response =
        await getProduct(id);

      setFormData(
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

      await updateProduct(
        id,
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
          Edit Product
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
            value={
              formData.name || ""
            }
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
            value={
              formData.description || ""
            }
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
            value={
              formData.price || ""
            }
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
            "
          />

          <button
            className="
              bg-black
              text-white
              px-6
              py-3
            "
          >
            Update
          </button>

        </form>

      </div>

    </MainLayout>
  );
}

export default ProductEdit;