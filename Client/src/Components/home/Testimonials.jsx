import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../admin/firebase'; 
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    /* 
       bg-white (Light) -> dark:bg-black (Dark) 
    */
    <section id="testimonials" className="bg-white dark:bg-black py-32 transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-10 md:px-24">
        
        {/* HEADER */}
        <div className="mb-16 text-left">
          <p className="text-[#822cff] font-mono text-[10px] tracking-[0.6em] uppercase mb-2 font-bold flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#822cff]"></span> Feedback
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight uppercase">
            Client <span className="text-gray-400 dark:text-gray-500 italic font-light">Testimonials.</span>
          </h2>
        </div>

        {/* TESTIMONIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              /* 
                 Card background and borders change based on mode 
              */
              className="relative p-10 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 rounded-2xl group hover:border-[#822cff]/40 transition-all duration-500 shadow-sm dark:shadow-none"
            >
              {/* Quote Mark Decoration */}
              <span className="absolute top-6 right-8 text-6xl text-gray-200 dark:text-white/5 font-serif group-hover:text-[#822cff]/10 transition-colors">“</span>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg italic leading-relaxed mb-8 relative z-10">
                "{item.comment}"
              </p>

              <div className="flex items-center gap-4 border-t border-gray-100 dark:border-white/5 pt-6">
                <img 
                  src={item.avatarUrl} 
                  alt={item.name} 
                  /* 
                     Grayscale effect on light mode can be harsh, 
                     so we keep it subtle or remove it for light mode if preferred.
                  */
                  className="w-12 h-12 rounded-full grayscale group-hover:grayscale-0 transition-all border border-gray-200 dark:border-white/10 object-cover"
                />
                <div>
                  <h4 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-wider">
                    {item.name}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-500 font-mono text-[9px] uppercase tracking-widest mt-1">
                    {item.workplace}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;