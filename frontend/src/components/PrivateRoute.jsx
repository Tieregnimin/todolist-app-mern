// src/components/PrivateRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const { user = null, loading = false } = useAuth() || {};
  const location = useLocation();

  // Affichage d'un écran de chargement pendant que le contexte charge
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-600 text-lg font-semibold animate-pulse">
          Chargement...
        </div>
      </div>
    );
  }

  // Redirection vers /login tout en conservant la page d'origine
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Si l'utilisateur est connecté, afficher la page protégée
  return <>{children}</>;
}

export default PrivateRoute;
