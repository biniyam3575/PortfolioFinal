import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query } from 'firebase/firestore';
import { 
  RiHandCoinLine, 
  RiAddLine, 
  RiDeleteBinLine,
  RiShieldUserLine, 
  RiLockPasswordLine,
  RiEyeLine,
  RiServiceLine
} from 'react-icons/ri';

const ValueManager = ({ isAdmin }) => {
  const [values, setValues] = useState([]);
  const [newValue, setNewValue] = useState({ title: '', desc: '' });

  useEffect(() => {
    const q = query(collection(db, "values"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setValues(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    await addDoc(collection(db, "values"), newValue);
    setNewValue({ title: '', desc: '' });
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Remove this value proposition?")) {
      await deleteDoc(doc(db, "values", id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* WHITE FORM SECTION (Consistent with Profile/Timeline) */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-gray-100 transition-colors">
        
        {/* HEADER WITH ACCESS STATUS */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isAdmin ? 'bg-black' : 'bg-gray-200'}`}>
              {isAdmin ? <RiShieldUserLine className="text-white text-2xl" /> : <RiLockPasswordLine className="text-gray-500 text-2xl" />}
            </div>
            <div>
              <h2 className="text-black text-xl font-black uppercase italic leading-none">Value Props</h2>
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
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Value Title</label>
              <input 
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-black font-bold outline-none focus:border-[#822cff] transition-all"
                placeholder="e.g. Rapid Turnaround"
                value={newValue.title}
                onChange={(e) => setNewValue({...newValue, title: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Description</label>
              <textarea 
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-black outline-none focus:border-[#822cff] h-24 transition-all"
                placeholder="Briefly explain the benefit provided..."
                value={newValue.desc}
                onChange={(e) => setNewValue({...newValue, desc: e.target.value})}
              />
            </div>
            <button className="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-[#822cff] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
              <RiAddLine className="text-xl" /> ADD VALUE ITEM
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 p-8 rounded-[2rem] text-center">
            <RiHandCoinLine className="mx-auto text-3xl text-gray-300 mb-2" />
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Administrator login required to edit values.</p>
          </div>
        )}
      </div>

      {/* LIST SECTION */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-600 mb-6 flex items-center gap-2">
          <RiServiceLine /> Active Propositions
        </h3>
        <div className="grid gap-4">
          {values.map((v) => (
            <div key={v.id} className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6 rounded-[1.5rem] flex justify-between items-center transition-all hover:border-[#822cff]/30">
              <div className="flex gap-6 items-center">
                <div className="p-3 bg-[#822cff]/10 rounded-xl">
                  <RiHandCoinLine className="text-[#822cff] text-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase text-black dark:text-white tracking-tight">{v.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{v.desc}</p>
                </div>
              </div>
              
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(v.id)} 
                  className="p-3 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <RiDeleteBinLine size={20} />
                </button>
              )}
            </div>
          ))}
          
          {values.length === 0 && (
            <p className="text-center py-10 text-gray-500 text-xs uppercase tracking-widest opacity-50">
              No values recorded in the database.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValueManager;