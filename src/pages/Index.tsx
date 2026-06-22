import { Suspense, lazy, useCallback, useState, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import HomeIntroSequence from "@/components/HomeIntroSequence";
import ParallaxSection from "@/components/ParallaxSection";
import Sidebar, { sitemapItems } from "@/components/Sidebar";
import SiteHeader from "@/components/SiteHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { preloadImages, scheduleImagePreloads } from "@/lib/imagePreload";
import { HEADER_SCROLL_OFFSET, scrollToPageSection } from "@/lib/scroll";

const loadProjectsSection = () => import("@/components/ProjectsSection");
const loadNewsSection = () => import("@/components/NewsSection");
const loadPhotoSection = () => import("@/components/PhotoSection");
const loadInspirationBoard = () => import("@/components/InspirationBoard");
const loadIsaacAISection = () => import("@/components/IsaacAISection");
const loadAboutSection = () => import("@/components/AboutSection");
const loadFooter = () => import("@/components/Footer");

const ProjectsSection = lazy(loadProjectsSection);
const NewsSection = lazy(loadNewsSection);
const PhotoSection = lazy(loadPhotoSection);
const InspirationBoard = lazy(loadInspirationBoard);
const IsaacAISection = lazy(loadIsaacAISection);
const AboutSection = lazy(loadAboutSection);
const Footer = lazy(loadFooter);

const HOME_INTRO_PREBOOT_CLASS = "home-intro-preboot";
const HOME_INTRO_FAILSAFE_MS = 4200;
const MOBILE_HOME_INTRO_FAILSAFE_MS = HOME_INTRO_FAILSAFE_MS;

type IntroWindow = Window & {
  __homeIntroPreboot?: boolean;
  __homeIntroShouldPlay?: boolean;
};

const trackedSectionIds = sitemapItems
  .map((item) => item.scrollTo)
  .filter((sectionId): sectionId is string => Boolean(sectionId));

const homeSectionFrame = "home-section-frame";
const homeSectionFrameFirst = `${homeSectionFrame} home-section-frame--first`;
const homeSectionFrameLast = `${homeSectionFrame} home-section-frame--last`;
const homeSectionFallback = <div className="home-section-skeleton" aria-hidden="true" />;

const preloadCoreHomeSections = () => {
  void Promise.all([loadProjectsSection(), loadAboutSection()]);
};

const preloadSecondaryHomeSections = () => {
  void Promise.all([loadNewsSection(), loadPhotoSection()]);
};

const preloadRemainingHomeSections = () => {
  void Promise.all([loadInspirationBoard(), loadIsaacAISection(), loadFooter()]);
};

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [aboutRevealEnabled, setAboutRevealEnabled] = useState(false);
  const [homeIntroHeroReady, setHomeIntroHeroReady] = useState(false);
  const [homeSectionTier, setHomeSectionTier] = useState(0);
  const [playHomeIntro] = useState(() => {
    if (typeof window === "undefined") return false;

    try {
      const introWindow = window as IntroWindow;
      const shouldPlay =
        !window.location.hash &&
        (introWindow.__homeIntroShouldPlay === true ||
          introWindow.__homeIntroPreboot === true ||
          document.documentElement.classList.contains(HOME_INTRO_PREBOOT_CLASS));

      introWindow.__homeIntroShouldPlay = false;
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
    (window as IntroWindow).__homeIntroPreboot = false;
    document.documentElement.classList.remove(HOME_INTRO_PREBOOT_CLASS);
    setHomeIntroHeroReady(true);
    setHomeIntroComplete(true);
  }, []);

  const handleHomeIntroRevealHero = useCallback(() => {
    setHomeIntroHeroReady(true);
  }, []);

  useLayoutEffect(() => {
    if (playHomeIntro) return;

    (window as IntroWindow).__homeIntroPreboot = false;
    document.documentElement.classList.remove(HOME_INTRO_PREBOOT_CLASS);
    setHomeIntroHeroReady(true);
  }, [playHomeIntro]);

  useEffect(() => {
    if (!playHomeIntro || homeIntroComplete) return;

    const isMobileViewport =
      window.matchMedia("(max-width: 899px)").matches ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const timer = window.setTimeout(
      handleHomeIntroComplete,
      isMobileViewport ? MOBILE_HOME_INTRO_FAILSAFE_MS : HOME_INTRO_FAILSAFE_MS,
    );

    return () => window.clearTimeout(timer);
  }, [handleHomeIntroComplete, homeIntroComplete, playHomeIntro]);

  useLayoutEffect(() => {
    if (location.hash) return;
    if (
      !window.matchMedia("(max-width: 899px)").matches &&
      !window.matchMedia("(hover: none) and (pointer: coarse)").matches
    ) {
      return;
    }

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [location.hash]);

  useEffect(() => {
    const isMobileViewport =
      window.matchMedia("(max-width: 899px)").matches ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    const warmSections = () => {
      preloadCoreHomeSections();

      const preloadLowerSections = () => {
        preloadSecondaryHomeSections();

        const preloadFinalSections = () => preloadRemainingHomeSections();
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(preloadFinalSections, { timeout: isMobileViewport ? 1800 : 1200 });
        } else {
          window.setTimeout(preloadFinalSections, isMobileViewport ? 1200 : 800);
        }
      };

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(preloadLowerSections, { timeout: isMobileViewport ? 1200 : 700 });
      } else {
        window.setTimeout(preloadLowerSections, isMobileViewport ? 800 : 420);
      }
    };

    if (isMobileViewport && playHomeIntro && !homeIntroComplete) {
      const timer = window.setTimeout(warmSections, 600);
      return () => window.clearTimeout(timer);
    }

    warmSections();
  }, [homeIntroComplete, playHomeIntro]);

  useEffect(() => {
    if (!renderDeferredSections) {
      setHomeSectionTier(0);
      return;
    }

    const raiseTier = (tier: number) => {
      setHomeSectionTier((current) => Math.max(current, tier));
    };

    if (location.hash) {
      raiseTier(3);
      return;
    }

    raiseTier(1);
    const timers = [
      window.setTimeout(() => raiseTier(2), 180),
      window.setTimeout(() => raiseTier(3), 900),
    ];
    const loadAll = () => raiseTier(3);

    window.addEventListener("scroll", loadAll, { once: true, passive: true });
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("scroll", loadAll);
    };
  }, [location.hash, renderDeferredSections]);

  useEffect(() => {
    const isMobileViewport =
      window.matchMedia("(max-width: 899px)").matches ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    let disposed = false;
    let preloadTimer: number | undefined;

    const preloadHomepageImages = async () => {
      const [
        headshotModule,
        { inspirationItems },
        { albums, coverFor },
        { featuredProjectIds, newsItems, projectItems },
      ] = await Promise.all([
        import("@/assets/headshot.jpg"),
        import("@/lib/inspirationItems"),
        import("@/lib/photoAlbums"),
        import("@/lib/siteContent"),
      ]);
      if (disposed) return;

      const headshotUrl = headshotModule.default;
      const featuredProjectImages = featuredProjectIds
        .map((id) => projectItems.find((project) => project.id === id)?.image)
        .filter((image): image is string => Boolean(image));
      const criticalProjectImages = featuredProjectImages.slice(0, isMobileViewport ? 1 : 2);
      const deferredProjectImages = featuredProjectImages.slice(criticalProjectImages.length);
      const photoCovers = albums.map(coverFor);
      const criticalNewsCount = isMobileViewport ? 1 : 2;
      const criticalPhotoCount = isMobileViewport ? 1 : 2;
      const criticalNewsAssets = newsItems
        .slice(0, criticalNewsCount)
        .flatMap((item) => [item.imageUrl, item.logoUrl])
        .filter((src): src is string => Boolean(src));
      const deferredNewsAssets = newsItems
        .slice(criticalNewsCount)
        .flatMap((item) => [item.imageUrl, item.logoUrl])
        .filter((src): src is string => Boolean(src));
      const inspirationAssets = inspirationItems.map((item) => item.imageUrl).filter((src): src is string => Boolean(src));

      void preloadImages([
        headshotUrl,
        ...criticalProjectImages,
      ], {
        decode: true,
        fetchPriority: "high",
        linkPreload: !isMobileViewport,
      });

      scheduleImagePreloads([
        ...deferredProjectImages,
        ...criticalNewsAssets,
        ...photoCovers.slice(0, criticalPhotoCount),
        ...photoCovers.slice(criticalPhotoCount),
        ...deferredNewsAssets,
        ...inspirationAssets,
      ], {
        batchSize: isMobileViewport ? 3 : 5,
        decode: false,
        fallbackDelay: isMobileViewport ? 220 : 140,
        fetchPriority: "low",
        idleTimeout: isMobileViewport ? 1200 : 700,
      });
    };

    if (isMobileViewport && playHomeIntro && !homeIntroComplete) {
      preloadTimer = window.setTimeout(() => {
        void preloadHomepageImages();
      }, 600);
    } else {
      void preloadHomepageImages();
    }

    return () => {
      disposed = true;
      if (preloadTimer) window.clearTimeout(preloadTimer);
    };
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

    const timers = [80, 360, 760, 1400, 2200].map((delay) =>
      window.setTimeout(() => scrollToPageSection(sectionId), delay),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [homeSectionTier, location.hash]);

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
          <div id="hero"><HeroSection playIntro={playHomeIntro} introReady={playHomeIntro ? homeIntroHeroReady : true} /></div>
          {renderDeferredSections ? (
            <>
              <Suspense fallback={homeSectionFallback}>
                <ParallaxSection id="projects" className={homeSectionFrameFirst} offset={34}><ProjectsSection /></ParallaxSection>
              </Suspense>
              {homeSectionTier >= 2 ? (
                <Suspense fallback={homeSectionFallback}>
                  <ParallaxSection id="about" className={homeSectionFrame} offset={30}><AboutSection revealEnabled={aboutRevealEnabled} /></ParallaxSection>
                  <ParallaxSection id="news" className={homeSectionFrame} offset={28}><NewsSection /></ParallaxSection>
                  <ParallaxSection id="photos" className={homeSectionFrame} offset={34}><PhotoSection /></ParallaxSection>
                </Suspense>
              ) : null}
              {homeSectionTier >= 3 ? (
                <Suspense fallback={homeSectionFallback}>
                  <div id="inspiration" className={homeSectionFrame}>
                    <ParallaxSection offset={28} clip={false}><InspirationBoard /></ParallaxSection>
                  </div>
                  <ParallaxSection id="isaac-ai" className={homeSectionFrameLast} offset={18} clip={false}><IsaacAISection /></ParallaxSection>
                  <Footer />
                </Suspense>
              ) : null}
            </>
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
        <HomeIntroSequence
          play={playHomeIntro}
          onRevealHero={handleHomeIntroRevealHero}
          onComplete={handleHomeIntroComplete}
        />
      )}
    </div>
  );
};

export default Index;
