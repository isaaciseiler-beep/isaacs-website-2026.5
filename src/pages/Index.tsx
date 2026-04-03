import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Logo from "@/components/Logo";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import NewsSection from "@/components/NewsSection";
import PhotoSection from "@/components/PhotoSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const navItems = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "news", label: "News" },
  { id: "photos", label: "Photos" },
  { id: "about", label: "About" },
];

const SectionDivider = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scaleX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);

  return (
    <div ref={ref} className="px-5 md:px-6">
      <motion.div
        className="h-px bg-border origin-left"
        style={{ scaleX }}
      />
    </div>
  );
};

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  return (
    <div className="relative">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 z-50 flex items-center gap-1 px-5 md:px-6 py-4">
        <Logo />
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-5 h-5 flex items-center justify-center text-foreground hover:text-muted-foreground transition-colors duration-200"
          aria-label="Toggle menu"
          animate={{ rotate: sidebarOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Push layout wrapper */}
      <motion.div
        animate={{ x: sidebarOpen ? 240 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <main>
          <div id="hero"><HeroSection /></div>
          <SectionDivider />
          <div id="projects"><ProjectsSection /></div>
          <SectionDivider />
          <div id="news"><NewsSection /></div>
          <SectionDivider />
          <div id="photos"><PhotoSection /></div>
          <SectionDivider />
          <div id="about"><AboutSection /></div>
          <Footer />
        </main>
      </motion.div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.nav
              className="fixed left-0 top-0 h-screen w-[240px] bg-sidebar border-r border-sidebar-border z-30 flex flex-col justify-between py-14 px-5"
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -16, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex flex-col gap-0.5 mt-4">
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className="text-left py-2 text-sm font-medium text-sidebar-foreground hover:text-sidebar-primary transition-colors duration-200"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.03, duration: 0.2 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>

              <p className="mono-text">© 2026</p>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
