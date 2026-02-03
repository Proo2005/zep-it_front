import axios from "axios";

const API = axios.create({
  baseURL: "https://zep-it-back.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ------------------ Request Interceptor ------------------ */
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------ Response Interceptor ------------------ */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token expired / invalid
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
