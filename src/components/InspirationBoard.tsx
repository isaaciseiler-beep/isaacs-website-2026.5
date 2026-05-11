import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface InspirationItem {
  id: number;
  type: "photo" | "website" | "place" | "quote" | "video" | "book" | "music" | "podcast";
  title: string;
  content: string;
  url?: string;
  imageUrl?: string;
  x: number;
  y: number;
  w: number;
  aspect: number;
  rotate: number;
  transparent?: boolean;
}

const R2 = "https://pub-5c0f4d5b9b8b4bd6869b22a9a8099b3e.r2.dev";
const R2B = "https://pub-0f2ac8ec0d4e41b885a39ae5fd004706.r2.dev";

const ITEMS: InspirationItem[] = [
  { id: 1, type: "website", title: "John Provencher", content: "", url: "https://johnprovencher.com/", imageUrl: `${R2}/john_provencherpicture-34-copy.webp`, x: 0, y: 0, w: 19.25, aspect: 1912 / 1982, rotate: 0 },
  { id: 2, type: "music", title: "Mr. Lovebomb", content: "", url: "https://open.spotify.com/artist/1hJx89kEIcAmlZzUWat9w6", imageUrl: `${R2}/lovebomb.jpg`, x: 0, y: 0, w: 17.9, aspect: 1, rotate: 0 },
  { id: 3, type: "place", title: "Hong Kong", content: "", imageUrl: `${R2}/hk.JPG`, x: 0, y: 0, w: 30.25, aspect: 1.5, rotate: 0 },
  { id: 4, type: "podcast", title: "Search Engine", content: "", url: "https://www.searchengine.show/", imageUrl: `${R2}/1200x1200bf-60.jpg`, x: 0, y: 0, w: 17.9, aspect: 1, rotate: 0 },
  { id: 5, type: "video", title: "Greg Girard", content: "Interview with the photographer of Kowloon Walled City.", imageUrl: `${R2}/newgirard.webp`, url: "https://www.youtube.com/watch?v=Ss1L7SaMnAU", x: 0, y: 0, w: 19.25, aspect: 1128 / 846, rotate: 0 },
  { id: 6, type: "book", title: "I Deliver Parcels in Beijing", content: "", imageUrl: `${R2}/parcels.jpg`, x: 0, y: 0, w: 16.5, aspect: 2 / 3, rotate: 0 },
  { id: 7, type: "book", title: "My Year of Rest and Relaxation", content: "", imageUrl: `${R2}/myyearofrest.jpg`, x: 0, y: 0, w: 13.75, aspect: 294 / 450, rotate: 0 },
  { id: 9, type: "website", title: "OpenAI Supply Co.", content: "", url: "https://supplyco.openai.com/", imageUrl: `${R2}/oaisupply.png`, x: 0, y: 0, w: 16.9, aspect: 819 / 1350, rotate: 0, transparent: true },
  { id: 10, type: "music", title: "I'll Finish the Lyrics Later", content: "", url: "https://genius.com/albums/Isaia-huron/Ill-finish-the-lyrics-later", imageUrl: `${R2}/lyricsarentfinished.jpg`, x: 0, y: 0, w: 16, aspect: 1, rotate: 0 },
  { id: 11, type: "video", title: "Tales from the Road", content: "Jack Fitz", url: "https://vimeo.com/1125286551", imageUrl: `${R2}/jackfitz.jpg`, x: 0, y: 0, w: 22, aspect: 16 / 9, rotate: 0 },
  { id: 12, type: "photo", title: "1989 Volvo 240 Wagon", content: "The best car ever made.", imageUrl: `${R2}/volvo_240_brochure_single_picture.webp`, x: 0, y: 0, w: 24, aspect: 1024 / 511, rotate: 0 },
  { id: 14, type: "website", title: "Ricoh GRIIIx", content: "", url: "https://www.ricoh-imaging.co.jp/english/products/gr-3/", imageUrl: `${R2}/grIIIx-hdf4.png`, x: 0, y: 0, w: 36, aspect: 1026 / 721, rotate: 0, transparent: true },
  { id: 15, type: "website", title: "M22 Microadventures", content: "", url: "https://m22.com/pages/m22microadventures?srsltid=AfmBOopJcmgdSW-z_Vit11JFCYE6ZpGThs1n__vtKa3h7zf6_zzcO1Nl", imageUrl: `${R2B}/m22.png`, x: 0, y: 0, w: 17.9, aspect: 1, rotate: 0, transparent: true },
  { id: 16, type: "photo", title: "MI", content: "", imageUrl: `${R2B}/mi.png`, x: 0, y: 0, w: 17.9, aspect: 1, rotate: 0, transparent: true },
  { id: 17, type: "photo", title: "NZ", content: "", imageUrl: `${R2B}/nz.png`, x: 0, y: 0, w: 17.9, aspect: 1433 / 1643, rotate: 0, transparent: true },
];

