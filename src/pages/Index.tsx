import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
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
  { id: "photos", label: "Photos" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com" },
];
const themeOptions = ["Dark", "Light", "System"] as const;
const themeMap = { Dark: "dark", Light: "light", System: "system" } as const;

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-1 mt-8">
      {themeOptions.map((opt) => {
        const val = themeMap[opt];
        const active = theme === val;
        return (
          <button
            key={opt}
            onClick={() => setTheme(val)}
            className={`font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 border transition-colors duration-200 ${
              active
                ? "text-foreground/80 border-foreground/30"
                : "text-foreground/20 border-foreground/8 hover:text-foreground/40 hover:border-foreground/15"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (item: typeof navItems[number]) => {
    if (item.href) {
      window.open(item.href, "_blank", "noopener");
    } else {
      const el = document.getElementById(item.id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setSidebarOpen(false);
  };

  return (
    <div className="relative">
      {/* Header gradient — short, smooth fade */}
      <div
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
        style={{
          height: 64,
          background: "linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 60%, transparent 100%)",
        }}
      />

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

      {/* Sidebar — no border, above gradient */}
      <motion.nav
        className="fixed left-0 top-0 h-screen w-[240px] bg-background z-[45] flex flex-col justify-center px-6"
        animate={{ x: sidebarOpen ? 0 : -240 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item)}
              className="text-left py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Theme switch */}
        <ThemeSwitch />
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
