
import { createContext, useContext, useState } from "react";
import apiClient from "../services/apiClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  async function login(email, password) {
    const { data } = await apiClient.post("/auth/login", {
      email,
      password,
    });

    setToken(data.accessToken);
    setUser(data.user);

    // Attach JWT token to Axios requests
    apiClient.defaults.headers.common["Authorization"] =
      `Bearer ${data.accessToken}`;

    return data;
  }

  function logout() {
    setUser(null);
    setToken(null);

    // Remove authorization header
    delete apiClient.defaults.headers.common["Authorization"];
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