// Approximate board width/height ratio (viewport-dependent; fine for initial layout)
const BOARD_RATIO = 1.7;

function randomizeLayout(items: InspirationItem[]): InspirationItem[] {
  const cols = 4;
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  const rows = Math.ceil(shuffled.length / cols);
  const slotW = 100 / cols;
  const slotH = 100 / rows;
  return shuffled.map((it, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const cx = c * slotW + slotW / 2 + (Math.random() - 0.5) * slotW * 0.35;
    const cy = r * slotH + slotH / 2 + (Math.random() - 0.5) * slotH * 0.3;
    const hPercent = (it.w / it.aspect) / BOARD_RATIO;
    return {
      ...it,
      x: cx - it.w / 2,
      y: cy - hPercent / 2,
      rotate: (Math.random() - 0.5) * 10,
    };
  });
}

const typeLabel: Record<string, string> = {
  photo: "PHOTO",
  website: "WEBSITE",
  place: "PLACE",
  quote: "QUOTE",
  video: "VIDEO",
  book: "BOOK",
  music: "MUSIC",
  podcast: "PODCAST",
};

const OVERHANG = 0.08; // max overhang past board edge (drag can go further? no, also clamps)

const ROTATE_CURSOR_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M17 8.5a5.5 5.5 0 1 0 1.5 4.5" fill="none" stroke="black" stroke-width="2.4" stroke-linecap="round"/><polyline points="18 5 18 9 14 9" fill="none" stroke="black" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
);
const ROTATE_CURSOR = `url("data:image/svg+xml;utf8,${ROTATE_CURSOR_SVG}") 7 7, alias`;

