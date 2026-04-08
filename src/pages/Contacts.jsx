import React, { useState, useEffect } from "react";
import { 
  getAllContacts, getUnreadCount, markAsRead, 
  replyToContact, deleteContact 
} from "../api/apiServices";
import { 
  Mail, MailOpen, Send, Trash2, Loader2, 
  User, Calendar, MessageSquare, CheckCircle, Clock
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
      setInquiries(list);
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
    if (!inquiry.isRead) {
      try {
        await markAsRead(inquiry._id);
        fetchData(); // Refresh list to update unread badges
      } catch (err) {
        console.error("Status update failed");
      }
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await replyToContact(selectedInquiry._id, replyData);
      toast.success("Reply sent to " + selectedInquiry.email);
      setReplyMode(false);
      setReplyData({ subject: "Regarding your inquiry", message: "" });
      fetchData();
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    try {
      await deleteContact(id);
      toast.success("Inquiry removed");
      setSelectedInquiry(null);
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between mt-10 items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Communications</h1>
          <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1 bg-blue-100 text-[#3866A3] px-2 py-0.5 rounded-lg text-xs font-black">
              {unreadCount} UNREAD
            </span>
            Manage potential investor inquiries.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3866A3]" size={40} /></div>
      ) : (
        <div className="grid grid-cols-12 gap-8 h-[calc(100vh-250px)]">
          
          {/* List View */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 bg-slate-50/30 font-black text-[10px] tracking-widest text-slate-400 uppercase">
              Recent Messages
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {inquiries.map((item) => (
                <div 
                  key={item._id}
                  onClick={() => handleSelect(item)}
                  className={`p-6 border-b border-slate-50 cursor-pointer transition-all flex items-start gap-4 hover:bg-slate-50 ${
                    selectedInquiry?._id === item._id ? 'bg-blue-50/50 border-r-4 border-r-[#3866A3]' : ''
                  }`}
                >
                  <div className={`mt-1 p-2.5 rounded-xl ${item.isRead ? 'bg-slate-100 text-slate-400' : 'bg-[#3866A3]/10 text-[#3866A3]'}`}>
                    {item.isRead ? <MailOpen size={18} /> : <Mail size={18} />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`text-sm font-black truncate ${item.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                        {item.name || item.email}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate font-medium">{item.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail View */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col relative">
            {selectedInquiry ? (
              <div className="p-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#3866A3]">
                      <User size={28} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{selectedInquiry.name}</h2>
                      <p className="text-sm font-bold text-[#3866A3]">{selectedInquiry.email}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(selectedInquiry._id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-8 mb-8 flex-1 overflow-y-auto">
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                     <Clock size={12} /> Received on {new Date(selectedInquiry.createdAt).toLocaleString()}
                   </div>
                   <p className="text-slate-700 leading-relaxed font-medium">
                     {selectedInquiry.message}
                   </p>
                </div>

                {!replyMode ? (
                  <button 
                    onClick={() => setReplyMode(true)}
                    className="w-full py-5 bg-[#3866A3] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-[#2d5284] transition-all shadow-lg"
                  >
                    <Send size={20} /> Reply to Inquiry
                  </button>
                ) : (
                  <form onSubmit={handleReply} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <input 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none font-bold"
                      value={replyData.subject}
                      onChange={(e) => setReplyData({...replyData, subject: e.target.value})}
                      placeholder="Subject"
                    />
                    <textarea 
                      rows="4"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#3866A3] outline-none resize-none"
                      value={replyData.message}
                      onChange={(e) => setReplyData({...replyData, message: e.target.value})}
                      placeholder="Type your response here..."
                    />
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setReplyMode(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancel</button>
                      <button type="submit" disabled={isSending} className="flex-1 py-4 bg-[#3866A3] text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                        {isSending ? <Loader2 className="animate-spin" /> : <><CheckCircle size={18} /> Send Message</>}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                <MessageSquare size={64} className="opacity-20" />
                <p className="font-black uppercase tracking-widest text-xs">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}