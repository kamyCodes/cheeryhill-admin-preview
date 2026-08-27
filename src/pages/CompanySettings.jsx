







// import React, { useState, useEffect } from "react";
// import { getCompanyInfo, updateCompanyInfo, updateCompanyStats } from "../api/apiServices";
// import { 
//   Building2, Save, Globe, Info, 
//   BarChart3, Shield, Loader2, MapPin, Users,
//   Mail, Phone, Zap, Target, Eye, Calendar
// } from "lucide-react";
// import toast from "react-hot-toast";

// export default function CompanySettings() {
//   const [loading, setLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [activeTab, setActiveTab] = useState("general");
  
//   const [formData, setFormData] = useState({
//     companyName: "", tagline: "", description: "", founded: 2020,
//     headquarters: "", email: "", phone: "", address: "",
//     mission: "", vision: "", values: "", whyChooseUs: "",
//     logo: "", favicon: "", mapUrl: "", linkedin: "", 
//     twitter: "", instagram: "", facebook: ""
//   });

//   const [stats, setStats] = useState({
//     clients: 0, assetsManaged: "", yearsOfExperience: 0, teamMembers: 0, investorSatisfaction: 100
//   });

//   useEffect(() => {
//     fetchInfo();
//   }, []);

//   const fetchInfo = async () => {
//     try {
//       const response = await getCompanyInfo();
//       // Adjust this based on your apiServices.js. 
//       // If it returns response.data directly:
//       const companyData = response?.data || response; 

//       if (companyData) {
//         setFormData({
//           ...companyData,
//           values: Array.isArray(companyData.values) ? companyData.values.join(", ") : companyData.values || "",
//           whyChooseUs: Array.isArray(companyData.whyChooseUs) ? companyData.whyChooseUs.join(", ") : companyData.whyChooseUs || ""
//         });
        
