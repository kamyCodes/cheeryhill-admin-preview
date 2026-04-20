import React, { useState, useEffect } from "react";
import { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } from "../api/apiServices";
import { 
  HelpCircle, Plus, Trash2, Edit3, 
  Loader2, ChevronDown, ChevronUp, X
} from "lucide-react";
import toast from "react-hot-toast";

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null); // Track if we are editing

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "Investment",
    order: 1
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const data = await getAllFAQs();
      setFaqs(data);
    } catch (err) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE FIX: Ensure stopPropagation is used ---
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevents accordion from toggling
    if (!window.confirm("Permanently remove this FAQ?")) return;
    try {
      await deleteFAQ(id);
      toast.success("FAQ deleted");
      fetchFaqs();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // --- EDIT FIX: Populate form and set editingId ---
  const handleEdit = (e, faq) => {
    e.stopPropagation(); // Prevents accordion from toggling
    setEditingId(faq._id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order
    });
    setShowModal(true);
  };

  // --- SUBMIT FIX: Handle both Create and Update ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateFAQ(editingId, formData);
        toast.success("FAQ updated successfully");
      } else {
        await createFAQ(formData);
        toast.success("FAQ created successfully");
      }
      closeModal();
      fetchFaqs();
    } catch (err) {
      toast.error(editingId ? "Update failed" : "Creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ question: "", answer: "", category: "Investment", order: 1 });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-10 mt-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Support Library</h1>
          <p className="text-slate-500 font-medium mt-1">Manage platform FAQs.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#3866A3] hover:bg-[#2d5284] text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg"
        >
          <Plus size={20} /> New Question
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3866A3]" size={40} /></div>
      ) : (
        <div className="max-w-4xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div 
                onClick={() => toggleExpand(faq._id)}
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#3866A3]/10 text-[#3866A3] rounded-xl"><HelpCircle size={20} /></div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{faq.category} • Order {faq.order}</span>
                    <h3 className="font-bold text-slate-800">{faq.question}</h3>
                  </div>
                </div>
                {expandedId === faq._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>

              {expandedId === faq._id && (
                <div className="px-6 pb-6 pt-2 ml-14">
                  <p className="text-slate-500 text-sm mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">{faq.answer}</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={(e) => handleEdit(e, faq)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-200 transition-all uppercase"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, faq._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-500 rounded-xl text-xs font-black hover:bg-rose-100 transition-all uppercase"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal - Dynamic for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl relative">
            <button onClick={closeModal} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600"><X /></button>
            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase">{editingId ? "Update FAQ" : "Add FAQ"}</h2>
            <p className="text-slate-500 font-medium mb-8">Maintain investor clarity.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Category</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border text-gray-500 rounded-2xl outline-none font-bold text-sm"
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="General">General</option>
                    <option value="Investment">Investment</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Order</label>
                  <input type="number" className="w-full text-gray-500 px-5 py-4 bg-slate-50 border rounded-2xl outline-none"
                    value={formData.order} onChange={(e) => setFormData({...formData, order: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Question</label>
                <input required className="w-full px-5 py-4 bg-slate-50 text-gray-500 border rounded-2xl outline-none font-bold"
                  value={formData.question} onChange={(e) => setFormData({...formData, question: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Answer</label>
                <textarea rows="4" required className="w-full text-gray-500 px-5 py-4 bg-slate-50 border rounded-2xl outline-none resize-none"
                  value={formData.answer} onChange={(e) => setFormData({...formData, answer: e.target.value})} />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-4 bg-slate-100 font-bold rounded-2xl text-gray-500">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#3866A3] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/10">
                  {isSubmitting ? "Saving..." : editingId ? "Update FAQ" : "Add FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}