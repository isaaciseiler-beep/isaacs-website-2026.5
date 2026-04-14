import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/* ── album cover with hover-to-cycle ──────────────────── */

const AlbumCover = ({
  album,
  onClick,
}: {
  album: Album;
  onClick: () => void;
}) => {
  const [activeIdx, setActiveIdx] = useState(-1); // -1 = show cover
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0-1
    const idx = Math.min(
      Math.floor(x * album.photos.length),
      album.photos.length - 1
    );
    setActiveIdx(idx);
  };

  const handleMouseLeave = () => setActiveIdx(-1);

  const displayImage =
    activeIdx >= 0 ? album.photos[activeIdx].image : album.cover;

  return (
    <div
      ref={containerRef}
      className="relative cursor-pointer overflow-hidden group"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={displayImage}
          alt={album.location}
          className="w-full h-full object-cover transition-[filter] duration-500 ease-out group-hover:grayscale-0"
          style={{ filter: activeIdx >= 0 ? "grayscale(0%)" : "grayscale(100%)" }}
        />
      </div>

      {/* bottom gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 35%)",
        }}
      />

      {/* location + count */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-sm font-medium tracking-tight text-white/90">
          {album.location}
        </h3>
        <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/30 mt-0.5">
          {album.photos.length}
        </p>
      </div>

      {/* hover progress dots */}
      {activeIdx >= 0 && (
        <div className="absolute top-3 left-3 right-3 flex gap-[2px]">
          {album.photos.map((_, i) => (
            <div
              key={i}
              className="h-[2px] flex-1 transition-colors duration-150"
              style={{
                background:
                  i === activeIdx
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── sidebar nav items ────────────────────────────────── */

const sidebarItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "photos", label: "Photos", path: "/photos" },
];

/* ── page ──────────────────────────────────────────────── */

const PhotosPage = () => {
  const [filter, setFilter] = useState("All");
  const [openAlbum, setOpenAlbum] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const filtered =
    filter === "All" ? albums : albums.filter((a) => a.location === filter);

  const currentAlbum = openAlbum
    ? albums.find((a) => a.location === openAlbum)
    : null;

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
    <div className="relative min-h-screen bg-background text-foreground">
      {/* header */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none" style={{ height: 64, background: "linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 60%, transparent 100%)" }} />
      <div className="fixed top-0 left-0 z-50 flex items-center gap-1 px-6 py-4">
        <Link to="/" className="contents">
          <Logo />
        </Link>
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-5 h-5 flex items-center justify-center text-foreground hover:text-foreground/60 transition-colors duration-200"
          aria-label="Toggle menu"
          animate={{ rotate: sidebarOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE_TEXT }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* sidebar */}
      <motion.nav
        className="fixed left-0 top-0 h-screen w-[240px] bg-background z-[45] flex flex-col px-6 py-20 overflow-y-auto"
        animate={{ x: sidebarOpen ? 0 : -240 }}
        transition={{ duration: 0.4, ease: EASE_TEXT }}
      >
        <AnimatePresence>
          {sidebarOpen && (
            <div className="mt-4 flex flex-col gap-0.5">
              {sidebarItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -14, filter: "blur(4px)" }}
                  transition={{
                    delay: 0.08 + i * 0.06,
                    duration: 0.5,
                    ease: EASE,
                  }}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`text-left py-1.5 text-sm font-medium transition-colors duration-200 ${
                    item.path === "/photos"
                      ? "text-foreground"
                      : "text-foreground/40 hover:text-foreground/70"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* content wrapper */}
      <motion.div
        animate={{ marginLeft: sidebarOpen ? 240 : 0 }}
        transition={{ duration: 0.4, ease: EASE_TEXT }}
      >
        <main className="pt-28 pb-0">
          {/* centered filter strip */}
          <div className="flex justify-center mb-16">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide px-6">
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
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}
                      {loc}
                    </button>
                  );
                })}
              </LayoutGroup>
            </div>
          </div>

          {/* content */}
          <AnimatePresence mode="wait">
            {openAlbum && currentAlbum ? (
              /* ── album interior: vertical scroll ──── */
              <motion.div
                key={`album-${openAlbum}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="px-6"
              >
                {/* back */}
                <motion.button
                  onClick={() => setOpenAlbum(null)}
                  className="flex items-center gap-2 mb-10 text-foreground/30 hover:text-foreground transition-colors"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3, ease: EASE }}
                >
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase">
                    ← {currentAlbum.location}
                  </span>
                </motion.button>

                {/* vertical photo list */}
                <div className="flex flex-col gap-[3px] max-w-5xl mx-auto">
                  {currentAlbum.photos.map((photo, i) => (
                    <motion.div
                      key={photo.id}
                      className="relative cursor-pointer overflow-hidden"
                      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        delay: i * 0.05,
                        duration: 0.5,
                        ease: EASE,
                      }}
                      onClick={() => setPreview(photo.image)}
                    >
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={photo.image}
                          alt=""
                          className="w-full h-full object-cover transition-all duration-700 ease-out"
                          style={{ filter: "grayscale(100%)" }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLImageElement).style.filter =
                              "grayscale(0%)";
                            (e.target as HTMLImageElement).style.transform =
                              "scale(1.02)";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLImageElement).style.filter =
                              "grayscale(100%)";
                            (e.target as HTMLImageElement).style.transform =
                              "scale(1)";
                          }}
                        />
                      </div>
                      {/* tiny location tag */}
                      <span className="absolute bottom-3 right-4 font-mono text-[8px] tracking-[0.2em] uppercase text-white/30">
                        {currentAlbum.location}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* ── album covers grid ──── */
              <motion.div
                key={`overview-${filter}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="px-6"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-[3px]">
                  {filtered.map((album, i) => (
                    <motion.div
                      key={album.location}
                      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        delay: i * 0.07,
                        duration: 0.5,
                        ease: EASE,
                      }}
                    >
                      <AlbumCover
                        album={album}
                        onClick={() => setOpenAlbum(album.location)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-24" />
        </main>
      </motion.div>

      {/* ── preview overlay ────────────────────────────── */}
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
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
              }}
            />
            <button
              onClick={closePreview}
              className="absolute top-6 right-6 z-10 text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
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
