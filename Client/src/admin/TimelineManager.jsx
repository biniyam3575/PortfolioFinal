import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { 
  RiHistoryLine, 
  RiAddLine, 
  RiDeleteBinLine, 
  RiShieldUserLine, 
  RiLockPasswordLine,
  RiEyeLine 
} from 'react-icons/ri';

const TimelineManager = ({ isAdmin }) => {
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState({ year: '', title: '', description: '' });

  useEffect(() => {
    const q = query(collection(db, "timeline"), orderBy("year", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMilestones(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    await addDoc(collection(db, "timeline"), {
      ...newMilestone,
      year: parseInt(newMilestone.year)
    });
    setNewMilestone({ year: '', title: '', description: '' });
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Delete this milestone?")) {
      await deleteDoc(doc(db, "timeline", id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* WHITE FORM SECTION (Consistent with ProfileManager) */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-gray-100 transition-colors">
        
        {/* HEADER WITH ACCESS STATUS */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isAdmin ? 'bg-black' : 'bg-gray-200'}`}>
              {isAdmin ? <RiShieldUserLine className="text-white text-2xl" /> : <RiLockPasswordLine className="text-gray-500 text-2xl" />}
            </div>
            <div>
              <h2 className="text-black text-xl font-black uppercase italic leading-none">Chronology</h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                 {isAdmin ? "Verified Administrator" : "Public Read-Only Access"}
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
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Event Year</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 2023"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-black font-bold outline-none focus:border-[#822cff] transition-all"
                  value={newMilestone.year}
                  onChange={(e) => setNewMilestone({...newMilestone, year: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Milestone Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Completed Degree"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-black font-bold outline-none focus:border-[#822cff] transition-all"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Description</label>
              <textarea 
                placeholder="What happened during this time?"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-black outline-none focus:border-[#822cff] h-24 transition-all"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
              />
            </div>
            <button className="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-[#822cff] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
              <RiAddLine className="text-xl" /> ADD TO TIMELINE
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 p-8 rounded-[2rem] text-center">
            <RiHistoryLine className="mx-auto text-3xl text-gray-300 mb-2" />
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Login as administrator to add new milestones.</p>
          </div>
        )}
      </div>

      {/* LIST SECTION (Transparent / Dark compatible) */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-600 mb-6 flex items-center gap-2">
          <RiHistoryLine /> Active Records
        </h3>
        <div className="grid gap-4">
          {milestones.map((m) => (
            <div key={m.id} className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6 rounded-[1.5rem] flex justify-between items-center transition-all hover:border-[#822cff]/30">
              <div className="flex gap-6 items-center">
                <div className="text-2xl font-black italic text-[#822cff] opacity-80">{m.year}</div>
                <div className="h-10 w-px bg-gray-100 dark:bg-white/5"></div>
                <div>
                  <h4 className="text-sm font-black uppercase text-black dark:text-white tracking-tight">{m.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{m.description}</p>
                </div>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(m.id)} 
                  className="p-3 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <RiDeleteBinLine size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineManager;