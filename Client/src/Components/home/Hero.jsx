import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../admin/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
  FaInstagram
} from 'react-icons/fa6';

const DEFAULT_ROLES = ["Fullstack Developer", "Problem Solver", "UI Craftsman"];

const useTypewriter = (words, speed = 90, pause = 1400) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    let timeout;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), speed);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), speed / 2);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setWordIndex((i) => i + 1);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, speed, pause]);

  return text;
};

const Hero = () => {
  const [profile, setProfile] = useState({
    name: "Biniyam",
    bio: "I turn ideas into products. Clean code, fast sites, no fuss.",
    imageUrl: "/image.png",
    roles: DEFAULT_ROLES,
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (docSnap) => {
      if (docSnap.exists()) {
        setProfile((prev) => ({ ...prev, ...docSnap.data() }));
      }
    });
    return () => unsub();
  }, []);

  // Roles come from the admin dashboard (profile.roles). Fall back to
  // defaults if the field is missing or empty, so the section never breaks.
  const roles = Array.isArray(profile.roles) && profile.roles.length > 0
    ? profile.roles
    : DEFAULT_ROLES;

  const typed = useTypewriter(roles);

  const socials = [
    { icon: <FaGithub />, link: "https://github.com/biniyam3575", label: "GitHub" },
    { icon: <FaLinkedinIn />, link: "https://www.linkedin.com/in/biniyam-beyene-7820b2358/?skipRedirect=true", label: "LinkedIn" },
    { icon: <FaXTwitter />, link: "https://x.com/biniyam1177", label: "X" },
    { icon: <FaInstagram />, link: "https://www.instagram.com/biniyam944/", label: "Instagram" }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
    })
  };

  return (
    <section
      id="home"
      className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center px-6 sm:px-10 md:px-16 lg:px-24 bg-white dark:bg-black gap-10 sm:gap-12 lg:gap-20 overflow-hidden relative pt-28 sm:pt-32 lg:pt-0 pb-12 lg:pb-0 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center">

        {/* TEXT */}
        <div className="w-full flex-1 z-10 text-left order-2 lg:order-1">
          <motion.p custom={0} initial="hidden" animate="show" variants={fadeUp} className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
            Hi, my name is
          </motion.p>

          <motion.h1 custom={1} initial="hidden" animate="show" variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] sm:leading-[1.05] mb-3 sm:mb-4 break-words">
            <span className="bg-gradient-to-r from-[#822cff] via-[#b314f3] to-[#eb0ec2] bg-clip-text text-transparent">
              {profile.name}
            </span>
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="show" variants={fadeUp} className="text-base sm:text-lg md:text-xl font-medium text-black dark:text-white mb-5 sm:mb-6 min-h-[2rem] flex items-center">
            <span>{typed}</span>
            <span className="inline-block w-[2px] h-4 sm:h-5 bg-[#822cff] ml-1 align-middle animate-pulse" />
          </motion.p>

          <motion.p custom={3} initial="hidden" animate="show" variants={fadeUp} className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-md leading-relaxed mb-8 sm:mb-10">
            {profile.bio}
          </motion.p>

          <motion.div custom={4} initial="hidden" animate="show" variants={fadeUp} className="flex flex-wrap items-center gap-4 sm:gap-5 mb-8 sm:mb-10">
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#822cff] via-[#b314f3] to-[#eb0ec2] text-white font-semibold text-xs sm:text-sm overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#b314f3]/30"
            >
              <span className="relative z-10">View my work</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#contact"
              className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
            >
              Get in touch
            </a>
          </motion.div>

          <motion.div custom={5} initial="hidden" animate="show" variants={fadeUp} className="flex gap-5 sm:gap-6">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-base sm:text-lg text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-300"
              >
                {s.icon}
              </a>
            ))}
          </motion.div>
        </div>

        {/* IMAGE - ABSTRACT BLOB */}
        <div className="w-full flex-1 flex justify-center lg:justify-end order-1 lg:order-2 mb-2 lg:mb-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-44 h-44 xs:w-52 xs:h-52 sm:w-64 sm:h-64 md:w-80 md:h-80"
          >
            <motion.div
              animate={{ borderRadius: [
                "60% 40% 30% 70% / 60% 30% 70% 40%",
                "30% 60% 70% 40% / 50% 60% 30% 60%",
                "60% 40% 30% 70% / 60% 30% 70% 40%",
              ] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-br from-[#822cff] via-[#b314f3] to-[#eb0ec2] opacity-20 blur-2xl"
            />
            <motion.div
              animate={{ borderRadius: [
                "60% 40% 30% 70% / 60% 30% 70% 40%",
                "30% 60% 70% 40% / 50% 60% 30% 60%",
                "60% 40% 30% 70% / 60% 30% 70% 40%",
              ] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full overflow-hidden bg-gray-100 dark:bg-[#111] border border-black/10 dark:border-white/10"
            >
              <img
                src={profile.imageUrl || "/image.png"}
                alt={profile.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
            <motion.span
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#eb0ec2]"
            />
            <motion.span
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-[#822cff]/70"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;