import React, { useState, useEffect } from "react";
import { 
  getAllTestimonials, 
  createTestimonial, 
  approveTestimonial, 
  deleteTestimonial,
  updateTestimonial // Now using the function from your apiServices
} from "../api/apiServices";
import { 
  Star, Quote, CheckCircle2, Trash2, Plus, Loader2, 
  User, Building2, AlertCircle, Pencil 
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- NEW STATE FOR EDITING ---
  const [editingId, setEditingId] = useState(null); 

  const [formData, setFormData] = useState({
    clientName: "",
    clientCompany: "",
    feedback: "",
    rating: 5,
    image: ""
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await getAllTestimonials();
      setTestimonials(data);
    } catch (err) {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: PREPARE EDIT ---
  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      clientName: item.clientName,
      clientCompany: item.clientCompany,
      feedback: item.feedback,
      rating: item.rating,
      image: item.image || ""
    });
    setShowModal(true);
  };

  // --- HANDLER: CLOSE MODAL ---
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ clientName: "", clientCompany: "", feedback: "", rating: 5, image: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        // CALL UPDATE API
        await updateTestimonial(editingId, formData);
        toast.success("Testimonial updated successfully");
      } else {
        // CALL CREATE API
        await createTestimonial(formData);
        toast.success("Testimonial added to queue");
      }
      handleCloseModal();
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (handleApprove and handleDelete remain the same)
  const handleApprove = async (id) => {
    try {
      await approveTestimonial(id);
      toast.success("Testimonial approved");
      fetchTestimonials();
    } catch (err) { toast.error("Approval failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback forever?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial removed");
      fetchTestimonials();
    } catch (err) { toast.error("Delete failed"); }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between mt-10 items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Client Feedback</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and approve social proof for CherryHills.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#3866A3] hover:bg-[#2d5284] text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg"
        >
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#3866A3] mb-4" size={40} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Reviews...</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((item) => (
            <div key={item._id} className="break-inside-avoid bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
              <div className={`absolute top-6 right-6 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${
                item.isApproved ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {item.isApproved ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {item.isApproved ? "PUBLISHED" : "PENDING"}
              </div>

              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < item.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                  ))}
                </div>

                <p className="text-slate-700 italic leading-relaxed mb-8 font-medium">"{item.feedback}"</p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                    {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-2xl" /> : <User size={24} />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">{item.clientName}</h4>
                    <p className="text-xs text-slate-400 font-bold flex items-center gap-1"><Building2 size={10} /> {item.clientCompany}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center">
                  {!item.isApproved && (
                    <button onClick={() => handleApprove(item._id)} className="text-[11px] font-black text-[#3866A3] hover:underline uppercase tracking-widest mr-4">
                      Approve Review
                    </button>
                  )}
                  
                  {/* EDIT BUTTON */}
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-2 text-slate-300 hover:text-[#3866A3] transition-colors"
                  >
                    <Pencil size={18} />
                  </button>

                  <button onClick={() => handleDelete(item._id)} className="ml-auto p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">
              {editingId ? "Edit Testimonial" : "New Testimonial"}
            </h2>
            <p className="text-slate-500 font-medium mb-8">Update client feedback details below.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Client Name</label>
                  <input required type="text" className="w-full text-gray-500 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                    value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Company</label>
                  <input type="text" className="w-full px-5 py-4 text-gray-500 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                    value={formData.clientCompany} onChange={(e) => setFormData({...formData, clientCompany: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Star Rating (1-5)</label>
                <input type="number" min="1" max="5" className="w-full text-gray-500 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.rating} onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})} />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Client Feedback</label>
                <textarea rows="4" required className="w-full text-gray-500 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none resize-none"
                  value={formData.feedback} onChange={(e) => setFormData({...formData, feedback: e.target.value})} />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#3866A3] text-white font-bold rounded-2xl hover:bg-[#2d5284] transition-all shadow-lg shadow-blue-900/10">
                  {isSubmitting ? "Saving..." : (editingId ? "Save Changes" : "Add to Queue")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}