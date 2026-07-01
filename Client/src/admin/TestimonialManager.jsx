import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { 
  RiUserStarLine, 
  RiChatQuoteLine, 
  RiLoader4Line, 
  RiDeleteBin6Line, 
  RiDoubleQuotesL,
  RiVerifiedBadgeFill,
  RiShieldUserLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiFeedbackLine
} from 'react-icons/ri';

const TestimonialManager = ({ isAdmin }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', workplace: '', comment: '' });

  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!avatar) return alert("Please upload a client photo.");
    
    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", avatar);
      data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST", body: data
      });
      const file = await res.json();

      await addDoc(collection(db, "testimonials"), {
        ...formData,
        avatarUrl: file.secure_url,
        createdAt: serverTimestamp()
      });

      setFormData({ name: '', workplace: '', comment: '' });
      setAvatar(null);
    } catch (err) { 
      alert("Deployment Error: " + err.message); 
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Remove this testimonial from public view?")) {
      await deleteDoc(doc(db, "testimonials", id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* WHITE FORM SECTION */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-gray-100 transition-colors">
        
        {/* HEADER WITH ACCESS STATUS */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isAdmin ? 'bg-black' : 'bg-gray-200'}`}>
              {isAdmin ? <RiShieldUserLine className="text-white text-2xl" /> : <RiLockPasswordLine className="text-gray-500 text-2xl" />}
            </div>
            <div>
              <h2 className="text-black text-xl font-black uppercase italic leading-none">Endorsements</h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                 {isAdmin ? "Verification Gateway" : "Verified Client Feedback"}
              </p>
            </div>
          </div>
          {!isAdmin && (
            <div className="flex items-center gap-1 text-[9px] font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 uppercase tracking-tighter">
              <RiEyeLine /> Preview Mode
            </div>
          )}
        </div>

        {isAdmin ? (
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Avatar Upload Column */}
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 relative group transition-colors hover:border-[#822cff]/30 h-full">
              {avatar ? (
                <img src={URL.createObjectURL(avatar)} className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white" alt="Avatar Preview" />
              ) : (
                <RiUserStarLine className="text-4xl text-gray-200" />
              )}
              <p className="text-[9px] font-black text-gray-400 mt-4 uppercase tracking-[0.2em] text-center">Upload Photo</p>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setAvatar(e.target.files[0])} />
            </div>

            {/* Fields Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-black font-bold outline-none focus:border-[#822cff] transition-all" placeholder="Client Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-black outline-none focus:border-[#822cff] transition-all text-sm" placeholder="Workplace / Role" value={formData.workplace} onChange={(e) => setFormData({...formData, workplace: e.target.value})} />
              </div>
              <textarea required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-black h-24 outline-none resize-none focus:border-[#822cff] transition-all text-sm" placeholder="Paste the feedback here..." value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} />
              <button disabled={loading} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-3 shadow-xl hover:bg-[#822cff] transition-all active:scale-95 disabled:opacity-50">
                {loading ? <RiLoader4Line className="animate-spin text-xl" /> : <><RiChatQuoteLine className="text-xl" /> PUBLISH TESTIMONIAL</>}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 p-8 rounded-[2rem] text-center">
            <RiFeedbackLine className="mx-auto text-3xl text-gray-300 mb-2" />
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Administrator login required to manage client reviews.</p>
          </div>
        )}
      </div>

      {/* FEED SECTION */}
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-600 mb-6 flex items-center gap-2">
          <RiVerifiedBadgeFill className="text-[#822cff]" /> Live Ledger
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] flex items-start justify-between group transition-all hover:border-[#822cff]/30">
              <div className="flex gap-5">
                <div className="relative shrink-0">
                  <img src={t.avatarUrl} className="w-14 h-14 rounded-2xl object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500 shadow-md" alt={t.name} />
                  <RiVerifiedBadgeFill className="absolute -bottom-1 -right-1 text-[#822cff] bg-white dark:bg-black rounded-full text-lg shadow-sm" />
                </div>
                <div className="flex-1">
                  <h4 className="text-black dark:text-white font-black text-sm tracking-tight leading-none">{t.name}</h4>
                  <p className="text-[#822cff] text-[9px] font-black uppercase tracking-widest mt-1 mb-3">{t.workplace}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed font-medium">
                    <RiDoubleQuotesL className="inline text-[#822cff] opacity-40 mr-1" />
                    {t.comment}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <button 
                  onClick={() => handleDelete(t.id)} 
                  className="p-3 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <p className="text-center py-10 text-gray-500 text-xs uppercase tracking-widest opacity-50">
            No verified testimonials found in the database.
          </p>
        )}
      </div>
    </div>
  );
};

export default TestimonialManager;