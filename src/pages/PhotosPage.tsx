import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";

/* ── data ──────────────────────────────────────────────── */

interface Photo {
  id: string;
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
      { id: "chi-1", image: photo1 },
      { id: "chi-2", image: photo3 },
      { id: "chi-3", image: photo2 },
      { id: "chi-4", image: photo4 },
    ],
  },
  {
    location: "Brooklyn",
    cover: photo2,
    photos: [
      { id: "bk-1", image: photo2 },
      { id: "bk-2", image: photo1 },
      { id: "bk-3", image: photo4 },
    ],
  },
  {
    location: "Detroit",
    cover: photo3,
    photos: [
      { id: "det-1", image: photo3 },
      { id: "det-2", image: photo1 },
      { id: "det-3", image: photo4 },
      { id: "det-4", image: photo2 },
      { id: "det-5", image: photo3 },
    ],
  },
  {
    location: "Brussels",
    cover: photo4,
    photos: [
      { id: "bru-1", image: photo4 },
      { id: "bru-2", image: photo2 },
      { id: "bru-3", image: photo1 },
    ],
  },
  {
    location: "Tokyo",
    cover: photo1,
    photos: [
      { id: "tok-1", image: photo1 },
      { id: "tok-2", image: photo3 },
      { id: "tok-3", image: photo4 },
      { id: "tok-4", image: photo2 },
    ],
  },
  {
    location: "Berlin",
    cover: photo2,
    photos: [
      { id: "ber-1", image: photo2 },
      { id: "ber-2", image: photo3 },
      { id: "ber-3", image: photo1 },
    ],
  },
];

const locations = ["All", ...albums.map((a) => a.location)];

/* ── easing ────────────────────────────────────────────── */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── component ────────────────────────────────────────── */

const PhotosPage = () => {
  const [filter, setFilter] = useState("All");
  const [openAlbum, setOpenAlbum] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const filtered =
    filter === "All" ? albums : albums.filter((a) => a.location === filter);

  const currentAlbum = openAlbum
    ? albums.find((a) => a.location === openAlbum)
    : null;

  /* keyboard */
  const closePreview = useCallback(() => setPreview(null), []);

  useEffect(() => {
    if (!preview) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [preview, closePreview]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [openAlbum]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-6 py-4">
        <Link
          to="/"
          className="text-foreground/40 hover:text-foreground transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Logo />
      </header>

      <main className="pt-28 pb-0">
        {/* filter */}
        <div className="px-6 mb-16 flex gap-1 overflow-x-auto scrollbar-hide">
          <LayoutGroup>
            {locations.map((loc) => {
              const active = filter === loc;
              return (
                <button
                  key={loc}
                  onClick={() => {
                    setFilter(loc);
                    setOpenAlbum(null);
                  }}
                  className="relative shrink-0 px-3 py-1 font-mono text-[9px] tracking-[0.2em] uppercase transition-colors duration-300"
                  style={{
                    color: active
                      ? "hsl(var(--background))"
                      : "hsl(var(--foreground) / 0.3)",
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="filter-pill"
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

        {/* content */}
        <AnimatePresence mode="wait">
          {openAlbum && currentAlbum ? (
            /* ── album interior: horizontal photos ──── */
            <motion.div
              key={`album-${openAlbum}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {/* back */}
              <motion.button
                onClick={() => setOpenAlbum(null)}
                className="px-6 flex items-center gap-2 mb-10 text-foreground/30 hover:text-foreground transition-colors"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3, ease: EASE }}
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase">
                  {currentAlbum.location}
                </span>
              </motion.button>

              {/* horizontal scroll strip */}
              <div className="relative">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-[3px] px-6 pb-6" style={{ width: "max-content" }}>
                    {currentAlbum.photos.map((photo, i) => (
                      <motion.div
                        key={photo.id}
                        className="relative shrink-0 cursor-pointer overflow-hidden"
                        style={{ width: "60vw", maxWidth: 700 }}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: i * 0.06,
                          duration: 0.5,
                          ease: EASE,
                        }}
                        onClick={() => setPreview(photo.image)}
                      >
                        <div className="aspect-[3/2] overflow-hidden">
                          <img
                            src={photo.image}
                            alt=""
                            className="w-full h-full object-cover transition-all duration-700 ease-out"
                            style={{ filter: "grayscale(100%)" }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLImageElement).style.filter = "grayscale(0%)";
                              (e.target as HTMLImageElement).style.transform = "scale(1.03)";
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLImageElement).style.filter = "grayscale(100%)";
                              (e.target as HTMLImageElement).style.transform = "scale(1)";
                            }}
                          />
                        </div>
                        {/* tiny location tag */}
                        <span className="absolute bottom-3 right-3 font-mono text-[8px] tracking-[0.2em] uppercase text-white/40">
                          {currentAlbum.location}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* edge fade right */}
                <div
                  className="absolute top-0 right-0 bottom-0 w-24 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to left, hsl(var(--background)), transparent)",
                  }}
                />
              </div>
            </motion.div>
          ) : (
            /* ── album covers: staggered vertical layout ──── */
            <motion.div
              key={`overview-${filter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="px-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-[3px]">
                {filtered.map((album, i) => {
                  // alternate tall/short for visual rhythm
                  const tall = i % 3 === 0;
                  return (
                    <motion.div
                      key={album.location}
                      className="relative cursor-pointer overflow-hidden group"
                      style={{ gridRow: tall ? "span 2" : "span 1" }}
                      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        delay: i * 0.07,
                        duration: 0.5,
                        ease: EASE,
                      }}
                      onClick={() => setOpenAlbum(album.location)}
                    >
                      <div
                        className="w-full h-full overflow-hidden"
                        style={{ aspectRatio: tall ? "2/3" : "3/2" }}
                      >
                        <img
                          src={album.cover}
                          alt={album.location}
                          className="w-full h-full object-cover transition-all duration-700 ease-out"
                          style={{ filter: "grayscale(100%)" }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLImageElement).style.filter = "grayscale(0%)";
                            (e.target as HTMLImageElement).style.transform = "scale(1.04)";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLImageElement).style.filter = "grayscale(100%)";
                            (e.target as HTMLImageElement).style.transform = "scale(1)";
                          }}
                        />
                      </div>
                      {/* overlay: location + count */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4 pointer-events-none">
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)",
                          }}
                        />
                        <div className="relative z-10">
                          <h3 className="text-sm font-medium tracking-tight text-white/90">
                            {album.location}
                          </h3>
                          <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/30 mt-0.5">
                            {album.photos.length}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-24" />
      </main>

      {/* ── preview overlay (blurred backdrop) ─────────── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePreview}
          >
            {/* blurred dark backdrop */}
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
              }}
            />

            {/* close hint */}
            <button
              onClick={closePreview}
              className="absolute top-6 right-6 z-10 text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* photo */}
            <motion.img
              key={preview}
              src={preview}
              alt=""
              className="relative z-10 max-w-[92vw] max-h-[88vh] object-contain"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default PhotosPage;
