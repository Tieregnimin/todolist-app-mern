import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
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

  // 🔍 États pour le filtrage
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("");

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
      await api.delete(`/api/tasks/${id}`, { withCredentials: true });
      setTasks((tasks) => tasks.filter((t) => t._id !== id));
      toast.success("Tâche supprimée !");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const onToggleComplete = async (task) => {
    try {
      const res = await api.patch(
        `/api/tasks/${task._id}`,
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
        `/api/tasks/${id}`,
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

  // 🎯 Filtrage combiné
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "pending" && !task.completed);

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    const matchesDueDate =
      !dueDateFilter || task.dueDate?.slice(0, 10) === dueDateFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
  });

  if (authLoading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-6 p-4"
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

      {/* 🎛️ Filtres */}
      <div className="flex flex-wrap gap-4 mt-6 items-center">
        <input
          type="text"
          placeholder="Rechercher une tâche..."
          className="border rounded px-3 py-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Toutes</option>
          <option value="completed">Terminées</option>
          <option value="pending">En cours</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Toutes priorités</option>
          <option value="haute">Haute</option>
          <option value="moyenne">Moyenne</option>
          <option value="faible">Faible</option>
        </select>
        <input
          type="date"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      {/* 🧮 Compteur */}
      <div className="text-sm text-gray-600 mt-4">
        {filteredTasks.length} tâche{filteredTasks.length !== 1 && "s"} trouvée
        {filteredTasks.length > 1 && "s"}.
      </div>

      <div className="space-y-4 mt-4">
        <AnimatePresence>
          {filteredTasks.map((task) => (
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
