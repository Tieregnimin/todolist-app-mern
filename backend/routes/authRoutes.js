// backend/routes/authRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Routes Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// ✅ Route protégée pour récupérer l'utilisateur
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});

export default router;
