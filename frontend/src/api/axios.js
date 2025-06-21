// frontend/api/axios.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // fallback local

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ important pour cookies cross-domain
});

console.log("✅ Axios baseURL:", api.defaults.baseURL);

export default api;