//         // Fix: Explicitly check for stats within the company data object
//         if (companyData.stats) {
//           setStats({
//             clients: companyData.stats.clients || 0,
//             assetsManaged: companyData.stats.assetsManaged || "",
//             yearsOfExperience: companyData.stats.yearsOfExperience || 0,
//             teamMembers: companyData.stats.teamMembers || 0
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       toast.error("Failed to sync platform data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInfoSubmit = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
//     const toastId = toast.loading("Updating corporate profile...");
//     try {
//       const payload = {
//         ...formData,
//         founded: Number(formData.founded),
//         values: typeof formData.values === 'string' ? formData.values.split(",").map(v => v.trim()).filter(v => v !== "") : formData.values,
//         whyChooseUs: typeof formData.whyChooseUs === 'string' ? formData.whyChooseUs.split(",").map(v => v.trim()).filter(v => v !== "") : formData.whyChooseUs
//       };
//       await updateCompanyInfo(payload);
//       toast.success("Branding updated successfully", { id: toastId });
//       await fetchInfo(); 
//     } catch (err) {
//       toast.error("Update failed", { id: toastId });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleStatsSubmit = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
//     const toastId = toast.loading("Publishing live metrics...");

//     try {
//       const statsPayload = {
//         clients: Number(stats.clients),
//         assetsManaged: String(stats.assetsManaged),
//         yearsOfExperience: Number(stats.yearsOfExperience),
//         teamMembers: Number(stats.teamMembers)
//       };

//       const response = await updateCompanyStats(statsPayload);

//       // Extract stats from response.data.stats based on your API snippet
//       const updatedStats = response?.data?.stats || response?.stats || response;
      
//       if (updatedStats) {
//         setStats(updatedStats);
//       }

//       toast.success("Live statistics synchronized", { id: toastId });
//       await fetchInfo(); // Refresh global state

//     } catch (err) {
//       console.error("Stats Update Error:", err);
//       toast.error("Stats sync failed", { id: toastId });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center py-40">
//       <Loader2 className="animate-spin text-[#3866A3] mb-4" size={40} />
//       <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">Fetching System Records...</p>
//     </div>
//   );

//   return (
//     <div className="p-8 bg-[#F8FAFC] min-h-screen">
//       <div className="mb-10 mt-10 max-w-5xl">
//         <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Platform Configuration</h1>
//         <p className="text-slate-500 font-medium mt-2">Update global entity details, mission statements, and real-time dashboard metrics.</p>
//       </div>

//       <div className="flex gap-2 mb-8 bg-slate-200/40 p-1.5 rounded-2xl w-fit border border-slate-200/60 backdrop-blur-sm">
//         {[
//           { id: "general", label: "Branding & Contact", icon: Building2 },
//           { id: "philosophy", label: "Philosophy", icon: Shield },
//           { id: "stats", label: "Live Statistics", icon: BarChart3 }
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             type="button"
//             onClick={() => setActiveTab(tab.id)}
//             className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all duration-200 ${
//               activeTab === tab.id 
//                 ? "bg-white text-[#3866A3] shadow-md scale-[1.02]" 
//                 : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
//             }`}
//           >
//             <tab.icon size={14} /> {tab.label}
//           </button>
//         ))}
//       </div>

//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-10 max-w-5xl relative overflow-hidden">
//         {isSaving && (
//           <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
//              <div className="flex flex-col items-center">
//                 <Loader2 className="animate-spin text-[#3866A3] mb-2" size={32} />
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Syncing to cloud...</span>
//              </div>
//           </div>
//         )}

//         {activeTab === "general" && (
//           <form onSubmit={handleInfoSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
//                   <div className="w-1.5 h-4 bg-[#3866A3] rounded-full" /> Basic Identity
//                 </h3>
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1">Company Legal Name</label>
//                   <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#3866A3]/10 focus:border-[#3866A3] transition-all"
//                     value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1">Platform Tagline</label>
//                   <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none focus:border-[#3866A3]"
//                     value={formData.tagline} onChange={(e) => setFormData({...formData, tagline: e.target.value})} />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                    <div>
//                       <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1 flex items-center gap-1"><Calendar size={10}/> Founded</label>
//                       <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none"
//                         value={formData.founded} onChange={(e) => setFormData({...formData, founded: e.target.value})} />
//                    </div>
//                    <div>
//                       <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1 flex items-center gap-1"><MapPin size={10}/> HQ City</label>
//                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none"
//                         value={formData.headquarters} onChange={(e) => setFormData({...formData, headquarters: e.target.value})} />
//                    </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
//                   <div className="w-1.5 h-4 bg-orange-400 rounded-full" /> Contact Channels
//                 </h3>
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1 flex items-center gap-1.5"><Mail size={10}/> Public Email</label>
//                   <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none focus:border-[#3866A3]"
//                     value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1 flex items-center gap-1.5"><Phone size={10}/> Contact Number</label>
//                   <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none focus:border-[#3866A3]"
//                     value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1">Office Address</label>
//                   <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 outline-none focus:border-[#3866A3]"
//                     value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
//                 </div>
//               </div>
//             </div>

//             <div className="pt-6 border-t border-slate-100">
//                <button type="submit" disabled={isSaving} className="bg-[#3866A3] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-[#2d5284] hover:shadow-lg transition-all disabled:opacity-50">
//                   {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Platform Identity
//                </button>
//             </div>
//           </form>
//         )}

//         {activeTab === "philosophy" && (
//           <form onSubmit={handleInfoSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="grid grid-cols-1 gap-8">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1 flex items-center gap-1.5"><Target size={14} className="text-[#3866A3]"/> Strategic Mission</label>
//                   <textarea rows="4" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 outline-none resize-none text-sm leading-relaxed focus:bg-white focus:border-[#3866A3] transition-all"
//                     value={formData.mission} onChange={(e) => setFormData({...formData, mission: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1 flex items-center gap-1.5"><Eye size={14} className="text-[#3866A3]"/> Long-term Vision</label>
//                   <textarea rows="4" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 outline-none resize-none text-sm leading-relaxed focus:bg-white focus:border-[#3866A3] transition-all"
//                     value={formData.vision} onChange={(e) => setFormData({...formData, vision: e.target.value})} />
//                 </div>
//               </div>
              
//               <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Core Values (Comma Separated)</label>
//                   <input className="w-full px-4 py-4 bg-white border border-slate-100 rounded-xl text-slate-600 outline-none text-sm font-bold shadow-sm focus:border-[#3866A3]"
//                     value={formData.values} onChange={(e) => setFormData({...formData, values: e.target.value})} placeholder="Integrity, Innovation, Excellence..." />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Unique Selling Points (Comma Separated)</label>
//                   <input className="w-full px-4 py-4 bg-white border border-slate-100 rounded-xl text-slate-600 outline-none text-sm font-bold shadow-sm focus:border-[#3866A3]"
//                     value={formData.whyChooseUs} onChange={(e) => setFormData({...formData, whyChooseUs: e.target.value})} placeholder="Fast Withdrawals, Secure Assets..." />
//                 </div>
//               </div>
//             </div>
            
//             <button type="submit" disabled={isSaving} className="bg-[#3866A3] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-[#2d5284] transition-all">
//                <Save size={16} /> Save Mission & Philosophy
//             </button>
//           </form>
//         )}

//         {activeTab === "stats" && (
//           <form onSubmit={handleStatsSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {[
//                 { label: "Active Clients", icon: Globe, key: "clients", type: "number" },
//                 { label: "Assets Managed", icon: Zap, key: "assetsManaged", type: "text" },
//                 { label: "Years in Industry", icon: Building2, key: "yearsOfExperience", type: "number" },
//                 { label: "Total Staff", icon: Info, key: "teamMembers", type: "number" },
//                { label: "Investor Satisfaction %", icon: Users, key: "investorSatisfaction", type: "number" }
//               ].map((stat) => (
//                 <div key={stat.key} className="group p-8 bg-slate-50 rounded-[2rem] border border-slate-100 focus-within:border-[#3866A3] focus-within:bg-white focus-within:shadow-xl transition-all duration-300">
//                   <label className="text-[10px] font-black text-slate-400 group-focus-within:text-[#3866A3] uppercase block mb-3 tracking-[0.15em] flex items-center gap-2">
//                     <stat.icon size={14} /> {stat.label}
//                   </label>
//                   <input 
//                     type={stat.type} 
//                     className="w-full bg-transparent text-3xl font-black text-slate-900 outline-none"
//                     value={stats[stat.key] || ""} 
//                     onChange={(e) => setStats({...stats, [stat.key]: e.target.value})} 
//                   />
//                 </div>
//               ))}
//             </div>
//             <button 
//               type="submit" 
//               disabled={isSaving} 
//               className="w-full py-5 bg-slate-900 text-white font-black rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-black shadow-2xl text-[11px] uppercase tracking-[0.3em] transition-all disabled:opacity-70 group"
//             >
//               {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} className="group-hover:scale-110 transition-transform" />}
//               Push Live Updates to Dashboard
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }







