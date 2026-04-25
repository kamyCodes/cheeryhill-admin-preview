import React, { useState, useEffect } from "react";
// 1. Ensure updateWebinar is imported
import { getAllWebinars, createWebinar, deleteWebinar, updateWebinar } from "../api/apiServices";
import { 
  Video, Plus, Calendar, Clock, User, ExternalLink, 
  Trash2, PlayCircle, Loader2, Globe, Monitor, X, Save, Pencil
} from "lucide-react";
import toast from "react-hot-toast";

export default function Webinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. State to track which webinar we are editing
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    duration: "",
    speaker: "",
    videoUrl: "",
    registrationLink: "",
    image: ""
  });

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const data = await getAllWebinars();
      setWebinars(data);
    } catch (err) {
      toast.error("Failed to load webinars");
    } finally {
      setLoading(false);
    }
  };

  // 3. Logic to open modal in Edit Mode
  const handleEdit = (webinar) => {
    setEditingId(webinar._id);
    setFormData({
      title: webinar.title || "",
      description: webinar.description || "",
      // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
      date: webinar.date ? new Date(webinar.date).toISOString().slice(0, 16) : "",
      duration: webinar.duration || "",
      speaker: webinar.speaker || "",
      videoUrl: webinar.videoUrl || "",
      registrationLink: webinar.registrationLink || "",
      image: webinar.image || ""
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this webinar from the platform?")) return;
    const toastId = toast.loading("Removing webinar...");
    try {
      await deleteWebinar(id);
      toast.success("Webinar deleted successfully", { id: toastId });
      fetchWebinars();
    } catch (err) {
      toast.error("Delete failed", { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(editingId ? "Updating session..." : "Publishing to hub...");
    
    try {
      if (editingId) {
        // 4. Call Update API
        await updateWebinar(editingId, formData);
        toast.success("Webinar updated successfully!", { id: toastId });
      } else {
        // Call Create API
        await createWebinar(formData);
        toast.success("Webinar published successfully!", { id: toastId });
      }
      handleCloseModal();
      fetchWebinars();
    } catch (err) {
      toast.error("Operation failed. Check your inputs.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", date: "", duration: "", speaker: "", videoUrl: "", registrationLink: "", image: "" });
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between mt-10 items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Webinar Hub</h1>
          <p className="text-slate-500 font-medium mt-1">Manage live investment summits and video archives.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#3866A3] hover:bg-[#2d5284] text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} /> Schedule Webinar
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#3866A3] mb-4" size={40} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Archives...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
          {webinars.map((webinar) => (
            <div key={webinar._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
              {/* Thumbnail */}
              <div className="h-44 bg-slate-100 relative overflow-hidden">
                {webinar.image ? (
                  <img src={webinar.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Monitor size={40} />
                  </div>
                )}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${
                  webinar.isUpcoming ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {webinar.isUpcoming ? "LIVE SOON" : "RECORDED"}
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col">
                <h3 className="text-lg font-black text-slate-800 mb-3 leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-[#3866A3] transition-colors">
                  {webinar.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase">
                    <Calendar size={13} className="text-[#3866A3]" /> 
                    {new Date(webinar.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase">
                    <User size={13} className="text-[#3866A3]" /> {webinar.speaker}
                  </div>
                </div>

                <p className="text-slate-500 text-xs mb-6 line-clamp-2 leading-relaxed font-medium">
                  {webinar.description}
                </p>

                <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {/* 5. ADDED EDIT BUTTON IN LIST */}
                    <button 
                      onClick={() => handleEdit(webinar)}
                      className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-[#3866A3] transition-colors"
                      title="Edit Webinar"
                    >
                      <Pencil size={16} />
                    </button>

                    {webinar.videoUrl && (
                      <a href={webinar.videoUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Watch Video">
                        <PlayCircle size={16} />
                      </a>
                    )}
                  </div>
                  <button onClick={() => handleDelete(webinar._id)} className="p-2 bg-rose-50/50 rounded-lg text-rose-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#3866A3]/10 text-[#3866A3] rounded-lg">
                  <Video size={18} />
                </div>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  {editingId ? "Edit Webinar" : "Schedule Webinar"}
                </h2>
              </div>
              <button onClick={handleCloseModal} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block ml-1">Session Title</label>
                  <input required type="text" className="w-full text-slate-700 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none font-bold text-sm"
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Title of the session" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block ml-1">Speaker</label>
                  <input required type="text" className="w-full text-slate-600 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none text-sm"
                    value={formData.speaker} onChange={(e) => setFormData({...formData, speaker: e.target.value})} placeholder="Name" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block ml-1">Date & Time</label>
                  <input required type="datetime-local" className="w-full px-4 py-3 bg-slate-50 text-slate-600 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none text-sm"
                    value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block ml-1">Summary</label>
                  <textarea rows="3" required className="w-full text-slate-600 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none resize-none text-sm"
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block ml-1">Video Link (YouTube/Vimeo)</label>
                  <input type="url" className="w-full px-4 py-3 bg-slate-50 text-slate-600 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none text-sm"
                    value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} placeholder="https://..." />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block ml-1">Registration Link (Live Event)</label>
                  <input type="url" className="w-full px-4 py-3 text-slate-600 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none text-sm"
                    value={formData.registrationLink} onChange={(e) => setFormData({...formData, registrationLink: e.target.value})} placeholder="Zoom or Google Meet Link" />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-3 bg-slate-50 text-slate-500 font-bold rounded-xl text-xs uppercase">Discard</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-[2] py-3 bg-[#3866A3] text-white font-bold rounded-xl hover:bg-[#2d5284] transition-all flex items-center justify-center gap-2 text-xs uppercase disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {isSubmitting ? "Processing..." : (editingId ? "Save Changes" : "Publish Session")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}