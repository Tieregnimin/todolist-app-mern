// frontend/src/api/axios.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

console.log("✅ Axios baseURL:", api.defaults.baseURL);

export default api;