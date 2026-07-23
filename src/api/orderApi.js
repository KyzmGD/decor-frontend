import axios from "axios";

const API_URL =
  "https://decor-backend-z1ve.onrender.com/api/orders";

const getConfig =
  (token) => ({
    headers: {
      Authorization:
        `Bearer ${token}`
    }
  });

export const createOrder =
  (data, token) =>
    axios.post(
      API_URL,
      data,
      getConfig(token)
    );

export const getMyOrders =
  (token) =>
    axios.get(
      `${API_URL}/my-orders`,
      getConfig(token)
    );

export const getAllOrders =
  (token) =>
    axios.get(
      API_URL,
      getConfig(token)
    );

export const updateOrderStatus =
  (
    id,
    status,
    token
  ) =>
    axios.put(
      `${API_URL}/${id}`,
      { status },
      getConfig(token)
    );