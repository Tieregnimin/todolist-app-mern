import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';

function TaskForm({ onAddTask, onUpdateTask, taskToEdit = null, clearEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [priority, setPriority] = useState('moyenne');
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate?.split('T')[0] || '');
      setProgress(taskToEdit.progress || 0);
      setPriority(taskToEdit.priority || 'moyenne');
      setShowModal(true);
    }
  }, [taskToEdit]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setProgress(0);
    setPriority('moyenne');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === '' || !user) return;

    const taskData = {
      title: title.trim(),
      description: description.trim() || '',
      dueDate: dueDate || null,
      progress: parseInt(progress) || 0,
      priority,
    };

    try {
      setLoading(true);
      if (taskToEdit) {
        const res = await api.patch(`/tasks/${taskToEdit._id}`, taskData);
        toast.success('Tâche modifiée !');
        onUpdateTask?.(res.data);
      } else {
        const res = await api.post('/tasks', taskData);
        toast.success('Tâche ajoutée !');
        onAddTask?.(res.data);
      }

      resetForm();
      setShowModal(false);
      clearEdit?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    resetForm();
    clearEdit?.();
  };

  if (!user) {
    return (
      <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-xl shadow text-center">
        Connecte-toi pour gérer les tâches.
      </div>
    );
  }

  return (
    <>
      {!taskToEdit && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <FaPlus /> Ajouter une tâche
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {taskToEdit ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Titre de la tâche"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Description de la tâche (facultatif)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
              />

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                placeholder="Progression (%)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="faible">Faible</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
              </select>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={title.trim() === '' || loading}
                  className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                    title.trim() === '' || loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading ? (taskToEdit ? 'Modification...' : 'Ajout...') : (taskToEdit ? 'Modifier' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskForm;
