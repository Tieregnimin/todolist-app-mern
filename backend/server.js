import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Chargement des variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();

// ✅ Liste des origines autorisées (localhost + Vercel prod + preview)
const allowedOrigins = [
  'http://localhost:5173',
  'https://todolist-app-mern.vercel.app',
  'https://todolist-app-mern-git-main-tieregnimins-projects.vercel.app'
];

// ✅ Middleware CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // permet l'envoi de cookies
}));

// ✅ Middlewares utiles
app.use(express.json());
app.use(cookieParser());

// ✅ Routes API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ Route test
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

// ✅ Middleware global de gestion des erreurs
app.use(errorHandler);

// ✅ Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
