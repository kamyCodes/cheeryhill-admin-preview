import React, { useState, useEffect } from "react";
import { getAllPressReleases, createPressRelease, deletePressRelease } from "../api/apiServices";
import { 
  Newspaper, Plus, Trash2, Loader2, ChevronRight, Eye, X, Save
} from "lucide-react";
import toast from "react-hot-toast";

export default function PressRelease() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    publicationDate: new Date().toISOString().split('T')[0],
    author: "Communications Team",
    image: ""
  });

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      const data = await getAllPressReleases();
      setReleases(data);
    } catch (err) {
      toast.error("Failed to load press releases");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    const toastId = toast.loading("Deleting release...");
    try {
      await deletePressRelease(id);
      toast.success("Release deleted successfully", { id: toastId });
      fetchReleases();
    } catch (err) {
      toast.error("Delete failed", { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Publishing release...");
    
    try {
      await createPressRelease(formData);
      toast.success("Press release published!", { id: toastId });
      setShowModal(false);
      resetForm();
      fetchReleases();
    } catch (err) {
      toast.error("Error publishing. Check all fields.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: "", summary: "", content: "", 
      publicationDate: new Date().toISOString().split('T')[0], 
      author: "Communications Team", image: "" 
    });
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between mt-10 items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Press Center</h1>
          <p className="text-slate-500 font-medium mt-1">Manage official corporate news and announcements.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#3866A3] hover:bg-[#2d5284] text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
        >
          <Plus size={20} /> Create Release
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#3866A3] mb-4" size={40} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching Newsroom...</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-6xl">
          {releases.map((release) => (
            <div key={release._id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 group">
              <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                <span className="text-[10px] font-black text-[#3866A3] uppercase tracking-widest">
                  {new Date(release.publicationDate).toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-2xl font-black text-slate-800">
                  {new Date(release.publicationDate).getDate()}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{release.author}</span>
                </div>
                <h3 className="text-lg font-black text-slate-800 group-hover:text-[#3866A3] transition-colors line-clamp-1 uppercase">
                  {release.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-1 font-medium mt-1">{release.summary}</p>
              </div>

              <div className="flex items-center gap-3 pr-4">
                <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-[#3866A3] transition-all" title="View">
                  <Eye size={18} />
                </button>
                <button onClick={() => handleDelete(release._id)} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 transition-all" title="Delete">
                  <Trash2 size={18} />
                </button>
                <ChevronRight className="text-slate-200 group-hover:text-[#3866A3] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal - Now Moderate Size */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-8 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#3866A3]/10 text-[#3866A3] rounded-xl">
                  <Newspaper size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Draft Release</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Headline</label>
                  <input required type="text" className="w-full text-slate-700 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#3866A3]/20 focus:border-[#3866A3] outline-none font-bold"
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Main Announcement Title" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Date</label>
                    <input required type="date" className="w-full text-slate-600 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none text-sm"
                      value={formData.publicationDate} onChange={(e) => setFormData({...formData, publicationDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Author</label>
                    <input required type="text" className="w-full text-slate-600 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none text-sm"
                      value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Summary Hook</label>
                  <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 border text-slate-600 border-slate-100 rounded-xl focus:border-[#3866A3] outline-none text-sm"
                    value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} placeholder="Brief introduction..." />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Body Content</label>
                  <textarea rows="6" required className="w-full text-slate-600 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none resize-none leading-relaxed text-sm"
                    value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Full details of the release..." />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 bg-slate-50 text-slate-500 font-bold rounded-xl hover:bg-slate-100 transition-all text-sm">Discard</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-[2] py-3.5 bg-[#3866A3] text-white font-bold rounded-xl hover:bg-[#2d5284] transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {isSubmitting ? "Publishing..." : "Publish Release"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}