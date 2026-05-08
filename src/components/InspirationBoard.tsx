import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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
  h: number;
  rotate: number;
}

const ITEMS: InspirationItem[] = [
  { id: 1, type: "website", title: "John Provencher", content: "Brooklyn-based artist & designer — interfaces as sculpture.", url: "https://johnprovencher.com/", x: 4, y: 5, w: 30, h: 24, rotate: -2 },
  { id: 2, type: "music", title: "Isaiah Huron", content: "Atmospheric R&B — late-night drives, neon reflections.", url: "https://open.spotify.com/artist/1hJx89kEIcAmlZzUWat9w6", x: 38, y: 7, w: 26, h: 20, rotate: 2.5 },
  { id: 3, type: "place", title: "Hong Kong", content: "Density as poetry. Neon, mist, signage stacked to the sky.", imageUrl: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&h=600&fit=crop", x: 69, y: 6, w: 27, h: 28, rotate: -1.5 },
  { id: 4, type: "podcast", title: "Search Engine", content: "PJ Vogt asks the questions you'd Google but never finish.", url: "https://www.searchengine.show/", x: 40, y: 36, w: 23, h: 22, rotate: -3.5 },
  { id: 5, type: "photo", title: "Greg Girard", content: "Kowloon Walled City, Tokyo nights — the vanished Asian metropolis.", imageUrl: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=800&h=600&fit=crop", url: "https://www.youtube.com/watch?v=Ss1L7SaMnAU&t=937s", x: 4, y: 53, w: 30, h: 30, rotate: 1.5 },
  { id: 6, type: "book", title: "I Deliver Parcels in Beijing", content: "Hu Anyan — a courier's view of the city, one doorbell at a time.", x: 67, y: 38, w: 28, h: 22, rotate: 2.5 },
  { id: 7, type: "book", title: "My Year of Rest and Relaxation", content: "Ottessa Moshfegh — pharmaceutical hibernation in pre-9/11 Manhattan.", x: 38, y: 62, w: 26, h: 22, rotate: -1 },
  { id: 8, type: "book", title: "What We Can Know", content: "Ian McEwan — a future scholar reconstructs a lost world from fragments.", x: 67, y: 66, w: 28, h: 22, rotate: 3 },
];

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

const OVERHANG = 0.3; // 30% max overhang

const InspirationBoard = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(ITEMS);
  const [activeItem, setActiveItem] = useState<InspirationItem | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const clampPosition = useCallback((x: number, y: number, w: number, h: number) => {
    if (!boardRef.current) return { x, y };
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
      const clamped = clampPosition(rawX, rawY, item.w, item.h);
      return { ...item, x: clamped.x, y: clamped.y };
    }));
  }, [dragging, clampPosition]);

  const handlePointerUp = useCallback((id: number) => {
    setDragging(null);
    if (!didDrag.current) {
      const item = items.find(i => i.id === id);
      if (item) setActiveItem(item);
    }
  }, [items]);

  const renderCard = (item: InspirationItem) => {
    if (item.imageUrl) {
      return (
        <div className="relative w-full h-full overflow-hidden">
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" draggable={false} />
          <div className="absolute top-3 left-3">
            <span className="mono-text bg-background/80 px-1.5 py-0.5 backdrop-blur-sm" style={{ fontSize: 9 }}>{typeLabel[item.type]}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/95 via-background/60 to-transparent">
            <p className="font-semibold tracking-tight text-foreground text-sm leading-tight">{item.title}</p>
          </div>
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
          <div className="grid grid-cols-1 gap-3 px-6 pb-12">
            {ITEMS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.55, ease: EASE }}
                className="relative h-44 bg-background cursor-pointer"
                style={{ boxShadow: "1px 2px 6px rgba(0,0,0,0.08)" }}
                onClick={() => setActiveItem(item)}
              >
                {renderCard(item)}
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div className="px-6 pt-[68px] pb-4">
          <SectionHeading className="mb-0">Inspiration</SectionHeading>
        </div>

        <div className="flex-1 min-h-0 px-6 pb-6">
          <motion.div
            ref={boardRef}
            className="relative h-full w-full overflow-hidden"
            style={{ cursor: dragging !== null ? "grabbing" : "default", y: boardY, opacity: boardOpacity }}
            onPointerMove={handlePointerMove}
          >
            {/* Dot grid — fades in from bottom */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: dotsOpacity,
                y: dotsY,
                backgroundImage: "radial-gradient(circle, hsl(var(--foreground) / 0.13) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
                maskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.82) 45%, rgba(0,0,0,0.1) 100%)",
              }}
            />

            {items.map((item, i) => (
              <motion.div
                key={item.id}
                className="absolute select-none"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  width: `${item.w}%`,
                  height: `${item.h}%`,
                  zIndex: dragging === item.id ? 50 : i,
                  rotate: item.rotate,
                  cursor: dragging === item.id ? "grabbing" : "grab",
                  opacity: cardOpacity,
                  y: cardY,
                }}
                transition={{
                  delay: 0.12 + i * 0.06,
                  duration: 0.7,
                  ease: EASE,
                }}
                onPointerDown={e => handlePointerDown(e, item.id)}
                onPointerUp={() => handlePointerUp(item.id)}
              >
                <div
                  className="h-full bg-background shadow-sm transition-shadow duration-300 hover:shadow-md"
                  style={{
                    boxShadow: dragging === item.id
                      ? "4px 6px 20px rgba(0,0,0,0.25)"
                      : "1px 2px 6px rgba(0,0,0,0.06)",
                  }}
                >
                  {renderCard(item)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      )}

      {/* Overlay */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(23,23,12,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setActiveItem(null)}
        >
          <motion.div
            className="max-w-md w-full mx-4 border border-border/40 bg-background p-8 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 mono-text text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
              style={{ fontSize: 10 }}
            >
              ✕
            </button>
            <p className="mono-text mb-4 text-foreground/50" style={{ fontSize: 10 }}>{typeLabel[activeItem.type]}</p>
            <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">{activeItem.title}</h3>
            {activeItem.imageUrl && (
              <img src={activeItem.imageUrl} alt={activeItem.title} className="w-full aspect-video object-cover mb-4 grayscale hover:grayscale-0 transition-all duration-500" />
            )}
            <p className="text-sm text-foreground/70 leading-relaxed mb-4">{activeItem.content}</p>
            {activeItem.url && (
              <a href={activeItem.url} target="_blank" rel="noopener noreferrer" className="pill-button inline-block">
                Visit →
              </a>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default InspirationBoard;
