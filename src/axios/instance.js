import axios from "axios";
import { toast } from "react-toastify";
import { refreshUser } from "../services/authentication";

const axiosBaseInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

//Request Interceptor
axiosBaseInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]; // Let browser set it
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//Response Interceptor
axiosBaseInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        await refreshUser();
        return axiosBaseInstance(config);
      } catch {
        toast.warn("🚨 Unauthorized. Redirecting to login...");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosBaseInstance;
