import { useState } from "react";
import {
  CreditCard,
  Plus,
  Loader2,
  CheckCircle,
  ExternalLink,
  Copy,
  ArrowRight,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { apiService } from "../utils/api";

const paymentSchema = z.object({
  school_id: z.string().min(1, "Please select a school"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Amount must be a valid positive number"),
  student_name: z.string().min(2, "Student name must be at least 2 characters"),
  student_id: z.string().min(1, "Student ID is required"),
  student_email: z.string().email("Please enter a valid email address"),
  callback_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
});

const CreatePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [schools, setSchools] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      callback_url: "https://google.com",
      description: "",
    },
  });

  const selectedSchoolId = watch("school_id");

  useState(() => {
    const fetchSchools = async () => {
      try {
        const response = await apiService.getSchools();
        setSchools(response);
      } catch (error) {
        console.error("Error fetching schools:", error);
        toast.error("Failed to load schools");
      }
    };

    fetchSchools();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setPaymentResponse(null);

    try {
      // const paymentData = {
      //   school_id: data.school_id,
      //   amount: data.amount,
      //   callback_url: data.callback_url || "https://google.com",
      //   student_info: {
      //     name: data.student_name,
      //     id: data.student_id,
      //     email: data.student_email,
      //   },
      // };

      const mockResponse = {
        Collect_request_url: "https://payment.example.com/pay/12345",
        collect_request_id: "cr_123456789",
        sign: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      };

      setPaymentResponse(mockResponse);

      toast.success(
        "Payment link created successfully! The payment link is ready for the student"
      );
    } catch (error) {
      toast.error(error.message || "Failed to create payment request");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied successfully`);
  };

  const openPaymentLink = () => {
    if (paymentResponse?.Collect_request_url) {
      window.open(paymentResponse.Collect_request_url, "_blank");
    }
  };

  const createNewPayment = () => {
    setPaymentResponse(null);
    reset();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Payment
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Generate a payment link for student fee collection
        </p>
      </div>

      {!paymentResponse ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Payment Request Details
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Fill in the required information to generate a payment link
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 space-y-6">
              {/* School Selection */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="school_id"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    School *
                  </label>
                  <select
                    id="school_id"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    {...register("school_id")}
                  >
                    <option value="">Select a school</option>
                    {schools.map((school) => (
                      <option key={school._id} value={school._id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                  {errors.school_id && (
                    <p className="text-sm text-red-600">
                      {errors.school_id.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Amount (INR) *
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    {...register("amount")}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-600">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Student Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="student_name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Student Name *
                    </label>
                    <input
                      id="student_name"
                      placeholder="Enter student name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      {...register("student_name")}
                    />
                    {errors.student_name && (
                      <p className="text-sm text-red-600">
                        {errors.student_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="student_id"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Student ID *
                    </label>
                    <input
                      id="student_id"
                      placeholder="Enter student ID"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      {...register("student_id")}
                    />
                    {errors.student_id && (
                      <p className="text-sm text-red-600">
                        {errors.student_id.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="student_email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Student Email *
                  </label>
                  <input
                    id="student_email"
                    type="email"
                    placeholder="Enter student email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    {...register("student_email")}
                  />
                  {errors.student_email && (
                    <p className="text-sm text-red-600">
                      {errors.student_email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <CreditCard className="mr-2 h-4 w-4" />
                Generate Payment Link
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-500 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Payment Link Generated Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Your payment link is ready. Share it with the student to complete
              the payment.
            </p>
          </div>
          <div className="p-6 space-y-6">
            {/* Payment Link */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-base font-semibold text-gray-900 dark:text-white">
                  Payment Link
                </label>
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={openPaymentLink}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </button>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <input
                  value={paymentResponse.Collect_request_url}
                  readOnly
                  className="flex-1 px-2 py-1.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded font-mono text-sm"
                />
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={() =>
                    copyToClipboard(
                      paymentResponse.Collect_request_url,
                      "Payment link"
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Collection Details */}

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-blue-800 dark:text-blue-300">
                  <strong className="font-semibold">Next Steps:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Share the payment link with the student</li>
                    <li>
                      The student can pay using UPI, Net Banking, Cards, or
                      Wallets
                    </li>
                    <li>You'll receive notifications about payment status</li>
                    <li>Use the Collection Request ID to track this payment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex space-x-4">
            <button
              onClick={createNewPayment}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Another Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePayment;
