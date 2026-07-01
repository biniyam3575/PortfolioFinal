import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { 
  RiInformationLine, 
  RiLoader5Line, 
  RiSaveLine, 
  RiMapPin2Fill, 
  RiGraduationCapFill, 
  RiPulseFill,
  RiShieldUserLine,
  RiLockPasswordLine,
  RiEyeLine
} from 'react-icons/ri';

const AboutManager = ({ isAdmin }) => {
  const [aboutData, setAboutData] = useState({
    aboutText: '',
    location: '',
    education: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "about"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAboutData({
          aboutText: data.aboutText || '',
          location: data.location || '',
          education: data.education || '',
          status: data.status || ''
        });
      }
    });
    return () => unsub();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "about"), aboutData, { merge: true });
    } catch (err) {
      alert("System Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* WHITE CARD CONTAINER */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-gray-100 transition-colors">
        
        {/* HEADER WITH ACCESS STATUS */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isAdmin ? 'bg-black' : 'bg-gray-200'}`}>
              {isAdmin ? <RiShieldUserLine className="text-white text-2xl" /> : <RiLockPasswordLine className="text-gray-500 text-2xl" />}
            </div>
            <div>
              <h2 className="text-black text-xl font-black uppercase italic leading-none">Intelligence</h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                 {isAdmin ? "Global Settings Control" : "Public Profile Metadata"}
              </p>
            </div>
          </div>
          {!isAdmin && (
            <div className="flex items-center gap-1 text-[9px] font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 uppercase tracking-tighter">
              <RiEyeLine /> Preview Mode
            </div>
          )}
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Biography Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest flex items-center gap-2">
              <RiInformationLine className="text-[#822cff]" /> Professional Biography
            </label>
            <textarea 
              rows="6"
              disabled={!isAdmin}
              className={`w-full border-2 rounded-[2rem] p-6 text-black outline-none transition-all resize-none font-medium text-sm leading-relaxed ${
                isAdmin ? 'bg-gray-50 border-gray-100 focus:border-[#822cff]' : 'bg-gray-100 border-transparent cursor-not-allowed text-gray-500'
              }`} 
              value={aboutData.aboutText} 
              placeholder="Draft your professional narrative..." 
              onChange={(e) => setAboutData({...aboutData, aboutText: e.target.value})} 
            />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest flex items-center gap-2">
                <RiMapPin2Fill className="text-[#822cff]" /> Current Location
              </label>
              <input 
                disabled={!isAdmin}
                placeholder="City, Country"
                className={`w-full border-2 rounded-2xl p-4 text-black font-bold outline-none transition-all ${
                  isAdmin ? 'bg-gray-50 border-gray-100 focus:border-[#822cff]' : 'bg-gray-100 border-transparent text-gray-500'
                }`} 
                value={aboutData.location} 
                onChange={(e) => setAboutData({...aboutData, location: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest flex items-center gap-2">
                <RiGraduationCapFill className="text-[#822cff]" /> Academic Foundation
              </label>
              <input 
                disabled={!isAdmin}
                placeholder="Degree or University"
                className={`w-full border-2 rounded-2xl p-4 text-black font-bold outline-none transition-all ${
                  isAdmin ? 'bg-gray-50 border-gray-100 focus:border-[#822cff]' : 'bg-gray-100 border-transparent text-gray-500'
                }`} 
                value={aboutData.education} 
                onChange={(e) => setAboutData({...aboutData, education: e.target.value})} 
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest flex items-center gap-2">
                <RiPulseFill className="text-[#822cff]" /> Deployment Status
              </label>
              <input 
                disabled={!isAdmin}
                placeholder="e.g. Available for new projects"
                className={`w-full border-2 rounded-2xl p-4 text-black font-bold outline-none transition-all ${
                  isAdmin ? 'bg-gray-50 border-gray-100 focus:border-[#822cff]' : 'bg-gray-100 border-transparent text-gray-500'
                }`} 
                value={aboutData.status} 
                onChange={(e) => setAboutData({...aboutData, status: e.target.value})} 
              />
            </div>
          </div>

          {/* Sync Button */}
          {isAdmin && (
            <button 
              disabled={loading} 
              className="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-[#822cff] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <RiLoader5Line className="animate-spin text-2xl" />
              ) : (
                <>
                  <RiSaveLine className="text-xl" />
                  PUBLISH UPDATES
                </>
              )}
            </button>
          )}
        </form>
      </div>

      {/* FOOTER INDICATOR */}
      <div className="px-6 flex justify-between items-center text-gray-400 dark:text-gray-600 text-[9px] font-bold uppercase tracking-[0.2em]">
        <span>Profile Configuration v2.0</span>
        <span className="flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
           Live Firestore Link
        </span>
      </div>
    </div>
  );
};

export default AboutManager;