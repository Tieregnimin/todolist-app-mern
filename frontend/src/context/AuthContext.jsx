import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const res = await api.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Erreur de connexion",
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await api.post(
        "/api/auth/register",
        { username, email, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      toast.success("Inscription réussie !");
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'inscription");
      return { success: false, message: err.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      toast("Déconnexion réussie", { icon: "👋" });
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setUser(null);
        } else {
          console.error("Erreur AuthContext :", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export default AuthContext;