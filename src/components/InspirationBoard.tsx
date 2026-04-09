import { useState, useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Quote, BookOpen, Image as ImageIcon } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

interface PinItem {
  id: number;
  type: "image" | "link" | "quote" | "note";
  content: string;
  label: string;
  url?: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
}

const initialPins: PinItem[] = [
  { id: 1, type: "image", content: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop", label: "Alpine Light", url: "https://unsplash.com", x: 40, y: 30, rotation: -3, width: 220 },
  { id: 2, type: "quote", content: "\"Design is not just what it looks like. Design is how it works.\"", label: "Steve Jobs", x: 320, y: 60, rotation: 2, width: 200 },
  { id: 3, type: "image", content: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=300&h=200&fit=crop", label: "Color Theory", url: "https://unsplash.com", x: 580, y: 20, rotation: -1, width: 200 },
  { id: 4, type: "link", content: "The Future of Creative Tools", label: "Wired", url: "https://wired.com", x: 60, y: 280, rotation: 1, width: 190 },
  { id: 5, type: "note", content: "Explore brutalist web aesthetics — raw, honest, confrontational design.", label: "Personal Note", x: 300, y: 310, rotation: -2, width: 200 },
  { id: 6, type: "quote", content: "\"Simplicity is the ultimate sophistication.\"", label: "Leonardo da Vinci", x: 600, y: 270, rotation: 3, width: 180 },
  { id: 7, type: "link", content: "Why Brutalism is Making a Comeback", label: "It's Nice That", url: "https://itsnicethat.com", x: 160, y: 480, rotation: -1, width: 200 },
  { id: 8, type: "image", content: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop", label: "Street Typography", url: "https://unsplash.com", x: 440, y: 460, rotation: 2, width: 210 },
];

const typeIcon = {
  image: ImageIcon,
  link: ExternalLink,
  quote: Quote,
  note: BookOpen,
};

const InspirationBoard = () => {
  const [pins, setPins] = useState(initialPins);
  const boardRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Section enters → fullscreen takeover
  const horizontalPadding = useTransform(scrollYProgress, [0.05, 0.2], [24, 0]);
  // Background transitions to light blue
  const bgColor = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.7, 0.85],
    [
      "hsl(var(--background))",
      "hsl(200 30% 90%)",
      "hsl(200 30% 90%)",
      "hsl(var(--background))",
    ]
  );
  // Text color adapts
  const textColor = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.7, 0.85],
    [
      "hsl(var(--foreground))",
      "hsl(210 20% 15%)",
      "hsl(210 20% 15%)",
      "hsl(var(--foreground))",
    ]
  );

  // Wind exit effect: each pin gets unique wind params
  const windSeeds = useMemo(() =>
    initialPins.map(() => ({
      xDrift: (Math.random() - 0.3) * 800, // mostly rightward
      yDrift: (Math.random() - 0.5) * 300,
      rotDrift: (Math.random() - 0.5) * 60,
    })),
    []
  );

  const handleDragStart = (id: number, e: React.PointerEvent) => {
    const pin = pins.find((p) => p.id === id);
    if (!pin || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    dragItem.current = id;
    hasDragged.current = false;
    dragOffset.current = { x: e.clientX - rect.left - pin.x, y: e.clientY - rect.top - pin.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e: React.PointerEvent) => {
    if (dragItem.current === null || !boardRef.current) return;
    hasDragged.current = true;
    const rect = boardRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.current.x;
    const newY = e.clientY - rect.top - dragOffset.current.y;
    setPins((prev) => prev.map((p) => p.id === dragItem.current ? { ...p, x: newX, y: Math.max(-20, newY) } : p));
  };

  const handleDragEnd = () => { dragItem.current = null; };

  const handleClick = (pin: PinItem) => {
    if (hasDragged.current) return;
    if (pin.url) window.open(pin.url, "_blank", "noopener");
  };

  return (
    <section ref={sectionRef} className="relative" style={{ minHeight: "180vh" }}>
      <motion.div
        className="sticky top-0 min-h-screen flex flex-col justify-start overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <motion.div style={{ paddingLeft: horizontalPadding, paddingRight: horizontalPadding }} className="pt-12">
          <div className="px-6">
            <motion.div style={{ color: textColor }}>
              <SectionHeading>My Inspiration</SectionHeading>
            </motion.div>
          </div>

          <div className="px-6">
            <motion.div
              ref={boardRef}
              className="relative w-full border border-border/30"
              style={{ height: 620, overflow: "visible" }}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
            >
              {/* Dot grid */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {pins.map((pin, i) => {
                const Icon = typeIcon[pin.type];
                const isDragging = dragItem.current === pin.id;
                const wind = windSeeds[i];

                // Wind-blown exit transforms
                const pinX = useTransform(
                  scrollYProgress,
                  [0.72, 0.92],
                  [0, wind.xDrift]
                );
                const pinY = useTransform(
                  scrollYProgress,
                  [0.72, 0.92],
                  [0, wind.yDrift]
                );
                const pinRotate = useTransform(
                  scrollYProgress,
                  [0.72, 0.92],
                  [0, wind.rotDrift]
                );
                const pinOpacity = useTransform(
                  scrollYProgress,
                  [0.72, 0.88],
                  [1, 0]
                );

                return (
                  <motion.div
                    key={pin.id}
                    className="absolute cursor-grab active:cursor-grabbing select-none"
                    style={{
                      left: pin.x,
                      top: pin.y,
                      width: pin.width,
                      rotate: pin.rotation,
                      zIndex: isDragging ? 50 : 10,
                      x: pinX,
                      y: pinY,
                      rotateZ: pinRotate,
                      opacity: pinOpacity,
                    }}
                    onPointerDown={(e) => handleDragStart(pin.id, e)}
                    whileHover={{ scale: 1.04, rotate: 0 }}
                    animate={{ scale: isDragging ? 1.06 : 1 }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                  >
                    {pin.type === "image" && (
                      <div
                        className="group overflow-hidden border border-border/40 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                        onClick={() => handleClick(pin)}
                      >
                        <img
                          src={pin.content}
                          alt={pin.label}
                          className="w-full aspect-[3/2] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          draggable={false}
                        />
                        <div className="px-3 py-2 flex items-center gap-1.5">
                          <Icon className="w-3 h-3 text-neutral-400" />
                          <p className="font-mono text-[10px] tracking-widest uppercase text-neutral-600">{pin.label}</p>
                        </div>
                      </div>
                    )}

                    {pin.type === "quote" && (
                      <div className="border border-border/40 bg-white p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        style={{ borderLeft: "3px solid hsl(var(--highlight))" }}
                      >
                        <Icon className="w-3 h-3 text-neutral-300 mb-2" />
                        <p className="text-sm text-neutral-800 leading-relaxed italic">
                          {pin.content}
                        </p>
                        <p className="font-mono text-[10px] tracking-widest uppercase text-neutral-500 mt-2">— {pin.label}</p>
                      </div>
                    )}

                    {pin.type === "link" && (
                      <div
                        className="group border border-border/40 bg-white p-4 shadow-lg hover:shadow-xl hover:bg-neutral-50 transition-all duration-200"
                        onClick={() => handleClick(pin)}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <Icon className="w-3 h-3 text-neutral-400" />
                          <p className="font-mono text-[10px] tracking-widest uppercase text-neutral-600">{pin.label}</p>
                        </div>
                        <p className="text-sm text-neutral-800 font-medium leading-snug">
                          {pin.content}
                        </p>
                        <span className="font-mono text-[10px] tracking-widest uppercase mt-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: "hsl(var(--highlight))" }}>
                          Open →
                        </span>
                      </div>
                    )}

                    {pin.type === "note" && (
                      <div className="border border-dashed border-neutral-300 bg-white/60 p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Icon className="w-3 h-3 text-neutral-400" />
                          <p className="font-mono text-[10px] tracking-widest uppercase text-neutral-500">{pin.label}</p>
                        </div>
                        <p className="text-sm text-neutral-700 leading-relaxed">
                          {pin.content}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default InspirationBoard;
