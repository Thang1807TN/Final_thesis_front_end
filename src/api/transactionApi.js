import axiosClient from "./axiosClient";

const transactionApi = {
  getAll() {
    return axiosClient.get("/transactions");
  },

  getById(id) {
    return axiosClient.get(`/transactions/${id}`);
  },

  getMine() {
    return axiosClient.get("/transactions/my-transactions");
  },

  create(payload) {
    return axiosClient.post("/transactions", payload);
  },

  updateStatus(id, payload) {
    return axiosClient.put(`/transactions/${id}/status`, payload);
  },

  complete(id) {
    return axiosClient.put(`/transactions/${id}/complete`);
  },
};

export default transactionApi;
