import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface PinItem {
  id: number;
  type: "image" | "link" | "quote";
  content: string;
  label: string;
  url?: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  color?: string;
}

const initialPins: PinItem[] = [
  { id: 1, type: "image", content: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop", label: "Alpine Light", url: "https://unsplash.com", x: 40, y: 30, rotation: -3, width: 220 },
  { id: 2, type: "quote", content: "\"Design is not just what it looks like. Design is how it works.\"", label: "Steve Jobs", x: 320, y: 60, rotation: 2, width: 200, color: "hsl(200 20% 85%)" },
  { id: 3, type: "image", content: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=300&h=200&fit=crop", label: "Color Theory", url: "https://unsplash.com", x: 580, y: 20, rotation: -1, width: 200 },
  { id: 4, type: "link", content: "The Future of Creative Tools", label: "Article — Wired", url: "https://wired.com", x: 60, y: 280, rotation: 1, width: 190 },
  { id: 5, type: "image", content: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=200&fit=crop", label: "Brutalist Architecture", url: "https://unsplash.com", x: 300, y: 310, rotation: -2, width: 240 },
  { id: 6, type: "quote", content: "\"Simplicity is the ultimate sophistication.\"", label: "Leonardo da Vinci", x: 600, y: 270, rotation: 3, width: 180, color: "hsl(200 20% 85%)" },
  { id: 7, type: "link", content: "Why Brutalism is Making a Comeback", label: "Essay — It's Nice That", url: "https://itsnicethat.com", x: 160, y: 480, rotation: -1, width: 200 },
  { id: 8, type: "image", content: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop", label: "Street Typography", url: "https://unsplash.com", x: 440, y: 460, rotation: 2, width: 210 },
];

const InspirationBoard = () => {
  const [pins, setPins] = useState(initialPins);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleDragStart = (id: number, e: React.PointerEvent) => {
    const pin = pins.find((p) => p.id === id);
    if (!pin || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    dragItem.current = id;
    dragOffset.current = {
      x: e.clientX - rect.left - pin.x,
      y: e.clientY - rect.top - pin.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e: React.PointerEvent) => {
    if (dragItem.current === null || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.current.x;
    const newY = e.clientY - rect.top - dragOffset.current.y;
    setPins((prev) =>
      prev.map((p) =>
        p.id === dragItem.current
          ? { ...p, x: Math.max(0, newX), y: Math.max(0, newY) }
          : p
      )
    );
  };

  const handleDragEnd = () => {
    dragItem.current = null;
  };

  const handleClick = (pin: PinItem) => {
    if (pin.url) window.open(pin.url, "_blank", "noopener");
  };

  return (
    <section className="py-12 px-5 md:px-6">
      <h2 className="section-heading">My Inspiration</h2>

      <div
        ref={boardRef}
        className="relative w-full border border-border overflow-hidden bg-card/30"
        style={{ height: 620 }}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {pins.map((pin) => (
          <motion.div
            key={pin.id}
            className="absolute cursor-grab active:cursor-grabbing select-none"
            style={{
              left: pin.x,
              top: pin.y,
              width: pin.width,
              rotate: pin.rotation,
              zIndex: dragItem.current === pin.id ? 50 : 10,
            }}
            onPointerDown={(e) => handleDragStart(pin.id, e)}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.15 }}
          >
            {pin.type === "image" && (
              <div
                className="group overflow-hidden border border-border bg-card shadow-lg"
                onClick={() => handleClick(pin)}
              >
                <img
                  src={pin.content}
                  alt={pin.label}
                  className="w-full aspect-[3/2] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  draggable={false}
                />
                <div className="px-3 py-2">
                  <p className="mono-text text-foreground">{pin.label}</p>
                </div>
              </div>
            )}

            {pin.type === "quote" && (
              <div className="border border-border bg-card p-4 shadow-lg">
                <p className="text-sm text-foreground leading-relaxed italic">
                  {pin.content}
                </p>
                <p className="mono-text mt-2">— {pin.label}</p>
              </div>
            )}

            {pin.type === "link" && (
              <div
                className="group border border-border bg-card p-4 shadow-lg hover:bg-card/80 transition-colors duration-200"
                onClick={() => handleClick(pin)}
              >
                <p className="mono-text mb-2 text-foreground">{pin.label}</p>
                <p className="text-sm text-foreground font-medium leading-snug">
                  {pin.content}
                </p>
                <span className="mono-text mt-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-foreground">
                  Open →
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <p className="mono-text mt-3 text-center">Drag to rearrange · Click to explore</p>
    </section>
  );
};

export default InspirationBoard;
