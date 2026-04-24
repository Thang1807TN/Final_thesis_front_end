import axiosClient from "./axiosClient";

const chatApi = {
  createConversation(payload) {
    return axiosClient.post("/chats/conversations", payload);
  },

  getMyConversations() {
    return axiosClient.get("/chats/conversations");
  },

  getMessages(conversationId) {
    return axiosClient.get(`/chats/conversations/${conversationId}/messages`);
  },

  sendMessage(conversationId, payload) {
    return axiosClient.post(
      `/chats/conversations/${conversationId}/messages`,
      payload,
    );
  },
};

export default chatApi;
