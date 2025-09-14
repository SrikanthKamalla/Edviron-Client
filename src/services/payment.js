import { axiosBaseInstance } from "../axios/instance";
import endpoints from "./endpoints";

export const createPayment = (payload) =>
  axiosBaseInstance.get(endpoints.CREATE_PAYMENT, payload);
export const paymentStatus = (id, school_id) =>
  axiosBaseInstance.get(endpoints.PAYMENT_STATUS(id, school_id));
