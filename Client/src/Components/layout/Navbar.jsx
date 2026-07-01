import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiDownloadLine, RiSettings4Line, RiSunLine, RiMoonLine } from 'react-icons/ri'; 
import { db } from '../../admin/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext'; // adjust path as needed

const AbstractLogo = () => (
  <div className="relative w-10 h-10 flex items-center justify-center group cursor-pointer">
    <div className="absolute inset-0 border-2 border-[#822cff] rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
    <div className="absolute inset-0 border border-black/20 dark:border-white/20 -rotate-12 group-hover:rotate-0 transition-transform duration-700"></div>
    <span className="text-black dark:text-white font-black italic text-xl relative z-10 select-none">B</span>
  </div>
);

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [hasTestimonials, setHasTestimonials] = useState(false);
  const [hasValues, setHasValues] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubTest = onSnapshot(collection(db, "testimonials"), (snapshot) => {
      setHasTestimonials(!snapshot.empty);
    });
    const unsubValues = onSnapshot(collection(db, "values"), (snapshot) => {
      setHasValues(!snapshot.empty);
    });
    return () => { unsubTest(); unsubValues(); };
  }, []);

  const navLinks = [
    { name: 'ABOUT', id: 'about' },
    { name: 'SKILLS', id: 'skills' },
    { name: 'PROJECTS', id: 'projects' },
    { name: 'VALUE', id: 'values', conditional: true }, 
    { name: 'TESTIMONIALS', id: 'testimonials', conditional: true },
    { name: 'CONTACT', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 280;
      const current = ['home', ...navLinks.map(l => l.id)].find(id => {
        const el = document.getElementById(id);
        if (el) return scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight;
        return false;
      });
      if (current && current !== activeSection) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-[100] px-6 md:px-24 py-6 flex justify-between items-center 
        backdrop-blur-xl bg-white/80 dark:bg-black/60 
        border-b border-black/10 dark:border-white/5 
        transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <a href="#home" onClick={() => setActiveSection('home')}>
          <AbstractLogo />
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold tracking-[0.4em] text-gray-500 dark:text-gray-400">
          {navLinks.map((link) => {
            if (link.id === 'testimonials' && !hasTestimonials) return null;
            if (link.id === 'values' && !hasValues) return null;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`transition-all relative py-2 ${
                  activeSection === link.id 
                    ? 'text-black dark:text-white' 
                    : 'hover:text-black dark:hover:text-white'
                }`}
              >
                {link.name}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-[#822cff] shadow-[0_0_10px_#822cff]"
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="group flex items-center gap-2 p-2 px-3 border border-black/10 dark:border-white/10 
              text-gray-500 dark:text-gray-400 rounded-full 
              hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black 
              transition-all duration-300"
            title="Toggle theme"
          >
            <motion.div
              key={isDark ? 'moon' : 'sun'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? <RiSunLine size={16} /> : <RiMoonLine size={16} />}
            </motion.div>
          </button>

          <Link 
            to="/dashboard" 
            className="group flex items-center gap-2 p-2 px-3 border border-black/10 dark:border-white/10 
              text-gray-500 dark:text-gray-400 rounded-full 
              hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black 
              transition-all"
            title="Admin Dashboard"
          >
            <RiSettings4Line size={16} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="hidden group-hover:block text-[9px] font-black tracking-widest overflow-hidden transition-all">
              DASHBOARD
            </span>
          </Link>

          <button className="flex items-center gap-2 px-6 py-2 bg-transparent border border-[#822cff]/40 
            text-black dark:text-white text-[10px] font-black rounded-full 
            hover:bg-[#822cff] hover:text-white hover:border-[#822cff] 
            transition-all shadow-[0_0_15px_rgba(130,44,255,0.1)] active:scale-95">
            RESUME <RiDownloadLine size={14} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;