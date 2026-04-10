import { useRef, useState } from "react";
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
  span?: string;
}

const ITEMS: InspirationItem[] = [
  { id: 1, type: "image", title: "Alpine Light", content: "Mountain photography — chasing light at altitude.", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", url: "https://unsplash.com", span: "col-span-2 row-span-2" },
  { id: 2, type: "quote", title: "Steve Jobs", content: "\"Design is not just what it looks like. Design is how it works.\"" },
  { id: 3, type: "image", title: "Color Theory", content: "Exploring gradients and natural palettes.", imageUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&h=300&fit=crop", url: "https://unsplash.com" },
  { id: 4, type: "note", title: "Note to self", content: "Explore brutalist web aesthetics — raw, honest, confrontational." },
  { id: 5, type: "link", title: "Wired", content: "The Future of Creative Tools", url: "https://wired.com", span: "col-span-2" },
  { id: 6, type: "image", title: "Street Type", content: "Found type in urban environments.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", url: "https://unsplash.com", span: "row-span-2" },
  { id: 7, type: "quote", title: "Da Vinci", content: "\"Simplicity is the ultimate sophistication.\"" },
  { id: 8, type: "link", title: "It's Nice That", content: "Why Brutalism is Making a Comeback", url: "https://itsnicethat.com" },
];

const typeLabel: Record<string, string> = {
  image: "📺 VISUAL",
  quote: "📌 QUOTE",
  note: "📓 NOTE",
  link: "📰 LINK",
};

const InspirationBoard = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<InspirationItem | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const padding = useTransform(scrollYProgress, [0, 0.12, 0.25, 0.70, 0.82, 1], [24, 24, 0, 0, 24, 24]);

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
          <div className="relative flex-1 min-h-0 overflow-auto border border-border/30 bg-background p-4">
            <div className="grid grid-cols-4 auto-rows-[140px] gap-3">
              {ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  className={`group relative overflow-hidden border border-border/30 bg-background text-left cursor-pointer transition-colors hover:border-[${ACCENT}]/60 ${item.span || ""}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => setActiveItem(item)}
                >
                  {item.imageUrl ? (
                    <>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-background/60 group-hover:bg-background/30 transition-colors" />
                      <div className="relative p-3 h-full flex flex-col justify-end">
                        <p className="mono-text text-foreground/50" style={{ fontSize: 9 }}>{item.type.toUpperCase()}</p>
                        <p className="text-sm font-medium text-foreground tracking-tight">{item.title}</p>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 h-full flex flex-col justify-between">
                      <p className="mono-text text-foreground/40" style={{ fontSize: 9 }}>{item.type.toUpperCase()}</p>
                      <div>
                        <p className="text-xs text-foreground/70 leading-relaxed mb-1">{item.content}</p>
                        <p className="mono-text text-foreground/40" style={{ fontSize: 9 }}>— {item.title}</p>
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
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
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 mono-text text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
              style={{ fontSize: 10 }}
            >
              ESC ✕
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
