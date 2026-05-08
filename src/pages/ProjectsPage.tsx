import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import Sidebar from "@/components/Sidebar";
import { projectItems } from "@/lib/siteContent";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const ProjectsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const filteredProjects = projectItems;

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

          <div className="px-6">
            <div className="grid grid-cols-1 gap-[3px] md:grid-cols-2">
              {filteredProjects.map((project, index) => (
                <motion.button
                  key={project.id}
                  className="group relative flex flex-col text-left bg-background overflow-hidden h-full"
                  initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: index * 0.04, duration: 0.45, ease: EASE }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
                    />
                  </div>
                  <div className="bg-background p-5 md:p-6 flex-1">
                    <div className="mb-3 flex items-center">
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">{project.year}</span>
                    </div>
                    <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{project.title}</h2>
                    <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-foreground/65 md:text-sm">{project.summary}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.main>

        <Footer />
      </motion.div>
    </div>
  );
};

export default ProjectsPage;
