// import React, { useState, useEffect, useCallback } from "react";
// import { 
//   Users, TrendingUp, Wallet, ChevronRight, 
//   MessageSquare, Award, ShieldCheck, Loader2, RefreshCcw
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { getDashboardSummary } from "../api/apiServices";
// import { useNavigate } from "react-router-dom";

// const StatCard = ({ title, value, subtext, icon: Icon, color = "blue" }) => (
//   <motion.div 
//     whileHover={{ y: -4 }}
//     className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
//   >
//     <div className="flex justify-between items-start mb-4">
//       <div className={`p-3 rounded-2xl ${color === 'blue' ? 'bg-blue-50 text-[#3866A3]' : 'bg-amber-50 text-amber-600'}`}>
//         <Icon size={24} />
//       </div>
//     </div>
//     <div>
//       <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
//       <h3 className="text-2xl font-black text-slate-800 mt-1">
//         {value !== undefined ? value : "---"}
//       </h3>
//       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{subtext}</p>
//     </div>
//   </motion.div>
// );

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const fetchDashboardData = useCallback(async (isManual = false) => {
//     if (isManual) setIsRefreshing(true);
//     try {
//       const summary = await getDashboardSummary();
//       setData(summary);
//     } catch (err) {
//       console.error("Dashboard sync error:", err);
//     } finally {
//       setLoading(false);
//       setIsRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]);

//   if (loading) return (
//     <div className="flex justify-center items-center min-h-screen bg-slate-50">
//       <div className="flex flex-col items-center gap-4">
//         <Loader2 className="animate-spin text-[#3866A3]" size={40} />
//         <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Syncing Live Data...</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-8 bg-slate-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-10 mt-10 flex justify-between items-end">
//         <div>
//           <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Market Intelligence</h1>
//           <p className="text-slate-500 font-medium italic">
//             Connected to: {data?.stats?.companyName || "CherryHills Enterprise"}
//           </p>
//         </div>
//         <button 
//           onClick={() => fetchDashboardData(true)}
//           className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#3866A3] transition-colors"
//           title="Refresh Stats"
//         >
//           <RefreshCcw size={18} className={isRefreshing ? "animate-spin" : ""} />
//         </button>
//       </div>

//       {/* Stats Grid - Values strictly mapped to API response */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         <StatCard 
//           title="Assets Managed" 
//           value={data?.stats?.assetsManaged} 
//           subtext="Verified Portfolio"
//           icon={Wallet} 
//         />
//         <StatCard 
//           title="Global Clients" 
//           value={data?.stats?.clients?.toLocaleString()} 
//           subtext="Active Accounts"
//           icon={Users} 
//         />
//         <StatCard 
//           title="Experience" 
//           value={`${data?.stats?.yearsOfExperience || 0} Years`} 
//           subtext="Since Founded"
//           icon={TrendingUp} 
//         />
//         <StatCard 
//           title="Unread Inquiries" 
//           value={data?.unreadInquiries} 
//           subtext="Action Required"
//           icon={MessageSquare} 
//           color="amber"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left: Dynamic Counts from Database */}
//         <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
//           <div className="flex justify-between items-center mb-10">
//             <div>
//                <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">Platform Profile</h2>
//                <p className="text-xs text-slate-400 font-bold">LIVE DATABASE TOTALS</p>
//             </div>
//             <div className="flex gap-2">
//                 <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black border border-green-100">
//                   REAL-TIME SYNCED
//                 </span>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div onClick={() => navigate('/admin/leadership')} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 cursor-pointer hover:border-[#3866A3] transition-all group">
//               <div className="flex justify-between items-start mb-4">
//                 <Users className="text-slate-400 group-hover:text-[#3866A3] transition-colors" size={32} />
//                 <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
//               </div>
//               <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Leadership</p>
//               <h4 className="text-xl font-black text-slate-800">
//                 {data?.teamSize || 0} Verified Profiles
//               </h4>
//             </div>

//             <div onClick={() => navigate('/admin/awards')} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 cursor-pointer hover:border-[#3866A3] transition-all group">
//               <div className="flex justify-between items-start mb-4">
//                 <Award className="text-slate-400 group-hover:text-[#3866A3] transition-colors" size={32} />
//                 <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
//               </div>
//               <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Accolades</p>
//               <h4 className="text-xl font-black text-slate-800">
//                 {data?.awardCount || 0} Tracked Achievements
//               </h4>
//             </div>
//           </div>
//         </div>

//         {/* Right: Operational Control */}
//         <div className="bg-[#3866A3] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
//           <div className="relative z-10 h-full flex flex-col">
//             <div className="mb-8">
//                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
//                  <ShieldCheck size={24} />
//                </div>
//                <h2 className="text-xl font-black tracking-tight uppercase">Control Center</h2>
//                <p className="text-blue-100/70 text-sm mt-1">Operational management modules.</p>
//             </div>
            
//             <div className="space-y-3 mt-auto">
//               {[
//                 { label: "Update Platform Identity", path: "/admin/company-info" },
//                 { label: "Investor Inquiries", path: "/admin/contacts" },
//                 { label: "Help Center Records", path: "/admin/faqs" }
//               ].map((action, idx) => (
//                 <button 
//                   key={idx}
//                   onClick={() => navigate(action.path)}
//                   className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between px-6 transition-all group"
//                 >
//                   <span className="font-bold text-[10px] uppercase tracking-widest">{action.label}</span>
//                   <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;





import React, { useState, useEffect, useCallback } from "react";
import { 
  Users, TrendingUp, Wallet, ChevronRight, 
  MessageSquare, Award, ShieldCheck, Loader2, RefreshCcw, Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { getDashboardSummary } from "../api/apiServices";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, subtext, icon: Icon, color = "blue" }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color === 'blue' ? 'bg-blue-50 text-[#3866A3]' : 'bg-amber-50 text-amber-600'}`}>
        <Icon size={24} />
      </div>
    </div>
    <div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-slate-800 mt-1">
        {value !== undefined ? value : "---"}
      </h3>
      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{subtext}</p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const summary = await getDashboardSummary();
      setData(summary);
    } catch (err) {
      console.error("Dashboard sync error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#3866A3]" size={40} />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Syncing Live Data...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-10 mt-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Market Intelligence</h1>
          <p className="text-slate-500 font-medium">
            Project: {data?.stats?.companyName || "Corporate Investment Platform"}
          </p>
        </div>
        <button 
          onClick={() => fetchDashboardData(true)}
          className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#3866A3] transition-colors"
        >
          <RefreshCcw size={18} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Assets Managed" 
          value={data?.stats?.assetsManaged} 
          subtext="Total Portfolio"
          icon={Wallet} 
        />
        <StatCard 
          title="Global Clients" 
          value={data?.stats?.clients?.toLocaleString()} 
          subtext="Verified Investors"
          icon={Users} 
        />
        <StatCard 
          title="Experience" 
          value={`${data?.stats?.yearsOfExperience || 0} Yrs`} 
          subtext="Platform Age"
          icon={TrendingUp} 
        />
        <StatCard 
          title="Unread" 
          value={data?.unreadInquiries} 
          subtext="Response Needed"
          icon={MessageSquare} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Stats Section */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
              <Activity size={20} className="text-[#3866A3]" /> Platform Overview
            </h2>
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black border border-green-100 uppercase">
              Live Connection
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              onClick={() => navigate('/dashboard/leadership')} 
              className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 cursor-pointer hover:border-[#3866A3] transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <Users className="text-slate-400 group-hover:text-[#3866A3]" size={32} />
                <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Corporate Team</p>
              <h4 className="text-xl font-black text-slate-800">{data?.teamSize || 0} Members</h4>
            </div>

            <div 
              onClick={() => navigate('/dashboard/awards')} 
              className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 cursor-pointer hover:border-[#3866A3] transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <Award className="text-slate-400 group-hover:text-[#3866A3]" size={32} />
                <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Recognition</p>
              <h4 className="text-xl font-black text-slate-800">{data?.awardCount || 0} Achievements</h4>
            </div>
          </div>
        </div>

        {/* Updated Control Center with Correct Paths */}
        <div className="bg-[#3866A3] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
          <div className="relative z-10 h-full flex flex-col">
            <div className="mb-8">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                 <ShieldCheck size={24} />
               </div>
               <h2 className="text-xl font-black tracking-tight uppercase">Control Center</h2>
               <p className="text-blue-100/70 text-xs font-medium mt-1 uppercase tracking-widest">Platform Admin</p>
            </div>
            
            <div className="space-y-3 mt-auto">
              {[
                { label: "Update Company Info", path: "/dashboard/company-info" },
                { label: "Investor Contacts", path: "/dashboard/contacts" },
                { label: "FAQ Records", path: "/dashboard/faqs" }
              ].map((action, idx) => (
                <button 
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between px-6 transition-all group"
                >
                  <span className="font-bold text-[10px] uppercase tracking-widest">{action.label}</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;