import axios from "axios";

// Create a singleton axios instance
const axiosInstance = axios.create({
  baseURL: 'https://localhost:44311',
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Initialize auth token from session storage
const token = typeof window !== 'undefined' ? sessionStorage.getItem("auth_token") : null;
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const getAxiosInstance = () => axiosInstance;