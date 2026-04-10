import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const ACCENT = "#c8d7df";

interface InspirationItem {
  id: number;
  type: "image" | "quote" | "note" | "link";
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
  { id: 1, type: "image", title: "Alpine Light", content: "Mountain photography — chasing light at altitude.", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", url: "https://unsplash.com", x: 60, y: 40, w: 280, h: 200, rotate: -2 },
  { id: 2, type: "quote", title: "Steve Jobs", content: "\"Design is not just what it looks like. Design is how it works.\"", x: 400, y: 60, w: 200, h: 120, rotate: 3 },
  { id: 3, type: "image", title: "Color Theory", content: "Exploring gradients and natural palettes.", imageUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&h=300&fit=crop", url: "https://unsplash.com", x: 650, y: 30, w: 220, h: 170, rotate: -1.5 },
  { id: 4, type: "note", title: "Note to self", content: "Explore brutalist web aesthetics — raw, honest, confrontational.", x: 380, y: 240, w: 180, h: 140, rotate: -4 },
  { id: 5, type: "link", title: "Wired", content: "The Future of Creative Tools", url: "https://wired.com", x: 80, y: 300, w: 240, h: 90, rotate: 1.5 },
  { id: 6, type: "image", title: "Street Type", content: "Found type in urban environments.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", url: "https://unsplash.com", x: 600, y: 260, w: 200, h: 200, rotate: 2.5 },
  { id: 7, type: "quote", title: "Da Vinci", content: "\"Simplicity is the ultimate sophistication.\"", x: 160, y: 480, w: 190, h: 100, rotate: -1 },
  { id: 8, type: "link", title: "It's Nice That", content: "Why Brutalism is Making a Comeback", url: "https://itsnicethat.com", x: 440, y: 440, w: 220, h: 90, rotate: 3.5 },
];

const typeLabel: Record<string, string> = {
  image: "📺 VISUAL",
  quote: "📌 QUOTE",
  note: "📓 NOTE",
  link: "📰 LINK",
};

const pinColors = ["#d4534a", "#c8d7df", "#e8d44d", "#4a8c5c", "#d4534a"];

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

  const padding = useTransform(scrollYProgress, [0, 0.12, 0.25, 0.70, 0.82, 1], [24, 24, 0, 0, 24, 24]);

  const handlePointerDown = useCallback((e: React.PointerEvent, id: number) => {
    e.preventDefault();
    const item = items.find(i => i.id === id);
    if (!item || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left - item.x, y: e.clientY - rect.top - item.y };
    didDrag.current = false;
    setDragging(id);
    // Bring to front
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
    const newX = e.clientX - rect.left - dragOffset.current.x;
    const newY = e.clientY - rect.top - dragOffset.current.y;
    didDrag.current = true;
    setItems(prev => prev.map(item =>
      item.id === dragging ? { ...item, x: newX, y: newY } : item
    ));
  }, [dragging]);

  const handlePointerUp = useCallback((id: number) => {
    setDragging(null);
    if (!didDrag.current) {
      const item = items.find(i => i.id === id);
      if (item) setActiveItem(item);
    }
  }, [items]);

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
            className="relative flex-1 min-h-0 overflow-hidden border border-border/30"
            style={{
              background: "repeating-conic-gradient(hsl(var(--muted)) 0% 25%, hsl(var(--background)) 0% 50%) 0 0 / 20px 20px",
              cursor: dragging !== null ? "grabbing" : "default",
            }}
            onPointerMove={handlePointerMove}
          >
            {items.map((item, i) => (
              <div
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
                onPointerDown={e => handlePointerDown(e, item.id)}
                onPointerUp={() => handlePointerUp(item.id)}
              >
                {/* Pin */}
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-md z-10"
                  style={{ backgroundColor: pinColors[item.id % pinColors.length] }}
                />

                {/* Card */}
                <div
                  className="border border-border/40 bg-background shadow-md transition-shadow"
                  style={{
                    boxShadow: dragging === item.id
                      ? "4px 6px 20px rgba(0,0,0,0.25)"
                      : "2px 3px 8px rgba(0,0,0,0.1)",
                    height: item.h,
                  }}
                >
                  {item.imageUrl ? (
                    <div className="relative w-full h-full overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        draggable={false}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/80 to-transparent">
                        <p className="mono-text text-foreground/50" style={{ fontSize: 8 }}>{item.type.toUpperCase()}</p>
                        <p className="text-xs font-medium text-foreground tracking-tight">{item.title}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 h-full flex flex-col justify-between">
                      <p className="mono-text text-foreground/40" style={{ fontSize: 8 }}>{item.type.toUpperCase()}</p>
                      <div>
                        <p className="text-xs text-foreground/70 leading-relaxed">{item.content}</p>
                        <p className="mono-text text-foreground/40 mt-1" style={{ fontSize: 8 }}>— {item.title}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Hint */}
            <div className="absolute bottom-3 left-3 pointer-events-none">
              <p className="mono-text text-foreground/30" style={{ fontSize: 9 }}>
                DRAG TO REARRANGE · CLICK TO INSPECT
              </p>
            </div>
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

            <p className="mono-text mb-4" style={{ color: ACCENT, fontSize: 10 }}>
              {typeLabel[activeItem.type]}
            </p>

            <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
              {activeItem.title}
            </h3>

            {activeItem.imageUrl && (
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full aspect-video object-cover mb-4 grayscale hover:grayscale-0 transition-all duration-500"
              />
            )}

            <p className="text-sm text-foreground/70 leading-relaxed mb-4">
              {activeItem.content}
            </p>

            {activeItem.url && (
              <a
                href={activeItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-button inline-block"
              >
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
