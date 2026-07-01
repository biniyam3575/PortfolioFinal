import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query } from 'firebase/firestore';
import { 
  RiCodeSSlashLine, 
  RiAddLine, 
  RiDeleteBinLine, 
  RiLoader5Line, 
  RiHashtag,
  RiCompass3Line,
  RiLockPasswordLine,
  RiShieldUserLine,
  RiEyeLine,
  RiTerminalWindowLine,
  RiStackLine
} from 'react-icons/ri';

const SkillManager = ({ isAdmin }) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', icon: '', routeName: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "skills"), (snapshot) => {
      setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!newSkill.name || !newSkill.icon) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, "skills"), newSkill);
      setNewSkill({ name: '', icon: '', routeName: '' });
    } catch (err) { 
      console.error("Database Error:", err); 
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if(window.confirm("Purge this skill from the inventory?")) {
      await deleteDoc(doc(db, "skills", id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* WHITE FORM SECTION (Consistent with Timeline/Value) */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-gray-100 transition-colors">
        
        {/* HEADER WITH ACCESS STATUS */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isAdmin ? 'bg-black' : 'bg-gray-200'}`}>
              {isAdmin ? <RiShieldUserLine className="text-white text-2xl" /> : <RiLockPasswordLine className="text-gray-500 text-2xl" />}
            </div>
            <div>
              <h2 className="text-black text-xl font-black uppercase italic leading-none">Architecture</h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                 {isAdmin ? "Inventory Control" : "Public Technical Registry"}
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
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Skill Name</label>
                <div className="relative">
                  <RiHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input 
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 pl-10 text-black font-bold outline-none focus:border-[#822cff] transition-all"
                    placeholder="e.g. React.js"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Route / Category</label>
                <div className="relative">
                  <RiCompass3Line className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input 
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 pl-10 text-black font-bold outline-none focus:border-[#822cff] transition-all"
                    placeholder="e.g. /frontend"
                    value={newSkill.routeName}
                    onChange={(e) => setNewSkill({...newSkill, routeName: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Icon Image URL</label>
              <div className="relative">
                <RiTerminalWindowLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 pl-10 text-black font-bold outline-none focus:border-[#822cff] transition-all"
                  placeholder="Paste URL to SVG or PNG icon"
                  value={newSkill.icon}
                  onChange={(e) => setNewSkill({...newSkill, icon: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-[#822cff] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? <RiLoader5Line className="animate-spin text-xl" /> : <RiAddLine className="text-xl" />} 
              DEPLOY NEW UNIT
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 p-8 rounded-[2rem] text-center">
            <RiCodeSSlashLine className="mx-auto text-3xl text-gray-300 mb-2" />
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Login as admin to modify the tech stack.</p>
          </div>
        )}
      </div>

      {/* SKILL GRID SECTION */}
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-600 mb-6 flex items-center gap-2">
          <RiStackLine /> Active Competencies
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skills.map(skill => (
            <div key={skill.id} className="group relative flex flex-col items-center p-6 bg-white dark:bg-white/[0.02] rounded-[2.5rem] border border-gray-100 dark:border-white/5 hover:border-[#822cff]/30 transition-all duration-500">
              <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-2xl group-hover:bg-white transition-colors duration-500">
                <img 
                  src={skill.icon} 
                  alt={skill.name} 
                  referrerPolicy="no-referrer" 
                  className="w-10 h-10 object-contain grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" 
                />
              </div>
              
              <span className="text-black dark:text-white font-black text-[11px] uppercase tracking-tighter text-center">{skill.name}</span>
              <span className="text-[#822cff] text-[8px] font-black uppercase mt-1 px-2 py-0.5 bg-[#822cff]/5 rounded-full opacity-60 group-hover:opacity-100 transition-all">
                {skill.routeName || 'Global'}
              </span>

              {isAdmin && (
                <button 
                  onClick={() => handleDelete(skill.id)} 
                  className="absolute -top-2 -right-2 bg-black text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 shadow-xl"
                >
                  <RiDeleteBinLine size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER METRIC */}
        <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-gray-400 dark:text-gray-600 text-[9px] font-bold uppercase tracking-[0.2em]">
          <span>Inventory: {skills.length} Units</span>
          <span className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-[#822cff] rounded-full animate-pulse"></span>
             Cloud Sync Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default SkillManager;