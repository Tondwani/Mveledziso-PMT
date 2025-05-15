import axios from "axios";

// Create a singleton axios instance
const axiosInstance = axios.create({
  baseURL: 'https://localhost:44311',
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 60000,
  withCredentials: true // Enable sending cookies in CORS requests
});

// Initialize auth token from session storage
const token = typeof window !== 'undefined' ? sessionStorage.getItem("auth_token") : null;
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error?.message) {
      error.message = error.response.data.error.message;
    }
    return Promise.reject(error);
  }
);

export const getAxiosInstance = () => axiosInstance;