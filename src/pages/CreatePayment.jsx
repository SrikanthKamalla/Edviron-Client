import { useEffect, useState } from "react";
import {
  CreditCard,
  Plus,
  Loader2,
  CheckCircle,
  ExternalLink,
  Copy,
  ArrowRight,
} from "lucide-react";
import { createPayment } from "../services/payment";
import { toast } from "react-toastify";
import { getSchools } from "../services/auth";

const CreatePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [formData, setFormData] = useState({
    schoolId: "",
    amount: "",
    name: "",
    id: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSchools();
        const { data = [] } = response?.data || {};

        setSchools(data);
      } catch (err) {
        toast.error("Error fetching schools:", err);
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.schoolId) newErrors.schoolId = "School is required";
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (!formData.name) newErrors.name = "Student name is required";
    if (!formData.id) newErrors.id = "Student ID is required";
    if (!formData.email) newErrors.email = "Student email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    setFormData({ schoolId: "", amount: "", name: "", id: "", email: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await createPayment(formData);
      const paymentDetails = response?.data?.data;
      setPaymentResponse({
        Collect_request_url: paymentDetails.payment_url,
        Collect_request_id: paymentDetails.collect_request_id,
        student_name: paymentDetails.student_info.name,
        studentId: paymentDetails.student_info.id,
        student_email: paymentDetails.student_info.email,
        amount: formData.amount,
      });
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5  min-h-screen font-sans">
      <header className="mb-6">
        <h1 className="text-3xl font-bold rounded p-1 pl-2">Create Payment</h1>
        <p className="text-gray-600 mt-1">
          Generate a payment link for students
        </p>
      </header>

      {!paymentResponse ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-5 space-y-5"
        >
          {/* School & Amount */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                School *
              </label>
              <select
                id="schoolId"
                value={formData.schoolId}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.schoolId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select school</option>
                {schools.map((school) => (
                  <option key={school._id} value={school._id}>
                    {school.name}
                  </option>
                ))}
              </select>
              {errors.schoolId && (
                <p className="text-red-500 text-sm mt-1">{errors.schoolId}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Amount (INR) *
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>
          </div>

          {/* Student Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Student Information
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Student Name *
                </label>
                <input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Student ID *
                </label>
                <input
                  id="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="Enter student ID"
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.id ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.id && (
                  <p className="text-red-500 text-sm mt-1">{errors.id}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Student Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter student email"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex justify-center items-center disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <CreditCard className="mr-2 h-4 w-4" />
            Generate Payment Link
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow p-5 space-y-5">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Payment Link Generated!</h2>
          </div>
          <p className="text-gray-600">
            Share this link with the student to complete payment.
          </p>

          <div>
            <label className="block font-medium text-gray-800 mb-1">
              Payment Link
            </label>
            <div className="flex gap-2">
              <input
                value={paymentResponse.Collect_request_url}
                readOnly
                className="flex-1 border rounded px-3 py-2 font-mono text-sm bg-gray-50"
              />
              <button
                onClick={openPaymentLink}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Open
              </button>
              <button
                onClick={() =>
                  copyToClipboard(
                    paymentResponse.Collect_request_url,
                    "Payment link"
                  )
                }
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded p-3 text-indigo-800 space-y-1">
            <p>
              <strong>Next Steps:</strong>
            </p>
            <ul className="list-disc list-inside">
              <li>Share link with student</li>
              <li>Student can pay via UPI, Net Banking, Cards, or Wallets</li>
              <li>You'll get payment status notifications</li>
              <li>Use Collection Request ID to track payment</li>
            </ul>
          </div>

          <button
            onClick={createNewPayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex justify-center items-center mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Another Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatePayment;
