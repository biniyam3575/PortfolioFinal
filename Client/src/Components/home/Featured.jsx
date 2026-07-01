import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "../projects/ProjectCard";
import { db } from "../../admin/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const Featured = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjectData(projects);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollLeft / 460);
      setActiveIndex(index);
    }
  };

  if (loading) return null;

  return (
    <section
      id="projects"
      className="bg-white dark:bg-black py-24 overflow-hidden flex flex-col items-center transition-colors duration-500"
    >
      {/* Heading */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 lg:px-28 mb-12">
        <p className="text-[#822cff] font-mono text-[10px] tracking-[0.6em] uppercase mb-2 font-bold flex items-center gap-2">
          <span className="w-4 h-[1px] bg-[#822cff]"></span>
          Development
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight uppercase">
          Featured{" "}
          <span className="text-gray-400 dark:text-gray-500 italic font-light">Work.</span>
        </h2>
      </div>

      {/* Slider */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory w-full h-[620px]"
        style={{
          paddingLeft: "calc(50% - 220px)",
          paddingRight: "calc(50% - 220px)",
          scrollBehavior: "smooth",
        }}
      >
        {projectData.map((project, index) => (
          <div
            key={project.id}
            className="snap-center flex-shrink-0 w-[460px] flex justify-center"
          >
            <ProjectCard
              project={project}
              index={index}
              containerRef={containerRef}
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex items-center gap-3 mt-5">
        {projectData.map((_, i) => (
          <div
            key={i}
            className="h-[3px] rounded-full overflow-hidden"
            style={{
              width: activeIndex === i ? "50px" : "12px",
              background: activeIndex === i ? "#822cff" : (document.documentElement.classList.contains('dark') ? "#222" : "#ddd"),
              transition: "0.35s",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Featured;