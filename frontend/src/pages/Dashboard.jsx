import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // ✅ instance axios centralisée
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();


  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
  if (authLoading || !user) return;

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/tasks");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Erreur lors du chargement des tâches");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

      fetchTasks();
  }, [user, authLoading]);

  const onAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const onUpdateTask = (updatedTask) => {
    setTasks((tasks) =>
      tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  const onDeleteTask = async (id) => {
    try {
      await api.delete(`${API_BASE}/api/tasks/${id}`, {
        withCredentials: true,
      });
      setTasks((tasks) => tasks.filter((t) => t._id !== id));
      toast.success("Tâche supprimée !");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const onToggleComplete = async (task) => {
    try {
      const res = await api.patch(
        `${API_BASE}/api/tasks/${task._id}`,
        { completed: !task.completed },
        { withCredentials: true }
      );
      setTasks((tasks) =>
        tasks.map((t) => (t._id === task._id ? res.data : t))
      );
    } catch {
      toast.error("Erreur lors du changement d'état");
    }
  };

  const onUpdateProgress = async (id, progress) => {
    try {
      const res = await api.patch(
        `${API_BASE}/api/tasks/${id}`,
        { progress: parseInt(progress) },
        { withCredentials: true }
      );
      setTasks((tasks) =>
        tasks.map((t) => (t._id === id ? res.data : t))
      );
    } catch {
      toast.error("Erreur lors de la mise à jour de la progression");
    }
  };

  if (authLoading) {
  return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <motion.div
      className="max-w-xl mx-auto mt-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      {user && (
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
          Bienvenue, {user.username}
        </h2>
      )}

      <TaskForm
        taskToEdit={editingTask}
        onAddTask={onAddTask}
        onUpdateTask={onUpdateTask}
        clearEdit={() => setEditingTask(null)}
      />

      <div className="space-y-4">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => setEditingTask(task)}
              onDelete={onDeleteTask}
              onToggleComplete={onToggleComplete}
              onUpdateProgress={onUpdateProgress}
              loading={loading}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Dashboard;
