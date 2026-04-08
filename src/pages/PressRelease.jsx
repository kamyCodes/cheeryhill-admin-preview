import React, { useState, useEffect } from "react";
import { getAllPressReleases, createPressRelease, deletePressRelease } from "../api/apiServices";
import { 
  Newspaper, Plus, Calendar, User, Trash2, 
  Edit3, Loader2, FileText, ChevronRight, Eye
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
    try {
      await deletePressRelease(id);
      toast.success("Release deleted successfully");
      fetchReleases();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createPressRelease(formData);
      toast.success("Press release published!");
      setShowModal(false);
      resetForm();
      fetchReleases();
    } catch (err) {
      toast.error("Error publishing. Check all fields.");
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
          className="bg-[#3866A3] hover:bg-[#2d5284] text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-900/10"
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
        <div className="space-y-4">
          {releases.map((release) => (
            <div key={release._id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 group">
              {/* Date Block */}
              <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                <span className="text-[10px] font-black text-[#3866A3] uppercase tracking-widest">
                  {new Date(release.publicationDate).toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-2xl font-black text-slate-800">
                  {new Date(release.publicationDate).getDate()}
                </span>
              </div>

              {/* Text Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${release.isActive ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{release.author}</span>
                </div>
                <h3 className="text-lg font-black text-slate-800 group-hover:text-[#3866A3] transition-colors line-clamp-1">
                  {release.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-1 font-medium mt-1">{release.summary}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pr-4">
                <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-[#3866A3] transition-all">
                  <Eye size={18} />
                </button>
                <button onClick={() => handleDelete(release._id)} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 transition-all">
                  <Trash2 size={18} />
                </button>
                <ChevronRight className="text-slate-200 group-hover:text-[#3866A3] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[95vh] custom-scrollbar">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[#3866A3]/10 text-[#3866A3] rounded-2xl">
                <Newspaper size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Draft Release</h2>
                <p className="text-slate-500 font-medium">Internal newsroom publishing tool.</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Headline</label>
                <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none font-bold text-lg"
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Main Headline" />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Publication Date</label>
                <input required type="date" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.publicationDate} onChange={(e) => setFormData({...formData, publicationDate: e.target.value})} />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Author / Team</label>
                <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Summary (Sub-headline)</label>
                <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} placeholder="A brief hook for the news feed..." />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Full Content</label>
                <textarea rows="10" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none resize-none leading-relaxed"
                  value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Write the full body of the release here..." />
              </div>

              <div className="col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Discard</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#3866A3] text-white font-bold rounded-2xl hover:bg-[#2d5284] transition-all shadow-lg shadow-blue-900/10">
                  {isSubmitting ? "Publishing..." : "Release Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}