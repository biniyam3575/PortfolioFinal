import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { RiShieldKeyholeLine, RiArrowRightLine, RiLoader4Line } from 'react-icons/ri';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Take you to the control center
    } catch (err) {
      setError("Invalid Credentials. Access Denied.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        
        {/* Aesthetic Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#822cff]/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10">
          <div className="w-14 h-14 bg-[#822cff]/10 border border-[#822cff]/20 rounded-2xl flex items-center justify-center mb-8 mx-auto">
            <RiShieldKeyholeLine className="text-[#822cff] text-2xl" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-white text-2xl font-black uppercase tracking-tighter">Biniyam Beyene</h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Admin Terminal v2.0</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <input 
                required type="email" placeholder="ADMIN_EMAIL"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-[#822cff] outline-none transition-all placeholder:text-gray-700 font-mono"
              />
            </div>

            <div className="space-y-2">
              <input 
                required type="password" placeholder="SECURITY_KEY"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-[#822cff] outline-none transition-all placeholder:text-gray-700 font-mono"
              />
            </div>

            {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center tracking-widest">{error}</p>}

            <button 
              disabled={loading}
              className="group w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#822cff] hover:text-white transition-all duration-500 mt-4"
            >
              {loading ? (
                <RiLoader4Line className="animate-spin text-xl" />
              ) : (
                <>AUTHENTICATE <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;