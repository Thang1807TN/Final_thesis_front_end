import axiosClient from "./axiosClient";

const reviewApi = {
  create(payload) {
    return axiosClient.post("/reviews", payload);
  },

  getSellerReviews(sellerId) {
    return axiosClient.get(`/reviews/seller/${sellerId}`);
  },

  getSellerSummary(sellerId) {
    return axiosClient.get(`/reviews/seller/${sellerId}/summary`);
  },

  markHelpful(reviewId, increment = true) {
    return axiosClient.put(`/reviews/${reviewId}/helpful`, { increment });
  },

  reply(reviewId, reply) {
    return axiosClient.put(`/reviews/${reviewId}/reply`, { reply });
  },
};

export default reviewApi;
