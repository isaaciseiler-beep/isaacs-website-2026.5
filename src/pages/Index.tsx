import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
import ParallaxSection from "@/components/ParallaxSection";
import Sidebar, { sitemapItems } from "@/components/Sidebar";

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

  return (
    <div className="relative">
      <div
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
        style={{
          height: 64,
          background: "linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 60%, transparent 100%)",
        }}
      />

      <div className="fixed top-0 left-0 z-[60] flex items-center gap-1 px-6 md:px-6 py-4">
        <Link to="/" className="contents"><Logo /></Link>
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          activeSection={activeSection}
        />
      </div>

      <motion.div
        animate={{ marginLeft: sidebarOpen ? 240 : 0, marginRight: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <main>
          <div id="hero"><HeroSection /></div>
          <ParallaxSection id="featured" offset={50} clip={false}><FeaturedSection /></ParallaxSection>
          <ParallaxSection id="about" offset={60}><AboutSection /></ParallaxSection>
          <ParallaxSection id="projects" offset={70}><ProjectsSection /></ParallaxSection>
          <ParallaxSection id="news" offset={55}><NewsSection /></ParallaxSection>
          <ParallaxSection id="photos" offset={80}><PhotoSection /></ParallaxSection>
          <ParallaxSection id="inspiration" offset={55}><InspirationBoard /></ParallaxSection>
          <Footer />
        </main>
      </motion.div>

      <ChatOrb />
    </div>
  );
};

export default Index;
