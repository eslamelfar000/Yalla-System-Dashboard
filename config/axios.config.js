// axios.config.js
import axios from "axios";
import { getAuthToken } from "@/lib/auth-utils";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://indigo-ferret-819035.hostingersite.com/api/v1/",
});

// Custom hook to use axios with authentication
export const useAxios = () => {
  // Create an axios instance with interceptors
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://indigo-ferret-819035.hostingersite.com/api/v1/",
  });

  // Request interceptor to add token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle errors
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle 401 unauthorized errors
      if (error.response?.status === 401) {
        // Token might be expired, redirect to login
        window.location.assign("/auth/login");
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
