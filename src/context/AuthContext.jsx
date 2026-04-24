import { createContext, useContext, useEffect, useState } from "react";
import { tokenService } from "../services/tokenService";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(tokenService.getUser());
  const [token, setToken] = useState(tokenService.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = tokenService.getToken();

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        tokenService.setUser(currentUser);
        setUser(currentUser);
        setToken(storedToken);
      } catch {
        tokenService.clear();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login({ email, password });
    setUser(result.user);
    setToken(result.token);
    return result;
  };

  const register = async (payload) => {
    return authService.register(payload);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isAdmin: user?.role === "Admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
