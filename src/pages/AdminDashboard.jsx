import React, { useState, useEffect, useCallback } from "react";
import { 
  Users, TrendingUp, Wallet, ChevronRight, 
  MessageSquare, Award, ShieldCheck, Loader2, RefreshCcw, Activity,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { getDashboardSummary } from "../api/apiServices";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, subtext, icon: Icon, accent = "green" }) => (
  <motion.div 
    whileHover={{ y: -6, scale: 1.02 }}
    className="glass-stat-card group"
  >
    <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl ${accent === 'green' ? 'bg-emerald-500' : 'bg-coral'}`} />
    <div className="flex justify-between items-start mb-5">
      <div className={`p-3 rounded-xl ${accent === 'green' ? 'bg-emerald-50 text-emerald-500' : 'bg-coral-50 text-coral'}`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <ArrowUpRight size={16} className="text-neutral-300 group-hover:text-emerald-500 transition-colors" />
    </div>
    <div>
      <p className="stat-label mb-2">{title}</p>
      <h3 className={`text-3xl font-black ${accent === 'green' ? 'text-emerald-500' : 'text-coral'} mb-1`}>
        {value !== undefined ? value : "---"}
      </h3>
      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">{subtext}</p>
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
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
        <p className="text-neutral-400 font-bold text-xs uppercase tracking-[0.2em]">Syncing Live Data...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="mb-12 mt-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold text-navy tracking-tight">Market Intelligence</h1>
          <p className="text-neutral-400 font-body text-sm mt-2 font-medium">
            Project: {data?.stats?.companyName || "Corporate Investment Platform"}
          </p>
        </div>
        <button 
          onClick={() => fetchDashboardData(true)}
          className="p-3 bg-white border border-neutral-200 rounded-xl text-neutral-400 hover:text-emerald-500 hover:border-emerald-200 transition-all duration-300 shadow-sm hover:shadow-brand"
        >
          <RefreshCcw size={18} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="AUM Target" value={data?.stats?.assetsManaged || "—"} subtext="Assets Under Management" icon={Wallet} accent="green" />
        <StatCard title="Investor Satisfaction" value={`${data?.stats?.investorSatisfaction ?? 100}%`} subtext="Client Approval Rating" icon={Users} accent="orange" />
        <StatCard title="Experience" value={`${data?.stats?.yearsOfExperience || 0} Yrs`} subtext="Platform Age" icon={TrendingUp} accent="green" />
        <StatCard title="Unread" value={data?.unreadInquiries} subtext="Response Needed" icon={MessageSquare} accent="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-10 border border-neutral-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-display font-bold text-navy flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-xl"><Activity size={20} className="text-emerald-500" /></div>
              Platform Overview
            </h2>
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-500 rounded-full text-[10px] font-black border border-emerald-100 uppercase tracking-wider">Live Connection</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ y: -4 }} onClick={() => navigate('/dashboard/leadership')} className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100 cursor-pointer hover:border-emerald-300 hover:shadow-brand transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <Users className="text-neutral-400 group-hover:text-emerald-500 transition-colors" size={28} />
                <ChevronRight className="text-neutral-300 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
              </div>
              <p className="stat-label mb-2">Corporate Team</p>
              <h4 className="text-xl font-display font-bold text-navy">{data?.teamSize || 0} Members</h4>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} onClick={() => navigate('/dashboard/awards')} className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100 cursor-pointer hover:border-emerald-300 hover:shadow-brand transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <Award className="text-neutral-400 group-hover:text-emerald-500 transition-colors" size={28} />
                <ChevronRight className="text-neutral-300 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
              </div>
              <p className="stat-label mb-2">Recognition</p>
              <h4 className="text-xl font-display font-bold text-navy">{data?.awardCount || 0} Achievements</h4>
            </motion.div>
          </div>
        </div>

        <div className="glass-stat-card-dark rounded-3xl p-8 text-white relative overflow-hidden shadow-glass-lg">
          <div className="relative z-10 h-full flex flex-col">
            <div className="mb-8">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-display font-bold text-white tracking-tight">Control Center</h2>
              <p className="text-white/50 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">Platform Admin</p>
            </div>
            <div className="space-y-3 mt-auto">
              {[
                { label: "Update Company Info", path: "/dashboard/company-info" },
                { label: "Investor Contacts", path: "/dashboard/contacts" },
                { label: "FAQ Records", path: "/dashboard/faqs" }
              ].map((action, idx) => (
                <button key={idx} onClick={() => navigate(action.path)} className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between px-6 transition-all duration-300 group">
                  <span className="font-bold text-[10px] uppercase tracking-[0.2em]">{action.label}</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-emerald-400" />
                </button>
              ))}
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-coral/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;