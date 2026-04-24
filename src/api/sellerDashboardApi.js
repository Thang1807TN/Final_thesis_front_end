import axiosClient from "./axiosClient";

const sellerDashboardApi = {
  getPublicProfile(sellerId) {
    return axiosClient.get(`/sellerdashboard/public/${sellerId}`);
  },
};

export default sellerDashboardApi;
