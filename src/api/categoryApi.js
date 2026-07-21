import axios from "axios";

const API_URL =
  "https://decor-backend-z1ve.onrender.com/api/categories";

export const getCategories = () =>
  axios.get(API_URL);

export const createCategory = (
  data,
  token
) =>
  axios.post(
    API_URL,
    data,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

export const updateCategory = (
  id,
  data,
  token
) =>
  axios.put(
    `${API_URL}/${id}`,
    data,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

export const deleteCategory = (
  id,
  token
) =>
  axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );