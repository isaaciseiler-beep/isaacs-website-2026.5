import { Component, Suspense, lazy, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Index from "./pages/Index.tsx";
import { ThemeProvider } from "@/components/ThemeProvider";

const ChatOrb = lazy(() => import("@/components/ChatOrb"));
const PhotosPage = lazy(() => import("./pages/PhotosPage.tsx"));
const PhotoMapPage = lazy(() => import("./pages/PhotoMapPage.tsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.tsx"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage.tsx"));
const AIStateGovernmentIndexPage = lazy(() => import("./pages/AIStateGovernmentIndexPage.tsx"));
const SeniorThesisLocalJournalismPage = lazy(() => import("./pages/SeniorThesisLocalJournalismPage.tsx"));
const CredentialsPage = lazy(() => import("./pages/CredentialsPage.tsx"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage.tsx"));
const ExperienceGamePage = lazy(() => import("./pages/ExperienceGamePage.tsx"));
const FulbrightMapPage = lazy(() => import("./pages/FulbrightMapPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const PAGE_TRANSITION_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

class RouteErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Route render failed", error, errorInfo);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const RouteFallback = () => {
  const location = useLocation();

  if (location.pathname === "/fulbrightmap") {
    return (
      <main className="grid min-h-[100svh] place-items-center bg-neutral-950 p-5 text-center text-white">
        <div>
          <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-white/80 shadow-lg shadow-black/30" />
          <div className="mt-4 text-lg font-semibold">Preparing the map</div>
          <p className="mt-1 text-sm leading-5 text-white/65">Loading New Taipei and shared spots.</p>
        </div>
      </main>
    );
  }

  return null;
};

const FulbrightMapErrorFallback = () => (
  <main className="grid min-h-[100svh] place-items-center bg-neutral-950 p-5 text-center text-white">
    <section className="max-w-md rounded-[1.25rem] border border-white/15 bg-neutral-950/80 p-6 shadow-2xl">
      <div className="text-lg font-semibold">The map could not finish loading</div>
      <p className="mt-2 text-sm leading-6 text-white/65">
        Refresh the page once. If it still fails, the browser may be blocking
        the map script, WebGL, or the Mapbox request.
      </p>
    </section>
  </main>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={location.pathname}
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
        exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.24,
          ease: PAGE_TRANSITION_EASE,
        }}
      >
        <RouteErrorBoundary
          fallback={location.pathname === "/fulbrightmap" ? <FulbrightMapErrorFallback /> : null}
        >
          <Suspense fallback={<RouteFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Index />} />
              <Route path="/photos" element={<PhotosPage />} />
              <Route path="/photos/map" element={<PhotoMapPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/artificial-intelligence-in-state-government-index" element={<AIStateGovernmentIndexPage />} />
              <Route path="/projects/senior-thesis-local-journalism" element={<SeniorThesisLocalJournalismPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/credentials" element={<CredentialsPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/experience/arcade" element={<ExperienceGamePage />} />
              <Route path="/fulbrightmap" element={<FulbrightMapPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </motion.div>
    </AnimatePresence>
  );
};

const ChatOrbGate = () => {
  const location = useLocation();
  const [shouldLoad, setShouldLoad] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.scrollY > 10;
  });

  useEffect(() => {
    if (location.pathname === "/experience/arcade") {
      setShouldLoad(false);
      return;
    }

    setShouldLoad(window.scrollY > 10);
    if (window.scrollY > 10) return;

    const load = () => setShouldLoad(true);
    window.addEventListener("scroll", load, { once: true, passive: true });
    return () => window.removeEventListener("scroll", load);
  }, [location.pathname]);

  if (location.pathname === "/experience/arcade") {
    return null;
  }

  if (!shouldLoad) return null;

  return (
    <Suspense fallback={null}>
      <ChatOrb />
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <AnimatedRoutes />
        <ChatOrbGate />
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
