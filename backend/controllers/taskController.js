import asyncHandler from 'express-async-handler';
import Task from '../models/taskModel.js';

// @desc    Obtenir toutes les tâches
// @route   GET /api/tasks
// @access  Privé
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(tasks);
});

// @desc    Créer une tâche
// @route   POST /api/tasks
// @access  Privé
export const createTask = asyncHandler(async (req, res) => {
  const { title, completed, priority, dueDate, progress } = req.body;

  if (!title || title.trim() === '') {
    res.status(400);
    throw new Error('Le titre est requis');
  }

  const task = await Task.create({
    title: title.trim(),
    completed: typeof completed === 'boolean' ? completed : false,
    priority: priority || 'moyenne',
    dueDate: dueDate || null,
    progress: progress || 0,
    userId: req.user.id,
  });

  res.status(201).json(task);
});


// @desc    Modifier une tâche
// @route   PATCH /api/tasks/:id
// @access  Privé
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

  if (!task) {
    res.status(404);
    throw new Error("Tâche non trouvée.");
  }

  const { title, completed, priority, dueDate, progress } = req.body;

if (title !== undefined) task.title = title.trim();
if (completed !== undefined) task.completed = completed;
if (priority !== undefined) task.priority = priority;
if (dueDate !== undefined) task.dueDate = dueDate;
if (progress !== undefined) task.progress = progress;

  const updatedTask = await task.save();
  res.status(200).json(updatedTask);
});

// @desc    Supprimer une tâche
// @route   DELETE /api/tasks/:id
// @access  Privé
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!task) {
    res.status(404);
    throw new Error("Tâche non trouvée ou non autorisée.");
  }

  res.status(200).json({ message: "Tâche supprimée avec succès." });
});
// @desc    Marquer une tâche comme terminée