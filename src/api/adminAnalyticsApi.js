import axiosClient from "./axiosClient";

const adminAnalyticsApi = {
  get() {
    return axiosClient.get("/adminanalytics");
  },
};

export default adminAnalyticsApi;
