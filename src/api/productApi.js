import axios from "axios";

const API_URL = "https://decor-backend-z1ve.onrender.com/api/products";

export const getProducts = (categoryId = "") => {
  const url = categoryId
    ? `${API_URL}?category=${categoryId}`
    : API_URL;

  return axios.get(url);
};

export const getProductById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};