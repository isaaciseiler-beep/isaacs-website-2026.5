import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Logo from "@/components/Logo";
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import ProjectsSection from "@/components/ProjectsSection";
import NewsSection from "@/components/NewsSection";
import PhotoSection from "@/components/PhotoSection";
import InspirationBoard from "@/components/InspirationBoard";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import ChatOrb from "@/components/ChatOrb";

const navItems = [
  { id: "hero", label: "Home" },
  { id: "featured", label: "Featured" },
  { id: "projects", label: "Projects" },
  { id: "news", label: "News" },
  { id: "photos", label: "Photos" },
  { id: "inspiration", label: "Inspiration" },
  { id: "about", label: "About" },
];

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
      <div className="fixed top-0 left-0 z-50 flex items-center gap-1 px-6 md:px-6 py-4">
        <Logo />
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-5 h-5 flex items-center justify-center text-foreground hover:text-foreground/60 transition-colors duration-200"
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
          <div id="featured"><FeaturedSection /></div>
          <div id="projects"><ProjectsSection /></div>
          <div id="news"><NewsSection /></div>
          <div id="photos"><PhotoSection /></div>
          <div id="inspiration"><InspirationBoard /></div>
          <div id="about"><AboutSection /></div>
          <Footer />
        </main>
      </motion.div>

      {/* Sidebar */}
      <motion.nav
        className="fixed left-0 top-0 h-screen w-[240px] bg-sidebar border-r border-sidebar-border z-30 flex flex-col justify-between py-14 px-6"
        animate={{ x: sidebarOpen ? 0 : -240 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="flex flex-col gap-0.5 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="text-left py-2 text-sm font-medium text-sidebar-foreground hover:text-sidebar-primary transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="mono-text">© 2026</p>
      </motion.nav>

      {/* Overlay to close sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat orb */}
      <ChatOrb />
    </div>
  );
};

export default Index;
