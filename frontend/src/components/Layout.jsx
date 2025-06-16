import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

function Layout() {
  return (
    <motion.div
      className="min-h-screen bg-gray-50 text-gray-800"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />
      <main>
        <Outlet />
      </main>
    </motion.div>
  );
}

export default Layout;
