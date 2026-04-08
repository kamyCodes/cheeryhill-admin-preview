import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User, Settings, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ userName: "Admin", role: "ADMIN" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const adminRoutes = [
    { name: "Admin Services", path: "/dashboard/services" },
    { name: "Admin Testimonials", path: "/dashboard/testimonials" },
    { name: "Admin Webinars", path: "/dashboard/webinars" },
    { name: "Admin Press-Release", path: "/dashboard/press-release" },
    { name: "Admin FAQs", path: "/dashboard/faqs" },
    { name: "Admin Contacts", path: "/dashboard/contacts" },
    { name: "Admin Leadership", path: "/dashboard/leadership" },
    { name: "Admin Awards", path: "/dashboard/awards" },
    { name: "Admin Company Info", path: "/dashboard/company-info" },
  ];

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResults = searchQuery
    ? adminRoutes.filter((route) =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectRoute = (path) => {
    navigate(path);
    setSearchQuery("");
    setShowResults(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between fixed top-0 left-72 right-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-black text-gray-800 tracking-tighter uppercase">
          Portal <span className="text-[#3866A3]">/</span> {admin.userName}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative w-80" ref={searchRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search modules..."
            className="w-full bg-slate-50 border border-slate-100 text-black focus:border-[#3866A3] rounded-2xl py-2.5 pl-10 text-xs font-bold placeholder-gray-400 focus:outline-none transition-all"
          />
          <Search size={14} className="absolute left-4 top-3 text-slate-400" />

          <AnimatePresence>
            {showResults && searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
              >
                {filteredResults.length > 0 ? (
                  filteredResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectRoute(result.path)}
                      className="w-full text-left px-5 py-3 text-[11px] font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:text-[#3866A3] flex items-center gap-3 transition-colors"
                    >
                      {result.name}
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">No results found</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <button className="relative w-11 h-11 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl flex items-center justify-center">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        {/* Profile Section */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-4 border-l border-slate-100 group"
          >
            <div className="text-right hidden md:block">
              <div className="font-black text-slate-800 text-xs uppercase tracking-tight">{admin.userName}</div>
              <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{admin.role}</div>
            </div>
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-[#3866A3] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-900/10 group-hover:scale-105 transition-transform">
              {admin.userName?.charAt(0).toUpperCase()}
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl py-3 z-50 overflow-hidden"
              >
                <div className="px-5 py-3 border-b border-slate-50 mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Account</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{admin.userName}@platform.com</p>
                </div>
                
                <button 
                  onClick={() => navigate('/dashboard/company-info')}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#3866A3] transition-colors"
                >
                  <Settings size={14} /> Account Settings
                </button>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}