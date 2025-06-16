// frontend/api/axios.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ transmet automatiquement les cookies
});

export default api;
