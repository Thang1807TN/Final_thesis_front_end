import axiosClient from "./axiosClient";

const productApi = {
  getAll(params) {
    return axiosClient.get("/products", { params });
  },

  getById(id) {
    return axiosClient.get(`/products/${id}`);
  },

  getMyProducts() {
    return axiosClient.get("/products/my-listings");
  },

  getBySellerId(sellerId) {
    return axiosClient.get(`/products/seller/${sellerId}`);
  },

  create(payload) {
    return axiosClient.post("/products", payload);
  },

  update(id, payload) {
    return axiosClient.put(`/products/${id}`, payload);
  },

  remove(id) {
    return axiosClient.delete(`/products/${id}`);
  },
};

export default productApi;
