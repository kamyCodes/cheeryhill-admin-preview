import React, { useState, useEffect } from "react";
import { 
  getAllContacts, getUnreadCount, markAsRead, 
  replyToContact, deleteContact 
} from "../api/apiServices";
import { 
  Mail, MailOpen, Send, Trash2, Loader2, 
  User, Calendar, MessageSquare, CheckCircle, Clock, X
} from "lucide-react";
import toast from "react-hot-toast";

export default function Contacts() {
  const [inquiries, setInquiries] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMode, setReplyMode] = useState(false);
  const [replyData, setReplyData] = useState({ subject: "Regarding your inquiry", message: "" });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [list, count] = await Promise.all([getAllContacts(), getUnreadCount()]);
      // Sort by newest first
      setInquiries(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setUnreadCount(count);
    } catch (err) {
      toast.error("Failed to sync inbox");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (inquiry) => {
    setSelectedInquiry(inquiry);
    setReplyMode(false);
    setReplyData({ ...replyData, subject: `RE: ${inquiry.subject || 'Your Inquiry'}` });
    
    if (!inquiry.isRead) {
      try {
        await markAsRead(inquiry._id);
        // Optimistic UI update to avoid full re-fetch
        setInquiries(prev => prev.map(item => 
          item._id === inquiry._id ? { ...item, isRead: true } : item
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Status update failed");
      }
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyData.message.trim()) return toast.error("Please enter a response");
    
    setIsSending(true);
    const loadToast = toast.loading("Sending response...");
    try {
      await replyToContact(selectedInquiry._id, replyData);
      toast.success("Reply sent to " + selectedInquiry.email, { id: loadToast });
      setReplyMode(false);
      setReplyData({ subject: "Regarding your inquiry", message: "" });
      fetchData();
    } catch (err) {
      toast.error("Failed to send message", { id: loadToast });
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanentally delete this inquiry?")) return;
    const delToast = toast.loading("Deleting...");
    try {
      await deleteContact(id);
      toast.success("Inquiry removed", { id: delToast });
      setSelectedInquiry(null);
      fetchData();
    } catch (err) {
      toast.error("Delete failed", { id: delToast });
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between mt-10 items-center mb-10 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase leading-none">Inbox</h1>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
            <span className="bg-[#3866A3] text-white px-2 py-0.5 rounded text-[10px] font-black">
              {unreadCount} NEW
            </span>
            Communication management portal
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3866A3]" size={40} /></div>
      ) : (
        <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto h-[70vh]">
          
          {/* Sidebar List */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <span className="font-black text-[10px] tracking-widest text-slate-400 uppercase">Incoming</span>
              <MessageSquare size={14} className="text-slate-300" />
            </div>
            <div className="overflow-y-auto flex-1">
              {inquiries.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs font-bold uppercase">No messages yet</div>
              ) : (
                inquiries.map((item) => (
                  <div 
                    key={item._id}
                    onClick={() => handleSelect(item)}
                    className={`p-5 border-b border-slate-50 cursor-pointer transition-all flex items-start gap-3 hover:bg-slate-50 relative ${
                      selectedInquiry?._id === item._id ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {!item.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#3866A3] rounded-full shadow-[0_0_8px_#3866A3]" />}
                    <div className={`mt-1 p-2 rounded-lg shrink-0 ${item.isRead ? 'bg-slate-100 text-slate-400' : 'bg-[#3866A3]/10 text-[#3866A3]'}`}>
                      {item.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4 className={`text-xs font-black truncate ${item.isRead ? 'text-slate-500' : 'text-slate-900'}`}>
                          {item.name || "Anonymous"}
                        </h4>
                        <span className="text-[9px] font-bold text-slate-400 shrink-0">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate font-medium">{item.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Moderate Detail View */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
            {selectedInquiry ? (
              <div className="flex flex-col h-full">
                {/* Detail Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3866A3]/10 rounded-xl flex items-center justify-center text-[#3866A3]">
                      <User size={20} />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none">{selectedInquiry.name}</h2>
                      <p className="text-[11px] font-bold text-[#3866A3]">{selectedInquiry.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(selectedInquiry._id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-8 flex-1 overflow-y-auto bg-slate-50/30">
                  <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      <Clock size={12} /> Received: {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 text-slate-700 text-sm leading-relaxed shadow-sm">
                      {selectedInquiry.message}
                    </div>
                  </div>
                </div>

                {/* Reply Section */}
                <div className="p-6 border-t border-slate-100 bg-white">
                  {!replyMode ? (
                    <button 
                      onClick={() => setReplyMode(true)}
                      className="group w-full py-4 border-2 border-dashed border-slate-200 hover:border-[#3866A3] hover:bg-blue-50/30 rounded-2xl flex items-center justify-center gap-3 transition-all text-slate-400 hover:text-[#3866A3] font-bold text-sm"
                    >
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                      Write a response...
                    </button>
                  ) : (
                    <form onSubmit={handleReply} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Compose Reply</span>
                        <button type="button" onClick={() => setReplyMode(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                      </div>
                      <input 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none font-bold text-sm"
                        value={replyData.subject}
                        onChange={(e) => setReplyData({...replyData, subject: e.target.value})}
                        placeholder="Subject"
                      />
                      <textarea 
                        rows="3"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3866A3] outline-none resize-none text-sm"
                        value={replyData.message}
                        onChange={(e) => setReplyData({...replyData, message: e.target.value})}
                        placeholder="Type your official response..."
                      />
                      <div className="flex gap-3">
                        <button type="submit" disabled={isSending} className="flex-1 py-3 bg-[#3866A3] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 text-xs uppercase tracking-widest">
                          {isSending ? <Loader2 className="animate-spin" size={14} /> : <><CheckCircle size={14} /> Send Reply</>}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 bg-slate-50/20">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <MessageSquare size={32} className="opacity-20" />
                </div>
                <p className="font-black uppercase tracking-widest text-[10px]">Select an inquiry to view</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}