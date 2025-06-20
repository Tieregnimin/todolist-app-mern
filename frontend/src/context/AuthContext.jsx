import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios"; // ✅ utilise l'instance axios avec la bonne baseURL
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Vérifie si l'utilisateur est connecté au montage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      await api.post("/api/auth/login", { email, password });
      // Récupère les infos utilisateur après connexion
      const res = await api.get("/api/auth/me");
      setUser(res.data);
      toast.success("Connexion réussie !");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de la connexion";
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (username, email, password) => {
    try {
      await api.post("/api/auth/register", { username, email, password });
      // Récupère les infos utilisateur après inscription
      const res = await api.get("/api/auth/me");
      setUser(res.data);
      toast.success("Inscription réussie !");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de l'inscription";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      toast.success("Déconnexion réussie !");
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
