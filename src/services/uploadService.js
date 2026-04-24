import axiosClient from "../api/axiosClient";

export const uploadService = {
  async uploadImages(files) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await axiosClient.post("/uploads/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
