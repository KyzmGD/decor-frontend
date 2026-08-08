import axios from "axios";

const API_URL =
  "https://decor-backend-z1ve.onrender.com/api/admin/accounts";

const getConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getAccounts = (token) =>
  axios.get(API_URL, getConfig(token));

export const getAccount = (id, token) =>
  axios.get(`${API_URL}/${id}`, getConfig(token));

export const updateAccountRole = (id, role, token) =>
  axios.patch(
    `${API_URL}/${id}/role`,
    { role },
    getConfig(token)
  );
