import axios from "axios";

// Get the backend URL from environment variables for flexibility.
// In development, create a .env.local file with VITE_API_URL=http://localhost:3000
// In production, set VITE_API_URL in your Vercel project settings.
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://ai-caption-generator-1-xi6u.onrender.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This ensures cookies are sent with every request
});

export default apiClient;
