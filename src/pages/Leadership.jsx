import React, { useState, useEffect, useRef } from "react";
import { 
  getAllLeadership, 
  createLeadership, 
  updateLeadership, 
  deleteLeadership 
} from "../api/apiServices"; // Added missing imports
import { 
  UserPlus, Trash2, Edit3, Loader2, 
  Linkedin, Mail, User, Briefcase, 
  X, Save, Camera, Upload
} from "lucide-react";
import toast from "react-hot-toast";

export default function Leadership() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    email: "",
    linkedin: "",
    order: 1,
    image: null
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await getAllLeadership();
      setMembers(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        return toast.error("Please upload a valid image (JPG, PNG, or WebP)");
      }
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Image too large (Max 2MB)");
      }
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && !formData.image) {
      return toast.error("Please upload a profile image");
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(editingId ? "Updating profile..." : "Publishing profile...");

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("position", formData.position.trim());
      data.append("bio", formData.bio.trim());
      data.append("order", formData.order);
      
      if (formData.email) data.append("email", formData.email.trim());
      if (formData.linkedin) data.append("linkedin", formData.linkedin.trim());

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      // Now using the imported services which handle the headers correctly
      if (editingId) {
        await updateLeadership(editingId, data);
      } else {
        await createLeadership(data);
      }

      toast.success("Success!", { id: loadingToast });
      closeModal();
      fetchMembers();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Server error during upload";
      toast.error(typeof errMsg === 'object' ? "Cloudinary upload failed" : errMsg, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setFormData({
      name: member.name || "",
      position: member.position || "",
      bio: member.bio || "",
      email: member.email || "",
      linkedin: member.linkedin || "",
      order: member.order || 1,
      image: null 
    });
    setImagePreview(member.image); 
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leader?")) return;
    const delToast = toast.loading("Removing...");
    try {
      await deleteLeadership(id);
      toast.success("Member removed successfully", { id: delToast });
      fetchMembers();
    } catch (err) {
      toast.error("Delete failed", { id: delToast });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setImagePreview(null);
    setFormData({ name: "", position: "", bio: "", email: "", linkedin: "", order: 1, image: null });
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between mt-10 items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Corporate Leadership</h1>
          <p className="text-slate-500 font-medium mt-1">Manage executive profiles and hierarchy.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#3866A3] hover:bg-[#2d5284] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <UserPlus size={18} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3866A3]" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {members.map((member) => (
            <div key={member._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="p-7">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#3866A3] overflow-hidden border border-slate-100 shadow-inner">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="bg-slate-800 text-white text-[9px] font-black px-2 py-1 rounded-md mb-2 uppercase">
                      Rank: {member.order}
                    </span>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleEdit(member)} className="p-2 bg-slate-50 text-slate-400 hover:text-[#3866A3] hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(member._id)} className="p-2 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight line-clamp-1">{member.name}</h3>
                <p className="text-[#3866A3] font-bold text-xs mb-3 flex items-center gap-1.5 uppercase">
                  <Briefcase size={12} /> {member.position}
                </p>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-5 font-medium">{member.bio}</p>

                <div className="flex gap-3 pt-4 border-t border-slate-50">
                  {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-[#0077B5] transition-colors"><Linkedin size={16} /></a>}
                  {member.email && <a href={`mailto:${member.email}`} className="text-slate-300 hover:text-[#3866A3] transition-colors"><Mail size={16} /></a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {editingId ? "Edit Profile" : "New Leader"}
              </h2>
              <button onClick={closeModal} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                <div className="col-span-2 flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-2">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    <div className="w-16 h-16 rounded-xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                      {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <Camera className="text-slate-300" size={24} />}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <Upload className="text-white" size={16} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">Profile Photo</h4>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Max 2MB. JPG/PNG.</p>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Full Name *</label>
                  <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none font-bold text-slate-700 text-sm"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Position *</label>
                  <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none text-slate-700 text-sm"
                    value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Email</label>
                  <input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none text-slate-700 text-sm"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Rank Order</label>
                  <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none text-slate-700 text-sm"
                    value={formData.order} onChange={(e) => setFormData({...formData, order: e.target.value})} />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">LinkedIn URL</label>
                  <input type="url" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none text-slate-700 text-sm"
                    value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Biography *</label>
                  <textarea rows="3" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none resize-none leading-relaxed text-slate-600 text-sm"
                    value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={closeModal} className="flex-1 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl text-xs">Discard</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-[2] py-3 bg-[#3866A3] text-white font-bold rounded-xl hover:bg-[#2d5284] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 text-xs"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {editingId ? "Update Profile" : "Publish Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}