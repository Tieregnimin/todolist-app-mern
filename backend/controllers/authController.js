// backend/controllers/authController.js
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({ id: user._id, username: user.username, email: user.email });
  } else {
    res.status(401);
    throw new Error("Email ou mot de passe invalide");
  }
});

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
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Déconnecté avec succès" });
});

export const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Non autorisé");
  }
  res.status(200).json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});
