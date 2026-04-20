import React, { useState, useEffect } from "react";
import { getAdmins, createAdmin, toggleAdminStatus } from "../api/apiServices";
import { Plus, UserCheck, UserMinus, Mail, Shield, MoreVertical, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminMnagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "admin" });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (err) {
      toast.error("Failed to load administrators");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleAdminStatus(id);
      toast.success("Status updated");
      fetchAdmins(); // Refresh list
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createAdmin(formData);
      toast.success("Admin created successfully");
      setShowModal(false);
      setFormData({ name: "", email: "", password: "", role: "admin" });
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between mt-10 items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">ADMIN SERVICES</h1>
          <p className="text-slate-500 text-sm font-medium">Manage personnel access and permissions</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#3866A3] hover:bg-[#2d5284] text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
        >
          <Plus size={18} /> Add New Admin
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-[#3866A3]" size={40} />
            <p className="text-slate-400 font-medium">Fetching admin records...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Administrator</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3866A3]/10 flex items-center justify-center text-[#3866A3] font-bold">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{admin.name}</p>
                        <p className="text-xs text-slate-500">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      <Shield size={12} /> {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`flex items-center gap-2 font-bold text-xs ${admin.isActive ? 'text-green-500' : 'text-slate-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${admin.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                      {admin.isActive ? "ACTIVE" : "INACTIVE"}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => handleToggleStatus(admin._id)}
                      className={`p-2 rounded-lg transition-all ${admin.isActive ? 'text-rose-500 hover:bg-rose-50' : 'text-green-500 hover:bg-green-50'}`}
                      title={admin.isActive ? "Deactivate" : "Activate"}
                    >
                      {admin.isActive ? <UserMinus size={20} /> : <UserCheck size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">New Admin</h2>
            <p className="text-slate-500 text-sm mb-8">Grant system access to new personnel.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-5 py-4 bg-slate-50 text-gray-500 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3866A3]/10 focus:border-[#3866A3] transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-5 py-4 bg-slate-50 border text-gray-500 border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3866A3]/10 focus:border-[#3866A3] transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@cherryhills.com"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full px-5 py-4 bg-slate-50 text-gray-500 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3866A3]/10 focus:border-[#3866A3] transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-[#3866A3] text-white font-bold rounded-2xl hover:bg-[#2d5284] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}