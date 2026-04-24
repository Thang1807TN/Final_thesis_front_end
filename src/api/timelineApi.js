import axiosClient from "./axiosClient";

const timelineApi = {
  getByTransactionId(transactionId) {
    return axiosClient.get(`/timeline/transaction/${transactionId}`);
  },
};

export default timelineApi;
