import axiosClient from "./axiosClient";

const emailLogApi = {
  getAll() {
    return axiosClient.get("/emaillogs");
  },

  exportCsv() {
    return axiosClient.get("/emaillogs/export-csv", {
      responseType: "blob",
    });
  },
};

export default emailLogApi;
