import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import adminlogo from "../../assets/datablinglogo.svg";
import { loginAdmin } from "../../api/apiServices";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { auth, login } = useAuth();

  useEffect(() => {
    if (auth?.token) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth?.token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await loginAdmin({ email, password });
      login({
        token: response.token,
        admin: response.user,
      });
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid credentials";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <Toaster position="top-right" />
      
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-50/80 blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-coral-50/60 blur-3xl" />
      </div>

      <div className="w-full max-w-md z-10">
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ y: -5 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex justify-center mb-6"
            >
              <div className="p-3 bg-white shadow-sm rounded-2xl">
                {/* <img src={adminlogo} alt="Logo" className="w-12 h-12" /> */}
              </div>
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-navy tracking-tight">
              CHERRYHILLS
            </h1>
            <p className="text-neutral-400 text-sm font-medium mt-1">Management Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <FaEnvelope size={16} />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="w-full pl-12 pr-5 py-4 bg-neutral-100 border border-transparent rounded-2xl text-navy placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <FaLock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-neutral-100 border border-transparent rounded-2xl text-navy placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors p-1"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm tracking-wide py-4 rounded-2xl transition-all shadow-cta flex items-center justify-center gap-3 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ repeat: Infinity, duration: 0.6, repeatType: "reverse" }}
                  >
                    →
                  </motion.span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
              Secure Environment
            </span>
          </div>
        </motion.div>
        
        <p className="text-center mt-8 text-slate-400 text-xs">
          &copy; {new Date().getFullYear()} CherryHills Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}