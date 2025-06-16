import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Non autorisé, pas de token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
};
