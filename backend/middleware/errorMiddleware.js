// middleware/errorMiddleware.js

// Middleware pour gérer les erreurs globales
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur attrapée par le middleware :', err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Une erreur est survenue',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

// Middleware pour gérer les routes non trouvées
export const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Ressource non trouvée' });
};