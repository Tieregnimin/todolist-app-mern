// src/api.js
import api from "../api/axios"; // ✅ instance axios centralisée

const API_BASE_URL = "/api/tasks"; // ✅ Pas de localhost ici (géré par l'instance axios)

// 🔁 Récupérer toutes les tâches
export const getTasks = async () => {
  const res = await api.get(API_BASE_URL); // withCredentials déjà configuré dans api.js
  return res.data;
};

// ➕ Créer une tâche
export const createTask = async (taskData) => {
  try {
    const res = await api.post(API_BASE_URL, taskData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Erreur lors de la création de la tâche" };
  }
};

// ✏️ Modifier une tâche
export const updateTask = async (id, updatedData) => {
  try {
    const res = await api.patch(`${API_BASE_URL}/${id}`, updatedData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Erreur lors de la modification de la tâche" };
  }
};

// ❌ Supprimer une tâche
export const deleteTask = async (id) => {
  try {
    const res = await api.delete(`${API_BASE_URL}/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Erreur lors de la suppression de la tâche" };
  }
};
