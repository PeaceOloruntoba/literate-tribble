import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
//   type AxiosResponse,
  AxiosHeaders,
} from "axios";
import { useAuthStore } from "../store/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL || "http://192.168.0.147:8000/";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Important: include credentials so HttpOnly cookies (access/refresh) flow
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    console.log("Token from api.interceptors: ", token);
    if (token) {
      config.headers = config.headers ?? new AxiosHeaders();
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error) => {
//     const message =
//       error.response?.data?.error?.message || "An unexpected error occurred";
//     return Promise.reject({ message, status: error.response?.status || 500 });
//   }
// );

export default api;
