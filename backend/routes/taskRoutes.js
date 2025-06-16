// backend/routes/taskRoutes.js
import express from 'express';
import {getTasks, createTask, updateTask, deleteTask,} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📌 Obtenir toutes les tâches de l'utilisateur connecté
router.get('/', protect, getTasks);

// 📌 Créer une nouvelle tâche
router.post('/', protect, createTask);

// 📌 Mettre à jour une tâche
router.patch('/:id', protect, updateTask);

// 📌 Supprimer une tâche
router.delete('/:id', protect, deleteTask);

export default router;
