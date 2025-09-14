import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { apiService } from "../utils/api";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "../components/helpers";
import {
  getTransactions,
  getTransactionStatus,
} from "../services/transactions";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("payment_time");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [uniqueSchoolIds, setUniqueSchoolIds] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    school_id: "",
    date_from: "",
    date_to: "",
    search: "",
  });

  const limit = 10;

  const loadTransactions = async () => {
    try {
      setIsLoading(true);

      // Prepare filter object for API call
      const apiFilters = {};

      if (filters.status) apiFilters.status = filters.status;
      if (filters.school_id) apiFilters.school_id = filters.school_id;
      if (filters.date_from) apiFilters.date_from = filters.date_from;
      if (filters.date_to) apiFilters.date_to = filters.date_to;
      if (filters.search) apiFilters.search = filters.search;

      const response = await apiService.getTransactions(
        apiFilters, // Use the prepared filters object
        currentPage,
        limit,
        sortBy,
        sortOrder
      );

      setTransactions(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);

      // Extract unique school IDs from transactions
      const schoolIds = [...new Set(response.data.map((t) => t.school_id))];
      setUniqueSchoolIds(schoolIds);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [currentPage, sortBy, sortOrder, filters]);

  useEffect(() => {
    const fetch = async () => {
      const response = await getTransactions();
      console.log(response);
    };
    fetch();
  }, []);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      school_id: "",
      date_from: "",
      date_to: "",
      search: "",
    });
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const hasActiveFilters =
    filters.status ||
    filters.school_id ||
    filters.date_from ||
    filters.date_to ||
    filters.search;

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and view all payment transactions
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by student name, order ID, or collect ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>

          {showFilters && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All statuses</option>
                  <option value="SUCCESS">Success</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              {/* School Filter */}
              <div className="space-y-2">
                <Label>School ID</Label>
                <select
                  value={filters.school_id}
                  onChange={(e) =>
                    handleFilterChange("school_id", e.target.value)
                  }
                  className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All schools</option>
                  {uniqueSchoolIds.map((schoolId) => (
                    <option key={schoolId} value={schoolId}>
                      {schoolId}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) =>
                    handleFilterChange("date_from", e.target.value)
                  }
                />
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) =>
                    handleFilterChange("date_to", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {transactions.length} of {total} transactions
              </div>
              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction List</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadTransactions}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading transactions...
            </div>
          ) : (
            <>
              <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-100 dark:bg-gray-700">
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 py-3 px-4"
                        onClick={() => handleSort("custom_order_id")}
                      >
                        <div className="flex items-center gap-2">
                          Order ID
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="py-3 px-4">Student</TableHead>
                      <TableHead className="py-3 px-4">School ID</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 py-3 px-4"
                        onClick={() => handleSort("transaction_amount")}
                      >
                        <div className="flex items-center gap-2">
                          Amount
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="py-3 px-4">Gateway</TableHead>
                      <TableHead className="py-3 px-4">Status</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 py-3 px-4"
                        onClick={() => handleSort("payment_time")}
                      >
                        <div className="flex items-center gap-2">
                          Payment Time
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-gray-500 dark:text-gray-400"
                        >
                          {hasActiveFilters
                            ? "No transactions match your filters"
                            : "No transactions found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow
                          key={transaction._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <TableCell className="font-mono text-sm py-3 px-4 text-gray-900 dark:text-white">
                            {transaction.custom_order_id}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {transaction.student_info.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {transaction.student_info.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-gray-900 dark:text-white font-mono">
                            {transaction.school_id}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                ₹
                                {transaction.transaction_amount.toLocaleString(
                                  "en-IN"
                                )}
                              </div>
                              {transaction.order_amount !==
                                transaction.transaction_amount && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Order: ₹
                                  {transaction.order_amount.toLocaleString(
                                    "en-IN"
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-gray-900 dark:text-white">
                            {transaction.gateway_name}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <Badge
                              className={getStatusColor(transaction.status)}
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <div className="text-sm">
                              <div className="text-gray-900 dark:text-white">
                                {format(
                                  new Date(transaction.payment_time),
                                  "MMM dd, yyyy"
                                )}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400">
                                {format(
                                  new Date(transaction.payment_time),
                                  "HH:mm:ss"
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, total)} of {total}{" "}
                    transactions
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page =
                            currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                          if (page > totalPages) return null;
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
