import { useState, useEffect, useLayoutEffect } from "react";
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
import headshotUrl from "@/assets/headshot.jpg";
import { useIsMobile } from "@/hooks/use-mobile";
import { preloadImages, scheduleImagePreloads } from "@/lib/imagePreload";
import { inspirationItems } from "@/lib/inspirationItems";
import { albums, coverFor } from "@/lib/photoAlbums";
import { scrollToPageSection } from "@/lib/scroll";
import { featuredProjectIds, newsItems, projectItems } from "@/lib/siteContent";

const HOME_INTRO_AUTO_SCROLL_DELAY = 3408;
const HOME_INTRO_AUTO_SCROLL_DURATION = 2200;
const HEADER_SCROLL_OFFSET = 96;
const WORK_AUTO_SCROLL_OFFSET = 118;
const WORK_SCROLL_CONTENT_SELECTOR = "[data-work-scroll-content]";
const HOME_INTRO_STORAGE_KEY = "pixel-canvas-home-intro-seen";

const easeIntroScroll = (progress: number) => {
  if (progress < 0.5) return 4 * progress * progress * progress;
  return 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [aboutRevealEnabled, setAboutRevealEnabled] = useState(false);
  const [playHomeIntro] = useState(() => {
    if (typeof window === "undefined") return false;

    try {
      const hasSeenIntro = window.sessionStorage.getItem(HOME_INTRO_STORAGE_KEY) === "true";
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const shouldPlay = !hasSeenIntro && !window.location.hash && !reduceMotion;
      window.sessionStorage.setItem(HOME_INTRO_STORAGE_KEY, "true");
      return shouldPlay;
    } catch {
      return !window.location.hash;
    }
  });
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

  useLayoutEffect(() => {
    if (location.hash) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [location.hash]);

  useEffect(() => {
    const featuredProjectImages = featuredProjectIds
      .map((id) => projectItems.find((project) => project.id === id)?.image)
      .filter((image): image is string => Boolean(image));
    const photoCovers = albums.map(coverFor);
    const newsAssets = newsItems.flatMap((item) => [item.imageUrl, item.logoUrl]).filter((src): src is string => Boolean(src));
    const inspirationAssets = inspirationItems.map((item) => item.imageUrl).filter((src): src is string => Boolean(src));

    void preloadImages([headshotUrl, ...featuredProjectImages.slice(0, 4), ...photoCovers.slice(0, 4)], {
      decode: true,
      fetchPriority: "high",
      linkPreload: true,
    });
    scheduleImagePreloads([...photoCovers.slice(4), ...newsAssets, ...inspirationAssets, ...featuredProjectImages.slice(4)], {
      decode: true,
      fetchPriority: "low",
    });
  }, []);

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
    if (!playHomeIntro) {
      setAboutRevealEnabled(true);
      return;
    }

    if (isMobile) {
      setAboutRevealEnabled(true);
      return;
    }

    if (location.hash || window.scrollY > 80) {
      setAboutRevealEnabled(true);
      return;
    }

    let cancelled = false;
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
      const workScrollOffset = window.innerWidth >= 768 ? WORK_AUTO_SCROLL_OFFSET : HEADER_SCROLL_OFFSET;
      const getWorkScrollTop = () => {
        const workContent = target.querySelector<HTMLElement>(WORK_SCROLL_CONTENT_SELECTOR) ?? target;
        const contentRect = workContent.getBoundingClientRect();
        return Math.max(0, window.scrollY + contentRect.top - workScrollOffset);
      };
      const end = getWorkScrollTop();

      const settleWorkScrollPosition = (attempt = 0) => {
        const refinedEnd = getWorkScrollTop();
        if (Math.abs(refinedEnd - window.scrollY) <= 2 || refinedEnd < window.scrollY || attempt >= 4) {
          waitForPostAutoIntent();
          return;
        }

        window.scrollTo(0, refinedEnd);
        window.requestAnimationFrame(() => settleWorkScrollPosition(attempt + 1));
      };

      if (reduceMotion) {
        window.scrollTo(0, end);
        removeIntentListeners();
        settleWorkScrollPosition();
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
        settleWorkScrollPosition();
      };

      frame = window.requestAnimationFrame(step);
    };

    const timer = window.setTimeout(() => {
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
  }, [isMobile, location.hash, playHomeIntro]);

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
          <div id="hero"><HeroSection playIntro={playHomeIntro} /></div>
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
