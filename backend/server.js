import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js'; // ✅ pour gérer les erreurs proprement

// Chargement des variables d'environnement
dotenv.config();

// Connexion à la base MongoDB
connectDB();

const app = express();

// Middleware CORS (doit venir avant les routes)
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // ← AJOUTE PATCH ici
  credentials: true
}));

// Middleware pour parser les cookies et JSON
app.use(express.json());
app.use(cookieParser());

// Routes API
app.use('/api/auth', authRoutes);
app.use("/api/tasks", taskRoutes);

// Route de test
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

// Middleware global de gestion des erreurs
app.use(errorHandler); // ✅ attention à bien avoir le fichier errorMiddleware.js

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
