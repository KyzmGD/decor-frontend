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

function Login() {

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
          "Login failed"
        );

      }
    };

  return (

    <div className="max-w-md mx-auto mt-20">

      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >

        <input
          type="email"
          placeholder="Email"
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
          placeholder="Password"
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
          Login
        </button>

      </form>

    </div>

  );
}

export default Login;