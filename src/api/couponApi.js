import axiosClient from "./axiosClient";

const couponApi = {
  getAll() {
    return axiosClient.get("/coupons");
  },

  getById(id) {
    return axiosClient.get(`/coupons/${id}`);
  },

  create(payload) {
    return axiosClient.post("/coupons", payload);
  },

  update(id, payload) {
    return axiosClient.put(`/coupons/${id}`, payload);
  },

  remove(id) {
    return axiosClient.delete(`/coupons/${id}`);
  },

  getUsageStats() {
    return axiosClient.get("/coupons/usage-stats");
  },
};

export default couponApi;
