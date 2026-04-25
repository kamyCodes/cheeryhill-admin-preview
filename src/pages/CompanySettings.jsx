import React, { useState, useEffect } from "react";
import { getCompanyInfo, updateCompanyInfo, updateCompanyStats } from "../api/apiServices";
import { 
  Building2, Save, Globe, Info, 
  BarChart3, Shield, Loader2, MapPin,
  Mail, Phone, Zap, Target, Eye
} from "lucide-react";
import toast from "react-hot-toast";

export default function CompanySettings() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  const [formData, setFormData] = useState({
    companyName: "", tagline: "", description: "", founded: 2020,
    headquarters: "", email: "", phone: "", address: "",
    mission: "", vision: "", values: "", whyChooseUs: "",
    logo: "", favicon: ""
  });

  const [stats, setStats] = useState({
    clients: 0, assetsManaged: "", yearsOfExperience: 0, teamMembers: 0
  });

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const data = await getCompanyInfo();
      if (data) {
        setFormData({
          ...data,
          values: Array.isArray(data.values) ? data.values.join(", ") : data.values || "",
          whyChooseUs: Array.isArray(data.whyChooseUs) ? data.whyChooseUs.join(", ") : data.whyChooseUs || ""
        });
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Updating company profile...");
    try {
      const payload = {
        ...formData,
        values: formData.values.split(",").map(v => v.trim()).filter(v => v !== ""),
        whyChooseUs: formData.whyChooseUs.split(",").map(v => v.trim()).filter(v => v !== "")
      };
      await updateCompanyInfo(payload);
      toast.success("Company branding updated", { id: toastId });
    } catch (err) {
      toast.error("Update failed", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatsSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Syncing platform stats...");
    try {
      await updateCompanyStats(stats);
      toast.success("Live statistics published", { id: toastId });
    } catch (err) {
      toast.error("Stats update failed", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <Loader2 className="animate-spin text-[#3866A3] mb-4" size={40} />
      <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">Initializing Settings...</p>
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-10 mt-10 max-w-4xl">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Platform Configuration</h1>
        <p className="text-slate-500 font-medium mt-1">Manage global branding, core philosophy, and public-facing data.</p>
      </div>

      {/* Moderate Tab Switcher */}
      <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
        {[
          { id: "general", label: "Branding", icon: Building2 },
          { id: "mission", label: "Philosophy", icon: Shield },
          { id: "stats", label: "Statistics", icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all ${
              activeTab === tab.id ? "bg-white text-[#3866A3] shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 max-w-4xl">
        {activeTab === "general" && (
          <form onSubmit={handleInfoSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1">Entity Name</label>
                <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-[#3866A3] transition-colors"
                  value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1">Tagline</label>
                <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none focus:border-[#3866A3]"
                  value={formData.tagline} onChange={(e) => setFormData({...formData, tagline: e.target.value})} placeholder="e.g. Investing in the future" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1 flex items-center gap-1.5"><Mail size={10}/> Support Email</label>
                <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1 flex items-center gap-1.5"><Phone size={10}/> Contact Number</label>
                <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none"
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1 flex items-center gap-1.5"><MapPin size={10}/> Corporate Address</label>
                <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none"
                  value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" disabled={isSaving} className="bg-[#3866A3] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#2d5284] transition-all disabled:opacity-50">
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Branding
              </button>
            </div>
          </form>
        )}

        {activeTab === "mission" && (
          <form onSubmit={handleInfoSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1 flex items-center gap-1.5"><Target size={12}/> Our Mission</label>
                <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none resize-none text-sm"
                  value={formData.mission} onChange={(e) => setFormData({...formData, mission: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1 flex items-center gap-1.5"><Eye size={12}/> Our Vision</label>
                <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none resize-none text-sm"
                  value={formData.vision} onChange={(e) => setFormData({...formData, vision: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1">Core Values (Comma Separated)</label>
                <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none text-sm"
                  value={formData.values} onChange={(e) => setFormData({...formData, values: e.target.value})} placeholder="Integrity, Innovation, Excellence..." />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" disabled={isSaving} className="bg-[#3866A3] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#2d5284] transition-all">
                <Save size={16} /> Save Philosophy
              </button>
            </div>
          </form>
        )}

        {activeTab === "stats" && (
          <form onSubmit={handleStatsSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Clients", icon: Globe, key: "clients", type: "number" },
                { label: "Assets Managed", icon: Zap, key: "assetsManaged", type: "text" },
                { label: "Years Exp.", icon: Building2, key: "yearsOfExperience", type: "number" },
                { label: "Team Members", icon: Info, key: "teamMembers", type: "number" }
              ].map((stat) => (
                <div key={stat.key} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-all focus-within:border-[#3866A3]/30">
                  <label className="text-[9px] font-black text-[#3866A3] uppercase block mb-2 tracking-widest flex items-center gap-1.5">
                    <stat.icon size={12} /> {stat.label}
                  </label>
                  <input 
                    type={stat.type} 
                    className="w-full bg-transparent text-2xl font-black text-slate-800 outline-none placeholder:text-slate-300"
                    value={stats[stat.key]} 
                    onChange={(e) => setStats({...stats, [stat.key]: e.target.value})} 
                  />
                </div>
              ))}
            </div>
            <div className="pt-4">
              <button type="submit" disabled={isSaving} className="w-full py-4 bg-[#3866A3] text-white font-black rounded-xl flex items-center justify-center gap-2 hover:bg-[#2d5284] transition-all shadow-lg shadow-blue-900/10 text-xs uppercase tracking-widest">
                <Save size={16} /> Update Live Dashboard
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}