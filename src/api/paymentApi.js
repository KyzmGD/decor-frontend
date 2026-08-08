import axios from "axios";

const API_URL =
  "https://decor-backend-z1ve.onrender.com/api/payments";

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getMyTransactions = (token) =>
  axios.get(`${API_URL}/my-transactions`, getConfig(token));

export const confirmPayment = (id, token) =>
  axios.patch(
    `${API_URL}/${id}/confirm`,
    {},
    getConfig(token)
  );
