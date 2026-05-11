import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = lazy(() => import("./pages/Index.tsx"));
const PhotosPage = lazy(() => import("./pages/PhotosPage.tsx"));
const PhotoMapPage = lazy(() => import("./pages/PhotoMapPage.tsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.tsx"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage.tsx"));
const FulbrightMapPage = lazy(() => import("./pages/FulbrightMapPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/photos" element={<PhotosPage />} />
              <Route path="/photos/map" element={<PhotoMapPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/fulbrightmap" element={<FulbrightMapPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
