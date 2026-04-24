import * as signalR from "@microsoft/signalr";
import { tokenService } from "./tokenService";

class SignalRService {
  connection = null;

  async start() {
    if (this.connection) return this.connection;

    const baseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/chat`, {
        accessTokenFactory: () => tokenService.getToken() || "",
      })
      .withAutomaticReconnect()
      .build();

    await this.connection.start();
    return this.connection;
  }

  async joinConversation(conversationId) {
    const conn = await this.start();
    await conn.invoke("JoinConversationGroup", conversationId);
  }

  async leaveConversation(conversationId) {
    if (!this.connection) return;
    await this.connection.invoke("LeaveConversationGroup", conversationId);
  }

  onReceiveMessage(callback) {
    if (!this.connection) return;
    this.connection.on("ReceiveMessage", callback);
  }

  onConversationUpdated(callback) {
    if (!this.connection) return;
    this.connection.on("ConversationUpdated", callback);
  }
}

export default new SignalRService();
