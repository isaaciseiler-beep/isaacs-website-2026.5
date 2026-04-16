import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
  { id: 1, type: "photo", title: "Alpine Light", content: "Mountain photography — chasing light at altitude.", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", url: "https://unsplash.com", x: 60, y: 40, w: 280, h: 200, rotate: -2 },
  { id: 2, type: "quote", title: "Steve Jobs", content: "\"Design is not just what it looks like. Design is how it works.\"", x: 400, y: 60, w: 200, h: 120, rotate: 3 },
  { id: 3, type: "website", title: "Are.na", content: "Visual research and bookmarking for the creative process.", url: "https://are.na", x: 650, y: 30, w: 220, h: 100, rotate: -1.5 },
  { id: 4, type: "place", title: "Marfa, TX", content: "Desert minimalism. Judd foundations, Prada Marfa, endless sky.", x: 380, y: 240, w: 180, h: 140, rotate: -4 },
  { id: 5, type: "video", title: "Dieter Rams", content: "Objectified — design philosophy in motion.", url: "https://vimeo.com", x: 80, y: 300, w: 240, h: 90, rotate: 1.5 },
  { id: 6, type: "photo", title: "Street Type", content: "Found type in urban environments.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", url: "https://unsplash.com", x: 600, y: 260, w: 200, h: 200, rotate: 2.5 },
  { id: 7, type: "quote", title: "Da Vinci", content: "\"Simplicity is the ultimate sophistication.\"", x: 160, y: 480, w: 190, h: 100, rotate: -1 },
  { id: 8, type: "website", title: "It's Nice That", content: "Why Brutalism is Making a Comeback", url: "https://itsnicethat.com", x: 440, y: 440, w: 220, h: 90, rotate: 3.5 },
];

const typeLabel: Record<string, string> = {
  photo: "📷 PHOTO",
  website: "🌐 WEBSITE",
  place: "📍 PLACE",
  quote: "💬 QUOTE",
  video: "▶ VIDEO",
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

  const boardInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const padding = useTransform(scrollYProgress, [0, 0.12, 0.25, 0.70, 0.82, 1], [24, 24, 0, 0, 24, 24]);

  const clampPosition = useCallback((x: number, y: number, w: number, h: number) => {
    if (!boardRef.current) return { x, y };
    const board = boardRef.current;
    const bw = board.clientWidth;
    const bh = board.clientHeight;
    const minX = -(w * OVERHANG);
    const maxX = bw - w * (1 - OVERHANG);
    const minY = -(h * OVERHANG);
    const maxY = bh - h * (1 - OVERHANG);
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
    dragOffset.current = { x: e.clientX - rect.left - item.x, y: e.clientY - rect.top - item.y };
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
    const rawX = e.clientX - rect.left - dragOffset.current.x;
    const rawY = e.clientY - rect.top - dragOffset.current.y;
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
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/80 to-transparent">
            <p className="mono-text text-foreground/40" style={{ fontSize: 8 }}>{typeLabel[item.type]}</p>
            <p className="text-xs font-medium text-foreground tracking-tight">{item.title}</p>
          </div>
        </div>
      );
    }

    if (item.type === "quote") {
      return (
        <div className="p-4 h-full flex flex-col justify-center" style={{ borderLeft: "2px solid hsl(var(--foreground) / 0.1)" }}>
          <p className="text-xs text-foreground/50 leading-relaxed italic">{item.content}</p>
          <p className="mono-text text-foreground/25 mt-2" style={{ fontSize: 8 }}>— {item.title}</p>
        </div>
      );
    }

    if (item.type === "place") {
      return (
        <div className="p-3 h-full flex flex-col justify-between" style={{ background: "linear-gradient(135deg, hsl(var(--foreground) / 0.03) 0%, transparent 100%)" }}>
          <p className="mono-text text-foreground/25" style={{ fontSize: 8 }}>{typeLabel[item.type]}</p>
          <div>
            <p className="text-sm font-medium text-foreground/70 tracking-tight">{item.title}</p>
            <p className="text-[10px] text-foreground/40 leading-relaxed mt-1">{item.content}</p>
          </div>
        </div>
      );
    }

    if (item.type === "video") {
      return (
        <div className="p-3 h-full flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-foreground/15 flex items-center justify-center shrink-0">
            <span className="text-foreground/30 text-[10px]">▶</span>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground/60 tracking-tight">{item.title}</p>
            <p className="text-[10px] text-foreground/30 mt-0.5">{item.content}</p>
          </div>
        </div>
      );
    }

    // website / default
    return (
      <div className="p-3 h-full flex flex-col justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-foreground/10" />
          <p className="mono-text text-foreground/25" style={{ fontSize: 8 }}>{typeLabel[item.type]}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-foreground/60 tracking-tight">{item.title}</p>
          <p className="text-[10px] text-foreground/30 leading-relaxed mt-0.5">{item.content}</p>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="relative" style={{ minHeight: "110vh" }}>
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div className="px-6 pt-[68px] pb-4">
          <SectionHeading className="mb-0">Inspiration</SectionHeading>
        </div>

        <motion.div
          className="flex-1 min-h-0 flex flex-col"
          style={{ paddingLeft: padding, paddingRight: padding, paddingBottom: padding }}
        >
          <div
            ref={boardRef}
            className="relative flex-1 min-h-0 overflow-visible border border-border/20"
            style={{ cursor: dragging !== null ? "grabbing" : "default" }}
            onPointerMove={handlePointerMove}
          >
            {/* Dot grid — fades in from bottom */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0, y: 40 }}
              animate={boardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: EASE }}
              style={{
                backgroundImage: "radial-gradient(circle, hsl(var(--foreground) / 0.1) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            {items.map((item, i) => (
              <motion.div
                key={item.id}
                className="absolute select-none"
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.w,
                  zIndex: dragging === item.id ? 50 : i,
                  transform: `rotate(${item.rotate}deg)`,
                  cursor: dragging === item.id ? "grabbing" : "grab",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={boardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  delay: 0.15 + i * 0.07,
                  duration: 0.6,
                  ease: EASE,
                }}
                onPointerDown={e => handlePointerDown(e, item.id)}
                onPointerUp={() => handlePointerUp(item.id)}
              >
                <div
                  className="border border-border/30 bg-background shadow-sm hover:shadow-md transition-shadow duration-300"
                  style={{
                    boxShadow: dragging === item.id
                      ? "4px 6px 20px rgba(0,0,0,0.25)"
                      : "1px 2px 6px rgba(0,0,0,0.06)",
                    height: item.h,
                  }}
                >
                  {renderCard(item)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
