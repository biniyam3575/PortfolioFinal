import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { 
  RiUserSharedLine, 
  RiImageEditLine, 
  RiLoader5Line, 
  RiShieldUserLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiUser3Fill,
  RiQuillPenFill,
  RiSparklingFill,
  RiAddLine,
  RiCloseLine
} from 'react-icons/ri';

const ProfileManager = ({ isAdmin }) => {
  const [profile, setProfile] = useState({ 
    name: '', 
    bio: '', 
    imageUrl: '',
    roles: []
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          name: data.name || '',
          bio: data.bio || '',
          imageUrl: data.imageUrl || '',
          roles: Array.isArray(data.roles) ? data.roles : []
        });
      }
    });
    return () => unsub();
  }, []);

  const updateRole = (index, value) => {
    const next = [...profile.roles];
    next[index] = value;
    setProfile({ ...profile, roles: next });
  };

  const addRole = () => {
    setProfile({ ...profile, roles: [...profile.roles, ''] });
  };

  const removeRole = (index) => {
    setProfile({ ...profile, roles: profile.roles.filter((_, i) => i !== index) });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setLoading(true);
    try {
      let url = profile.imageUrl;

      if (newImage) {
        const data = new FormData();
        data.append("file", newImage);
        data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, 
          { method: "POST", body: data }
        );
        const file = await res.json();
        url = file.secure_url;
      }

      // Drop empty/blank role entries before saving
      const cleanRoles = profile.roles.map(r => r.trim()).filter(Boolean);

      await setDoc(doc(db, "settings", "profile"), { 
        ...profile, 
        roles: cleanRoles,
        imageUrl: url 
      }, { merge: true });

      setNewImage(null);
    } catch (err) { 
      alert("Sync Error: " + err.message); 
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* MAIN IDENTITY CARD */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-gray-100 transition-all">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isAdmin ? 'bg-black' : 'bg-gray-200'}`}>
              {isAdmin ? <RiShieldUserLine className="text-white text-2xl" /> : <RiLockPasswordLine className="text-gray-500 text-2xl" />}
            </div>
            <div>
              <h2 className="text-black text-xl font-black uppercase italic leading-none">Hero Identity</h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                 {isAdmin ? "Core Identity Control" : "Public Bio Preview"}
              </p>
            </div>
          </div>
          {!isAdmin && (
            <div className="flex items-center gap-1 text-[9px] font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 uppercase tracking-tighter">
              <RiEyeLine /> Read-Only
            </div>
          )}
        </div>

        <form onSubmit={handleUpdate} className="space-y-10">
          
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center justify-center py-10 rounded-[3rem] bg-gray-50/50 border-2 border-dashed border-gray-100 relative group">
             <div className="relative">
                <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-white">
                    <img 
                      src={newImage ? URL.createObjectURL(newImage) : profile.imageUrl || 'https://via.placeholder.com/400'} 
                      className={`w-full h-full object-cover transition-all duration-500 ${!isAdmin ? 'grayscale' : 'group-hover:scale-110'}`} 
                      alt="Identity"
                    />
                </div>
                
                {isAdmin && (
                  <label className="absolute -bottom-4 -right-4 bg-[#822cff] p-5 rounded-[1.5rem] cursor-pointer hover:bg-black hover:scale-110 transition-all shadow-xl border-4 border-white">
                    <RiImageEditLine className="text-white text-2xl" />
                    <input type="file" className="hidden" onChange={(e) => setNewImage(e.target.files[0])} />
                  </label>
                )}
             </div>
             <p className="text-[9px] font-black uppercase text-gray-300 mt-8 tracking-[0.3em]">
                {newImage ? "New Identity Payload Ready" : "Current Avatar Representation"}
             </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest flex items-center gap-2">
                <RiUser3Fill className="text-[#822cff]" /> Designated Name
              </label>
              <input 
                required 
                disabled={!isAdmin}
                placeholder="Full Name"
                className={`w-full border-2 rounded-2xl p-5 text-black font-bold outline-none transition-all ${
                  isAdmin ? 'bg-gray-50 border-gray-100 focus:border-[#822cff]' : 'bg-gray-100 border-transparent text-gray-400'
                }`} 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest flex items-center gap-2">
                <RiQuillPenFill className="text-[#822cff]" /> Professional Tagline
              </label>
              <input 
                required 
                disabled={!isAdmin}
                placeholder="e.g. Software Systems Engineer"
                className={`w-full border-2 rounded-2xl p-5 text-black font-bold outline-none transition-all ${
                  isAdmin ? 'bg-gray-50 border-gray-100 focus:border-[#822cff]' : 'bg-gray-100 border-transparent text-gray-400'
                }`} 
                value={profile.bio} 
                onChange={(e) => setProfile({...profile, bio: e.target.value})} 
              />
            </div>
          </div>

          {/* Rotating Roles Section */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest flex items-center gap-2">
              <RiSparklingFill className="text-[#822cff]" /> Rotating Roles (Hero Typewriter)
            </label>

            <div className="space-y-3">
              {profile.roles.length === 0 && (
                <p className="text-gray-300 text-xs font-bold uppercase tracking-widest px-2">
                  No roles yet — add one below
                </p>
              )}

              {profile.roles.map((role, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    disabled={!isAdmin}
                    placeholder="e.g. Fullstack Developer"
                    className={`flex-1 border-2 rounded-2xl p-4 text-black font-bold outline-none transition-all ${
                      isAdmin ? 'bg-gray-50 border-gray-100 focus:border-[#822cff]' : 'bg-gray-100 border-transparent text-gray-400'
                    }`}
                    value={role}
                    onChange={(e) => updateRole(i, e.target.value)}
                  />
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => removeRole(i)}
                      className="p-3 rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                      aria-label="Remove role"
                    >
                      <RiCloseLine className="text-lg" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={addRole}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#822cff] hover:text-black transition-all px-2 pt-1"
              >
                <RiAddLine className="text-base" /> Add Role
              </button>
            )}
          </div>

          {/* Action Button */}
          {isAdmin && (
            <button 
              disabled={loading} 
              className="w-full bg-black text-white font-black py-6 rounded-2xl hover:bg-[#822cff] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-[0.97] disabled:opacity-50"
            >
              {loading ? (
                <RiLoader5Line className="animate-spin text-2xl" />
              ) : (
                <>
                  <RiUserSharedLine className="text-xl" />
                  SYNCHRONIZE IDENTITY
                </>
              )}
            </button>
          )}
        </form>
      </div>

      {/* FOOTER METADATA */}
      <div className="px-6 flex justify-between items-center text-gray-400 text-[9px] font-bold uppercase tracking-[0.2em]">
        <span>Identity Protocol v4.0</span>
        <span className="flex items-center gap-2">
           <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAdmin ? 'bg-[#822cff]' : 'bg-gray-300'}`}></span>
           Cloudinary & Firestore Secured
        </span>
      </div>
    </div>
  );
};

export default ProfileManager;