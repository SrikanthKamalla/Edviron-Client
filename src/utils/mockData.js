import { addDays, subDays } from "date-fns";

export const mockSchools = [
  {
    _id: "65b0e6293e9f76a9694d84b4",
    name: "Greenwood High School",
    email: "admin@greenwood.edu",
    phone: "+91 98765 43210",
  },
  {
    _id: "65b0e6293e9f76a9694d84b5",
    name: "St. Mary's Academy",
    email: "contact@stmarys.edu",
    phone: "+91 98765 43211",
  },
  {
    _id: "65b0e6293e9f76a9694d84b6",
    name: "Delhi Public School",
    email: "info@dps.edu",
    phone: "+91 98765 43212",
  },
  {
    _id: "65b0e6293e9f76a9694d84b7",
    name: "Ryan International",
    email: "admin@ryan.edu",
    phone: "+91 98765 43213",
  },
  {
    _id: "65b0e6293e9f76a9694d84b8",
    name: "Kendriya Vidyalaya",
    email: "kv@gov.in",
    phone: "+91 98765 43214",
  },
];

export const mockTransactions = [
  {
    _id: "6745a123b456c789d012e345",
    collect_id: "TXN001",
    school_id: "65b0e6293e9f76a9694d84b4",
    trustee_id: "65b0e5552dd31950a9b41c5ba",
    student_info: {
      name: "Rahul Sharma",
      id: "STU001",
      email: "rahul.sharma@student.com",
    },
    gateway_name: "PhonePe",
    order_amount: 5000,
    transaction_amount: 5050,
    payment_mode: "upi",
    payment_details: "success@ybl",
    bank_reference: "YESBNK001",
    payment_message: "Payment successful",
    status: "SUCCESS",
    error_message: "",
    payment_time: subDays(new Date(), 2).toISOString(),
    custom_order_id: "ORD001",
  },
  {
    _id: "6745a123b456c789d012e346",
    collect_id: "TXN002",
    school_id: "65b0e6293e9f76a9694d84b5",
    trustee_id: "65b0e5552dd31950a9b41c5ba",
    student_info: {
      name: "Priya Patel",
      id: "STU002",
      email: "priya.patel@student.com",
    },
    gateway_name: "Paytm",
    order_amount: 3000,
    transaction_amount: 3030,
    payment_mode: "netbanking",
    payment_details: "HDFC Bank",
    bank_reference: "HDFC002",
    payment_message: "Payment successful",
    status: "SUCCESS",
    error_message: "",
    payment_time: subDays(new Date(), 1).toISOString(),
    custom_order_id: "ORD002",
  },
  {
    _id: "6745a123b456c789d012e347",
    collect_id: "TXN003",
    school_id: "65b0e6293e9f76a9694d84b4",
    trustee_id: "65b0e5552dd31950a9b41c5ba",
    student_info: {
      name: "Arjun Singh",
      id: "STU003",
      email: "arjun.singh@student.com",
    },
    gateway_name: "Razorpay",
    order_amount: 7500,
    transaction_amount: 7575,
    payment_mode: "card",
    payment_details: "Credit Card - ****1234",
    bank_reference: "ICICI003",
    payment_message: "Payment pending",
    status: "PENDING",
    error_message: "",
    payment_time: new Date().toISOString(),
    custom_order_id: "ORD003",
  },
  {
    _id: "6745a123b456c789d012e348",
    collect_id: "TXN004",
    school_id: "65b0e6293e9f76a9694d84b6",
    trustee_id: "65b0e5552dd31950a9b41c5ba",
    student_info: {
      name: "Sneha Gupta",
      id: "STU004",
      email: "sneha.gupta@student.com",
    },
    gateway_name: "PhonePe",
    order_amount: 2500,
    transaction_amount: 2525,
    payment_mode: "upi",
    payment_details: "failed@paytm",
    bank_reference: "SBI004",
    payment_message: "Payment failed - Insufficient balance",
    status: "FAILED",
    error_message: "Transaction declined by bank",
    payment_time: addDays(new Date(), -3).toISOString(),
    custom_order_id: "ORD004",
  },
  {
    _id: "6745a123b456c789d012e349",
    collect_id: "TXN005",
    school_id: "65b0e6293e9f76a9694d84b7",
    trustee_id: "65b0e5552dd31950a9b41c5ba",
    student_info: {
      name: "Vikram Joshi",
      id: "STU005",
      email: "vikram.joshi@student.com",
    },
    gateway_name: "Cashfree",
    order_amount: 4500,
    transaction_amount: 4545,
    payment_mode: "wallet",
    payment_details: "Paytm Wallet",
    bank_reference: "PTM005",
    payment_message: "Payment successful",
    status: "SUCCESS",
    error_message: "",
    payment_time: addDays(new Date(), -1).toISOString(),
    custom_order_id: "ORD005",
  },
];

export const getSchoolName = (schoolId) => {
  const school = mockSchools.find((s) => s._id === schoolId);
  return school ? school.name : "Unknown School";
};

export const getTransactionsBySchool = (schoolId) => {
  return mockTransactions.filter((t) => t.school_id === schoolId);
};

export const getTransactionByOrderId = (orderId) => {
  return mockTransactions.find((t) => t.custom_order_id === orderId);
};
