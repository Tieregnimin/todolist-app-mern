import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash } from "react-icons/fa";

function TaskList({ tasks = [], onDeleteTask, onToggleComplete, onEditTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortOption, setSortOption] = useState('dateAsc'); // default sort

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditValue(task.title);
  };

  const handleEditSubmit = (task) => {
    if (editValue.trim() && onEditTask) {
      onEditTask({ ...task, title: editValue.trim() });
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Supprimer la tâche "${title}" ?`)) {
      onDeleteTask(id);
    }
  };

  // 1. Filtrage
  const filteredTasks = tasks.filter((task) => {
    if (priorityFilter === 'all') return true;
    return task.priority === priorityFilter;
  });

  // 2. Tri
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === 'dateAsc') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortOption === 'dateDesc') {
      return new Date(b.dueDate) - new Date(a.dueDate);
    }
    if (sortOption === 'priorityHighLow') {
      const order = { haute: 1, moyenne: 2, faible: 3 };
      return order[a.priority] - order[b.priority];
    }
    if (sortOption === 'priorityLowHigh') {
      const order = { faible: 1, moyenne: 2, haute: 3 };
      return order[a.priority] - order[b.priority];
    }
    return 0;
  });

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      {/* Filtres et tri */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Mes Tâches</h2>
        <div className="flex flex-wrap gap-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">📋 Toutes les priorités</option>
            <option value="haute">🔴 Haute</option>
            <option value="moyenne">🟡 Moyenne</option>
            <option value="faible">🟢 Faible</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="dateAsc">📅 Date ↑</option>
            <option value="dateDesc">📅 Date ↓</option>
            <option value="priorityHighLow">🔴 Priorité haute → basse</option>
            <option value="priorityLowHigh">🟢 Priorité basse → haute</option>
          </select>
        </div>
      </div>

      {/* Liste */}
      {sortedTasks.length === 0 && (
        <div className="text-center text-gray-400 italic py-8">
          Aucune tâche pour ce filtre.
        </div>
      )}

      <AnimatePresence>
        {sortedTasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`flex justify-between items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group ${
              task.completed ? 'opacity-70' : ''
            }`}
          >
            <div className="flex flex-col gap-1">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task)}
                  className="w-5 h-5 accent-blue-600"
                  aria-label={`Marquer "${task.title}" comme terminée`}
                />
                {editingId === task._id ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleEditSubmit(task)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditSubmit(task);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                    className="ml-2 text-lg border-b border-blue-400 outline-none"
                  />
                ) : (
                  <span
                    className={`ml-2 text-lg select-none ${
                      task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </span>
                )}
                {task.completed && (
                  <span className="ml-2 text-green-500" title="Tâche terminée">
                    ✔
                  </span>
                )}
              </label>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span
                  className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${
                  task.priority === 'haute'
                  ? 'bg-red-500'
                  : task.priority === 'moyenne'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
                }`}
                  >
                  {task.priority}
                  </span>
                  <span>Échéance : {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</span>
              </div>

            </div>

            <div className="flex gap-2">
              {onEditTask && editingId !== task._id && (
                <button
                  onClick={() => startEdit(task)}
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                  aria-label={`Modifier la tâche "${task.title}"`}
                  title="Modifier"
                >
                  <FaEdit className="text-blue-500" />
                </button>
              )}
              <button
                onClick={() => handleDelete(task._id, task.title)}
                className="p-2 rounded-full hover:bg-red-100 transition-colors"
                aria-label={`Supprimer la tâche "${task.title}"`}
                title="Supprimer"
              >
                <FaTrash className="text-red-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default TaskList;
