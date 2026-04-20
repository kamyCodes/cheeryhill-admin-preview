import React, { useState, useEffect } from "react";
import { getAllAwards, createAward, updateAward, deleteAward } from "../api/apiServices";
import { 
  Trophy, Plus, Trash2, Edit3, Loader2, 
  Award, Calendar, X, Save, ShieldCheck 
} from "lucide-react";
import toast from "react-hot-toast";

export default function Awards() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    awardingBody: "",
    year: new Date().getFullYear(),
    description: "",
    image: "",
    order: 1
  });

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const data = await getAllAwards();
      setAwards(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      toast.error("Failed to load awards");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        // PUT REQ: title, year, image as per your endpoint spec
        await updateAward(editingId, {
          title: formData.title,
          year: formData.year,
          image: formData.image
        });
        toast.success("Award updated");
      } else {
        await createAward(formData);
        toast.success("Award created");
      }
      closeModal();
      fetchAwards();
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (award) => {
    setEditingId(award._id);
    setFormData({
      title: award.title,
      awardingBody: award.awardingBody,
      year: award.year,
      description: award.description,
      image: award.image || "",
      order: award.order
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this award record?")) return;
    try {
      await deleteAward(id);
      toast.success("Award removed");
      fetchAwards();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: "", awardingBody: "", year: new Date().getFullYear(), description: "", image: "", order: 1 });
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between mt-10 items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Recognition</h1>
          <p className="text-slate-500 font-medium mt-1">Manage corporate honors and industry milestones.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#3866A3] hover:bg-[#2d5284] text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg"
        >
          <Plus size={20} /> Add Award
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3866A3]" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((item) => (
            <div key={item._id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 group hover:shadow-xl hover:shadow-blue-900/5 transition-all relative">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#3866A3]">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-10 h-10 object-contain" />
                  ) : (
                    <Trophy size={32} />
                  )}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(item)} className="p-2 bg-slate-50 text-slate-400 hover:text-[#3866A3] rounded-lg">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <span className="bg-blue-50 text-[#3866A3] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {item.year}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-slate-800 leading-tight mb-2 uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="text-[#3866A3] font-bold text-xs mb-4 flex items-center gap-1">
                <ShieldCheck size={14} /> {item.awardingBody}
              </p>
              <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Award Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl relative">
            <button onClick={closeModal} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600"><X /></button>
            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase">
              {editingId ? "Update Award" : "New Achievement"}
            </h2>
            <p className="text-slate-500 font-medium mb-8">Maintain the platform's public trophy room.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Award Title</label>
                <input required className="w-full px-5 py-4 bg-slate-50 text-gray-500 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none font-bold text-slate-800"
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Best Investment Bank 2024" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Awarding Body</label>
                  <input required={!editingId} className="w-full text-gray-500 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                    value={formData.awardingBody} onChange={(e) => setFormData({...formData, awardingBody: e.target.value})} 
                    placeholder="e.g. Global Finance Magazine" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Year</label>
                  <input type="number" className="w-full px-5 py-4 bg-slate-50 border text-gray-500 border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none font-bold"
                    value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Logo URL (Optional)</label>
                <input className="w-full px-5 py-4 bg-slate-50 border text-gray-500 border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} 
                  placeholder="https://image-link.com/logo.png" />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 ml-1">Brief Description</label>
                <textarea rows="3" required={!editingId} className="w-full px-5 py-4 bg-slate-50 text-gray-500 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none resize-none"
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Describe the significance of this award..." />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Discard</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#3866A3] text-white font-bold rounded-2xl hover:bg-[#2d5284] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {editingId ? "Update Award" : "Save Achievement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}