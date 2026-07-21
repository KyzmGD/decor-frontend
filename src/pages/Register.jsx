import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  register
} from "../api/authApi";

function Register() {

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

    <div className="max-w-md mx-auto mt-20">

      <h1 className="text-3xl font-bold mb-6">
        Register
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >

        <input
          placeholder="Full Name"
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
          placeholder="Email"
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
          placeholder="Password"
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
          Register
        </button>

      </form>

    </div>

  );
}

export default Register;