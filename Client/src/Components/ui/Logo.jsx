const AbstractLogo = () => (
  <div className="relative w-10 h-10 flex items-center justify-center group cursor-pointer">
    <div className="absolute inset-0 border-2 border-accent rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
    <div className="absolute inset-0 border border-white/20 -rotate-12 group-hover:rotate-0 transition-transform duration-700"></div>
    <span className="text-white font-black italic text-xl relative z-10">B</span>
  </div>
);