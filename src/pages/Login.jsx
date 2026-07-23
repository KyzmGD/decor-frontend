import {
  useState,
  useContext
} from "react";

import {
  useNavigate
} from "react-router-dom";

import AuthContext
  from "../context/AuthContext";

import {
  login
} from "../api/authApi";
import LanguageContext from "../context/LanguageContext";
import MainLayout from "../layouts/MainLayout";

function Login() {
  const { t } = useContext(LanguageContext);

  const navigate =
    useNavigate();

  const {
    loginUser
  } = useContext(
    AuthContext
  );

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const response =
          await login(
            email,
            password
          );

        loginUser(
          response.data.user,
          response.data.token
        );

        navigate("/");

      } catch (error) {

        alert(
          t("user.loginFailed")
        );

      }
    };

  return (

    <MainLayout><div className="max-w-md mx-auto w-full py-20 px-6">

      <h1 className="text-3xl font-bold mb-6">
        {t("common.login")}
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >

        <input
          type="email"
          placeholder={t("common.email")}
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="w-full border p-3"
        />

        <input
          type="password"
          placeholder={t("common.password")}
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border p-3"
        />

        <button
          type="submit"
          className="
            bg-black
            text-white
            px-6
            py-3
          "
        >
          {t("common.login")}
        </button>

      </form>

    </div></MainLayout>

  );
}

export default Login;
