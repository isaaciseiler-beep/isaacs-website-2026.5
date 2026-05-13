import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import NewsSection from "@/components/NewsSection";
import PhotoSection from "@/components/PhotoSection";
import InspirationBoard from "@/components/InspirationBoard";
import IsaacAISection from "@/components/IsaacAISection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import ParallaxSection from "@/components/ParallaxSection";
import Sidebar, { sitemapItems } from "@/components/Sidebar";
import SiteHeader from "@/components/SiteHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { scrollToPageSection } from "@/lib/scroll";

const HOME_INTRO_AUTO_SCROLL_DELAY = 3408;
const HOME_INTRO_AUTO_SCROLL_DURATION = 2200;
const HEADER_SCROLL_OFFSET = 96;
const WORK_SCROLL_CONTENT_SELECTOR = "[data-work-scroll-content]";

const easeIntroScroll = (progress: number) => {
  if (progress < 0.5) return 4 * progress * progress * progress;
  return 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [aboutRevealEnabled, setAboutRevealEnabled] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const handleSidebarToggle = () => {
    setSearchOpen(false);
    setSidebarOpen((open) => !open);
  };

  const handleSearchOpen = () => {
    setSidebarOpen(false);
    setSearchOpen(true);
  };

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

  useEffect(() => {
    const sectionId = location.hash.replace("#", "");
    if (!sectionId) return;

    const timers = [80, 360, 760].map((delay) =>
      window.setTimeout(() => scrollToPageSection(sectionId), delay),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [location.hash]);

  useEffect(() => {
    if (location.hash || window.scrollY > 80) {
      setAboutRevealEnabled(true);
      return;
    }

    let cancelled = false;
    let timer: number;
    let frame = 0;
    let awaitingPostAutoIntent = false;

    const postAutoIntentListeners: Array<[keyof WindowEventMap, EventListenerOrEventListenerObject]> = [
      ["wheel", markAboutReady],
      ["touchmove", markAboutReady],
      ["keydown", markAboutReady],
      ["pointerdown", markAboutReady],
    ];

    function removePostAutoIntentListeners() {
      postAutoIntentListeners.forEach(([eventName, listener]) => {
        window.removeEventListener(eventName, listener);
      });
    }

    function waitForPostAutoIntent() {
      awaitingPostAutoIntent = true;
      postAutoIntentListeners.forEach(([eventName, listener]) => {
        window.addEventListener(eventName, listener, { passive: eventName !== "keydown", once: true });
      });
    }

    function markAboutReady() {
      setAboutRevealEnabled(true);
      removePostAutoIntentListeners();
    }

    const removeIntentListeners = () => {
      window.removeEventListener("wheel", cancelAutoScroll);
      window.removeEventListener("touchmove", cancelAutoScroll);
      window.removeEventListener("keydown", cancelAutoScroll);
      window.removeEventListener("pointerdown", cancelAutoScroll);
    };

    const cancelAutoScroll = () => {
      cancelled = true;
      if (!awaitingPostAutoIntent) setAboutRevealEnabled(true);
      window.clearTimeout(timer);
      if (frame) window.cancelAnimationFrame(frame);
      removeIntentListeners();
      removePostAutoIntentListeners();
    };

    const autoScrollToWork = () => {
      const target = document.getElementById("projects");
      if (!target) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const start = window.scrollY;
      const workContent = target.querySelector<HTMLElement>(WORK_SCROLL_CONTENT_SELECTOR) ?? target;
      const contentRect = workContent.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const centeredEnd = start + contentRect.top + contentRect.height / 2 - viewportCenter;
      const topAlignedEnd = start + contentRect.top - HEADER_SCROLL_OFFSET;
      const end = Math.max(
        0,
        contentRect.height > window.innerHeight - HEADER_SCROLL_OFFSET
          ? topAlignedEnd
          : centeredEnd,
      );

      if (reduceMotion) {
        window.scrollTo(0, end);
        removeIntentListeners();
        waitForPostAutoIntent();
        return;
      }

      const startedAt = performance.now();
      const step = (now: number) => {
        if (cancelled) return;

        const progress = Math.min(1, (now - startedAt) / HOME_INTRO_AUTO_SCROLL_DURATION);
        const eased = easeIntroScroll(progress);
        window.scrollTo(0, start + (end - start) * eased);

        if (progress < 1) {
          frame = window.requestAnimationFrame(step);
          return;
        }

        removeIntentListeners();
        waitForPostAutoIntent();
      };

      frame = window.requestAnimationFrame(step);
    };

    timer = window.setTimeout(() => {
      if (cancelled) return;
      autoScrollToWork();
    }, HOME_INTRO_AUTO_SCROLL_DELAY);

    window.addEventListener("wheel", cancelAutoScroll, { passive: true });
    window.addEventListener("touchmove", cancelAutoScroll, { passive: true });
    window.addEventListener("keydown", cancelAutoScroll);
    window.addEventListener("pointerdown", cancelAutoScroll);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (frame) window.cancelAnimationFrame(frame);
      removeIntentListeners();
      removePostAutoIntentListeners();
    };
  }, [location.hash]);

  return (
    <div className="relative">
      <Sidebar
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        onClose={() => setSidebarOpen(false)}
        onSearchOpen={handleSearchOpen}
        activeSection={activeSection}
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
        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
      >
        <main>
          <div id="hero"><HeroSection /></div>
          <ParallaxSection id="projects" offset={70}><ProjectsSection /></ParallaxSection>
          <ParallaxSection id="about" offset={60}><AboutSection revealEnabled={aboutRevealEnabled} /></ParallaxSection>
          <ParallaxSection id="news" offset={55}><NewsSection /></ParallaxSection>
          <ParallaxSection id="photos" offset={80}><PhotoSection /></ParallaxSection>
          <div id="inspiration">
            <ParallaxSection offset={55} clip={false}><InspirationBoard /></ParallaxSection>
          </div>
          <ParallaxSection id="isaac-ai" offset={28} clip={false}><IsaacAISection /></ParallaxSection>
          <Footer />
        </main>
      </motion.div>

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

export default Index;
