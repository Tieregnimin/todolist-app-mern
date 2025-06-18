// backend/utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "SECRET_KEY", {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,       // ✅ nécessaire pour Render en HTTPS
    sameSite: "None",   // ✅ autorise Vercel ↔ Render (cross-site)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  });
};

export default generateToken;
