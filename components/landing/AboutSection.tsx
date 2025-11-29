"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Sparkles, Camera, BookOpen, ChefHat } from 'lucide-react';

const projects = [
  {
    id: 1,
    name: "ContentAI",
    tagline: "AI-Powered Content Generation",
    description: "Intelligent content creation platform powered by advanced AI",
    icon: Sparkles,
    pdfPath: "/infographics/contentaiinfograhic.pdf",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    bgGradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20"
  },
  {
    id: 2,
    name: "Professional Shoot",
    tagline: "Photography Platform",
    description: "Professional photography and creative shoot management",
    icon: Camera,
    pdfPath: "/infographics/Infographic -professionalshoot.pdf",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    bgGradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20"
  },
  {
    id: 3,
    name: "Stepwise",
    tagline: "Step-by-Step Learning",
    description: "Interactive learning platform with guided tutorials",
    icon: BookOpen,
    pdfPath: "/infographics/infographic-stepwise.pdf",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    bgGradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20"
  },
  {
    id: 4,
    name: "SnapCook",
    tagline: "Recipe & Cooking App",
    description: "Discover, save, and share amazing recipes instantly",
    icon: ChefHat,
    pdfPath: "/infographics/snapcook-infographic.pdf",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    bgGradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20"
  }
];

export function AboutSection() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  return (
    <>
      <section id="about" className="relative py-24 px-8 bg-gradient-to-b from-slate-100 via-slate-50 to-white">
        {/* About Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            About Our Work
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We create innovative digital solutions that transform ideas into reality.
            From AI-powered platforms to creative tools, each project showcases our
            commitment to excellence and cutting-edge technology.
          </p>
        </motion.div>

        {/* Projects Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold text-slate-800 mb-4">
            Featured Projects
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our portfolio of innovative applications and platforms
          </p>
        </motion.div>

        {/* 3D Flip Cards Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 justify-items-center">
          {projects.map((project, index) => {
            const Icon = project.icon;
            const isFlipped = flippedCard === project.id;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="perspective-1000"
                style={{ perspective: "1000px" }}
                onMouseEnter={() => setFlippedCard(project.id)}
                onMouseLeave={() => setFlippedCard(null)}
              >
                <motion.div
                  className="relative w-60 h-[520px] cursor-pointer"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                  style={{ transformStyle: "preserve-3d" }}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Front of Card */}
                  <div
                    className="absolute inset-0 rounded-[2.5rem] bg-white/80 backdrop-blur-md border border-white/50 shadow-xl overflow-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.bgGradient}`} />

                    {/* Content */}
                    <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                      <motion.div
                        className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-8 shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon size={48} className="text-white" strokeWidth={2.5} />
                      </motion.div>

                      <h4 className="text-2xl font-bold text-slate-800 mb-3 px-2">
                        {project.name}
                      </h4>
                      <p className="text-sm text-slate-600 font-medium px-4 leading-relaxed">
                        {project.tagline}
                      </p>

                      {/* Hover Indicator */}
                      <motion.div
                        className="absolute bottom-8 text-xs text-slate-500 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isFlipped ? 0 : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        Hover to flip
                      </motion.div>
                    </div>
                  </div>

                  {/* Back of Card */}
                  <div
                    className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${project.gradient} shadow-xl overflow-hidden`}
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-white">
                      <Icon size={56} className="mb-6 opacity-90" strokeWidth={2} />

                      <h4 className="text-2xl font-bold mb-4 px-2">
                        {project.name}
                      </h4>
                      <p className="text-sm mb-8 opacity-90 leading-relaxed px-4">
                        {project.description}
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
                      >
                        <ExternalLink size={18} />
                        View Project Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <p className="text-lg text-slate-600 mb-6">
            Want to see more details about each project?
          </p>
          <p className="text-sm text-slate-500 italic">
            Click on any project card to view the full infographic
          </p>
        </motion.div>
      </section>

      {/* PDF Modal Viewer */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>

              {/* Project Header */}
              <div className={`px-8 py-6 bg-gradient-to-r ${selectedProject.gradient} text-white`}>
                <h3 className="text-3xl font-bold mb-2">{selectedProject.name}</h3>
                <p className="text-white/90">{selectedProject.tagline}</p>
              </div>

              {/* PDF Viewer */}
              <div className="h-[calc(100%-88px)] overflow-auto bg-slate-100">
                <iframe
                  src={selectedProject.pdfPath}
                  className="w-full h-full"
                  title={`${selectedProject.name} Infographic`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
