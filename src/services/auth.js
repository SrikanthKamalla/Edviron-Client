import { axiosBaseInstance } from "../axios/instance";
import endpoints from "./endpoints";

export const login = (payload) =>
  axiosBaseInstance.post(endpoints.USER_LOGIN, payload);
export const signUp = (payload) =>
  axiosBaseInstance.post(endpoints.USER_SIGNUP, payload);
