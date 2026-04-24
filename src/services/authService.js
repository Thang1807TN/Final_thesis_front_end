import authApi from "../api/authApi";
import { tokenService } from "./tokenService";

export const authService = {
  async login(payload) {
    const response = await authApi.login(payload);
    const data = response.data;

    if (data?.token) {
      tokenService.setToken(data.token);
    }

    const meResponse = await authApi.getCurrentUser();
    const user = meResponse.data;

    tokenService.setUser(user);

    return {
      token: data.token,
      user,
    };
  },

  async register(payload) {
    const response = await authApi.register(payload);
    return response.data;
  },

  async getCurrentUser() {
    const response = await authApi.getCurrentUser();
    return response.data;
  },

  logout() {
    tokenService.clear();
  },
};
