import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

function TaskCard({ task, onEdit, onDelete, onToggleComplete, onUpdateProgress, loading }) {
  if (!task) return null;

  const handleDelete = () => {
    if (window.confirm(`Supprimer la tâche "${task.title || "sans titre"}" ?`)) {
      onDelete(task._id);
    }
  };

  const handleProgressChange = (value) => {
    onUpdateProgress(task._id, Number(value));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'haute':
        return 'bg-red-500 text-white';
      case 'moyenne':
        return 'bg-yellow-400 text-black';
      case 'faible':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow ${
        task.completed ? "opacity-70" : ""
      }`}
    >
      {/* ✅ Titre + Checkbox */}
      <div className="flex items-center justify-between w-full">
        <label className="flex items-center gap-2 w-full cursor-pointer">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task)}
            className="w-5 h-5 accent-blue-600"
            aria-label={`Marquer "${task.title || "sans titre"}" comme terminée`}
          />
          <div className="flex flex-col flex-1">
          <span
            className={`text-lg select-none ${
            task.completed ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {task.title || <span className="italic text-gray-400">Sans titre</span>}
          </span>

          {/* Description facultative */}
            {task.description && (
          <p className="text-sm mt-1 text-gray-600 italic break-words">
            {task.description}
          </p>
            )}
          </div>

          <AnimatePresence>
            {task.completed && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
                className="text-green-500"
                title="Tâche terminée"
              >
                ✔
              </motion.span>
            )}
          </AnimatePresence>
        </label>
      </div>

      {/* ✅ Description (si présente) */}
      {task.description && (
        <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
          {task.description}
        </p>
      )}

      {/* ✅ Badge de priorité */}
      <div className="mt-2">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
            task.priority
          )}`}
        >
          Priorité : {task.priority || "non définie"}
        </span>
      </div>

      {/* ✅ Barre de progression */}
      <div className="w-full mt-4">
        <input
          type="range"
          min="0"
          max="100"
          value={task.progress || 0}
          onChange={(e) => handleProgressChange(e.target.value)}
          className="w-full accent-blue-500 cursor-pointer"
          title={`Progression : ${task.progress || 0}%`}
        />
        <p className="text-sm text-gray-600 mt-1 text-right">
          {task.progress || 0}%
        </p>
      </div>

      {/* ✅ Boutons Action */}
      <div className="flex gap-2 mt-4 justify-end">
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-full hover:bg-blue-100 transition-colors"
            aria-label={`Modifier la tâche "${task.title || "sans titre"}"`}
            title="Modifier"
            disabled={loading}
          >
            <FaEdit className="text-blue-500" />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="p-2 rounded-full hover:bg-red-100 transition-colors"
          aria-label={`Supprimer la tâche "${task.title || "sans titre"}"`}
          title="Supprimer"
          disabled={loading}
        >
          <FaTrash className="text-red-500" />
        </button>
      </div>
    </motion.div>
  );
}

export default TaskCard;
