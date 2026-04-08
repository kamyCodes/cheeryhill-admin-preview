import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import adminlogo from "../../assets/datablinglogo.svg";


export default function AdminRegister() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("SUPER_ADMIN");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email || !password) {
    toast.error("Please fill in all fields");
    return;
  }

  setLoading(true);
  try {
    const response = await loginAdmin({ email, password });
    
    // Use response.admin instead of response.user
    login({
      token: response.token,
      admin: response.admin, 
    });

    toast.success("Welcome back!");
    navigate("/dashboard", { replace: true });
  } catch (err) {
    // If the error is "Invalid Credentials", ensure your backend 
    // isn't actually throwing a 401 even with correct data.
    const errorMessage = err.response?.data?.message || "Invalid credentials";
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8FAFC]">
      <Toaster position="top-center" />

      <div className="w-full max-w-md">
        <motion.div
          className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10">
                <img src={adminlogo} alt="DataBling" className="w-full h-full" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-gray-500 tracking-tighter uppercase">
              DataBling
            </h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Admin Registration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[10px] font-black text-gray-800 uppercase tracking-widest mb-1.5 ml-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter admin username"
                value={userName}
                onChange={(e) => setUserName(e.target.value.trim())}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 text-sm focus:border-[#3866A3] focus:bg-white outline-none transition-all font-medium"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-[10px] font-black text-gray-800 uppercase tracking-widest mb-1.5 ml-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 text-sm focus:border-[#3866A3] focus:bg-white outline-none transition-all font-medium pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-gray-400 hover:text-[#3866A3] transition-colors"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>

            {/* Fixed Role Display */}
            <div>
              <label className="block text-[10px] font-black text-gray-800 uppercase tracking-widest mb-1.5 ml-1">
                Assigned Role
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 border border-gray-100 rounded-xl text-gray-500 text-xs font-bold tracking-wider">
                SUPER_ADMIN
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3866A3] hover:bg-[#2d5284] text-white font-black uppercase text-[11px] tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-[12px] text-gray-500">
              Back to{" "}
              <Link to="/login" className="text-[#3866A3] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}