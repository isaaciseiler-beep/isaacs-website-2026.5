import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import NewsSection from "@/components/NewsSection";
import PhotoSection from "@/components/PhotoSection";
import InspirationBoard from "@/components/InspirationBoard";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import ChatOrb from "@/components/ChatOrb";
import ParallaxSection from "@/components/ParallaxSection";
import Sidebar, { sitemapItems } from "@/components/Sidebar";
import SiteHeader from "@/components/SiteHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const isMobile = useIsMobile();

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

  return (
    <div className="relative">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        showToggle={false}
      />

      <motion.div
        animate={{
          marginLeft: sidebarOpen && !isMobile ? 240 : 0,
          width: sidebarOpen && !isMobile ? "calc(100% - 240px)" : "100%",
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <main>
          <div id="hero"><HeroSection /></div>
          <ParallaxSection id="projects" offset={70}><ProjectsSection /></ParallaxSection>
          <ParallaxSection id="about" offset={60}><AboutSection /></ParallaxSection>
          <ParallaxSection id="news" offset={55}><NewsSection /></ParallaxSection>
          <ParallaxSection id="photos" offset={80}><PhotoSection /></ParallaxSection>
          <ParallaxSection id="inspiration" offset={55}><InspirationBoard /></ParallaxSection>
          <Footer />
        </main>
      </motion.div>

      {!sidebarOpen && <ChatOrb />}

      <SiteHeader open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
    </div>
  );
};

export default Index;
