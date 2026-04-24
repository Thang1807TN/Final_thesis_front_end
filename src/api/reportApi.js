import axiosClient from "./axiosClient";

const reportApi = {
  create(payload) {
    return axiosClient.post("/reports", payload);
  },

  getAll() {
    return axiosClient.get("/reports");
  },

  updateStatus(id, payload) {
    return axiosClient.put(`/reports/${id}/status`, payload);
  },
};

export default reportApi;
