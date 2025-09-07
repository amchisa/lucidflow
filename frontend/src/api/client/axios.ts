import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // Gets redirected through the proxy configured in vite.config (change later)
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 5 seconds
});
