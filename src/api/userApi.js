import axiosClient from "./axiosClient";

const userApi = {
  getProfile() {
    return axiosClient.get("/users/profile");
  },

  updateProfile(payload) {
    return axiosClient.put("/users/profile", payload);
  },

  getAllUsers() {
    return axiosClient.get("/users");
  },
};

export default userApi;
