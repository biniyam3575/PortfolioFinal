import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../admin/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const Skills = () => {
  const [activeSkill, setActiveSkill] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [techStack, setTechStack] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "skills"), (snapshot) => {
      const skillsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTechStack(skillsData);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (techStack.length === 0) return;

    const startCanvas = () => {
      try {
        window.TagCanvas.Start("skill-canvas", "skill-list", {
          textColour: null,
          outlineColour: "transparent",
          reverse: true,
          depth: 0.9,
          maxSpeed: 0.012,
          minSpeed: 0.004,
          initial: [0.04, -0.04],
          dragControl: true,
          decel: 0.97,
          clickToFront: 600,
          wheelZoom: false,
          imageMode: "both",
          imagePosition: "top",
        });
      } catch (err) {
        window.TagCanvas.Update("skill-canvas");
      }
    };

    if (!document.getElementById("tagcanvas-script")) {
      const script = document.createElement("script");
      script.id = "tagcanvas-script";
      script.src = "https://www.goat1000.com/tagcanvas.min.js";
      script.async = true;
      script.onload = startCanvas;
      document.body.appendChild(script);
    } else {
      startCanvas();
    }
  }, [techStack]);

  const handleSkillClick = (skill) => {
    if (!window.TagCanvas) return;
    if (activeSkill === skill.name && isPaused) {
      window.TagCanvas.SetSpeed("skill-canvas", [0.04, -0.04]);
      window.TagCanvas.Set("skill-canvas", "lock", null);
      setActiveSkill(null);
      setIsPaused(false);
    } else {
      window.TagCanvas.TagToFront("skill-canvas", {
        index: techStack.findIndex((item) => item.name === skill.name),
        callback: () => {
          window.TagCanvas.Set("skill-canvas", "lock", "xy");
          window.TagCanvas.SetSpeed("skill-canvas", [0, 0]);
        },
      });
      setActiveSkill(skill.name);
      setIsPaused(true);
    }
  };

  return (
    <section
      id="skills"
      className="min-h-screen w-full 
        bg-white dark:bg-black 
        relative flex flex-col items-center justify-center py-20 overflow-hidden
        transition-colors duration-500"
    >
      <div className="w-full max-w-7xl mx-auto px-10 md:px-24 mb-12 text-left">
        <p className="text-[#822cff] font-mono text-[10px] tracking-[0.6em] uppercase mb-2 font-bold flex items-center gap-2">
          <span className="w-4 h-[1px] bg-[#822cff]"></span> Tech Stack
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight uppercase">
          Skill <span className="text-gray-400 dark:text-gray-500 italic font-light">Sphere.</span>
        </h2>
      </div>

      <div className="h-12 mb-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeSkill && (
            <motion.div
              key={activeSkill}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-8 py-2 border border-[#822cff]/30 bg-[#822cff]/10 rounded-full backdrop-blur-md"
            >
              <span className="text-[#822cff] font-mono tracking-[0.4em] text-xs uppercase font-bold">
                {activeSkill}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 w-full max-w-[600px] aspect-square flex items-center justify-center">
        <canvas
          id="skill-canvas"
          width="800"
          height="800"
          style={{ width: "100%", height: "100%" }}
          className="cursor-crosshair"
        />
        <div id="skill-list" className="hidden">
          <ul>
            {techStack.map((skill) => (
              <li key={skill.id}>
                <a href="#!" onClick={(e) => { e.preventDefault(); handleSkillClick(skill); }}>
                  <img 
                    width="85" height="85" 
                    src={skill.icon} 
                    alt={skill.name} 
                    referrerPolicy="no-referrer"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Skills;