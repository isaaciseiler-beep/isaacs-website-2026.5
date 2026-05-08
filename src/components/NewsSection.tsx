import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { newsItems } from "@/lib/siteContent";

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
        <SectionHeading className="mb-0">News</SectionHeading>
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
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card group relative block flex-shrink-0 transition-colors duration-300 overflow-hidden flex flex-col"
              style={{ width: "calc(40% - 2px)", scrollSnapAlign: "start", minWidth: 280 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              {item.imageUrl && (
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="news-gradient absolute inset-x-0 bottom-0 h-32 pointer-events-none" />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex h-[37px] items-center">
                    <img
                      src={item.logoUrl}
                      alt={item.logoAlt}
                      className="h-full w-auto max-w-[128px] object-contain opacity-80 transition-opacity duration-200 group-hover:opacity-100"
                      loading="lazy"
                    />
                  </div>
                </div>

                <h3 className="news-card-title text-lg font-semibold tracking-tight text-foreground mb-2 transition-colors duration-200">
                  {item.title}
                </h3>
                <div className="absolute bottom-5 right-5">
                  <span className="text-foreground text-sm opacity-0 group-hover:opacity-100 group-hover:text-[hsl(var(--highlight))] translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.a>
          ))}
          {/* Spacer for right padding */}
          <div className="flex-shrink-0 w-3" aria-hidden />
        </div>

        {/* Right edge gradient — always visible */}
        <div
          className="absolute top-0 right-0 bottom-0 w-9 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to left, hsl(var(--background)) 0%, hsl(var(--background)) 35%, hsl(var(--background) / 0.85) 65%, transparent 100%)",
          }}
        />

        {/* Left edge gradient — only when scrolled */}
        <div
          className="absolute top-0 left-0 bottom-0 w-9 pointer-events-none z-10 transition-opacity duration-500 ease-out"
          style={{
            background:
              "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background)) 35%, hsl(var(--background) / 0.85) 65%, transparent 100%)",
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
