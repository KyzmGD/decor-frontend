import {
  useContext,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  register
} from "../api/authApi";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";

function Register() {
  const { t } = useContext(LanguageContext);

  const navigate =
    useNavigate();

  const [formData,
    setFormData] =
    useState({
      fullname: "",
      email: "",
      password: ""
    });

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      await register(
        formData
      );

      navigate(
        "/login"
      );
    };

  return (

    <MainLayout><div className="max-w-md mx-auto w-full py-20 px-6">

      <h1 className="text-3xl font-bold mb-6">
        {t("common.register")}
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >

        <input
          placeholder={t("common.fullName")}
          className="w-full border p-3"
          onChange={(e) =>
            setFormData({
              ...formData,
              fullname:
                e.target.value
            })
          }
        />

        <input
          placeholder={t("common.email")}
          className="w-full border p-3"
          onChange={(e) =>
            setFormData({
              ...formData,
              email:
                e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder={t("common.password")}
          className="w-full border p-3"
          onChange={(e) =>
            setFormData({
              ...formData,
              password:
                e.target.value
            })
          }
        />

        <button
          className="
            bg-black
            text-white
            px-6
            py-3
          "
        >
          {t("common.register")}
        </button>

      </form>

    </div></MainLayout>

  );
}

export default Register;
