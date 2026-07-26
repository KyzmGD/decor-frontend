import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/cart`;

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getCart = (token) =>
  axios.get(API_URL, getConfig(token));

export const addToCartApi = (productId, quantity, token) =>
  axios.post(API_URL, { productId, quantity }, getConfig(token));

export const updateCartItemApi = (productId, quantity, token) =>
  axios.put(`${API_URL}/${productId}`, { quantity }, getConfig(token));

export const removeFromCartApi = (productId, token) =>
  axios.delete(`${API_URL}/${productId}`, getConfig(token));

export const clearCartApi = (token) =>
  axios.delete(API_URL, getConfig(token));
