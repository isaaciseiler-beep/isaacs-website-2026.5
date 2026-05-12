import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = lazy(() => import("./pages/Index.tsx"));
const PhotosPage = lazy(() => import("./pages/PhotosPage.tsx"));
const PhotoMapPage = lazy(() => import("./pages/PhotoMapPage.tsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.tsx"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage.tsx"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage.tsx"));
const FulbrightMapPage = lazy(() => import("./pages/FulbrightMapPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const PAGE_TRANSITION_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const AnimatedRoutes = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={location.pathname}
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, filter: "blur(8px)" }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)" }}
        exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, filter: "blur(10px)" }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.24,
          ease: PAGE_TRANSITION_EASE,
          filter: { duration: prefersReducedMotion ? 0 : 0.2, ease: PAGE_TRANSITION_EASE },
        }}
      >
        <Suspense fallback={null}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/photos/map" element={<PhotoMapPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/fulbrightmap" element={<FulbrightMapPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
