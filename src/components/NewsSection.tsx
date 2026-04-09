import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const newsItems = [
  { id: 1, date: "Mar 2026", title: "Selected for ADC Annual Awards", description: "Urban Canvas project recognized in the branding category.", tag: "Award" },
  { id: 2, date: "Feb 2026", title: "Speaking at Config 2026", description: "Presenting on the intersection of street culture and digital design.", tag: "Event" },
  { id: 3, date: "Jan 2026", title: "Studio Expansion — Brooklyn", description: "New workspace opening in Williamsburg, Q2 2026.", tag: "Studio" },
  { id: 4, date: "Dec 2025", title: "Year in Review Published", description: "Reflecting on 14 projects shipped across 6 countries.", tag: "Editorial" },
  { id: 5, date: "Nov 2025", title: "Collaboration with Muji", description: "Spatial design for their new concept store in Shibuya.", tag: "Project" },
  { id: 6, date: "Oct 2025", title: "Featured in It's Nice That", description: "Deep-dive interview on process and creative philosophy.", tag: "Press" },
  { id: 7, date: "Sep 2025", title: "Workshop — Type in Motion", description: "Two-day kinetic typography intensive at Pratt Institute.", tag: "Event" },
  { id: 8, date: "Aug 2025", title: "Concrete Dreams Shortlisted", description: "European Design Awards 2025, spatial category.", tag: "Award" },
  { id: 9, date: "Jul 2025", title: "Open Call: Residency Program", description: "Accepting applications for the summer residency in Lisbon.", tag: "Studio" },
  { id: 10, date: "Jun 2025", title: "Brand Identity for Aether", description: "Full identity system for emerging architecture firm.", tag: "Project" },
];

const chevronVariants = {
  initial: (dir: "left" | "right") => ({
    opacity: 0,
    x: dir === "left" ? -20 : 20,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: (dir: "left" | "right") => ({
    opacity: 0,
    x: dir === "left" ? -20 : 20,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  }),
};

const NewsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-12">
      <div className="px-6 mb-6">
        <h2 className="section-heading mb-0">News</h2>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-[3px] overflow-x-auto scrollbar-hide px-6"
          style={{ scrollSnapType: "x mandatory", scrollPaddingLeft: 24 }}
        >
          {newsItems.map((item, index) => (
            <motion.a
              key={item.id}
              href="#"
              className="group relative block flex-shrink-0 border border-border p-6 hover:bg-card/60 transition-colors duration-300 overflow-hidden"
              style={{ width: "calc(40% - 2px)", scrollSnapAlign: "start", minWidth: 280 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="inline-block mono-text px-3 py-1 bg-foreground text-background">
                  {item.tag}
                </span>
              </div>

              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 group-hover:text-foreground/80 transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed mb-4">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <p className="mono-text">{item.date}</p>
                <span className="text-foreground text-sm opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300">
                  →
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.a>
          ))}
          {/* Spacer for right padding */}
          <div className="flex-shrink-0 w-3" aria-hidden />
        </div>

        {/* Right edge gradient — always visible */}
        <div
          className="absolute top-0 right-0 bottom-0 w-14 pointer-events-none z-10"
          style={{ background: "linear-gradient(to left, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 40%, transparent 100%)" }}
        />

        {/* Left edge gradient — only when scrolled */}
        <div
          className="absolute top-0 left-0 bottom-0 w-14 pointer-events-none z-10 transition-opacity duration-500 ease-out"
          style={{
            background: "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 40%, transparent 100%)",
            opacity: canScrollLeft ? 1 : 0,
          }}
        />

        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              key="scroll-left"
              custom="left"
              variants={chevronVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => scroll("left")}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-20 text-foreground hover:text-foreground transition-colors drop-shadow-[0_0_8px_hsl(var(--background))]"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.85 }}
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              key="scroll-right"
              custom="right"
              variants={chevronVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => scroll("right")}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-20 text-foreground hover:text-foreground transition-colors drop-shadow-[0_0_8px_hsl(var(--background))]"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.85 }}
            >
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default NewsSection;
