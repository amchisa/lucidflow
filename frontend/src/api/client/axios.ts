import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // Trigger a redirect through the proxy configured in vite.config
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]; // Let browser set Content-Type for FormData
    }

    return config;
  },
  (error) => Promise.reject(error),
);
