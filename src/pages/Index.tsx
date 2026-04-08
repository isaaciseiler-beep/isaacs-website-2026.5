import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ChevronRight, Sun, Laptop, Mail } from "lucide-react";
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

const sitemapItems = [
  { id: "hero", label: "Home" },
  { id: "featured", label: "Featured" },
  { id: "projects", label: "Projects" },
  { id: "news", label: "News" },
  { id: "photos", label: "Photos" },
  { id: "inspiration", label: "Inspiration" },
  { id: "about", label: "About" },
];

const socialLinks = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    id: "substack",
    label: "Substack",
    href: "https://substack.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22.539 8.242H1.461V5.406h21.078v2.836zM1.461 10.812V24L12 18.11 22.539 24V10.812H1.461zM22.539 0H1.461v2.836h21.078V0z"/>
      </svg>
    ),
  },
];

const SlimMoon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const themeOptions = [
  { value: "dark" as const, label: "Dark", icon: SlimMoon },
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "system" as const, label: "System", icon: Laptop },
];

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-2">
      {themeOptions.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              active
                ? "bg-white text-black shadow-sm"
                : "bg-foreground/10 text-foreground hover:bg-foreground/15"
            }`}
            aria-label={opt.label}
          >
            <opt.icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed left-0 top-0 bottom-0 w-[2px] z-50 pointer-events-none">
      <motion.div
        className="w-full bg-foreground/20 origin-top"
        style={{ scaleY, height: "100%" }}
      />
    </div>
  );
};

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sitemapItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSitemapNavigate = (item: typeof sitemapItems[number]) => {
    const el = document.getElementById(item.id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  const handleSocialClick = (href: string) => {
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener");
    } else {
      window.location.href = href;
    }
    setSidebarOpen(false);
  };

  return (
    <div className="relative">
      <ScrollProgress />

      {/* Header gradient */}
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

      {/* Sidebar */}
      <motion.nav
        className="fixed left-0 top-0 h-screen w-[240px] bg-background z-[45] flex flex-col justify-between px-6 py-20 overflow-y-auto"
        animate={{ x: sidebarOpen ? 0 : -240 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Sitemap — top */}
        <AnimatePresence>
          {sidebarOpen && (
            <div className="mt-4">
              <div className="flex flex-col gap-0.5">
                {sitemapItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -12, filter: "blur(4px)" }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    onClick={() => handleSitemapNavigate(item)}
                    className={`text-left py-1.5 text-sm font-medium transition-colors duration-200 ${
                      activeSection === item.id
                        ? "text-foreground"
                        : "text-foreground/40 hover:text-foreground/70"
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Bottom section — Get in Touch + Appearance */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p className="mono-text mb-3">Get in Touch</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  <button
                    key="contact"
                    onClick={() => { window.location.href = "/contact"; setSidebarOpen(false); }}
                    className="w-10 h-10 rounded-xl bg-foreground/10 hover:bg-foreground/15 text-foreground flex items-center justify-center transition-all duration-200"
                    aria-label="Contact"
                  >
                    <Mail className="w-4 h-4" />
                  </button>,
                  ...socialLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleSocialClick(link.href)}
                      className="w-10 h-10 rounded-xl bg-foreground/10 hover:bg-foreground/15 text-foreground flex items-center justify-center transition-all duration-200"
                      aria-label={link.label}
                    >
                      {link.icon}
                    </button>
                  )),
                ]}
              </div>

              <p className="mono-text mb-3 mt-6">Appearance</p>
              <ThemeSwitch />
            </motion.div>
          )}
        </AnimatePresence>
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

      <ChatOrb />
    </div>
  );
};

export default Index;
