import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { 
  RiLayoutMasonryLine, 
  RiUserSettingsLine, 
  RiChatQuoteLine, 
  RiLogoutCircleRLine,
  RiInformationLine, 
  RiCodeSSlashLine,
  RiArrowLeftLine,
  RiShieldFlashLine,
  RiHistoryLine,
  RiHandCoinLine,
  RiMenu2Line,
  RiCloseLine
} from 'react-icons/ri';

// Import your manager components
import ProjectManager from './ProjectManager';
import ProfileManager from './ProfileManager';
import AboutManager from './AboutManager'; 
import TestimonialManager from './TestimonialManager';
import SkillManager from './SkillManager';
import TimelineManager from './TimelineManager';
import ValueManager from './ValueManager';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // AUTH OBSERVER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Admin verification
      if (currentUser && currentUser.email === "biniyam1177@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // SECRET LOGIN TRIGGER
  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) navigate('/admin');
    const timer = setTimeout(() => setClickCount(0), 3000);
    return () => clearTimeout(timer);
  };

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/'));
  };

  // Helper to handle tab changes on mobile
  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 flex w-full bg-[#050505] text-white font-sans overflow-hidden z-[9999]">
      
      {/* MOBILE BACKDROP DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR - Persistent on desktop, sliding drawer on mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col p-6 shrink-0 h-full overflow-hidden transition-transform duration-300 ease-in-out
        lg:relative lg:transform-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* LOGO AREA & CLOSE BUTTON */}
        <div className="flex items-center justify-between mb-12 px-2">
          <div 
            onClick={handleSecretClick}
            className="flex items-center gap-3 cursor-default select-none active:opacity-70 transition-opacity"
            title="System Core"
          >
            <div className="w-8 h-8 border-2 border-[#822cff] rotate-45 flex items-center justify-center">
              <span className="text-white font-black italic text-xs -rotate-45">B</span>
            </div>
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-white">
              Control Center
            </span>
          </div>

          {/* Close button inside sidebar for mobile view */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white lg:hidden transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* NAVIGATION - Independent Scroll */}
        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-1">
          <SidebarItem icon={<RiLayoutMasonryLine />} label="Projects" active={activeTab === 'projects'} onClick={() => handleTabSelect('projects')} />
          <SidebarItem icon={<RiCodeSSlashLine />} label="Skills" active={activeTab === 'skills'} onClick={() => handleTabSelect('skills')} />
          <SidebarItem icon={<RiHistoryLine />} label="Timeline" active={activeTab === 'timeline'} onClick={() => handleTabSelect('timeline')} />
          <SidebarItem icon={<RiHandCoinLine />} label="What You Get" active={activeTab === 'values'} onClick={() => handleTabSelect('values')} />
          <SidebarItem icon={<RiChatQuoteLine />} label="Testimonials" active={activeTab === 'testimonials'} onClick={() => handleTabSelect('testimonials')} />
          <SidebarItem icon={<RiUserSettingsLine />} label="Profile" active={activeTab === 'profile'} onClick={() => handleTabSelect('profile')} />
          <SidebarItem icon={<RiInformationLine />} label="About" active={activeTab === 'about'} onClick={() => handleTabSelect('about')} />
        </nav>

        {/* FOOTER ACTIONS */}
        <div className="pt-6 mt-4 border-t border-white/5 shrink-0">
          {user ? (
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-gray-500 hover:text-red-400 transition-colors px-4 py-3 text-[10px] font-bold uppercase tracking-widest">
              <RiLogoutCircleRLine size={18}/> Logout Session
            </button>
          ) : (
            <Link to="/" className="w-full flex items-center gap-3 text-gray-500 hover:text-[#822cff] transition-colors px-4 py-3 text-[10px] font-bold uppercase tracking-widest">
              <RiArrowLeftLine size={18}/> Exit to Public Site
            </Link>
          )}
        </div>
      </aside>

      {/* MAIN VIEWPORT - Flex column to separate header from scrollable stage */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#050505]">
        
        {/* FIXED HEADER - Remains at top, responsive padding and structure */}
        <header className="flex items-center justify-between p-6 md:p-8 lg:p-12 pb-6 shrink-0 bg-[#050505] z-20 gap-4">
          <div className="flex items-center gap-4">
            {/* Hamburger button for mobile layouts */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 bg-white/5 border border-white/10 rounded-xl lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <RiMenu2Line size={20} />
            </button>

            <div>
              <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-2 md:gap-3">
                {activeTab} <span className="text-gray-700 font-light italic text-xs md:text-xl">/ Manager</span>
              </h1>
              
              {/* STATUS INDICATOR */}
              <div className="flex items-center gap-2 mt-2 px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-full w-fit">
                <div className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-amber-500'} animate-pulse`}></div>
                <p className="text-gray-500 text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black truncate max-w-[140px] md:max-w-none">
                  {isAdmin ? `ROOT_ACCESS: ${user?.email}` : "READ_ONLY_ACCESS"}
                </p>
              </div>
            </div>
          </div>

          <Link 
            to="/" 
            className="group flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-[#822cff] hover:border-[#822cff] transition-all duration-500 whitespace-nowrap"
          >
              <RiArrowLeftLine className="text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-[9px] md:text-[10px] font-black tracking-widest text-gray-400 group-hover:text-white uppercase hidden sm:inline">Back to Portfolio</span>
              <span className="text-[9px] font-black tracking-widest text-gray-400 group-hover:text-white uppercase sm:hidden">Exit</span>
          </Link>
        </header>

        {/* SCROLLABLE CONTENT STAGE - Dynamic padding for mobile optimization */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 lg:px-12 pb-24 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'projects' && <ProjectManager isAdmin={isAdmin} />}
            {activeTab === 'profile' && <ProfileManager isAdmin={isAdmin} />}
            {activeTab === 'about' && <AboutManager isAdmin={isAdmin} />}
            {activeTab === 'testimonials' && <TestimonialManager isAdmin={isAdmin} />}
            {activeTab === 'skills' && <SkillManager isAdmin={isAdmin} />}
            {activeTab === 'timeline' && <TimelineManager isAdmin={isAdmin} />}
            {activeTab === 'values' && <ValueManager isAdmin={isAdmin} />}
          </div>
        </div>
      </main>

      {/* SECURITY OVERLAY - Placed defensively out of the way on smaller mobile screens */}
      {!isAdmin && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 p-3 md:p-4 bg-black/80 backdrop-blur-md border border-white/5 rounded-2xl flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity z-50 pointer-events-none sm:pointer-events-auto">
          <RiShieldFlashLine className="text-[#822cff]" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Encrypted Dashboard</span>
        </div>
      )}
    </div>
  );
};

// SIDEBAR ITEM HELPER
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
      active 
        ? 'bg-[#822cff] text-white shadow-[0_10px_20px_rgba(130,44,255,0.3)]' 
        : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
    }`}
  >
    {active && (
      <div className="absolute left-0 top-0 w-1 h-full bg-white/20"></div>
    )}
    <span className={`text-xl transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:text-[#822cff]'}`}>
      {icon}
    </span>
    <span className="text-[11px] font-black uppercase tracking-widest text-left">{label}</span>
  </button>
);

export default Dashboard;