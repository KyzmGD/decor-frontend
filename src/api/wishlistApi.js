import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/wishlist`;

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getWishlist = (token) =>
  axios.get(API_URL, getConfig(token));

export const addToWishlist = (productId, token) =>
  axios.post(API_URL, { productId }, getConfig(token));

export const removeFromWishlist = (productId, token) =>
  axios.delete(`${API_URL}/${productId}`, getConfig(token));

export const clearWishlistApi = (token) =>
  axios.delete(API_URL, getConfig(token));
