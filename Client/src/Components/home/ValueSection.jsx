import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../admin/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

const ValueSection = () => {
  const [values, setValues] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "values"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setValues(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <section
      id="values"
      className="w-full 
        bg-white dark:bg-black 
        py-20 px-6 md:px-16 lg:px-28 
        border-t border-black/5 dark:border-white/5
        transition-colors duration-500"
    >
      <div className="max-w-[1600px] mx-auto w-full">
        
        {/* HEADER */}
        <div className="mb-12">
          <p className="text-[#822cff] font-mono text-[10px] tracking-[0.6em] uppercase mb-2 font-bold flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#822cff]"></span> Cooperation
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight uppercase">
            What you <span className="text-gray-400 italic font-light">Get.</span>
          </h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {values.map((v, idx) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, borderColor: 'rgba(130, 44, 255, 0.6)' }}
              className="p-8 
                bg-gray-50 dark:bg-[#070707] 
                border border-black/10 dark:border-white/10 
                rounded-2xl transition-all duration-500 group relative overflow-hidden"
            >
              <span className="text-[#bf80ff] font-mono text-[12px] mb-6 block font-black tracking-[0.3em] opacity-100">
                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1} //
              </span>
              <h3 className="text-black dark:text-white font-bold text-base mb-4 uppercase tracking-wider group-hover:text-[#822cff] transition-colors duration-300">
                {v.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-[12px] leading-relaxed font-light tracking-wide">
                {v.desc}
              </p>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#822cff]/5 blur-2xl group-hover:bg-[#822cff]/20 transition-all duration-500 rounded-full"></div>
            </motion.div>
          ))}
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-16 flex flex-col md:flex-row items-center gap-6 opacity-60">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[#822cff] to-transparent"></div>
          <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
            Reliability by Design
          </p>
        </div>

      </div>
    </section>
  );
};

export default ValueSection;