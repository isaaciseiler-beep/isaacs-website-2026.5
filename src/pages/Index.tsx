import { Suspense, lazy, useCallback, useState, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import HomeIntroSequence from "@/components/HomeIntroSequence";
import ParallaxSection from "@/components/ParallaxSection";
import Sidebar, { sitemapItems } from "@/components/Sidebar";
import SiteHeader from "@/components/SiteHeader";
import headshotUrl from "@/assets/headshot.jpg";
import { useIsMobile } from "@/hooks/use-mobile";
import { preloadImages, scheduleImagePreloads } from "@/lib/imagePreload";
import { inspirationItems } from "@/lib/inspirationItems";
import { albums, coverFor } from "@/lib/photoAlbums";
import { HEADER_SCROLL_OFFSET, scrollToPageSection } from "@/lib/scroll";
import { featuredProjectIds, newsItems, projectItems } from "@/lib/siteContent";

const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const NewsSection = lazy(() => import("@/components/NewsSection"));
const PhotoSection = lazy(() => import("@/components/PhotoSection"));
const InspirationBoard = lazy(() => import("@/components/InspirationBoard"));
const IsaacAISection = lazy(() => import("@/components/IsaacAISection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const Footer = lazy(() => import("@/components/Footer"));

const HOME_INTRO_PREBOOT_CLASS = "home-intro-preboot";

type IntroWindow = Window & {
  __homeIntroPreboot?: boolean;
};

const trackedSectionIds = sitemapItems
  .map((item) => item.scrollTo)
  .filter((sectionId): sectionId is string => Boolean(sectionId));

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [aboutRevealEnabled, setAboutRevealEnabled] = useState(false);
  const [playHomeIntro] = useState(() => {
    if (typeof window === "undefined") return false;

    try {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const introWindow = window as IntroWindow;
      const shouldPlay =
        !window.location.hash &&
        !reduceMotion &&
        (introWindow.__homeIntroPreboot === true ||
          document.documentElement.classList.contains(HOME_INTRO_PREBOOT_CLASS));

      introWindow.__homeIntroPreboot = false;
      return shouldPlay;
    } catch {
      return document.documentElement.classList.contains(HOME_INTRO_PREBOOT_CLASS);
    }
  });
  const [homeIntroComplete, setHomeIntroComplete] = useState(() => !playHomeIntro);
  const isMobile = useIsMobile();
  const location = useLocation();
  const renderDeferredSections = !playHomeIntro || homeIntroComplete;

  const handleSidebarToggle = () => {
    setSearchOpen(false);
    setSidebarOpen((open) => !open);
  };

  const handleSearchOpen = () => {
    setSidebarOpen(false);
    setSearchOpen(true);
  };

  const handleHomeIntroComplete = useCallback(() => {
    setHomeIntroComplete(true);
  }, []);

  useLayoutEffect(() => {
    if (playHomeIntro) return;

    document.documentElement.classList.remove(HOME_INTRO_PREBOOT_CLASS);
  }, [playHomeIntro]);

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
    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
    if (isMobileViewport && playHomeIntro && !homeIntroComplete) return;

    const featuredProjectImages = featuredProjectIds
      .map((id) => projectItems.find((project) => project.id === id)?.image)
      .filter((image): image is string => Boolean(image));
    const photoCovers = albums.map(coverFor);
    const newsAssets = newsItems.flatMap((item) => [item.imageUrl, item.logoUrl]).filter((src): src is string => Boolean(src));
    const inspirationAssets = inspirationItems.map((item) => item.imageUrl).filter((src): src is string => Boolean(src));

    if (isMobileViewport) {
      scheduleImagePreloads([headshotUrl, ...featuredProjectImages.slice(0, 2), ...photoCovers.slice(0, 2)], {
        decode: true,
        fetchPriority: "low",
      });
    } else {
      void preloadImages([headshotUrl, ...featuredProjectImages.slice(0, 4), ...photoCovers.slice(0, 4)], {
        decode: true,
        fetchPriority: "high",
        linkPreload: true,
      });
    }

    scheduleImagePreloads([...photoCovers.slice(isMobileViewport ? 2 : 4), ...newsAssets, ...inspirationAssets, ...featuredProjectImages.slice(isMobileViewport ? 2 : 4)], {
      decode: true,
      fetchPriority: "low",
    });
  }, [homeIntroComplete, playHomeIntro]);

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;

      const activationLine = HEADER_SCROLL_OFFSET + Math.min(window.innerHeight * 0.38, 340);
      let nextSection = trackedSectionIds[0] ?? "hero";
      let bestScore = Number.POSITIVE_INFINITY;

      trackedSectionIds.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const distanceOutside =
          activationLine < rect.top
            ? rect.top - activationLine
            : activationLine > rect.bottom
              ? activationLine - rect.bottom
              : 0;
        const centerDistance = Math.abs(rect.top + rect.height / 2 - activationLine);
        const score = distanceOutside * window.innerHeight + centerDistance;

        if (score < bestScore) {
          bestScore = score;
          nextSection = sectionId;
        }
      });

      setActiveSection((current) => (current === nextSection ? current : nextSection));
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("load", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("load", scheduleUpdate);
    };
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
    if (!playHomeIntro || homeIntroComplete || isMobile || location.hash || window.scrollY > 80) {
      setAboutRevealEnabled(true);
    }
  }, [homeIntroComplete, isMobile, location.hash, playHomeIntro]);

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
          <div id="hero"><HeroSection playIntro={playHomeIntro} introReady={homeIntroComplete} /></div>
          {renderDeferredSections ? (
            <Suspense fallback={null}>
              <ParallaxSection id="projects" offset={70}><ProjectsSection /></ParallaxSection>
              <ParallaxSection id="about" offset={60}><AboutSection revealEnabled={aboutRevealEnabled} /></ParallaxSection>
              <ParallaxSection id="news" offset={55}><NewsSection /></ParallaxSection>
              <ParallaxSection id="photos" offset={80}><PhotoSection /></ParallaxSection>
              <div id="inspiration">
                <ParallaxSection offset={55} clip={false}><InspirationBoard /></ParallaxSection>
              </div>
              <ParallaxSection id="isaac-ai" offset={28} clip={false}><IsaacAISection /></ParallaxSection>
              <Footer />
            </Suspense>
          ) : null}
        </main>
      </motion.div>

      <SiteHeader
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        searchOpen={searchOpen}
        onSearchOpen={handleSearchOpen}
        onSearchClose={() => setSearchOpen(false)}
      />

      {playHomeIntro && !homeIntroComplete && (
        <HomeIntroSequence play={playHomeIntro} onComplete={handleHomeIntroComplete} />
      )}
    </div>
  );
};

export default Index;
