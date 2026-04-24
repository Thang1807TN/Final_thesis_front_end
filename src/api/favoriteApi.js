import axiosClient from "./axiosClient";

const favoriteApi = {
  toggle(productId) {
    return axiosClient.post("/favorites/toggle", { productId });
  },

  getMine() {
    return axiosClient.get("/favorites/mine");
  },

  check(productId) {
    return axiosClient.get(`/favorites/check/${productId}`);
  },
};

export default favoriteApi;
