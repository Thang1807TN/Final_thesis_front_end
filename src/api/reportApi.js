import axiosClient from "./axiosClient";

const reportApi = {
  // Create new report
  // payload: { productId, reportedUserId, reason, description }
  create(payload) {
    if (!payload) {
      throw new Error("Report payload is required");
    }

    return axiosClient.post("/reports", payload);
  },

  // Get all reports (Admin)
  getAll(params) {
    // optional params: pageNumber, pageSize, status
    return axiosClient.get("/reports", { params });
  },

  // Get single report by ID
  getById(id) {
    if (!id) {
      throw new Error("Report ID is required");
    }

    return axiosClient.get(`/reports/${id}`);
  },

  // Update report status (Admin)
  // payload: { status: "Resolved" | "Rejected" }
  updateStatus(id, payload) {
    if (!id) {
      throw new Error("Report ID is required");
    }

    return axiosClient.put(`/reports/${id}/status`, payload);
  },

  // (Optional) Delete report (if backend supports)
  remove(id) {
    if (!id) {
      throw new Error("Report ID is required");
    }

    return axiosClient.delete(`/reports/${id}`);
  },
};

export default reportApi;
