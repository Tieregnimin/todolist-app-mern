import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col justify-center items-center px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Texte */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 flex items-center gap-2">
            <CheckCircle className="w-10 h-10 text-green-500" />
            ToDoPro
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Simplifiez votre quotidien. Planifiez, organisez et terminez vos tâches avec efficacité.
          </p>
          <div className="flex gap-4">
            <Link to="/login">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                Connexion
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition">
                Inscription
              </button>
            </Link>
          </div>
        </div>

        {/* Image */}
        <motion.img
          src="https://illustrations.popsy.co/gray/work-from-home.svg"
          alt="Illustration"
          className="w-full max-h-96 object-contain drop-shadow-xl"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
}

export default Landing;
