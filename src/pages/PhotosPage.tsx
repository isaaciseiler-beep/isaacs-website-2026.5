import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";

/* ── data ──────────────────────────────────────────────── */

interface Photo {
  id: string;
  title: string;
  image: string;
}

interface Album {
  location: string;
  cover: string;
  photos: Photo[];
}

const albums: Album[] = [
  {
    location: "Chicago",
    cover: photo1,
    photos: [
      { id: "chi-1", title: "Skyline at Dusk", image: photo1 },
      { id: "chi-2", title: "River Walk", image: photo3 },
      { id: "chi-3", title: "Steel & Glass", image: photo2 },
      { id: "chi-4", title: "L Train", image: photo4 },
    ],
  },
  {
    location: "Brooklyn",
    cover: photo2,
    photos: [
      { id: "bk-1", title: "Process", image: photo2 },
      { id: "bk-2", title: "Rooftop", image: photo1 },
      { id: "bk-3", title: "Bodega Light", image: photo4 },
    ],
  },
  {
    location: "Detroit",
    cover: photo3,
    photos: [
      { id: "det-1", title: "Light & Ruin", image: photo3 },
      { id: "det-2", title: "Michigan Central", image: photo1 },
      { id: "det-3", title: "Packard Plant", image: photo4 },
      { id: "det-4", title: "Midtown Mural", image: photo2 },
      { id: "det-5", title: "Cass Corridor", image: photo3 },
    ],
  },
  {
    location: "Brussels",
    cover: photo4,
    photos: [
      { id: "bru-1", title: "Vanishing Point", image: photo4 },
      { id: "bru-2", title: "Marolles", image: photo2 },
      { id: "bru-3", title: "Atomium Fog", image: photo1 },
    ],
  },
  {
    location: "Tokyo",
    cover: photo1,
    photos: [
      { id: "tok-1", title: "Underpass", image: photo1 },
      { id: "tok-2", title: "Shibuya Rain", image: photo3 },
      { id: "tok-3", title: "Vending Glow", image: photo4 },
      { id: "tok-4", title: "Shinjuku Neon", image: photo2 },
    ],
  },
  {
    location: "Berlin",
    cover: photo2,
    photos: [
      { id: "ber-1", title: "Grain", image: photo2 },
      { id: "ber-2", title: "Kreuzberg Wall", image: photo3 },
      { id: "ber-3", title: "Tempelhof", image: photo1 },
    ],
  },
];

const locations = ["All", ...albums.map((a) => a.location)];

/* ── animation tokens ─────────────────────────────────── */

const EASE_REVEAL: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const chevronVariants = {
  initial: (dir: "left" | "right") => ({
    opacity: 0,
    x: dir === "left" ? -20 : 20,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: EASE_REVEAL },
  },
  exit: (dir: "left" | "right") => ({
    opacity: 0,
    x: dir === "left" ? -20 : 20,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  }),
};

/* ── component ────────────────────────────────────────── */

