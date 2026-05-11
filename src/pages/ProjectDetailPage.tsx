import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import Sidebar from "@/components/Sidebar";
import { projectItems } from "@/lib/siteContent";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const project = projectItems.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <button onClick={() => navigate("/projects")} className="font-mono text-xs uppercase tracking-widest">← Back to projects</button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none" style={{ height: 64, background: "linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 60%, transparent 100%)" }} />
      <div className="fixed top-0 left-0 z-[60] flex items-center gap-1 px-6 py-4">
        <Link to="/" className="contents"><Logo /></Link>
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <motion.div animate={{ marginLeft: sidebarOpen ? 240 : 0 }} transition={{ duration: 0.4, ease: EASE_TEXT }}>
        <motion.main
          className="pt-28 pb-20 px-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: EASE_TEXT, delay: 0.1 }}
        >
          <button
            onClick={() => navigate("/projects")}
            className="group relative mb-8 inline-flex items-center justify-center overflow-hidden rounded-full bg-foreground px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] cursor-pointer"
          >
            <span
              className="absolute inset-0 bg-[hsl(50_33%_12%)] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
              style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
            />
            <span className="relative z-10 flex items-center text-background group-hover:text-highlight transition-colors duration-500">
              <span className="inline-flex overflow-hidden max-w-0 opacity-0 group-hover:max-w-[1.5rem] group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <ArrowLeft className="w-3 h-3 mr-1.5 shrink-0" strokeWidth={1.5} />
              </span>
              All Projects
            </span>
          </button>

          <div className="mb-3 flex items-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/50">{project.year}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">{project.title}</h1>
          <p className="text-base md:text-lg text-foreground/65 leading-relaxed mb-10 max-w-2xl">{project.summary}</p>

          <div className="aspect-[16/9] overflow-hidden mb-12">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-10 max-w-2xl">
            {project.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3">{section.heading}</h2>
                {section.paragraphs?.map((p) => (
                  <p key={p} className="mb-3 text-[15px] leading-relaxed text-foreground/70">{p}</p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2">
                    {section.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-foreground/70">
                        <span className="mt-[0.55rem] h-[3px] w-[3px] shrink-0 rounded-full bg-foreground/40" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.links && (
                  <div className="space-y-2 mt-2">
                    {section.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between border-b border-foreground/10 py-3 text-sm text-foreground/75 hover:text-foreground transition-colors"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="h-4 w-4 text-foreground/40 transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px] group-hover:text-foreground" />
                      </a>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </motion.main>

        <Footer />
      </motion.div>
    </div>
  );
};

export default ProjectDetailPage;