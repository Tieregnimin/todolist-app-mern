// backend/models/taskModel.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      minlength: [2, 'Le titre doit contenir au moins 2 caractères'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    priority: {
      type: String,
      enum: ['faible', 'moyenne', 'haute'],
      default: 'moyenne',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'La progression ne peut pas être inférieure à 0'],
      max: [100, 'La progression ne peut pas être supérieure à 100'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