const PhotosPage = () => {
  const [activeLocation, setActiveLocation] = useState("All");
  const [expandedAlbum, setExpandedAlbum] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ albumIdx: number; photoIdx: number } | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const filteredAlbums =
    activeLocation === "All"
      ? albums
      : albums.filter((a) => a.location === activeLocation);

  const currentAlbum = expandedAlbum
    ? albums.find((a) => a.location === expandedAlbum)
    : null;

  /* keyboard nav for lightbox */
  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const album = albums[lightbox.albumIdx];
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight")
        setLightbox((p) =>
          p ? { ...p, photoIdx: Math.min(p.photoIdx + 1, album.photos.length - 1) } : null
        );
      if (e.key === "ArrowLeft")
        setLightbox((p) => (p ? { ...p, photoIdx: Math.max(p.photoIdx - 1, 0) } : null));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, closeLightbox]);

  /* scroll to top on view change */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [expandedAlbum]);

  const openAlbum = (location: string) => {
    setExpandedAlbum(location);
  };

  const openLightbox = (albumLocation: string, photoIdx: number) => {
    const idx = albums.findIndex((a) => a.location === albumLocation);
    if (idx >= 0) setLightbox({ albumIdx: idx, photoIdx });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── header ─────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
        style={{
          height: 64,
          background:
            "linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 60%, transparent 100%)",
        }}
      />
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-foreground/50 hover:text-foreground transition-colors duration-200"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Logo />
        </div>
      </header>

      {/* ── main ───────────────────────────────────────── */}
      <main className="pt-24 pb-0">
        <div className="px-6">
          <SectionHeading>Photos</SectionHeading>
        </div>

        {/* ── filter strip ─────────────────────────────── */}
        <div
          ref={filterRef}
          className="px-6 mb-10 flex gap-[3px] overflow-x-auto scrollbar-hide"
        >
          <LayoutGroup>
            {locations.map((loc) => {
              const active = activeLocation === loc;
              return (
                <button
                  key={loc}
                  onClick={() => {
                    setActiveLocation(loc);
                    setExpandedAlbum(null);
                  }}
                  className="relative shrink-0 px-4 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors duration-300"
                  style={{
                    color: active
                      ? "hsl(var(--background))"
                      : "hsl(var(--foreground) / 0.5)",
                    background: active
                      ? "hsl(var(--foreground))"
                      : "transparent",
                    border: active
                      ? "1px solid hsl(var(--foreground))"
                      : "1px solid hsl(var(--border))",
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="active-filter"
                      className="absolute inset-0 bg-foreground"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  {loc}
                </button>
              );
            })}
          </LayoutGroup>
        </div>

        {/* ── content ──────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {expandedAlbum && currentAlbum ? (
            /* ── expanded album view ───────────────────── */
            <motion.div
              key={`expanded-${expandedAlbum}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: EASE_REVEAL }}
              className="px-6"
            >
              {/* back button */}
              <motion.button
                onClick={() => setExpandedAlbum(null)}
                className="flex items-center gap-2 mb-8 text-foreground/50 hover:text-foreground transition-colors duration-200"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease: EASE_REVEAL }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] tracking-widest uppercase">
                  {currentAlbum.location}
                </span>
              </motion.button>

              {/* masonry grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-[3px] space-y-[3px]">
                {currentAlbum.photos.map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    className="grid-item break-inside-avoid"
                    initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      delay: i * 0.04,
                      duration: 0.4,
                      ease: EASE_REVEAL,
                    }}
                    onClick={() => openLightbox(currentAlbum.location, i)}
                  >
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    <div className="grid-item-overlay">
                      <p className="mono-text mb-0.5">{currentAlbum.location}</p>
                      <h3 className="text-xs font-medium text-foreground">
                        {photo.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ── album grid overview ───────────────────── */
            <motion.div
              key={`overview-${activeLocation}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: EASE_REVEAL }}
              className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {filteredAlbums.map((album, i) => (
                <motion.div
                  key={album.location}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.5,
                    ease: EASE_REVEAL,
                  }}
                  onClick={() => openAlbum(album.location)}
                >
                  {/* stacked prints effect */}
                  <div className="relative mb-4">
                    {/* back layers */}
                    <div
                      className="absolute inset-0 bg-foreground/5 border border-border"
                      style={{ transform: "translate(8px, 8px)" }}
                    />
                    <div
                      className="absolute inset-0 bg-foreground/[0.03] border border-border"
                      style={{ transform: "translate(4px, 4px)" }}
                    />
                    {/* cover image */}
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <img
                        src={album.cover}
                        alt={album.location}
                        className="w-full h-full object-cover transition-all duration-700 ease-out"
                        style={{ filter: "grayscale(100%)" }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLImageElement).style.filter = "grayscale(0%)";
                          (e.target as HTMLImageElement).style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLImageElement).style.filter = "grayscale(100%)";
                          (e.target as HTMLImageElement).style.transform = "scale(1)";
                        }}
                      />
                      {/* bottom gradient overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)",
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold tracking-tight text-white">
                          {album.location}
                        </h3>
                        <p className="font-mono text-[10px] tracking-widest uppercase text-white/50">
                          {album.photos.length} photos
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-20" />
      </main>

      {/* ── lightbox ───────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-black/90"
              onClick={closeLightbox}
            />

            {/* close */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 font-mono text-[10px] tracking-widest uppercase text-white/40">
              {lightbox.photoIdx + 1} / {albums[lightbox.albumIdx].photos.length}
            </div>

            {/* image */}
            <motion.img
              key={`${lightbox.albumIdx}-${lightbox.photoIdx}`}
              src={albums[lightbox.albumIdx].photos[lightbox.photoIdx].image}
              alt={albums[lightbox.albumIdx].photos[lightbox.photoIdx].title}
              className="relative z-10 max-w-[90vw] max-h-[80vh] object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: EASE_TEXT }}
            />

            {/* prev */}
            <AnimatePresence>
              {lightbox.photoIdx > 0 && (
                <motion.button
                  key="lb-prev"
                  custom="left"
                  variants={chevronVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onClick={() =>
                    setLightbox((p) =>
                      p ? { ...p, photoIdx: p.photoIdx - 1 } : null
                    )
                  }
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* next */}
            <AnimatePresence>
              {lightbox.photoIdx <
                albums[lightbox.albumIdx].photos.length - 1 && (
                <motion.button
                  key="lb-next"
                  custom="right"
                  variants={chevronVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onClick={() =>
                    setLightbox((p) =>
                      p ? { ...p, photoIdx: p.photoIdx + 1 } : null
                    )
                  }
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* title */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center">
              <p className="text-xs font-medium text-white">
                {albums[lightbox.albumIdx].photos[lightbox.photoIdx].title}
              </p>
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mt-1">
                {albums[lightbox.albumIdx].location}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default PhotosPage;
