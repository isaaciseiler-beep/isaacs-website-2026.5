import { useRef, useState, useEffect } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import PhotoPreview from "@/components/PhotoPreview";
import { albums, coverFor } from "@/lib/photoAlbums";
import { preloadImages } from "@/lib/imagePreload";
import { useIsMobile } from "@/hooks/use-mobile";

const photos = albums.map((a, i) => ({
  id: i + 1,
  title: a.location,
  image: coverFor(a),
}));

const PhotoSection = () => {
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hasAutoplayed, setHasAutoplayed] = useState(false);
  const [isCycling, setIsCycling] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const isPreviewInView = useInView(previewRef, { amount: 0.55 });
  const shouldFlipPhotos = !prefersReducedMotion && (isCycling || (!isMobile && hovering));

  useEffect(() => {
    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
    void preloadImages(photos.slice(0, isMobileViewport ? 2 : photos.length).map((photo) => photo.image), {
      decode: !isMobileViewport,
      fetchPriority: isMobileViewport ? "low" : "high",
      linkPreload: !isMobileViewport,
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || hasAutoplayed || !isPreviewInView) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setIsCycling(false);
      return;
    }

    let tick = 0;
    setIsCycling(true);
    const schedule = () => {
      const cadence = [520, 380, 260, 200, 170, 160, 170, 200, 260, 340, 420, 500];
      const delay = cadence[tick % cadence.length];
      timeoutRef.current = setTimeout(() => {
        setActiveIdx((tick + 1) % photos.length);
        tick += 1;
        if (tick >= photos.length) {
          setHasAutoplayed(true);
          setIsCycling(false);
          timeoutRef.current = null;
          return;
        }
        schedule();
      }, delay);
    };

    schedule();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, [hasAutoplayed, isPreviewInView, prefersReducedMotion]);

  return (
    <section className="flex h-auto min-h-0 flex-col pb-0 pt-12 md:h-[calc(100svh-9.75rem)] md:min-h-[420px] md:pt-0">
      <div className="mb-5 flex shrink-0 items-end justify-between px-6 md:mb-6">
        <SectionHeading className="mb-0">Photos</SectionHeading>
      </div>

      <div className="px-6 md:min-h-0 md:flex-1">
        <div
          ref={previewRef}
          className="site-corner group relative aspect-[4/5] h-auto min-h-0 w-full cursor-pointer overflow-hidden md:aspect-auto md:h-full"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={() => setPreviewIdx(activeIdx)}
        >
          {photos.map((photo, idx) => (
            <img
              key={photo.id}
              src={photo.image}
              alt={photo.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: idx === activeIdx ? 1 : 0,
                filter: shouldFlipPhotos ? "grayscale(0%)" : "grayscale(100%)",
                transform: shouldFlipPhotos ? "scale(1.02)" : "scale(1)",
                transition: "opacity 140ms ease-out, filter 600ms ease-out, transform 900ms cubic-bezier(0.16,1,0.3,1)",
              }}
              loading="eager"
              decoding="async"
              fetchpriority={idx < 4 ? "high" : "auto"}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 shrink-0 px-6 md:mt-6">
        <div className="flex w-full gap-[3px] overflow-hidden site-corner">
          {[
            { label: "Portfolio", href: "/photos" },
            { label: "Map", href: "/photos/map" },
          ].map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              className="work-cta-link group block min-w-0"
            >
              <div
                className={`homepage-cta relative flex w-full cursor-pointer items-center justify-center bg-primary py-3 font-mono text-sm uppercase tracking-[0.2em] transition-colors duration-300 group-hover:bg-accent group-focus-visible:bg-accent ${
                  index === 0 ? "rounded-r-none" : "rounded-l-none"
                }`}
              >
                <span className="flex min-w-0 items-center justify-center">
                  <span className="truncate">{item.label}</span>
                  <span className="inline-flex max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:max-w-[2rem] group-hover:opacity-100">
                    <ArrowUpRight className="ml-2 h-4 w-4 shrink-0" strokeWidth={1.5} />
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <PhotoPreview
        images={photos.map(p => p.image)}
        currentIndex={previewIdx}
        onClose={() => setPreviewIdx(null)}
        onNavigate={setPreviewIdx}
      />
    </section>
  );
};

export default PhotoSection;
