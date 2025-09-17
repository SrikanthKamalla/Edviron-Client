import React, { useEffect, useState } from "react";
import { getTransactionBySchool } from "../services/transactions";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { Badge } from "../components/helpers";

const getStatusVariant = (status) => {
  switch (status) {
    case "SUCCESS":
      return "green";
    case "FAILED":
      return "red";
    case "PENDING":
      return "yellow";
    default:
      return "gray";
  }
};

const Transactions = () => {
  const location = useLocation();
  const { state } = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const schoolId = searchParams.get("school");

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const response = await getTransactionBySchool(schoolId);
      setTransactions(response.data.data);
    };
    fetch();
  }, [schoolId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied: " + text);
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white my-4 ">
        {state?.name}
      </h1>
      <table className="min-w-full border-collapse bg-white dark:bg-gray-900">
        <thead className="bg-gray-100 dark:bg-gray-800 text-left">
          <tr>
            <th className="py-3 px-4">S.No.</th>
            <th className="py-3 px-4">Collect ID</th>
            <th className="py-3 px-4">Student</th>
            <th className="py-3 px-4">Gateway</th>
            <th className="py-3 px-4">Order Amount</th>
            <th className="py-3 px-4">Transaction Amount</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Payment Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center py-8 text-gray-500">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((transaction, idx) => (
              <tr
                key={transaction._id}
                className="hover:bg-gray-50 border-gray-200"
              >
                <td className="py-3 px-4 text-gray-900">{idx + 1}</td>
                <td className="font-mono text-sm py-3 px-4 text-gray-900">
                  <div className="flex items-center gap-2 group">
                    {transaction.collect_id || "N/A"}
                    {transaction.collect_id && (
                      <button
                        onClick={() => copyToClipboard(transaction.collect_id)}
                        className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-3 w-3 text-gray-500" />
                      </button>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">
                    {transaction?.orderInfo.student_info?.name || "N/A"}
                  </div>
                  {transaction?.student_info?.email && (
                    <div className="text-sm text-gray-500">
                      {transaction.student_info.email}
                    </div>
                  )}
                </td>

                <td className="py-3 px-4 text-gray-900">
                  {transaction?.orderInfo.gateway_name || "N/A"}
                </td>

                <td className="py-3 px-4 text-gray-900 font-mono">
                  ₹{transaction.order_amount?.toLocaleString("en-IN") || "0"}
                </td>

                <td className="py-3 px-4 text-gray-900 font-mono">
                  ₹
                  {transaction.transaction_amount?.toLocaleString("en-IN") ||
                    "0"}
                </td>

                <td className="py-3 px-4">
                  <Badge variant={getStatusVariant(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </td>

                <td className="py-3 px-4 text-sm">
                  <div className="text-gray-900">
                    {format(new Date(transaction.payment_time), "MMM dd, yyyy")}
                  </div>
                  <div className="text-gray-500">
                    {format(new Date(transaction.payment_time), "hh:mm a")}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
