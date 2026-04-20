import React, { useState, useEffect } from "react";
import { getAllWebinars, createWebinar, deleteWebinar } from "../api/apiServices";
import { 
  Video, Plus, Calendar, Clock, User, ExternalLink, 
  Trash2, PlayCircle, Loader2, Globe, Monitor
} from "lucide-react";
import toast from "react-hot-toast";

export default function Webinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this webinar from the platform?")) return;
    try {
      await deleteWebinar(id);
      toast.success("Webinar deleted");
      fetchWebinars();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createWebinar(formData);
      toast.success("Webinar published successfully");
      setShowModal(false);
      resetForm();
      fetchWebinars();
    } catch (err) {
      toast.error("Error creating webinar. Check all fields.");
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
          className="bg-[#3866A3] hover:bg-[#2d5284] text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-900/10"
        >
          <Plus size={20} /> Schedule Webinar
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#3866A3] mb-4" size={40} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Archives...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {webinars.map((webinar) => (
            <div key={webinar._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
              {/* Thumbnail Area */}
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                {webinar.image ? (
                  <img src={webinar.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Monitor size={48} />
                  </div>
                )}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                  webinar.isUpcoming ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {webinar.isUpcoming ? "LIVE SOON" : "RECORDED"}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-800 mb-3 leading-tight line-clamp-2 uppercase tracking-tight">
                  {webinar.title}
                </h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <Calendar size={14} className="text-[#3866A3]" /> 
                    {new Date(webinar.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <User size={14} className="text-[#3866A3]" /> {webinar.speaker}
                  </div>
                </div>

                <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed">
                  {webinar.description}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex gap-2">
                    {webinar.videoUrl && (
                      <a href={webinar.videoUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                        <PlayCircle size={18} />
                      </a>
                    )}
                    {webinar.registrationLink && (
                      <a href={webinar.registrationLink} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-[#3866A3] transition-colors">
                        <Globe size={18} />
                      </a>
                    )}
                  </div>
                  <button onClick={() => handleDelete(webinar._id)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight">Post Webinar</h2>
            <p className="text-slate-500 font-medium mb-10">Streamline education and client engagement.</p>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Session Title</label>
                <input required type="text" className="w-full text-gray-500 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none transition-all font-semibold"
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="The Future of REITs 2024" />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Host/Speaker</label>
                <input required type="text" className="w-full text-gray-500 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.speaker} onChange={(e) => setFormData({...formData, speaker: e.target.value})} placeholder="Dr. Sarah James" />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Date & Time</label>
                <input required type="datetime-local" className="w-full px-5 py-4 bg-slate-50 text-gray-500 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Description</label>
                <textarea rows="3" required className="w-full text-gray-500 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none resize-none"
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Video URL (Post-Event)</label>
                <input type="url" className="w-full px-5 py-4 bg-slate-50 text-gray-500 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} placeholder="YouTube/Vimeo Link" />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Registration Link (Live)</label>
                <input type="url" className="w-full px-5 py-4 text-gray-500 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.registrationLink} onChange={(e) => setFormData({...formData, registrationLink: e.target.value})} placeholder="Zoom/Google Meet" />
              </div>

              <div className="col-span-2 flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#3866A3] text-white font-bold rounded-2xl hover:bg-[#2d5284] transition-all shadow-lg shadow-blue-900/10">
                  {isSubmitting ? "Syncing..." : "Publish Webinar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}