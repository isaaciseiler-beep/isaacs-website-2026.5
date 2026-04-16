import { useEffect, useMemo, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import ProjectModal from "@/components/ProjectModal";
import Sidebar from "@/components/Sidebar";
import { projectItems } from "@/lib/siteContent";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const categories = ["All", "RESEARCH", "WORK", "REPORTING", "PROJECT"];

const ProjectsPage = () => {
  const [filter, setFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const filteredProjects = useMemo(
    () => (filter === "All" ? projectItems : projectItems.filter((project) => project.source === filter)),
    [filter]
  );

  const activeIndex = activeProjectId ? filteredProjects.findIndex((project) => project.id === activeProjectId) : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filter]);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none" style={{ height: 64, background: "linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 60%, transparent 100%)" }} />

      <div className="fixed top-0 left-0 z-[60] flex items-center gap-1 px-6 py-4">
        <Link to="/" className="contents"><Logo /></Link>
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <motion.div animate={{ marginLeft: sidebarOpen ? 240 : 0 }} transition={{ duration: 0.4, ease: EASE_TEXT }}>
        <motion.main
          className="pt-28 pb-20"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
        >
          <div className="mb-12 px-6">
            <p className="mb-3 pl-10 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/28 md:pl-12">Project Archive</p>
            <h1 className="max-w-5xl pl-10 text-4xl font-semibold tracking-tight text-foreground md:pl-12 md:text-6xl">
              Research, reporting, strategy, and communications work.
            </h1>
          </div>

          <div className="mb-12 flex justify-center">
            <div className="flex gap-1 px-6">
              <LayoutGroup>
                {categories.map((category) => {
                  const active = filter === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setFilter(category)}
                      className="relative shrink-0 px-3 py-1 font-mono text-[9px] tracking-[0.2em] uppercase transition-colors duration-300"
                      style={{ color: active ? "hsl(var(--background))" : "hsl(var(--foreground) / 0.3)" }}
                    >
                      {active && (
                        <motion.div
                          layoutId="projects-filter-pill"
                          className="absolute inset-0 bg-foreground"
                          style={{ zIndex: -1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      {category}
                    </button>
                  );
                })}
              </LayoutGroup>
            </div>
          </div>

          <div className="px-6">
            <div className="grid grid-cols-1 gap-[3px] md:grid-cols-2">
              {filteredProjects.map((project, index) => (
                <motion.button
                  key={project.id}
                  className="group relative overflow-hidden text-left"
                  initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: index * 0.04, duration: 0.45, ease: EASE }}
                  onClick={() => setActiveProjectId(project.id)}
                >
                  <div className="aspect-[5/4] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">{project.source}</span>
                      <span className="h-px w-5 bg-white/15" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">{project.year}</span>
                    </div>
                    <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-white md:text-3xl">{project.title}</h2>
                    <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-white/58 md:text-sm">{project.summary}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.main>

        <Footer />
      </motion.div>

      <ProjectModal
        projects={filteredProjects}
        currentIndex={activeIndex !== null && activeIndex >= 0 ? activeIndex : null}
        onClose={() => setActiveProjectId(null)}
        onNavigate={(index) => setActiveProjectId(filteredProjects[index]?.id ?? null)}
      />
    </div>
  );
};

export default ProjectsPage;
