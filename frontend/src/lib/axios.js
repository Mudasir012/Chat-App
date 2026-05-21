import axios from "axios";

const getBaseUrl = () => {
  if (import.meta.env.MODE === "development") return "http://localhost:5001/api";

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (backendUrl) return `${backendUrl}/api`;

  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }

  return "/api";
};

export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const { useAuthStore } = await import("../store/useAuthStore");
        useAuthStore.setState({ authUser: null, isCheckingAuth: false });
      } catch {}
    }
    return Promise.reject(error);
  }
);
