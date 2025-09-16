import { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  TrendingUp,
  Clock,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Copy,
  Share2,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { getFiltersFromUrl, updateUrl } from "../helpers/utils";
import { getTransactions } from "../services/transactions";
import { toast } from "react-toastify";

const Button = ({
  children,
  onClick,
  variant = "default",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
    link: "text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`rounded-lg border bg-white shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ children, className = "", ...props }) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  >
    {children}
  </label>
);

const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "text-gray-950 border border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

const Table = ({ children, className = "", ...props }) => (
  <div className="w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
      {children}
    </table>
  </div>
);

const TableHeader = ({ children, className = "", ...props }) => (
  <thead className={className} {...props}>
    {children}
  </thead>
);

const TableBody = ({ children, className = "", ...props }) => (
  <tbody className={className} {...props}>
    {children}
  </tbody>
);

const TableRow = ({ children, className = "", ...props }) => (
  <tr
    className={`border-b border-gray-200 transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100 ${className}`}
    {...props}
  >
    {children}
  </tr>
);

const TableHead = ({ children, className = "", ...props }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  >
    {children}
  </th>
);

const TableCell = ({ children, className = "", ...props }) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  >
    {children}
  </td>
);

const SingleSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select option...",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    if (value === optionValue) {
      onChange("");
    } else {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLabel}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 opacity-50"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md">
          <div className="p-1">
            {options.map((option) => (
              <div
                key={option.value}
                className={`relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 ${
                  value === option.value ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSelect(option.value)}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {value === option.value && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </span>
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TransactionsDashboard = () => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    successfulTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    totalAmount: 0,
    successRate: "0",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("payment_time");
  const [order, setOrder] = useState("desc");
  const [uniqueSchools, setUniqueSchools] = useState([]);

  const [filters, setFilters] = useState({
    status: [],
    school_id: [],
    gateway: [],
    date_from: "",
    date_to: "",
    search: "",
  });

  const limit = 10;

  const statusOptions = [
    { value: "SUCCESS", label: "Success" },
    { value: "PENDING", label: "Pending" },
    { value: "FAILED", label: "Failed" },
  ];

  useEffect(() => {
    const urlFilters = getFiltersFromUrl();
    setFilters({
      status: urlFilters.status,
      school_id: urlFilters.school_id,
      gateway: urlFilters.gateway,
      date_from: urlFilters.date_from,
      date_to: urlFilters.date_to,
      search: urlFilters.search,
    });
    setCurrentPage(urlFilters.page);
    setSort(urlFilters.sort);
    setOrder(urlFilters.order);
  }, []);

  useEffect(() => {
    updateUrl({
      ...filters,
      page: currentPage,
      limit,
      sort,
      order,
    });
  }, [filters, currentPage, sort, order]);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);

      const params = {
        ...filters,
        status: filters.status || "",
        school_id: filters.school_id,
        page: currentPage,
        limit,
        sort,
        order,
      };

      const response = await getTransactions(params);
      const {
        data = [],
        total = 0,
        totalPages = 1,
      } = response?.data.data || {};

      setTransactions(data);

      setTotal(total);
      setTotalPages(totalPages);

      const schools = Array.from(
        data
          .reduce((map, t) => {
            if (!map.has(t.school_id)) {
              map.set(t.school_id, {
                value: t.school_id,
                label: t.institutionName || t.school_id,
              });
            }
            return map;
          }, new Map())
          .values()
      );
      setUniqueSchools(schools);

      const successful = data.filter((tx) => tx.status === "SUCCESS");
      const pending = data.filter((tx) => tx.status === "PENDING");
      const failed = data.filter((tx) => tx.status === "FAILED");
      const totalTransactions = data.length;
      const successRate = total > 0 ? (successful.length / total) * 100 : 0;

      const successfulAmount = successful.reduce(
        (sum, tx) => sum + (tx.transaction_amount || 0),
        0
      );
      const pendingAmount = pending.reduce(
        (sum, tx) => sum + (tx.order_amount || 0),
        0
      );
      const failedAmount = failed.reduce(
        (sum, tx) => sum + (tx.order_amount || 0),
        0
      );
      const totalAmount = successfulAmount + pendingAmount + failedAmount;

      setStats({
        totalTransactions,
        successfulTransactions: successful.length,
        successRate: successRate,
        pendingTransactions: pending.length,
        failedTransactions: failed.length,
        totalAmount,
      });
    } catch (error) {
      toast.error(
        "Failed to load dashboard data: " + (error.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, order, filters, sort]);

  useEffect(() => {
    loadDashboardData();
  }, [currentPage, sort, order, filters, loadDashboardData]);

  const handleSort = (field) => {
    const newOrder = sort === field && order === "asc" ? "desc" : "asc";
    setSort(field);
    setOrder(newOrder);
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
      status: [],
      school_id: [],
      gateway: [],
      date_from: "",
      date_to: "",
      search: "",
    });
    setCurrentPage(1);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "SUCCESS":
        return "default";
      case "PENDING":
        return "secondary";
      case "FAILED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const hasActiveFilters =
    filters.status ||
    filters.school_id ||
    filters.date_from ||
    filters.date_to ||
    filters.search;

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="flex items-center space-x-2 text-gray-900">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transaction Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              Comprehensive overview of school payment transactions
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-medium text-gray-900">
                Total Transactions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalTransactions}
              </div>
              <p className="text-xs text-gray-500">All payment transactions</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm shadow-green-100">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-medium text-gray-900">
                Successful Payments
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.successfulTransactions}
              </div>
              <p className="text-xs text-gray-500">
                {/* Success rate: {stats.successRate}% */}
                Success rate: {stats.successRate?.toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm shadow-yellow-100">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-medium text-gray-900">
                Pending Payments
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingTransactions}
              </div>
              <p className="text-xs text-gray-500">Awaiting completion</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm shadow-red-100">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-medium text-gray-900">
                Failed Payments
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.failedTransactions}
              </div>
              <p className="text-xs text-gray-500">Transactions that failed</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-medium text-gray-900">
                Total Amount
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ₹{stats.totalAmount.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-gray-500">Successful transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Filter className="h-5 w-5" />
                Advanced Filters & Search
              </CardTitle>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by student name, collect ID..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 bg-white border-gray-300"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-gray-900">Status</Label>
                <SingleSelect
                  options={statusOptions}
                  value={filters.status}
                  onChange={(val) => handleFilterChange("status", val)}
                  placeholder="Select status..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900">Schools</Label>

                <SingleSelect
                  options={uniqueSchools}
                  value={filters.school_id}
                  onChange={(val) => handleFilterChange("school_id", val)}
                  placeholder="Select school..."
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-900">From Date</Label>
                <Input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) =>
                    handleFilterChange("date_from", e.target.value)
                  }
                  className="bg-white border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900">To Date</Label>
                <Input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) =>
                    handleFilterChange("date_to", e.target.value)
                  }
                  className="bg-white border-gray-300"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {transactions.length} of {total} transactions
                  {filters.status && (
                    <span className="ml-2">• Status: {filters.status}</span>
                  )}
                  {filters.school_id && (
                    <span className="ml-2">
                      • Schools: {filters.school_id} selected
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">Transaction List</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                Page {currentPage} of {totalPages} • {total} total transactions
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                <span className="text-gray-900">Loading transactions...</span>
              </div>
            ) : (
              <>
                <div className="rounded-md border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow className="border-gray-200">
                        <TableHead className="py-3 px-4 text-gray-900">
                          S.No.
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-gray-100 py-3 px-4 text-gray-900">
                          Collect ID
                        </TableHead>
                        <TableHead className="py-3 px-4 text-gray-900">
                          Student
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-gray-100 py-3 px-4 text-gray-900">
                          School
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-gray-100 py-3 px-4 text-gray-900">
                          Gateway
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 py-3 px-4 text-gray-900"
                          onClick={() => handleSort("order_amount")}
                        >
                          <div className="flex items-center gap-2">
                            Order Amount
                            <ArrowUpDown className="h-4 w-4" />
                            {sort === "order_amount" && (
                              <span className="text-xs">
                                {order === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-gray-100 py-3 px-4 text-gray-900">
                          Transaction Amount
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-gray-100 py-3 px-4 text-gray-900">
                          Status
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 py-3 px-4 text-gray-900"
                          onClick={() => handleSort("payment_time")}
                        >
                          <div className="flex items-center gap-2">
                            Payment Time
                            <ArrowUpDown className="h-4 w-4" />
                            {sort === "payment_time" && (
                              <span className="text-xs">
                                {order === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={10}
                            className="text-center py-8 text-gray-500"
                          >
                            {hasActiveFilters
                              ? "No transactions match your filters"
                              : "No transactions found"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.map((transaction, idx) => (
                          <TableRow
                            key={transaction._id}
                            className="hover:bg-gray-50 border-gray-200"
                          >
                            <TableCell className="py-3 px-4 text-gray-900">
                              {(currentPage - 1) * limit + idx + 1}
                            </TableCell>

                            <TableCell className="font-mono text-sm py-3 px-4 text-gray-900">
                              <div className="flex items-center gap-2">
                                {transaction.collect_request_id}
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      transaction.collect_request_id
                                    )
                                  }
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <Copy className="h-3 w-3 text-gray-500" />
                                </button>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="font-medium text-gray-900">
                                {transaction?.student_info?.name || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4 text-gray-900 font-medium">
                              {transaction?.institutionName ||
                                transaction?.school_id ||
                                "Unknown School"}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-gray-900">
                              {transaction.gateway_name}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-gray-900 font-mono">
                              ₹
                              {transaction.order_amount?.toLocaleString(
                                "en-IN"
                              )}
                            </TableCell>
                            <TableCell className="py-3 px-4 text-gray-900 font-mono">
                              ₹
                              {transaction.transaction_amount?.toLocaleString(
                                "en-IN"
                              )}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <Badge
                                variant={getStatusVariant(transaction.status)}
                              >
                                {transaction.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="text-sm">
                                <div className="text-gray-900">
                                  {format(
                                    new Date(transaction.payment_time),
                                    "MMM dd, yyyy"
                                  )}
                                </div>
                                <div className="text-gray-500">
                                  {format(
                                    new Date(transaction.payment_time),
                                    "hh:mm a"
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
                    <div className="text-sm text-gray-500">
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
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
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
    </div>
  );
};

export default TransactionsDashboard;
