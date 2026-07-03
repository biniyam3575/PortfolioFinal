import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../admin/firebase';
import { doc, onSnapshot, collection, query } from 'firebase/firestore';

const About = () => {
  const [profile, setProfile] = useState({
    aboutText: "",
    location: "",
    education: "",
    status: ""
  });
  const [projectCount, setProjectCount] = useState(0);
  const yearsOfExperience = new Date().getFullYear() - 2022;

  useEffect(() => {
    const unsubProfile = onSnapshot(doc(db, "settings", "profile"), (docSnap) => {
      if (docSnap.exists()) setProfile(docSnap.data());
    });
    const q = query(collection(db, "projects"));
    const unsubProjects = onSnapshot(q, (snapshot) => {
      setProjectCount(snapshot.size); 
    });
    return () => { unsubProfile(); unsubProjects(); };
  }, []);

  return (
    <section
      id="about"
      className="min-h-screen w-full 
        bg-white dark:bg-black 
        py-10 px-6 md:px-16 lg:px-28 flex items-center
        transition-colors duration-500"
    >
      <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row gap-20 items-stretch">

        {/* LEFT SIDE */}
        <div className="flex-1 flex flex-col justify-between py-2 text-left">
          <div>
            <div className="mb-6">
              <p className="text-[#822cff] font-mono text-[10px] tracking-[0.6em] uppercase mb-2 font-bold flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[#822cff]"></span>
                Profile
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight uppercase">
                About <span className="text-gray-400 dark:text-gray-500 italic font-light">Me.</span>
              </h2>
            </div>

            <h3 className="text-xl md:text-2xl font-semibold text-black dark:text-white tracking-tight mb-6 leading-snug">
              Architecting Digital Logic <br />
              <span className="text-gray-500 dark:text-gray-600 font-medium">
                with Engineering Precision.
              </span>
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-xl">
              {profile.aboutText || "As a Computer Engineer, I focus on the structural integrity of full-stack systems through hardware-inspired software logic."}
            </p>
          </div>

          <div className="flex gap-14 mt-14">
            <div>
              <div className="flex items-baseline gap-1">
                <h4 className="text-4xl font-bold text-black dark:text-white">{yearsOfExperience}</h4>
                <span className="text-[#822cff] font-bold">+</span>
              </div>
              <p className="text-gray-500 dark:text-gray-600 font-mono text-[8px] tracking-widest uppercase">
                Years Active
              </p>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <h4 className="text-4xl font-bold text-black dark:text-white">{projectCount}</h4>
                <span className="text-[#822cff] font-bold">+</span>
              </div>
              <p className="text-gray-500 dark:text-gray-600 font-mono text-[8px] tracking-widest uppercase">
                Systems Built
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE GRID */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { title: 'Discipline', desc: 'Computer Engineering' },
            { title: 'Specialization', desc: 'Full-Stack / MERN' },
            { title: 'Education', desc: profile.education || 'Addis Ababa University' },
            { title: 'Languages', desc: 'English / Amharic' },
            { title: 'Status', desc: profile.status || 'Open for Innovation' },
            { title: 'Location', desc: profile.location || 'Addis Ababa, ET' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, borderColor: 'rgba(130, 44, 255, 0.4)' }}
              className="p-7 
                bg-gray-50 dark:bg-[#0a0a0a] 
                border border-black/10 dark:border-white/10 
                rounded-xl transition-all flex flex-col justify-center text-left"
            >
              <h5 className="text-gray-400 dark:text-gray-500 font-mono text-[8px] tracking-[0.3em] uppercase mb-2">
                {item.title}
              </h5>
              <p className="text-gray-800 dark:text-gray-200 font-bold text-base md:text-lg">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;