import { useState } from "react";
import {
  Search,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { getTransactionStatus } from "../services/transactions";

const CheckStatus = () => {
  const [orderId, setOrderId] = useState("");

  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError("Please enter an order ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setTransaction(null);

    try {
      const result = await getTransactionStatus(orderId);
      setTransaction(result.data.data);

    } catch (err) {
      setError(err.message || "Transaction not found");
      setTransaction(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "FAILED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(new Date(date), "PPpp");
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Check Transaction Status
        </h1>
        <p className="text-gray-600 mt-2">
          Enter an order ID to check the current status of a transaction
        </p>
      </div>


      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Search className="h-5 w-5" />
            Transaction Lookup
          </h2>
          <p className="text-gray-600 mt-1">
            Search for a transaction using its custom order ID
          </p>
        </div>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="orderId"
              className="block text-sm font-medium text-gray-700"
            >
              Custom Order ID
            </label>
            <input
              id="orderId"

              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Search className="mr-2 h-4 w-4" />
            Search Transaction
          </button>
        </form>
      </div>


      {transaction && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  {getStatusIcon(transaction.status)}
                  Transaction Details
                </h2>
                <p className="text-gray-600 mt-1">Order ID: {orderId}</p>

              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}
              >
                {transaction.status}
              </span>
            </div>
          </div>
          <div className="space-y-6">

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Payment Status</h3>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {getStatusIcon(transaction.status)}
                </div>
                <div className="flex-grow">
                  <div className="font-medium text-gray-900">
                    {transaction.payment_message || "No payment message"}
                  </div>
                  {transaction.payment_time && (
                    <div className="text-sm text-gray-600">
                      {formatDate(transaction.payment_time)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    {formatAmount(transaction.transaction_amount)}

                  </div>
                </div>
              </div>

              {transaction.error_message && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                  <XCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Error:</strong> {transaction.error_message}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Order Amount</span>
                    <span className="font-medium text-gray-900">
 
                      {formatAmount(transaction.amount)}

                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Transaction Amount
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatAmount(transaction.transaction_amount)}

                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Mode</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {transaction.details.payment_mode || "N/A"}
                    </span>
                  </div>

                  {transaction.details.bank_ref && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Bank Reference
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm text-gray-900">
                          {transaction.details.bank_ref || "N/A"}
                        </span>
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            copyToClipboard(transaction.details.bank_ref)
                          }
                        >
                          {transaction.details.bank_ref && (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>


            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <button
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-md"
                onClick={() => {
                  setOrderId("");
                  setTransaction(null);
                  setError("");
                }}
              >
                Search Another
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckStatus;
