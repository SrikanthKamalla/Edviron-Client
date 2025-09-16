import { useLocation } from "react-router-dom";
import { useState } from "react";
import { CheckCircle, XCircle, Clipboard, ClipboardCheck } from "lucide-react";

const TransactionSuccess = () => {
  const [copied, setCopied] = useState(false);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const requestId = queryParams.get("EdvironCollectRequestId");
  const status = queryParams.get("status");

  const handleCopy = () => {
    if (requestId) {
      navigator.clipboard.writeText(requestId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSuccess = status?.toUpperCase() === "SUCCESS";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isSuccess ? "Transaction Successful!" : "Transaction Failed"}
        </h1>

        <p className="text-gray-600 mb-6">
          {isSuccess
            ? "Thank you for your purchase. Your payment has been processed successfully."
            : "Unfortunately, your payment could not be completed. Please try again or contact support."}
        </p>

        {/* Show Request ID with Copy */}
        {requestId && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Request ID:
            </p>
            <div className="flex items-center justify-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
              <span className="text-xs font-mono">{requestId}</span>
              <button
                onClick={handleCopy}
                className="p-1 hover:text-blue-600 transition"
                title="Copy Request ID"
              >
                {copied ? (
                  <ClipboardCheck className="w-4 h-4 text-green-500" />
                ) : (
                  <Clipboard className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? contact <b>support@gmail.com</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionSuccess;
