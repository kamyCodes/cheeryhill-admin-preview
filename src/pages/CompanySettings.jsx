import React, { useState, useEffect } from "react";
import { getCompanyInfo, updateCompanyInfo, updateCompanyStats } from "../api/apiServices";
import { 
  Building2, Save, Globe, Info, 
  BarChart3, Shield, Loader2, MapPin,
  Mail, Phone, Zap
} from "lucide-react";
import toast from "react-hot-toast";

export default function CompanySettings() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  const [formData, setFormData] = useState({
    companyName: "",
    tagline: "",
    description: "",
    founded: 2020,
    headquarters: "",
    email: "",
    phone: "",
    address: "",
    mission: "",
    vision: "",
    values: "", // We'll handle as comma-separated string for UX
    whyChooseUs: "",
    logo: "",
    favicon: ""
  });

  const [stats, setStats] = useState({
    clients: 0,
    assetsManaged: "",
    yearsOfExperience: 0,
    teamMembers: 0
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
          values: Array.isArray(data.values) ? data.values.join(", ") : data.values,
          whyChooseUs: Array.isArray(data.whyChooseUs) ? data.whyChooseUs.join(", ") : data.whyChooseUs
        });
        setStats(data.stats);
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
    try {
      const payload = {
        ...formData,
        values: formData.values.split(",").map(v => v.trim()),
        whyChooseUs: formData.whyChooseUs.split(",").map(v => v.trim())
      };
      await updateCompanyInfo(payload);
      toast.success("Branding updated successfully");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatsSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCompanyStats(stats);
      toast.success("Live stats updated");
    } catch (err) {
      toast.error("Stats update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3866A3]" size={40} /></div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-10 mt-10">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Platform Configuration</h1>
        <p className="text-slate-500 font-medium mt-1">Global settings and public profile management.</p>
      </div>

      <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl border border-slate-100 w-fit">
        {[
          { id: "general", label: "Branding", icon: Building2 },
          { id: "mission", label: "Mission & Values", icon: Shield },
          { id: "stats", label: "Platform Stats", icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
              activeTab === tab.id ? "bg-[#3866A3] text-white shadow-md" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 max-w-5xl">
        {activeTab === "general" && (
          <form onSubmit={handleInfoSubmit} className="space-y-8 animate-in fade-in duration-300">
             <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Company Name</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-[#3866A3]"
                    value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Tagline</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                    value={formData.tagline} onChange={(e) => setFormData({...formData, tagline: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Support Email</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Support Phone</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Headquarters / Office Address</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                    value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
             </div>
             <button type="submit" disabled={isSaving} className="bg-[#3866A3] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#2d5284] transition-all">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Update Branding
             </button>
          </form>
        )}

        {activeTab === "mission" && (
          <form onSubmit={handleInfoSubmit} className="space-y-8 animate-in fade-in duration-300">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Mission Statement</label>
              <textarea rows="3" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none resize-none leading-relaxed"
                value={formData.mission} onChange={(e) => setFormData({...formData, mission: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Vision Statement</label>
              <textarea rows="3" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none resize-none leading-relaxed"
                value={formData.vision} onChange={(e) => setFormData({...formData, vision: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Core Values (Comma Separated)</label>
              <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                value={formData.values} onChange={(e) => setFormData({...formData, values: e.target.value})} />
            </div>
            <button type="submit" disabled={isSaving} className="bg-[#3866A3] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2">
              <Save size={18} /> Save Philosophy
            </button>
          </form>
        )}

        {activeTab === "stats" && (
          <form onSubmit={handleStatsSubmit} className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <label className="text-[10px] font-black text-[#3866A3] uppercase block mb-4 tracking-widest flex items-center gap-2">
                  <Globe size={14} /> Total Clients
                </label>
                <input type="number" className="w-full bg-transparent text-3xl font-black text-slate-800 outline-none"
                  value={stats.clients} onChange={(e) => setStats({...stats, clients: e.target.value})} />
              </div>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <label className="text-[10px] font-black text-[#3866A3] uppercase block mb-4 tracking-widest flex items-center gap-2">
                  <Zap size={14} /> Assets Managed
                </label>
                <input className="w-full bg-transparent text-3xl font-black text-slate-800 outline-none"
                  value={stats.assetsManaged} onChange={(e) => setStats({...stats, assetsManaged: e.target.value})} />
              </div>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <label className="text-[10px] font-black text-[#3866A3] uppercase block mb-4 tracking-widest flex items-center gap-2">
                  <Building2 size={14} /> Years Exp.
                </label>
                <input type="number" className="w-full bg-transparent text-3xl font-black text-slate-800 outline-none"
                  value={stats.yearsOfExperience} onChange={(e) => setStats({...stats, yearsOfExperience: e.target.value})} />
              </div>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <label className="text-[10px] font-black text-[#3866A3] uppercase block mb-4 tracking-widest flex items-center gap-2">
                  <Info size={14} /> Team Members
                </label>
                <input type="number" className="w-full bg-transparent text-3xl font-black text-slate-800 outline-none"
                  value={stats.teamMembers} onChange={(e) => setStats({...stats, teamMembers: e.target.value})} />
              </div>
            </div>
            <button type="submit" disabled={isSaving} className="w-full py-5 bg-[#3866A3] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-[#2d5284] transition-all shadow-lg shadow-blue-900/10">
              <Save size={20} /> Publish Live Stats
            </button>
          </form>
        )}
      </div>
    </div>
  );
}