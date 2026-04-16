import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import PhotoPreview from "@/components/PhotoPreview";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";

const photos = [
  { id: 1, title: "Christchurch, New Zealand", location: "Christchurch, New Zealand", image: photo1 },
  { id: 2, title: "Banli, Taiwan", location: "Banli, Taiwan", image: photo2 },
  { id: 3, title: "Aoraki National Park", location: "Aoraki National Park", image: photo3 },
  { id: 4, title: "Las Palmas de Gran Canaria, Spain", location: "Las Palmas de Gran Canaria, Spain", image: photo4 },
  { id: 5, title: "Djupivogur, Iceland", location: "Djupivogur, Iceland", image: photo1 },
  { id: 6, title: "Qiaozi Village, Taiwan", location: "Qiaozi Village, Taiwan", image: photo2 },
];

photos.forEach((p) => { const img = new Image(); img.src = p.image; });

const chevronVariants = {
  initial: (dir: "left" | "right") => ({ opacity: 0, x: dir === "left" ? -20 : 20 }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: (dir: "left" | "right") => ({ opacity: 0, x: dir === "left" ? -20 : 20, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as [number, number, number, number] } }),
};

const VISIBLE_COLS = 1.5;

const PhotoSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const updateHeight = () => {
      const itemW = (window.innerWidth - 48) / VISIBLE_COLS;
      setContainerHeight(itemW / 1.5);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.6 : el.clientWidth * 0.6, behavior: "smooth" });
  };

  return (
    <section className="py-12">
      <div className="px-6 mb-6 flex items-end justify-between">
        <SectionHeading className="mb-0">Photos</SectionHeading>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ scrollSnapType: "x mandatory", scrollPaddingLeft: 24, maxHeight: containerHeight }}
        >
          <div className="flex gap-[3px] px-6" style={{ width: "max-content" }}>
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="grid-item shrink-0 cursor-pointer"
                style={{ width: `calc((100vw - 48px) / ${VISIBLE_COLS})`, aspectRatio: "3/2", scrollSnapAlign: "start" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                onClick={() => setPreviewIdx(index)}
              >
                <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                <div className="grid-item-overlay">
                  <p className="mono-text mb-0.5">{photo.location}</p>
                  <h3 className="text-xs font-medium text-foreground">{photo.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute top-0 right-0 bottom-0 w-14 pointer-events-none z-10" style={{ background: "linear-gradient(to left, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 40%, transparent 100%)" }} />
        <div
          className="absolute top-0 left-0 bottom-0 w-14 pointer-events-none z-10 transition-opacity duration-500 ease-out"
          style={{ background: "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 40%, transparent 100%)", opacity: canScrollLeft ? 1 : 0 }}
        />

        <AnimatePresence>
          {canScrollLeft && (
            <motion.button key="scroll-left" custom="left" variants={chevronVariants} initial="initial" animate="animate" exit="exit" onClick={() => scroll("left")} className="absolute left-8 top-1/2 -translate-y-1/2 z-20 text-foreground hover:text-foreground transition-colors drop-shadow-[0_0_8px_hsl(var(--background))]" whileHover={{ x: -3 }} whileTap={{ scale: 0.85 }}>
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {canScrollRight && (
            <motion.button key="scroll-right" custom="right" variants={chevronVariants} initial="initial" animate="animate" exit="exit" onClick={() => scroll("right")} className="absolute right-8 top-1/2 -translate-y-1/2 z-20 text-foreground hover:text-foreground transition-colors drop-shadow-[0_0_8px_hsl(var(--background))]" whileHover={{ x: 3 }} whileTap={{ scale: 0.85 }}>
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 mt-6">
        <Link to="/photos" className="block">
          <motion.div className="group relative w-full py-2.5 text-sm font-mono tracking-[0.2em] uppercase rounded-full bg-foreground overflow-hidden flex items-center justify-center cursor-pointer" whileTap={{ scale: 0.995 }}>
            <span
              className="absolute inset-0 bg-[hsl(68,100%,81%)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            />
            <span className="relative z-10 text-background flex items-center justify-center">
              View my Portfolio
              <span className="inline-flex overflow-hidden max-w-0 group-hover:max-w-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" strokeWidth={1.5} />
              </span>
            </span>
          </motion.div>
        </Link>
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
