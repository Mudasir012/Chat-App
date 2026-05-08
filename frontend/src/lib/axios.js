import axios from "axios";

const getBaseUrl = () => {
  if (import.meta.env.MODE === "development") return "http://localhost:5001/api";
  return "https://chat-app-git-main-mudasir012s-projects.vercel.app/api";
};

export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});
