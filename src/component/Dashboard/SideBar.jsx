import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { 
  LayoutGrid, LogOut, Briefcase, MessageSquareQuote, 
  Video, Newspaper, HelpCircle, Mail, UserPlus, Trophy, Info 
} from "lucide-react";

const contentItems = [
  { to: "/dashboard/admin-manage", label: "Management", icon: Briefcase },
  { to: "/dashboard/services", label: "Services", icon: Briefcase },
  { to: "/dashboard/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/dashboard/webinars", label: "Webinars", icon: Video },
  { to: "/dashboard/press-release", label: "Press-Release", icon: Newspaper },
  { to: "/dashboard/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/dashboard/contacts", label: "Contacts", icon: Mail },
  { to: "/dashboard/leadership", label: "Leadership", icon: UserPlus },
  { to: "/dashboard/awards", label: "Awards", icon: Trophy },
  { to: "/dashboard/company-info", label: "Company Info", icon: Info },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // Optional: Add confirmation to prevent accidental logouts
    if (window.confirm("Are you sure you want to sign out?")) {
      logout();
      toast.success("Logged out successfully");
      // navigate to login and replace the dashboard in the history stack
      navigate("/login", { replace: true });
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 ${
      isActive 
        ? "bg-[#3866A3] text-white shadow-md" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
    }`;

  return (
    <div className="w-72 bg-white h-screen flex flex-col fixed left-0 top-0 border-r border-slate-100 shadow-sm z-[100]">
      {/* Brand Section */}
      <div className="px-8 py-10">
        <h2 className="font-black text-xl tracking-tighter text-slate-800">CHERRYHILLS</h2>
        <p className="text-[10px] font-black text-[#3866A3] uppercase tracking-[0.2em] mt-1">Admin Intelligence</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto space-y-6 pb-6 custom-scrollbar">
        <div>
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Main</p>
          <NavLink to="/dashboard" end className={navLinkClasses}>
            <LayoutGrid size={18} />
            Overview
          </NavLink>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Content Hub</p>
          <div className="space-y-1">
            {contentItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClasses}>
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Logout Footer */}
      <div className="p-6 border-t border-slate-50 bg-slate-50/30">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 w-full px-4 py-3 text-rose-500 hover:bg-rose-100/50 rounded-xl text-[14px] font-black transition-all group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
}