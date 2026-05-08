import axios from "axios";

const getBaseUrl = () => {
  if (import.meta.env.MODE === "development") return "http://localhost:5001/api";
  const url = import.meta.env.VITE_BACKEND_URL;
  if (!url) return "/api";
  const cleanUrl = url.replace(/\/+$/, "");
  return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
};

export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});
