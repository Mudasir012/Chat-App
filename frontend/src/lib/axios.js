import axios from "axios";

const getBaseUrl = () => {
  if (import.meta.env.MODE === "development") return "http://localhost:5001/api";
  return `${import.meta.env.VITE_BACKEND_URL || ""}/api`;
};

export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});
