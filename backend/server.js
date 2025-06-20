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
const allowedOrigins = [
  'https://todolist-app-mern.vercel.app',
  'https://todolist-app-mern-git-main-tieregnimins-projects.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


// ✅ Middlewares utiles
app.use(express.json());
app.use(cookieParser());

// ✅ Routes API
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// ✅ Route test
app.get('/ping', (req, res) => {
  res.send('pong');
});

// ✅ Middleware global de gestion des erreurs
app.use(errorHandler);

