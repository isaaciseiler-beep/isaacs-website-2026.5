import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface InspirationItem {
  id: number;
  type: "photo" | "website" | "place" | "quote" | "video";
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
  { id: 1, type: "photo", title: "Alpine Light", content: "Mountain photography — chasing light at altitude.", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", url: "https://unsplash.com", x: 5, y: 6, w: 31, h: 28, rotate: -2 },
  { id: 2, type: "quote", title: "Steve Jobs", content: "\"Design is not just what it looks like. Design is how it works.\"", x: 41, y: 8, w: 22, h: 17, rotate: 3 },
  { id: 3, type: "website", title: "Are.na", content: "Visual research and bookmarking for the creative process.", url: "https://are.na", x: 68, y: 5, w: 24, h: 14, rotate: -1.5 },
  { id: 4, type: "place", title: "Marfa, TX", content: "Desert minimalism. Judd foundations, Prada Marfa, endless sky.", x: 39, y: 38, w: 20, h: 20, rotate: -4 },
  { id: 5, type: "video", title: "Dieter Rams", content: "Objectified — design philosophy in motion.", url: "https://vimeo.com", x: 8, y: 49, w: 27, h: 13, rotate: 1.5 },
  { id: 6, type: "photo", title: "Street Type", content: "Found type in urban environments.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", url: "https://unsplash.com", x: 64, y: 42, w: 24, h: 28, rotate: 2.5 },
  { id: 7, type: "quote", title: "Da Vinci", content: "\"Simplicity is the ultimate sophistication.\"", x: 15, y: 74, w: 21, h: 14, rotate: -1 },
  { id: 8, type: "website", title: "It's Nice That", content: "Why Brutalism is Making a Comeback", url: "https://itsnicethat.com", x: 48, y: 72, w: 24, h: 13, rotate: 3.5 },
];

const typeLabel: Record<string, string> = {
  photo: "PHOTO",
  website: "WEBSITE",
  place: "PLACE",
  quote: "QUOTE",
  video: "VIDEO",
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const revealProgress = useSpring(useTransform(scrollYProgress, [0.08, 0.5], [0, 1]), {
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
          <div className="absolute bottom-0 left-0 right-0 p-[clamp(0.55rem,1vw,0.85rem)] bg-gradient-to-t from-background/90 to-transparent">
            <p className="mono-text text-foreground/40" style={{ fontSize: "clamp(7px,0.6vw,9px)" }}>{typeLabel[item.type]}</p>
            <p className="font-medium tracking-tight text-foreground" style={{ fontSize: "clamp(0.72rem,1vw,0.95rem)" }}>{item.title}</p>
          </div>
        </div>
      );
    }

    if (item.type === "quote") {
      return (
        <div className="flex h-full flex-col justify-center p-[clamp(0.8rem,1.25vw,1.25rem)]" style={{ borderLeft: "2px solid hsl(var(--foreground) / 0.1)" }}>
          <p className="italic text-foreground/55 leading-relaxed" style={{ fontSize: "clamp(0.72rem,0.95vw,0.95rem)" }}>{item.content}</p>
          <p className="mono-text text-foreground/25 mt-2" style={{ fontSize: "clamp(7px,0.6vw,9px)" }}>- {item.title}</p>
        </div>
      );
    }

    if (item.type === "place") {
      return (
        <div className="flex h-full flex-col justify-between p-[clamp(0.75rem,1vw,1rem)]" style={{ background: "linear-gradient(135deg, hsl(var(--foreground) / 0.03) 0%, transparent 100%)" }}>
          <p className="mono-text text-foreground/25" style={{ fontSize: "clamp(7px,0.6vw,9px)" }}>{typeLabel[item.type]}</p>
          <div>
            <p className="font-medium text-foreground/72 tracking-tight" style={{ fontSize: "clamp(0.75rem,1vw,1rem)" }}>{item.title}</p>
            <p className="mt-1 text-foreground/40 leading-relaxed" style={{ fontSize: "clamp(0.62rem,0.78vw,0.78rem)" }}>{item.content}</p>
          </div>
        </div>
      );
    }

    if (item.type === "video") {
      return (
        <div className="flex h-full items-center gap-[clamp(0.55rem,0.9vw,0.85rem)] p-[clamp(0.75rem,1vw,1rem)]">
          <div className="flex shrink-0 items-center justify-center rounded-full border border-foreground/15" style={{ width: "clamp(1.8rem,2.4vw,2.2rem)", height: "clamp(1.8rem,2.4vw,2.2rem)" }}>
            <span className="text-foreground/30" style={{ fontSize: "clamp(0.55rem,0.7vw,0.7rem)" }}>▶</span>
          </div>
          <div>
            <p className="font-medium text-foreground/60 tracking-tight" style={{ fontSize: "clamp(0.72rem,0.95vw,0.95rem)" }}>{item.title}</p>
            <p className="mt-0.5 text-foreground/30" style={{ fontSize: "clamp(0.62rem,0.78vw,0.78rem)" }}>{item.content}</p>
          </div>
        </div>
      );
    }

    // website / default
    return (
      <div className="flex h-full flex-col justify-between p-[clamp(0.75rem,1vw,1rem)]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-foreground/10" />
          <p className="mono-text text-foreground/25" style={{ fontSize: "clamp(7px,0.6vw,9px)" }}>{typeLabel[item.type]}</p>
        </div>
        <div>
          <p className="font-medium text-foreground/60 tracking-tight" style={{ fontSize: "clamp(0.72rem,0.95vw,0.95rem)" }}>{item.title}</p>
          <p className="mt-0.5 text-foreground/30 leading-relaxed" style={{ fontSize: "clamp(0.62rem,0.78vw,0.78rem)" }}>{item.content}</p>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="relative" style={{ minHeight: "120vh" }}>
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
                backgroundImage: "radial-gradient(circle, hsl(var(--foreground) / 0.1) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
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