const InspirationBoard = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(() => randomizeLayout(ITEMS));
  const [dragging, setDragging] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkCarouselScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const el = carouselRef.current;
    if (!el) return;
    checkCarouselScroll();
    el.addEventListener("scroll", checkCarouselScroll, { passive: true });
    window.addEventListener("resize", checkCarouselScroll);
    return () => {
      el.removeEventListener("scroll", checkCarouselScroll);
      window.removeEventListener("resize", checkCarouselScroll);
    };
  }, [isMobile, checkCarouselScroll]);

  const scrollCarousel = (dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const revealProgress = useSpring(useTransform(scrollYProgress, [0.0, 0.28], [0, 1]), {
    stiffness: 140,
    damping: 28,
    mass: 0.8,
  });
  const boardY = useTransform(revealProgress, [0, 1], [88, 0]);
  const boardOpacity = useTransform(revealProgress, [0, 1], [0, 1]);
  const dotsOpacity = useTransform(revealProgress, [0, 0.55, 1], [0, 0.45, 1]);
  const dotsY = useTransform(revealProgress, [0, 1], [52, 0]);
  const cardOpacity = useTransform(revealProgress, [0.1, 1], [0, 1]);
  const cardY = useTransform(revealProgress, [0, 1], [40, 0]);

  const clampPosition = useCallback((x: number, y: number, w: number, aspect: number) => {
    if (!boardRef.current) return { x, y };
    const rect = boardRef.current.getBoundingClientRect();
    const h = (((w / 100) * rect.width) / aspect / rect.height) * 100;
    const minX = -(w * OVERHANG);
    const maxX = 100 - w * (1 - OVERHANG);
    const minY = -(h * OVERHANG);
    const maxY = 100 - h * (1 - OVERHANG);
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, id: number) => {
    e.preventDefault();
    const item = items.find(i => i.id === id);
    if (!item || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left - (item.x / 100) * rect.width,
      y: e.clientY - rect.top - (item.y / 100) * rect.height,
    };
    didDrag.current = false;
    setDragging(id);
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx < 0) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(idx, 1);
      copy.push(moved);
      return copy;
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [items]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragging === null || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left - dragOffset.current.x) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top - dragOffset.current.y) / rect.height) * 100;
    didDrag.current = true;
    setItems(prev => prev.map(item => {
      if (item.id !== dragging) return item;
        const clamped = clampPosition(rawX, rawY, item.w, item.aspect);
      return { ...item, x: clamped.x, y: clamped.y };
    }));
  }, [dragging, clampPosition]);

  const handlePointerUp = useCallback((id: number) => {
    setDragging(null);
    if (!didDrag.current) {
      const item = items.find(i => i.id === id);
      if (item?.url) window.open(item.url, "_blank", "noopener,noreferrer");
    }
  }, [items]);

  const updateRotation = useCallback((id: number, rotate: number) => {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, rotate } : it)));
  }, []);

  const renderCard = (item: InspirationItem) => {
    if (item.imageUrl) {
      return (
        <div className="group relative w-full h-full overflow-hidden flex items-center justify-center">
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" draggable={false} />
        </div>
      );
    }

    if (item.type === "quote") {
      return (
        <div className="flex h-full flex-col justify-between p-4" style={{ background: "hsl(var(--foreground) / 0.02)" }}>
          <span className="text-foreground/15 leading-none" style={{ fontSize: 32, fontFamily: "Georgia, serif" }}>"</span>
          <p className="italic text-foreground/75 leading-snug font-light text-[13px]">{item.content}</p>
          <p className="mono-text text-foreground/40 mt-2" style={{ fontSize: 9 }}>— {item.title}</p>
        </div>
      );
    }

    if (item.type === "place") {
      return (
        <div className="flex h-full flex-col justify-between p-4" style={{ background: "linear-gradient(135deg, hsl(var(--foreground) / 0.04) 0%, transparent 100%)" }}>
          <div className="flex items-center gap-1.5">
            <span className="text-foreground/40" style={{ fontSize: 11 }}>◉</span>
            <p className="mono-text text-foreground/40" style={{ fontSize: 9 }}>{typeLabel[item.type]}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground tracking-tight text-base leading-tight">{item.title}</p>
            <p className="mt-1.5 text-foreground/55 leading-snug text-[12px]">{item.content}</p>
          </div>
        </div>
      );
    }

    if (item.type === "video") {
      return (
        <div className="flex h-full flex-col justify-between p-4" style={{ background: "hsl(var(--foreground) / 0.03)" }}>
          <p className="mono-text text-foreground/40" style={{ fontSize: 9 }}>{typeLabel[item.type]}</p>
          <div className="flex items-center gap-3">
            <div className="flex shrink-0 items-center justify-center rounded-full bg-foreground/10 w-10 h-10">
              <span className="text-foreground/70 ml-0.5" style={{ fontSize: 12 }}>▶</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground tracking-tight text-sm leading-tight truncate">{item.title}</p>
              <p className="mt-0.5 text-foreground/50 text-[12px] leading-snug">{item.content}</p>
            </div>
          </div>
        </div>
      );
    }

    if (item.type === "book") {
      return (
        <div className="flex h-full p-0" style={{ background: "hsl(var(--foreground) / 0.03)" }}>
          <div className="w-[28%] shrink-0 relative" style={{ background: "linear-gradient(135deg, hsl(var(--foreground) / 0.18), hsl(var(--foreground) / 0.06))", borderRight: "1px solid hsl(var(--foreground) / 0.15)" }}>
            <div className="absolute inset-0 flex items-end justify-center pb-2">
              <span className="mono-text text-foreground/35" style={{ fontSize: 8 }}>BOOK</span>
            </div>
            <div className="absolute left-1.5 top-2 bottom-6 w-px bg-foreground/15" />
          </div>
          <div className="flex-1 flex flex-col justify-between p-3 min-w-0">
            <p className="mono-text text-foreground/40" style={{ fontSize: 9 }}>READING</p>
            <div>
              <p className="font-semibold text-foreground tracking-tight text-[13px] leading-tight italic">{item.title}</p>
              <p className="mt-1 text-foreground/55 leading-snug text-[11px]">{item.content}</p>
            </div>
          </div>
        </div>
      );
    }

    if (item.type === "music") {
      return (
        <div className="flex h-full flex-col justify-between p-4" style={{ background: "linear-gradient(160deg, hsl(var(--foreground) / 0.06), transparent)" }}>
          <div className="flex items-center justify-between">
            <p className="mono-text text-foreground/40" style={{ fontSize: 9 }}>{typeLabel[item.type]}</p>
            <div className="flex items-end gap-[2px] h-3">
              <span className="w-[2px] bg-[hsl(var(--highlight))]" style={{ height: "40%" }} />
              <span className="w-[2px] bg-[hsl(var(--highlight))]" style={{ height: "100%" }} />
              <span className="w-[2px] bg-[hsl(var(--highlight))]" style={{ height: "65%" }} />
              <span className="w-[2px] bg-[hsl(var(--highlight))]" style={{ height: "85%" }} />
              <span className="w-[2px] bg-[hsl(var(--highlight))]" style={{ height: "30%" }} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex shrink-0 items-center justify-center rounded-full border border-foreground/30 w-10 h-10">
              <span className="text-foreground/60" style={{ fontSize: 14 }}>♪</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground tracking-tight text-sm leading-tight truncate">{item.title}</p>
              <p className="mt-0.5 text-foreground/50 text-[11px] leading-snug">{item.content}</p>
            </div>
          </div>
        </div>
      );
    }

    if (item.type === "podcast") {
      return (
        <div className="flex h-full flex-col justify-between p-4" style={{ background: "hsl(var(--foreground) / 0.03)" }}>
          <div className="flex items-center gap-1.5">
            <span className="text-[hsl(var(--highlight))]" style={{ fontSize: 10 }}>●</span>
            <p className="mono-text text-foreground/40" style={{ fontSize: 9 }}>{typeLabel[item.type]}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground tracking-tight text-sm leading-tight">{item.title}</p>
            <p className="mt-1 text-foreground/55 leading-snug text-[12px]">{item.content}</p>
          </div>
        </div>
      );
    }

    // website / default
    return (
      <div className="flex h-full flex-col justify-between p-4 border border-foreground/10">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--highlight))]" />
          <p className="mono-text text-foreground/40" style={{ fontSize: 9 }}>{typeLabel[item.type]}</p>
          <span className="ml-auto text-foreground/30" style={{ fontSize: 11 }}>↗</span>
        </div>
        <div>
          <p className="font-semibold text-foreground tracking-tight text-sm leading-tight">{item.title}</p>
          <p className="mt-1 text-foreground/50 leading-snug text-[12px]">{item.content}</p>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="relative" style={isMobile ? undefined : { minHeight: "120vh" }}>
      {isMobile ? (
        <div className="flex flex-col">
          <div className="px-6 pt-12 pb-4">
            <SectionHeading className="mb-0">Inspiration</SectionHeading>
          </div>
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide px-6 pb-12 items-center"
              style={{ scrollSnapType: "x mandatory", scrollPaddingLeft: 24 }}
            >
              {ITEMS.map((item, i) => {
              const baseW = 240;
              const h = baseW / item.aspect;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: EASE }}
                  className="flex-shrink-0 cursor-pointer"
                  style={{ width: baseW, height: h, scrollSnapAlign: "start" }}
                  onClick={() => item.url && window.open(item.url, "_blank", "noopener,noreferrer")}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  ) : (
                    renderCard(item)
                  )}
                </motion.div>
              );
              })}
              <div className="flex-shrink-0 w-3" aria-hidden />
            </div>
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  key="ins-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  onClick={() => scrollCarousel("left")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20"
                  style={{ color: "hsl(50 33% 7%)" }}
                  whileHover={{ x: -3 }}
                  whileTap={{ scale: 0.85 }}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
                </motion.button>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {canScrollRight && (
                <motion.button
                  key="ins-right"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  onClick={() => scrollCarousel("right")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20"
                  style={{ color: "hsl(50 33% 7%)" }}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.85 }}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
      <div className="sticky top-0 h-screen flex flex-col overflow-visible z-30">
        <div className="px-6 pt-[68px] pb-4">
          <SectionHeading className="mb-0">Inspiration</SectionHeading>
        </div>

        <div className="flex-1 min-h-0 px-6 pb-6 relative z-30">
          <motion.div
            ref={boardRef}
            className="relative h-full w-full"
            style={{ cursor: dragging !== null ? "grabbing" : "default", y: boardY, opacity: boardOpacity }}
            onPointerMove={handlePointerMove}
          >
            {/* Dot grid — fades in from bottom */}
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{
                opacity: dotsOpacity,
                y: dotsY,
                backgroundImage: "radial-gradient(circle, hsl(var(--foreground) / 0.13) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />

            {items.map((item, i) => (
              <BoardCard
                key={item.id}
                item={item}
                index={i}
                dragging={dragging === item.id}
                zIndex={dragging === item.id ? 50 : i}
                cardOpacity={cardOpacity}
                cardY={cardY}
                onPointerDown={e => handlePointerDown(e, item.id)}
                onPointerUp={() => handlePointerUp(item.id)}
                onRotate={updateRotation}
                renderCard={renderCard}
              />
            ))}
          </motion.div>
        </div>
      </div>
      )}
    </section>
  );
};

