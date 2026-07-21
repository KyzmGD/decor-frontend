import axios from "axios";

const API_URL =
  "https://decor-backend-z1ve.onrender.com/api/products";

const getConfig = (token) => ({
  headers: {
    Authorization:
      `Bearer ${token}`
  }
});

export const getProducts = () =>
  axios.get(API_URL);

export const getProduct = (id) =>
  axios.get(`${API_URL}/${id}`);

export const createProduct = (
  data,
  token
) =>
  axios.post(
    API_URL,
    data,
    getConfig(token)
  );

export const updateProduct = (
  id,
  data,
  token
) =>
  axios.put(
    `${API_URL}/${id}`,
    data,
    getConfig(token)
  );

export const deleteProduct = (
  id,
  token
) =>
  axios.delete(
    `${API_URL}/${id}`,
    getConfig(token)
  );