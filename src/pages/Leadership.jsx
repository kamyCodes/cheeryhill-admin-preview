import React, { useState, useEffect } from "react";
import { 
  getAllLeadership, createLeadership, 
  updateLeadership, deleteLeadership 
} from "../api/apiServices";
import { 
  UserPlus, Trash2, Edit3, Loader2, 
  Linkedin, Mail, User, Briefcase, 
  ArrowUpDown, X, Save
} from "lucide-react";
import toast from "react-hot-toast";

export default function Leadership() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    email: "",
    linkedin: "",
    order: 1,
    image: ""
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await getAllLeadership();
      // Sorting by order locally for better admin UX
      setMembers(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateLeadership(editingId, formData);
        toast.success("Profile updated successfully");
      } else {
        await createLeadership(formData);
        toast.success("New leader added to the team");
      }
      closeModal();
      fetchMembers();
    } catch (err) {
      toast.error("Operation failed. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio,
      email: member.email || "",
      linkedin: member.linkedin || "",
      order: member.order,
      image: member.image || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this leader from the platform?")) return;
    try {
      await deleteLeadership(id);
      toast.success("Member removed");
      fetchMembers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", position: "", bio: "", email: "", linkedin: "", order: 1, image: "" });
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between mt-10 items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Corporate Leadership</h1>
          <p className="text-slate-500 font-medium mt-1">Manage the executives and board members of CherryHills.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#3866A3] hover:bg-[#2d5284] text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-900/10"
        >
          <UserPlus size={20} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3866A3]" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {members.map((member) => (
            <div key={member._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-[#3866A3] overflow-hidden border border-slate-100">
                    {member.image ? (
                      <img src={member.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="bg-slate-800 text-white text-[10px] font-black px-3 py-1 rounded-full mb-2">
                      RANK: {member.order}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(member)} className="p-2 bg-slate-50 text-slate-400 hover:text-[#3866A3] rounded-lg transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(member._id)} className="p-2 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{member.name}</h3>
                <p className="text-[#3866A3] font-bold text-sm mb-4 flex items-center gap-2">
                  <Briefcase size={14} /> {member.position}
                </p>
                
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
                  {member.bio}
                </p>

                <div className="flex gap-3 pt-6 border-t border-slate-50">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-[#0077B5] transition-colors">
                      <Linkedin size={18} />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-slate-300 hover:text-[#3866A3] transition-colors">
                      <Mail size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">
              {editingId ? "Edit Profile" : "New Leader"}
            </h2>
            <p className="text-slate-500 font-medium mb-10">Define corporate identity and authority.</p>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Full Name</label>
                <input required className="w-full px-5 py-4 bg-slate-50 text-gray-500 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none font-bold"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Position</label>
                <input required className="w-full px-5 py-4 bg-slate-50 text-gray-500 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Email Address</label>
                <input type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 text-gray-500 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">LinkedIn URL</label>
                <input type="url" className="w-full px-5 py-4 bg-slate-50 text-gray-500 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Hierarchy Order (e.g., 1 for CEO)</label>
                <input type="number" className="w-full px-5 py-4 bg-slate-50 text-gray-500 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none"
                  value={formData.order} onChange={(e) => setFormData({...formData, order: e.target.value})} />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Executive Biography</label>
                <textarea rows="4" required className="w-full px-5 py-4 bg-slate-50 border text-gray-500 border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none resize-none leading-relaxed"
                  value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
              </div>

              <div className="col-span-2 flex gap-4 mt-6">
                <button type="button" onClick={closeModal} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all text-gray-500">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#3866A3] text-white font-bold rounded-2xl hover:bg-[#2d5284] transition-all flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {editingId ? "Update Profile" : "Save Leader"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}