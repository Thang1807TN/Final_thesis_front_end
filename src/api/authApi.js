import axiosClient from "./axiosClient";

const authApi = {
  login(payload) {
    return axiosClient.post("/auth/login", payload);
  },

  register(payload) {
    return axiosClient.post("/auth/register", payload);
  },

  getCurrentUser() {
    return axiosClient.get("/auth/me");
  },
};

export default authApi;
