import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  return (
    <div className="relative">
      {/* Sidebar trigger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-5 left-5 z-50 w-10 h-10 flex items-center justify-center text-foreground hover:text-muted-foreground transition-colors duration-200"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.nav
              className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-50 flex flex-col justify-between py-10 px-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="mb-10 text-sidebar-foreground hover:text-sidebar-primary transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col gap-1">
                  {navItems.map((item, i) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className="text-left py-2.5 text-lg font-medium text-sidebar-foreground hover:text-sidebar-primary transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <p className="mono-text">© 2026</p>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main>
        <div id="hero"><HeroSection /></div>
        <div id="projects"><ProjectsSection /></div>
        <div id="news"><NewsSection /></div>
        <div id="photos"><PhotoSection /></div>
        <div id="about"><AboutSection /></div>
        <Footer />
      </main>
    </div>
  );
};

export default Index;
