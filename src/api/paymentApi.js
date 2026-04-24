import axiosClient from "./axiosClient";

const paymentApi = {
  create(payload) {
    return axiosClient.post("/payments", payload);
  },

  getById(id) {
    return axiosClient.get(`/payments/${id}`);
  },

  getMine() {
    return axiosClient.get("/payments/mine");
  },

  updateStatus(id, payload) {
    return axiosClient.put(`/payments/${id}/status`, payload);
  },

  validateCoupon(payload) {
    return axiosClient.post("/payments/validate-coupon", payload);
  },

  getInvoiceUrl(id) {
    return `${import.meta.env.VITE_API_BASE_URL}/payments/${id}/invoice`;
  },
};

export default paymentApi;
