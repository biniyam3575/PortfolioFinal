import React from 'react';
import { motion } from 'framer-motion';
import { RiArrowUpLine, RiGithubLine, RiLinkedinLine, RiTelegramLine } from 'react-icons/ri';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#fafafa] dark:bg-black pt-20 pb-10 px-10 md:px-24 border-t border-black/5 dark:border-white/5 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Decorative Element - Adjusted opacity for light mode */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#822cff]/30 dark:via-[#822cff]/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          
          {/* LOGO & BRANDING */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#822cff] rotate-45 flex items-center justify-center">
                {/* Text color changes from black to white */}
                <span className="text-black dark:text-white font-black italic text-sm -rotate-45">B</span>
              </div>
              <span className="text-black dark:text-white font-bold tracking-[0.3em] text-sm uppercase">Biniyam Beyene</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-[10px] tracking-widest uppercase font-medium">
              Computer Engineering & Fullstack Development
            </p>
          </div>

          {/* SOCIAL LINKS */}
          <div className="flex items-center gap-8">
            <a href="https://github.com/biniyam3575" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <RiGithubLine size={20} />
            </a>
            <a href="https://www.linkedin.com/in/biniyam-beyene-7820b2358/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <RiLinkedinLine size={20} />
            </a>
            <a href="https://t.me/Bini1177" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <RiTelegramLine size={20} />
            </a>
          </div>

          {/* BACK TO TOP */}
          <button 
            onClick={scrollToTop}
            className="group flex flex-col items-center gap-2 text-gray-500 hover:text-[#822cff] transition-all"
          >
            <div className="w-10 h-10 border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center group-hover:border-[#822cff]/50 group-hover:bg-[#822cff]/5 transition-all">
              <RiArrowUpLine size={20} className="group-hover:-translate-y-1 transition-transform" />
            </div>
            <span className="text-[8px] font-bold tracking-[0.3em] uppercase">Return to Orbit</span>
          </button>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-20 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 dark:text-gray-600 text-[9px] tracking-widest uppercase">
            © {currentYear} ALL RIGHTS RESERVED. DESIGNED & ENGINEERED BY BINIYAM B.
          </p>
          
          <div className="flex gap-8 text-gray-500 dark:text-gray-600 text-[9px] tracking-widest uppercase">
            <span className="hover:text-black dark:hover:text-white cursor-help">Local Time: Addis Ababa</span>
            <span className="hidden md:inline text-black/10 dark:text-white/10">|</span>
            <span className="hover:text-black dark:hover:text-white cursor-help">Status: Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;