import React, { useState, useEffect } from "react";
import { getCompanyInfo, updateCompanyInfo, updateCompanyStats } from "../api/apiServices";
import { 
  Building2, Save, Globe, Info, 
  BarChart3, Shield, Loader2, MapPin, Users,
  Mail, Phone, Zap, Target, Eye, Calendar
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
    logo: "", favicon: "", mapUrl: "", linkedin: "", 
    twitter: "", instagram: "", facebook: ""
  });

  const [stats, setStats] = useState({
    clients: 0, assetsManaged: "", yearsOfExperience: 0, teamMembers: 0, investorSatisfaction: 100
  });

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const response = await getCompanyInfo();
      const companyData = response?.data || response; 

      if (companyData) {
        setFormData({
          ...companyData,
          values: Array.isArray(companyData.values) ? companyData.values.join(", ") : companyData.values || "",
          whyChooseUs: Array.isArray(companyData.whyChooseUs) ? companyData.whyChooseUs.join(", ") : companyData.whyChooseUs || ""
        });
        
        if (companyData.stats) {
          setStats({
            clients: companyData.stats.clients ?? 0,
            assetsManaged: companyData.stats.assetsManaged ?? "",
            yearsOfExperience: companyData.stats.yearsOfExperience ?? 0,
            teamMembers: companyData.stats.teamMembers ?? 0,
            investorSatisfaction: companyData.stats.investorSatisfaction ?? 100
          });
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to sync platform data");
    } finally {
      setLoading(false);
    }
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Updating corporate profile...");
    try {
      const payload = {
        ...formData,
        founded: Number(formData.founded) || 2020,
        values: typeof formData.values === 'string' ? formData.values.split(",").map(v => v.trim()).filter(Boolean) : formData.values,
        whyChooseUs: typeof formData.whyChooseUs === 'string' ? formData.whyChooseUs.split(",").map(v => v.trim()).filter(Boolean) : formData.whyChooseUs
      };
      await updateCompanyInfo(payload);
      toast.success("Branding updated successfully", { id: toastId });
      await fetchInfo(); 
    } catch (err) {
      toast.error("Update failed", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatsSubmit = async (e) => {
  e.preventDefault();
  setIsSaving(true);
  const toastId = toast.loading("Publishing live metrics...");

  try {
    const statsPayload = {
      clients: Number(stats.clients) || 0,
      assetsManaged: String(stats.assetsManaged || ""),
      yearsOfExperience: Number(stats.yearsOfExperience) || 0,
      teamMembers: Number(stats.teamMembers) || 0,
      investorSatisfaction: Number(stats.investorSatisfaction) || 100
    };

    // 1. Sends flat payload now
    const response = await updateCompanyStats(statsPayload);
    
    // 2. Safely extract "stats" from the nested data object returned by the server
    const targetData = response?.data || response;
    const updatedStats = targetData?.stats;
    
    if (updatedStats) {
      setStats({
        clients: updatedStats.clients ?? 0,
        assetsManaged: updatedStats.assetsManaged ?? "",
        yearsOfExperience: updatedStats.yearsOfExperience ?? 0,
        teamMembers: updatedStats.teamMembers ?? 0
      });
    }

    toast.success("Live statistics synchronized", { id: toastId });
    await fetchInfo(); // Refresh global state configurations seamlessly

  } catch (err) {
    console.error("Stats Update Error:", err);
    toast.error("Stats sync failed", { id: toastId });
  } finally {
    setIsSaving(false);
  }
};

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <Loader2 className="animate-spin text-[#3866A3] mb-4" size={40} />
      <p className="text-neutral-400 font-black text-[10px] tracking-widest uppercase">Fetching System Records...</p>
    </div>
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="mb-10 mt-10 max-w-5xl">
        <h1 className="text-4xl font-black text-navy tracking-tight uppercase">Platform Configuration</h1>
        <p className="text-neutral-500 font-medium mt-2">Update global entity details, mission statements, and real-time dashboard metrics.</p>
      </div>

      <div className="flex gap-2 mb-8 bg-neutral-200/40 p-1.5 rounded-2xl w-fit border border-neutral-200/60 backdrop-blur-sm">
        {[
          { id: "general", label: "Branding & Contact", icon: Building2 },
          { id: "philosophy", label: "Philosophy", icon: Shield },
          { id: "stats", label: "Live Statistics", icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === tab.id 
                ? "bg-white text-[#3866A3] shadow-md scale-[1.02]" 
                : "text-neutral-500 hover:text-navy hover:bg-white/50"
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-xl shadow-slate-200/50 p-10 max-w-5xl relative overflow-hidden">
        {isSaving && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
             <div className="flex flex-col items-center">
                <Loader2 className="animate-spin text-[#3866A3] mb-2" size={32} />
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">Syncing to cloud...</span>
             </div>
          </div>
        )}

        {activeTab === "general" && (
          <form onSubmit={handleInfoSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-navy flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full" /> Basic Identity
                </h3>
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase block mb-1.5 ml-1">Company Legal Name</label>
                  <input required className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#3866A3]/10 focus:border-[#3866A3] transition-all"
                    value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase block mb-1.5 ml-1">Platform Tagline</label>
                  <input className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl text-slate-600 outline-none focus:border-[#3866A3]"
                    value={formData.tagline} onChange={(e) => setFormData({...formData, tagline: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] font-black text-neutral-400 uppercase block mb-1.5 ml-1 flex items-center gap-1"><Calendar size={10}/> Founded</label>
                      <input type="number" className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl text-slate-600 outline-none"
                        value={formData.founded} onChange={(e) => setFormData({...formData, founded: e.target.value})} />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-neutral-400 uppercase block mb-1.5 ml-1 flex items-center gap-1"><MapPin size={10}/> HQ City</label>
                      <input className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl text-slate-600 outline-none"
                        value={formData.headquarters} onChange={(e) => setFormData({...formData, headquarters: e.target.value})} />
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-navy flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-4 bg-orange-400 rounded-full" /> Contact Channels
                </h3>
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase block mb-1.5 ml-1 flex items-center gap-1.5"><Mail size={10}/> Public Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl text-slate-600 outline-none focus:border-[#3866A3]"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase block mb-1.5 ml-1 flex items-center gap-1.5"><Phone size={10}/> Contact Number</label>
                  <input className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl text-slate-600 outline-none focus:border-[#3866A3]"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase block mb-1.5 ml-1">Office Address</label>
                  <input className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl text-slate-600 outline-none focus:border-[#3866A3]"
                    value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100">
               <button type="submit" disabled={isSaving} className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-emerald-600 hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer">
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Platform Identity
               </button>
            </div>
          </form>
        )}

        {activeTab === "philosophy" && (
          <form onSubmit={handleInfoSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase block mb-2 ml-1 flex items-center gap-1.5"><Target size={14} className="text-[#3866A3]"/> Strategic Mission</label>
                  <textarea rows="4" className="w-full px-5 py-4 bg-white border border-neutral-100 rounded-2xl text-slate-600 outline-none resize-none text-sm leading-relaxed focus:bg-white focus:border-[#3866A3] transition-all"
                    value={formData.mission} onChange={(e) => setFormData({...formData, mission: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase block mb-2 ml-1 flex items-center gap-1.5"><Eye size={14} className="text-[#3866A3]"/> Long-term Vision</label>
                  <textarea rows="4" className="w-full px-5 py-4 bg-white border border-neutral-100 rounded-2xl text-slate-600 outline-none resize-none text-sm leading-relaxed focus:bg-white focus:border-[#3866A3] transition-all"
                    value={formData.vision} onChange={(e) => setFormData({...formData, vision: e.target.value})} />
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase block mb-2 ml-1">Core Values (Comma Separated)</label>
                  <input className="w-full px-4 py-4 bg-white border border-neutral-100 rounded-xl text-slate-600 outline-none text-sm font-bold shadow-sm focus:border-[#3866A3]"
                    value={formData.values} onChange={(e) => setFormData({...formData, values: e.target.value})} placeholder="Integrity, Innovation, Excellence..." />
                </div>
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase block mb-2 ml-1">Unique Selling Points (Comma Separated)</label>
                  <input className="w-full px-4 py-4 bg-white border border-neutral-100 rounded-xl text-slate-600 outline-none text-sm font-bold shadow-sm focus:border-[#3866A3]"
                    value={formData.whyChooseUs} onChange={(e) => setFormData({...formData, whyChooseUs: e.target.value})} placeholder="Fast Withdrawals, Secure Assets..." />
                </div>
              </div>
            </div>
            
            <button type="submit" disabled={isSaving} className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-emerald-600 transition-all cursor-pointer">
                <Save size={16} /> Save Mission & Philosophy
            </button>
          </form>
        )}

        {activeTab === "stats" && (
          <form onSubmit={handleStatsSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
//                 { label: "Active Clients", icon: Globe, key: "clients", type: "number" },
                { label: "Assets Managed", icon: Zap, key: "assetsManaged", type: "text" },
                { label: "Years in Industry", icon: Building2, key: "yearsOfExperience", type: "number" },
                { label: "Total Staff", icon: Info, key: "teamMembers", type: "number" },
                { label: "Investor Satisfaction %", icon: Users, key: "investorSatisfaction", type: "number" }
              ].map((stat) => (
                <div key={stat.key} className="group p-8 bg-white rounded-[2rem] border border-neutral-100 focus-within:border-[#3866A3] focus-within:bg-white focus-within:shadow-xl transition-all duration-300">
                  <label className="text-[10px] font-black text-neutral-400 group-focus-within:text-[#3866A3] uppercase block mb-3 tracking-[0.15em] flex items-center gap-2">
                    <stat.icon size={14} /> {stat.label}
                  </label>
                  <input 
                    type={stat.type} 
                    className="w-full bg-transparent text-3xl font-black text-navy outline-none"
                    value={stats[stat.key] ?? ""} 
                    onChange={(e) => setStats({...stats, [stat.key]: e.target.value})} 
                  />
                </div>
              ))}
            </div>
            <button 
              type="submit" 
              disabled={isSaving} 
              className="w-full py-5 bg-slate-900 text-white font-black rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-black shadow-2xl text-[11px] uppercase tracking-[0.3em] transition-all disabled:opacity-70 group cursor-pointer"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} className="group-hover:scale-110 transition-transform" />}
              Push Live Updates to Dashboard
            </button>
          </form>
        )}
      </div>
    </div>
  );
}