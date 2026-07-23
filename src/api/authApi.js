import axios from "axios";

const API_URL =
  "https://decor-backend-z1ve.onrender.com/api/auth";

export const register = (
  userData
) => {
  return axios.post(
    `${API_URL}/register`,
    userData
  );
};

export const login = (
  email,
  password
) => {
  return axios.post(
    `${API_URL}/login`,
    {
      email,
      password
    }
  );
};

export const getProfile = (
  token
) => {
  return axios.get(
    `${API_URL}/profile`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );
};

export const updateProfile = (
  data,
  token
) => {
  return axios.put(
    `${API_URL}/profile`,
    data,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );
};
