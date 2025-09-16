import { axiosBaseInstance } from "../axios/instance";
import endpoints from "./endpoints";

export const getTransactions = (payload = {}) =>
  axiosBaseInstance.get(endpoints.GET_TRANSACTIONS, { params: payload });

export const getTransactionBySchool = (school_id) =>
  axiosBaseInstance.get(endpoints.GET_TRANSACTION_BY_SCHOOL(school_id));

export const getTransactionStatus = (id) =>
  axiosBaseInstance.get(endpoints.GET_TRANSACTION_STATUS(id));
