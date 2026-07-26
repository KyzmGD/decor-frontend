import axios from "axios";

const BASE = "https://decor-backend-z1ve.onrender.com/api/reviews";

// Lấy danh sách đánh giá của sản phẩm
export const getReviews = (productId) =>
  axios.get(`${BASE}/${productId}/reviews`);

// Gửi đánh giá mới (cần token)
export const createReview = (productId, data, token) =>
  axios.post(`${BASE}/${productId}/reviews`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
