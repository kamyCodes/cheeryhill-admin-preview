// import React, { useState, useEffect } from "react";
// import { getAllServices, createService, toggleServiceStatus, deleteService } from "../api/apiServices";
// import { Plus, Edit2, Trash2, Power, LayoutGrid, List, Loader2, Link as LinkIcon } from "lucide-react";
// import toast from "react-hot-toast";

// export default function AdminServices() {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Form State
//   const [formData, setFormData] = useState({
//     title: "",
//     summary: "",
//     description: "",
//     icon: "",
//     features: "", // We'll split this by comma on submit
//     callToAction: "Learn More",
//     order: 1
//   });

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const fetchServices = async () => {
//     try {
//       const data = await getAllServices();
//       setServices(data);
//     } catch (err) {
//       toast.error("Failed to load services");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggle = async (id) => {
//     try {
//       await toggleServiceStatus(id);
//       toast.success("Status updated");
//       fetchServices();
//     } catch (err) {
//       toast.error("Update failed");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this service?")) return;
//     try {
//       await deleteService(id);
//       toast.success("Service deleted");
//       fetchServices();
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       // Convert features string to array
//       const payload = {
//         ...formData,
//         features: formData.features.split(",").map(f => f.trim())
//       };
//       await createService(payload);
//       toast.success("Service created successfully");
//       setShowModal(false);
//       setFormData({ title: "", summary: "", description: "", icon: "", features: "", callToAction: "Learn More", order: 1 });
//       fetchServices();
//     } catch (err) {
//       toast.error("Check all fields and try again");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-8 bg-slate-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between mt-10 items-end mb-10">
//         <div>
//           <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Services</h1>
//           <p className="text-slate-500 font-medium mt-1">Configure your platform's core investment offerings.</p>
//         </div>
//         <button 
//           onClick={() => setShowModal(true)}
//           className="bg-[#3866A3] hover:bg-[#2d5284] text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-900/10"
//         >
//           <Plus size={20} /> Create Service
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-20">
//           <Loader2 className="animate-spin text-[#3866A3] mb-4" size={40} />
//           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Services...</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {services.map((service) => (
//             <div key={service._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
//               {/* Status Badge */}
//               <div className={`absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
//                 service.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
//               }`}>
//                 <div className={`w-1.5 h-1.5 rounded-full ${service.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
//                 {service.isActive ? "LIVE" : "DRAFT"}
//               </div>

//               {/* Icon & Title */}
//               <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
//                 {service.icon ? <img src={service.icon} alt="" className="w-8 h-8 object-contain" /> : <LayoutGrid className="text-slate-300" />}
//               </div>
              
//               <h3 className="text-xl font-black text-slate-800 mb-2 truncate">{service.title}</h3>
//               <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">{service.summary}</p>

//               {/* Features Preview */}
//               <div className="flex flex-wrap gap-2 mb-8">
//                 {service.features?.[0]?.split(',').slice(0, 3).map((f, i) => (
//                   <span key={i} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg uppercase">
//                     {f}
//                   </span>
//                 ))}
//               </div>

//               {/* Action Footer */}
//               <div className="flex items-center justify-between pt-6 border-t border-slate-50">
//                 <div className="flex gap-2">
//                   <button onClick={() => handleToggle(service._id)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-[#3866A3] transition-colors">
//                     <Power size={18} />
//                   </button>
//                   <button onClick={() => handleDelete(service._id)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 transition-colors">
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//                 <button className="flex items-center gap-2 text-[#3866A3] font-bold text-sm hover:underline">
//                   Edit Details <Edit2 size={14} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal - Large for complex content */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
//             <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight">Add Service</h2>
//             <p className="text-slate-500 font-medium mb-10">Define a new investment category for the platform.</p>
            
//             <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
//               <div className="col-span-2 md:col-span-1">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Service Title</label>
//                 <input required type="text" className="w-full text-gray-500 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none transition-all"
//                   value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Wealth Management" />
//               </div>
              
//               <div className="col-span-2 md:col-span-1">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Icon URL (Cloudinary)</label>
//                 <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 text-gray-500 rounded-2xl focus:border-[#3866A3] outline-none"
//                   value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} placeholder="https://..." />
//               </div>

//               <div className="col-span-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Summary (Catchy Hook)</label>
//                 <input required type="text" className="w-full text-gray-500 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
//                   value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} placeholder="Brief one-liner..." />
//               </div>

//               <div className="col-span-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Full Description</label>
//                 <textarea rows="4" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none text-gray-500 resize-none"
//                   value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Detailed explanation..." />
//               </div>

//               <div className="col-span-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Key Features (Comma Separated)</label>
//                 <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 text-gray-500 rounded-2xl focus:border-[#3866A3] outline-none"
//                   value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} placeholder="Risk Assessment, Portfolio Tracking, 24/7 Support" />
//               </div>

//               <div className="col-span-2 flex gap-4 mt-6">
//                 <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
//                 <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#3866A3] text-white font-bold rounded-2xl hover:bg-[#2d5284] transition-all disabled:opacity-50 shadow-lg shadow-blue-900/10">
//                   {isSubmitting ? "Uploading..." : "Publish Service"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }







import React, { useState, useEffect } from "react";
import { getAllServices, createService, updateService, toggleServiceStatus, deleteService } from "../api/apiServices";
import { Plus, Edit2, Trash2, Power, LayoutGrid, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track if we are editing an item

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    icon: "",
    features: "", 
    callToAction: "Learn More",
    order: 1
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (err) {
      toast.error("Failed to load services");
    } finally { // <--- Fixed the missing 'l' here
      setLoading(false);
    }
  };
  const handleToggle = async (id) => {
    try {
      await toggleServiceStatus(id);
      toast.success("Status updated");
      fetchServices();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService(id);
      toast.success("Service deleted");
      fetchServices();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Open modal in creation mode
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({ 
      title: "", 
      summary: "", 
      description: "", 
      icon: "", 
      features: "", 
      callToAction: "Learn More", 
      order: 1 
    });
    setShowModal(true);
  };

  // Open modal in update mode and map active fields
  const handleOpenEditModal = (service) => {
    setEditingId(service._id);
    
    // Process backend array into string format for input field editability
    let parsedFeatures = "";
    if (Array.isArray(service.features)) {
      parsedFeatures = service.features.join(", ");
    } else if (typeof service.features === "string") {
      parsedFeatures = service.features;
    }

    setFormData({
      title: service.title || "",
      summary: service.summary || "",
      description: service.description || "",
      icon: service.icon || "",
      features: parsedFeatures,
      callToAction: service.callToAction || "Learn More",
      order: service.order || 1
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Process features cleanly back to a valid payload string array
      const payload = {
        ...formData,
        features: formData.features ? formData.features.split(",").map(f => f.trim()).filter(Boolean) : []
      };

      if (editingId) {
        await updateService(editingId, payload);
        toast.success("Service updated successfully");
      } else {
        await createService(payload);
        toast.success("Service created successfully");
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({ title: "", summary: "", description: "", icon: "", features: "", callToAction: "Learn More", order: 1 });
      fetchServices();
    } catch (err) {
      toast.error("Check all fields and try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between mt-10 items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Services</h1>
          <p className="text-slate-500 font-medium mt-1">Configure your platform's core investment offerings.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-[#3866A3] hover:bg-[#2d5284] text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-900/10 cursor-pointer"
        >
          <Plus size={20} /> Create Service
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#3866A3] mb-4" size={40} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              {/* Status Badge */}
              <div className={`absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                service.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${service.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                {service.isActive ? "LIVE" : "DRAFT"}
              </div>

              {/* Icon & Title */}
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon ? <img src={service.icon} alt="" className="w-8 h-8 object-contain" /> : <LayoutGrid className="text-slate-300" />}
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-2 truncate">{service.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">{service.summary}</p>

              {/* Features Preview */}
              <div className="flex flex-wrap gap-2 mb-8">
                {Array.isArray(service.features) && service.features.length > 0 ? (
                  // Handle if backend features are already an array
                  service.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg uppercase">
                      {f}
                    </span>
                  ))
                ) : service.features?.[0]?.split(',').slice(0, 3).map((f, i) => (
                  // Fallback to split string
                  <span key={i} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg uppercase">
                    {f}
                  </span>
                ))}
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex gap-2">
                  <button onClick={() => handleToggle(service._id)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-[#3866A3] transition-colors cursor-pointer">
                    <Power size={18} />
                  </button>
                  <button onClick={() => handleDelete(service._id)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 transition-colors cursor-pointer">
                    <Trash2 size={18} />
                  </button>
                </div>
                <button 
                  onClick={() => handleOpenEditModal(service)}
                  className="flex items-center gap-2 text-[#3866A3] font-bold text-sm hover:underline cursor-pointer"
                >
                  Edit Details <Edit2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Large for complex content */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight">
              {editingId ? "Modify Service" : "Add Service"}
            </h2>
            <p className="text-slate-500 font-medium mb-10">
              {editingId ? "Update configurations for this investment category." : "Define a new investment category for the platform."}
            </p>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Service Title</label>
                <input required type="text" className="w-full text-gray-500 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none transition-all"
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Wealth Management" />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Icon URL (Cloudinary)</label>
                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 text-gray-500 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} placeholder="https://..." />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Summary (Catchy Hook)</label>
                <input required type="text" className="w-full text-gray-500 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} placeholder="Brief one-liner..." />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Full Description</label>
                <textarea rows="4" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none text-gray-500 resize-none"
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Detailed explanation..." />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Key Features (Comma Separated)</label>
                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 text-gray-500 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} placeholder="Risk Assessment, Portfolio Tracking, 24/7 Support" />
              </div>

              <div className="col-span-2 flex gap-4 mt-6">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#3866A3] text-white font-bold rounded-2xl hover:bg-[#2d5284] transition-all disabled:opacity-50 shadow-lg shadow-blue-900/10 cursor-pointer">
                  {isSubmitting ? "Uploading..." : editingId ? "Save Changes" : "Publish Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}