const endpoints = {
  USER_SIGNUP: "/auth/signUp",
  USER_LOGIN: "/auth/login",
  CREATE_PAYMENT: "/payment/createPayment",
  GET_SCHOOLS: "schools",
  PAYMENT_STATUS: (id, school_id) =>
    `/payment/createPayment/${id}?school_id=${school_id}`,

  GET_TRANSACTIONS: "/transactions",

  GET_TRANSACTION_BY_SCHOOL: (school_id) => `/transactions/school/${school_id}`,

  GET_TRANSACTION_STATUS: (id) => `/payment/status/${id}`,
};

export default endpoints;
