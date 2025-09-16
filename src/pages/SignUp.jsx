import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Loader2 } from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import { signUp } from "../services/auth";
import { useDispatch } from "react-redux";
import { fetchUserSignUp } from "../toolkit/userSlice";

const SignUp = () => {
  const initial = { name: "", email: "", password: "" };
  const [signUpUser, setSignUpUser] = useState(initial);
  const [error, setError] = useState(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateField = (name, value) => {
    let message = "";
    if (!value) {
      message = "This field is required";
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        message = "Please enter a valid email address";
      }
    } else if (name === "password" && value.length < 6) {
      message = "Password must be at least 6 characters";
    }
    setError((prev) => ({ ...prev, [name]: message }));
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSignUpUser((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Object.entries(signUpUser).forEach(([key, value]) =>
      validateField(key, value)
    );
    const hasErrors = Object.values(signUpUser).some((val) => !val);
    if (hasErrors) {
      toast.error("Please fill all the required details");
      setIsSubmitting(false);
      return;
    }

    try {

      const resultAction = await dispatch(
        fetchUserSignUp({ signUp, signUpUser })
      );

      if (fetchUserSignUp.fulfilled.match(resultAction)) {
        if (resultAction.payload.success) {
          toast.success(resultAction.payload.message);
          navigate("/dashboard");
        } else {
          toast.error(resultAction.payload.message || "Signup failed");
        }
      } else {
        toast.error(resultAction.payload?.message || "Signup failed");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
              <CreditCard className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">EduPay</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
            <p className="text-gray-600">Create your account to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={signUpUser.name}
                  name="name"
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {error?.name && (
                  <p className="text-sm text-red-600">{error.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={signUpUser.email}
                  name="email"
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {error?.email && (
                  <p className="text-sm text-red-600">{error.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={signUpUser.password}
                    name="password"
                    onChange={handleOnChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </span>
                </div>
                {error?.password && (
                  <p className="text-sm text-red-600">{error.password}</p>
                )}
              </div>
            </div>

            {/* Button + Link */}
            <div className="p-6 flex flex-col space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign Up
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Log in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
