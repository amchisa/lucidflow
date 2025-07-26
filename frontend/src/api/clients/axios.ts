import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // Gets redirected through the api proxy configured in vite.config
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 5 sec
});

api.interceptors.request.use(
  (config) => {
    // Modify request config here if needed
    return config;
  },
  (error) => {
    // Handle global request errors here if needed
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Modify or log response data here if needed
    return response;
  },
  (error) => {
    // Handle global response errors here if needed
    return Promise.reject(error);
  }
);
