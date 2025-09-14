import axios from "axios";
import {
  mockTransactions,
  mockSchools,
  getTransactionsBySchool,
  getTransactionByOrderId,
} from "./mockData";

// Mock API base URL - replace with your actual backend URL
const API_BASE_URL = "https://your-backend-url.com/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const token = JSON.parse(user).token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Mock API functions - these simulate backend calls with delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  // Fetch all transactions with filtering, pagination, and sorting
  async getTransactions(
    options = {},
    page = 1,
    limit = 10,
    sortBy = "payment_time",
    sortOrder = "desc"
  ) {
    await delay(500); // Simulate network delay

    let filteredTransactions = [...mockTransactions];

    // Apply filters
    if (options.status && options.status.length > 0) {
      filteredTransactions = filteredTransactions.filter((t) =>
        options.status.includes(t.status)
      );
    }

    if (options.school_ids && options.school_ids.length > 0) {
      filteredTransactions = filteredTransactions.filter((t) =>
        options.school_ids.includes(t.school_id)
      );
    }

    if (options.search) {
      const search = options.search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(
        (t) =>
          t.student_info.name.toLowerCase().includes(search) ||
          t.custom_order_id.toLowerCase().includes(search) ||
          t.collect_id.toLowerCase().includes(search)
      );
    }

    // Apply date filters
    if (options.date_from) {
      const fromDate = new Date(options.date_from);
      filteredTransactions = filteredTransactions.filter(
        (t) => new Date(t.payment_time) >= fromDate
      );
    }

    if (options.date_to) {
      const toDate = new Date(options.date_to);
      toDate.setHours(23, 59, 59, 999); // End of day
      filteredTransactions = filteredTransactions.filter(
        (t) => new Date(t.payment_time) <= toDate
      );
    }

    // Apply sorting
    filteredTransactions.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "payment_time") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "desc") {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filteredTransactions.slice(
      startIndex,
      endIndex
    );

    return {
      data: paginatedTransactions,
      total: filteredTransactions.length,
      page,
      totalPages: Math.ceil(filteredTransactions.length / limit),
      limit,
    };
  },

  // Fetch transactions by school ID
  async getTransactionsBySchool(schoolId, page = 1, limit = 10) {
    await delay(500);

    const schoolTransactions = getTransactionsBySchool(schoolId);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = schoolTransactions.slice(
      startIndex,
      endIndex
    );

    return {
      data: paginatedTransactions,
      total: schoolTransactions.length,
      page,
      totalPages: Math.ceil(schoolTransactions.length / limit),
      limit,
    };
  },

  // Check transaction status by custom order ID
  async getTransactionStatus(customOrderId) {
    await delay(300);

    const transaction = getTransactionByOrderId(customOrderId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return transaction;
  },

  // Get all schools
  async getSchools() {
    await delay(200);
    // console.log(object)
    return mockSchools;
  },

  // Create payment request
  async createPaymentRequest(paymentData) {
    await delay(1000);

    // Mock payment gateway response
    return {
      collect_request_id: `CR_${Date.now()}`,
      Collect_request_url: `https://dev-vanilla.edviron.com/payment/${Date.now()}`,
      sign: "mock_jwt_token_here",
    };
  },

  // Mock webhook endpoint (for testing)
  async processWebhook(webhookData) {
    await delay(100);
    console.log("Webhook processed:", webhookData);
    return { success: true };
  },

  // Dashboard statistics
  async getDashboardStats() {
    await delay(300);

    const totalTransactions = mockTransactions.length;
    const successfulTransactions = mockTransactions.filter(
      (t) => t.status === "SUCCESS"
    ).length;
    const pendingTransactions = mockTransactions.filter(
      (t) => t.status === "PENDING"
    ).length;
    const failedTransactions = mockTransactions.filter(
      (t) => t.status === "FAILED"
    ).length;

    const totalAmount = mockTransactions
      .filter((t) => t.status === "SUCCESS")
      .reduce((sum, t) => sum + t.transaction_amount, 0);

    return {
      totalTransactions,
      successfulTransactions,
      pendingTransactions,
      failedTransactions,
      totalAmount,
      successRate: ((successfulTransactions / totalTransactions) * 100).toFixed(
        1
      ),
    };
  },
};

export default api;
