// backend/utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "SECRET_KEY", {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {  // ✅ Changement ici
    httpOnly: true,
    secure: true,       // ✅ requis pour Render
    sameSite: "None",   // ✅ autorise Vercel <-> Render
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  });
};

export default generateToken;
