import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { service } from "../services/authService";
import { useToast } from "../components/Notifications/ToastDemo";
import logo from "../assets/image/Media 3 (1).png";

const Page = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    terms: false,
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await service.login(form);
      if (response.success) {
        toast.success(response.message);
        setTimeout(() => navigate("/"), 200);
        return;
      }
      toast.error(response.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    // Full screen dark background
    <div className="min-h-screen w-full bg-[#2a283d] flex items-center justify-center p-4">
      {/* Centered login form */}
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-[#2a283d] rounded-2xl px-6 py-8 border border-gray-700 shadow-2xl"
        >
          {/* Logo at the top center */}
          <div className="flex justify-center mb-6">
            <img 
              src={logo} 
              alt="Company Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white">Login</h2>
          </div>

          {/* Username */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 rounded-lg bg-[#1f1d2e] border border-gray-600 focus:outline-none focus:ring focus:ring-green-500 text-white"
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full pl-10 pr-10 px-4 py-3 rounded-lg bg-[#1f1d2e] border border-gray-600 focus:outline-none focus:ring focus:ring-green-500 text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-gray-300">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
                className="mr-2 accent-purple-500"
              />
              Remember me
            </label>
            <a href="#" className="text-sm text-purple-400 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 transition-colors text-white font-semibold py-3 rounded-lg shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;