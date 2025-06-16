// backend/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Le nom d’utilisateur est requis'],
      minlength: [3, 'Le nom d’utilisateur doit contenir au moins 3 caractères'],
      maxlength: [30, 'Le nom d’utilisateur ne peut pas dépasser 30 caractères'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L’email est requis'],
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Adresse email invalide'],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Middleware de hachage du mot de passe
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Méthode de comparaison de mot de passe pour le login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