export default InspirationBoard;

interface BoardCardProps {
  item: InspirationItem;
  index: number;
  dragging: boolean;
  zIndex: number;
  cardOpacity: any;
  cardY: any;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onRotate: (id: number, rotate: number) => void;
  renderCard: (item: InspirationItem) => React.ReactNode;
}

const BoardCard = ({ item, index, dragging, zIndex, cardOpacity, cardY, onPointerDown, onPointerUp, onRotate, renderCard }: BoardCardProps) => {
  const rotX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18, mass: 0.6 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18, mass: 0.6 });
  const [cornerHover, setCornerHover] = useState(false);
  const [rotating, setRotating] = useState(false);
  const rotateState = useRef<{ startAngle: number; baseRot: number; cx: number; cy: number } | null>(null);

  const isCorner = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    return Math.abs(nx) > 0.62 && Math.abs(ny) > 0.62;
  };

  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isCorner(e)) {
      e.preventDefault();
      e.stopPropagation();
      const r = e.currentTarget.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const startAngle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
      rotateState.current = { startAngle, baseRot: item.rotate, cx, cy };
      setRotating(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }
    onPointerDown(e);
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (rotating && rotateState.current) {
      const { startAngle, baseRot, cx, cy } = rotateState.current;
      const angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
      onRotate(item.id, baseRot + (angle - startAngle));
      return;
    }
    if (dragging) return;
    setCornerHover(isCorner(e));
    const r = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    // tilt: corners lift while center stays planar
    rotY.set(nx * 9);
    rotX.set(-ny * 9);
  };

  const handleUp = () => {
    if (rotating) {
      setRotating(false);
      rotateState.current = null;
      return;
    }
    onPointerUp();
  };

  const handleLeave = () => {
    rotX.set(0);
    rotY.set(0);
    setCornerHover(false);
  };

  const cursor = rotating || cornerHover ? ROTATE_CURSOR : dragging ? "grabbing" : "grab";

  return (
    <motion.div
      className="absolute select-none"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.w}%`,
        aspectRatio: item.aspect,
        zIndex,
        rotate: item.rotate,
        cursor,
        opacity: cardOpacity,
        y: cardY,
        perspective: 800,
      }}
      transition={{ delay: 0.12 + index * 0.06, duration: 0.7, ease: EASE }}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <motion.div
        className={`h-full transition-shadow duration-300 ${item.transparent ? "" : "bg-background shadow-sm hover:shadow-md"}`}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: "preserve-3d",
          boxShadow: item.transparent
            ? undefined
            : dragging
              ? "4px 6px 20px rgba(0,0,0,0.25)"
              : "1px 2px 6px rgba(0,0,0,0.06)",
        }}
      >
        {renderCard(item)}
      </motion.div>
    </motion.div>
  );
};
