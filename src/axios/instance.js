import axios from "axios";
import { getAuthToken } from "../helpers/localstorage";
const BASE_URL = import.meta.env.VITE_API_URL;


export const axiosBaseInstance = axios.create({
  baseURL: BASE_URL,
});

axiosBaseInstance.interceptors.request.use(
  function (config) {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosBaseInstance.interceptors.response.use(
  function (response) {

    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
