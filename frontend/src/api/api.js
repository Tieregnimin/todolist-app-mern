// src/api.js
import api from "../api/axios"; // ✅ instance axios centralisée


const API_BASE_URL = "http://localhost:5000/api/tasks";

// Récupérer toutes les tâches
export const getTasks = async () => {
  const res = await api.get(API_BASE_URL, { withCredentials: true });
  return res.data.user;
};

// Créer une tâche
export const createTask = async (taskData) => {
  try {
    const res = await api.post(API_BASE_URL, taskData, { withCredentials: true });
    return res.data.user;
  } catch (err) {
    throw err.response?.data || { message: "Erreur lors de la création de la tâche" };
  }
};

// Mettre à jour une tâche
export const updateTask = async (id, updatedData) => {
  try {
    const res = await api.patch(`${API_BASE_URL}/${id}`, updatedData, { withCredentials: true });
    return res.data.user;
  } catch (err) {
    throw err.response?.data || { message: "Erreur lors de la modification de la tâche" };
  }
};

// Supprimer une tâche
export const deleteTask = async (id) => {
  try {
    const res = await api.delete(`${API_BASE_URL}/${id}`, { withCredentials: true });
    return res.data.user;
  } catch (err) {
    throw err.response?.data || { message: "Erreur lors de la suppression de la tâche" };
  }
};
