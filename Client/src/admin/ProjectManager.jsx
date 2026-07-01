import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { 
  RiImageAddLine, 
  RiSendPlaneLine, 
  RiLoader4Line, 
  RiDeleteBin6Line, 
  RiGithubFill, 
  RiExternalLinkLine,
  RiTerminalBoxLine,
  RiShieldFlashLine,
  RiStackFill,
  RiGlobalLine
} from 'react-icons/ri';

const ProjectManager = ({ isAdmin }) => {
  const [projects, setProjects] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tech: '',
    description: '',
    github: '',
    demo: ''
  });

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!image) return alert("Please select a project screenshot.");
    
    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST", body: data
      });
      const file = await res.json();

      await addDoc(collection(db, "projects"), {
        ...formData,
        tech: formData.tech.split(',').map(t => t.trim()),
        imageUrl: file.secure_url,
        createdAt: serverTimestamp()
      });

      setFormData({ title: '', tech: '', description: '', github: '', demo: '' });
      setImage(null);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Confirm deletion from production?")) {
      await deleteDoc(doc(db, "projects", id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      
      {/* 1. DEPLOYMENT TERMINAL (Admin Form) */}
      {isAdmin ? (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-100 transition-all">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-black rounded-2xl">
              <RiTerminalBoxLine className="text-white text-2xl" />
            </div>
            <div>
               <h2 className="text-black text-xl font-black uppercase italic leading-none">Deployment Terminal</h2>
               <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Initialize New Project Payload</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Upload Area */}
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Project Visual (.png/.jpg)</label>
               <div className="aspect-video rounded-[2rem] border-4 border-dashed border-gray-50 bg-gray-50/50 flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:border-[#822cff]/30">
                {image ? (
                  <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center">
                    <RiImageAddLine className="text-5xl text-gray-200 mx-auto mb-2" />
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Drag screenshot here</p>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setImage(e.target.files[0])} />
              </div>
            </div>

            {/* Input Fields Area */}
            <div className="space-y-4">
              <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-[#822cff] p-4 rounded-2xl outline-none text-black font-bold text-sm transition-all" placeholder="Project Designation (Title)" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-[#822cff] p-4 rounded-2xl outline-none text-black text-sm transition-all" placeholder="Stack (React, Node, etc.)" value={formData.tech} onChange={(e) => setFormData({...formData, tech: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <RiGithubFill className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="w-full bg-gray-50 p-4 pl-10 rounded-2xl outline-none text-black text-[11px] font-bold" placeholder="Source URL" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} />
                </div>
                <div className="relative">
                    <RiGlobalLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="w-full bg-gray-50 p-4 pl-10 rounded-2xl outline-none text-black text-[11px] font-bold" placeholder="Live URL" value={formData.demo} onChange={(e) => setFormData({...formData, demo: e.target.value})} />
                </div>
              </div>

              <textarea required className="w-full bg-gray-50 border-2 border-transparent focus:border-[#822cff] p-4 rounded-2xl outline-none text-black h-28 resize-none text-sm leading-relaxed transition-all" placeholder="Project Technical Overview..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              
              <button disabled={loading} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#822cff] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50">
                {loading ? <RiLoader4Line className="animate-spin text-xl" /> : <><RiSendPlaneLine className="text-xl" /> Push to Production</>}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* PUBLIC NOTICE */
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-gray-50 rounded-xl">
             <RiShieldFlashLine className="text-[#822cff] text-2xl" />
          </div>
          <div>
            <h4 className="text-black text-[11px] font-black uppercase tracking-[0.1em]">Public Explorer Mode</h4>
            <p className="text-gray-400 text-[10px] font-medium tracking-tight">You are currently viewing the live project database in read-only mode.</p>
          </div>
        </div>
      )}

      {/* 2. DATABASE EXPLORER (Project List) */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#822cff]/5 blur-[100px] -z-10"></div>
        
        <div className="flex items-center justify-between mb-10">
            <h3 className="text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Production Environment ({projects.length} Nodes)
            </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white/[0.03] border border-white/5 p-5 rounded-[2rem] flex items-center justify-between group transition-all hover:bg-white/[0.06] hover:border-white/10 hover:translate-y-[-2px]">
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <img src={p.imageUrl} className="w-16 h-16 rounded-2xl object-cover grayscale-[0.6] group-hover:grayscale-0 transition-all duration-500 shadow-lg" alt={p.title} />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"></div>
                </div>
                <div>
                  <h4 className="text-white font-black text-sm tracking-tight">{p.title}</h4>
                  <p className="text-gray-500 text-[10px] font-bold mt-0.5 line-clamp-1">{p.tech.join(' • ')}</p>
                  <div className="flex gap-3 mt-2">
                    {p.github && <RiGithubFill className="text-gray-500 hover:text-[#822cff] cursor-pointer transition-colors" size={16} />}
                    {p.demo && <RiExternalLinkLine className="text-gray-500 hover:text-green-400 cursor-pointer transition-colors" size={16} />}
                  </div>
                </div>
              </div>

              {isAdmin && (
                <button 
                  onClick={() => handleDelete(p.id)} 
                  className="p-4 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;