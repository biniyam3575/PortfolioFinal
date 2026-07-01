import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ProjectCard = ({ project, index, containerRef }) => {
  const { scrollX } = useScroll({
    container: containerRef,
  });

  const base = index * 460;
  const range = [base - 460, base, base + 460];

  // Animation values based on scroll position
  const scale = useTransform(scrollX, range, [0.82, 1, 0.82]);
  const opacity = useTransform(scrollX, range, [0.45, 1, 0.45]);
  const y = useTransform(scrollX, range, [35, 0, 35]);

  const zIndex = useTransform(scrollX, (value) => {
    const distance = Math.abs(value - base);
    return distance < 150 ? 30 : 10;
  });

  return (
    <motion.div
      style={{ scale, opacity, y, zIndex }}
      className="relative w-[320px] md:w-[400px] h-[500px] bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all"
    >
      {/* Image - Mapping to imageUrl from Firebase */}
      <div className="absolute inset-0">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-8 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight mb-2 uppercase">
            {project.title}
          </h3>

          <p className="text-gray-400 text-[10px] font-medium leading-relaxed max-w-[250px]">
            {project.description}
          </p>
        </div>

        <div className="flex gap-4">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="group relative flex-1 py-3 rounded-lg border border-white/10 flex items-center justify-center hover:border-[#822cff]/50 transition-all"
          >
            <span className="relative z-10 text-white text-[9px] font-mono tracking-widest uppercase group-hover:text-[#822cff]">
              Source
            </span>
          </a>

          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 bg-white rounded-lg text-black text-[9px] font-mono tracking-widest uppercase font-black text-center hover:bg-[#822cff] hover:text-white transition-all"
          >
            Live
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;