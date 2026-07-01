import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../admin/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const TimelineSection = () => {
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "timeline"), orderBy("year", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMilestones(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <section
      id="journey"
      className="w-full 
        bg-white dark:bg-black 
        py-20 md:py-32 px-4 md:px-16 lg:px-28 overflow-hidden
        transition-colors duration-500"
    >
      <div className="max-w-[1600px] mx-auto w-full">
        
        {/* HEADER */}
        <div className="mb-12 md:mb-20">
          <p className="text-[#822cff] font-mono text-[10px] tracking-[0.6em] uppercase mb-2 font-bold flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#822cff]"></span> Experience
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white tracking-tight uppercase">
            The <span className="text-gray-400 italic font-light border-b border-[#822cff]/30">Journey.</span>
          </h2>
        </div>

        {/* TIMELINE VIEWPORT */}
        <div className="relative pt-10 pb-20">
          <div className="no-scrollbar overflow-x-auto flex items-start pb-10 cursor-grab active:cursor-grabbing scroll-smooth">
            <div className="relative flex items-start">
              
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 3, ease: "circOut" }}
                className="absolute top-[30px] left-0 h-[2px] bg-[#822cff] z-0 shadow-[0_0_20px_#822cff]"
              />
              <div className="absolute top-[30px] left-0 h-[1px] w-full bg-black/10 dark:bg-white/10 z-[-1]" />

              <div className="flex gap-12 md:gap-32 lg:gap-40 pr-32 relative z-10">
                {milestones.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.3 }}
                    className="flex flex-col items-start w-[280px] md:w-[380px] shrink-0"
                  >
                    {/* YEAR NODE */}
                    <div className="relative flex items-center justify-center w-[60px] h-[60px]">
                      <div className="absolute inset-0 border-2 border-[#822cff] rounded-full bg-white dark:bg-black z-20 flex items-center justify-center transition-all duration-500 shadow-[0_0_15px_#822cff44]">
                        <span className="text-black dark:text-white font-mono text-[11px] font-black">{item.year}</span>
                      </div>
                      <div className="absolute w-[70px] h-4 bg-white dark:bg-black z-10"></div>
                    </div>

                    {/* CONTENT CARD */}
                    <motion.div 
                      whileHover={{ y: -8, borderColor: 'rgba(130, 44, 255, 0.6)' }}
                      className="mt-12 p-8 
                        bg-gray-50 dark:bg-[#0a0a0a] 
                        border border-black/10 dark:border-white/20 
                        rounded-2xl w-full transition-all duration-500 shadow-2xl"
                    >
                      <h5 className="text-[#a855f7] font-mono text-[9px] tracking-[0.4em] uppercase mb-4 font-bold flex items-center gap-2">
                        {index === milestones.length - 1 ? (
                          <>
                            <span className="w-2 h-2 bg-[#822cff] rounded-full animate-ping"></span>
                            Currently
                          </>
                        ) : (
                          `Phase_0${index + 1}`
                        )}
                      </h5>
                      <h3 className="text-black dark:text-white font-bold text-xl mb-4 tracking-tight uppercase">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm font-light leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* SCROLL HINT */}
        <div className="flex items-center gap-4">
          <div className="h-[2px] w-16 bg-[#822cff] shadow-[0_0_8px_#822cff]"></div>
          <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-black dark:text-white font-bold animate-pulse">
            Slide to explore timeline
          </span>
        </div>

      </div>
    </section>
  );
};

export default TimelineSection;