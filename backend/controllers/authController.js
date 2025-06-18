// backend/controllers/authController.js
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    // Génère le token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "SECRET_KEY", {
      expiresIn: "7d",
    });

    // ✅ Envoie le token dans un cookie sécurisé
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,         // 🔒 obligatoire pour Render + Vercel (HTTPS)
      sameSite: "None",     // 🔄 permet d’envoyer le cookie entre domaines différents
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    // Envoie l'utilisateur (sans le mot de passe)
    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Utilisateur déjà existant");
  }

  const user = await User.create({ username, email, password });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({ id: user._id, username: user.username, email: user.email });
  } else {
    res.status(400);
    throw new Error("Échec de l'inscription");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Déconnecté avec succès" });
});

