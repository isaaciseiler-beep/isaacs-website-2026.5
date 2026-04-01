import { useRef, useState, useCallback, useEffect } from "react";
import PortfolioSidebar from "@/components/PortfolioSidebar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import PhotoSection from "@/components/PhotoSection";
import AboutSection from "@/components/AboutSection";

const Index = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("hero");

  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    photos: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
  };

  const handleNavigate = useCallback((section: string) => {
    const ref = sectionRefs[section as keyof typeof sectionRefs];
    if (ref.current && scrollRef.current) {
      scrollRef.current.scrollTo({
        left: ref.current.offsetLeft,
        behavior: "smooth",
      });
    }
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const entries = Object.entries(sectionRefs);

      for (let i = entries.length - 1; i >= 0; i--) {
        const [key, ref] = entries[i];
        if (ref.current && ref.current.offsetLeft <= scrollLeft + 200) {
          setActiveSection(key);
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Convert vertical wheel to horizontal scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY + e.deltaX;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="relative">
      <PortfolioSidebar activeSection={activeSection} onNavigate={handleNavigate} />

      <div ref={scrollRef} className="horizontal-scroll ml-16">
        <div ref={sectionRefs.hero}>
          <HeroSection />
        </div>
        <div ref={sectionRefs.projects}>
          <ProjectsSection />
        </div>
        <div ref={sectionRefs.photos}>
          <PhotoSection />
        </div>
        <div ref={sectionRefs.about}>
          <AboutSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
