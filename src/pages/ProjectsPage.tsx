import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import SiteHeader from "@/components/SiteHeader";
import { projectItems, type ProjectItem } from "@/lib/siteContent";
import { useIsMobile } from "@/hooks/use-mobile";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FLOAT_BOTTOM = 20;

const useCenteredInFrame = <T extends HTMLElement>(enabled: boolean) => {
  const ref = useRef<T | null>(null);
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsCentered(false);
      return;
    }

    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const activeRange = Math.min(window.innerHeight * 0.18, rect.height * 0.45);
      setIsCentered(Math.abs(elementCenter - viewportCenter) <= activeRange);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);

  return [ref, isCentered] as const;
};

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  isMobile: boolean;
  revealImmediately: boolean;
  onOpen: () => void;
}

const ProjectCard = ({ project, index, isMobile, revealImmediately, onOpen }: ProjectCardProps) => {
  const [cardRef, isCentered] = useCenteredInFrame<HTMLButtonElement>(isMobile);
  const isColor = isMobile && isCentered;

  return (
    <motion.button
      ref={cardRef}
      className="group relative flex flex-col text-left bg-background overflow-hidden h-full border border-foreground/10 hover:border-foreground/30 transition-colors duration-300"
      initial={revealImmediately ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={revealImmediately ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      animate={revealImmediately ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      viewport={revealImmediately ? undefined : { once: true, margin: "-80px" }}
      transition={{ delay: (index % 2) * 0.08 + Math.floor(index / 2) * 0.05, duration: 0.7, ease: EASE }}
      onClick={onOpen}
    >
      <div className="aspect-[16/10] overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          loading={index < 4 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={index < 2 ? "high" : "auto"}
          className="h-full w-full object-cover grayscale transition-all duration-500 md:group-hover:grayscale-0"
          animate={isMobile ? { filter: isColor ? "grayscale(0%)" : "grayscale(100%)" } : undefined}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>
      <div className="bg-background p-5 md:p-6 flex-1 border-t border-foreground/10">
        <div className="mb-3 flex items-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">{project.year}</span>
        </div>
        <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{project.title}</h2>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-foreground/65 md:text-sm">{project.summary}</p>
      </div>
    </motion.button>
  );
};

const ProjectsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(FLOAT_BOTTOM);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const filteredProjects = projectItems;

  const handleSidebarToggle = () => {
    setSearchOpen(false);
    setSidebarOpen((open) => !open);
  };

  const handleSearchOpen = () => {
    setSidebarOpen(false);
    setSearchOpen(true);
  };

  useEffect(() => {
    filteredProjects.forEach((project) => {
      const image = new Image();
      image.decoding = "async";
      image.src = project.image;
    });
  }, [filteredProjects]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > window.innerHeight * 0.35);

      const footer = document.getElementById("footer");
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const windowH = window.innerHeight;
        setBottomOffset(footerTop < windowH ? windowH - footerTop + FLOAT_BOTTOM : FLOAT_BOTTOM);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsLightTheme(root.classList.contains("light"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Sidebar
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        onClose={() => setSidebarOpen(false)}
        onSearchOpen={handleSearchOpen}
        showToggle={false}
      />

      <motion.div
        animate={{
          marginLeft: sidebarOpen && !isMobile ? 240 : 0,
          marginRight: searchOpen && !isMobile ? 240 : 0,
          width:
            sidebarOpen && !isMobile
              ? "calc(100% - 240px)"
              : searchOpen && !isMobile
                ? "calc(100% - 240px)"
                : "100%",
        }}
        transition={{ duration: 0.56, ease: EASE_TEXT }}
      >
        <motion.main
          className="pt-28 pb-20"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
        >
          <div className="mb-8 flex min-h-[calc(100svh-14rem)] items-center justify-start px-6 text-left md:mb-12 md:min-h-[calc(100vh-14rem)]">
            <motion.p
              className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl"
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: EASE_TEXT, delay: 0.15 }}
            >
              My work across communication, emerging tech, AI, and journalism.
            </motion.p>
          </div>

          <div className="px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isMobile={isMobile}
                  revealImmediately={isMobile && index === 0}
                  onOpen={() => navigate(`/projects/${project.id}`)}
                />
              ))}
            </div>
          </div>
        </motion.main>

        <Footer />
      </motion.div>

      <AnimatePresence>
        {showBackToTop && !sidebarOpen && !searchOpen && (
          <motion.button
            className={`fixed left-[calc(env(safe-area-inset-left)+1.5rem)] z-50 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-xl transition-colors duration-300 ${
              isLightTheme
                ? "bg-foreground/12 text-foreground hover:bg-foreground/18"
                : "bg-white/16 text-[hsl(var(--background))] hover:bg-white/24"
            }`}
            style={{ bottom: bottomOffset }}
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_TEXT }}
          >
            <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
          </motion.button>
        )}
      </AnimatePresence>

      <SiteHeader
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        searchOpen={searchOpen}
        onSearchOpen={handleSearchOpen}
        onSearchClose={() => setSearchOpen(false)}
      />
    </div>
  );
};

export default ProjectsPage;
