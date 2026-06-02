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
    <section className="pb-0 pt-0 md:pb-10">
      <div className="px-6 mb-6">
        <SectionHeading className="mb-0">News</SectionHeading>
      </div>

      <div className="relative">
        <div className="site-corner mx-6 overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-[3px] overflow-x-auto scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {newsItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="news-card group relative block flex-shrink-0 overflow-hidden bg-background"
                style={{ width: "clamp(232px, 25.2vw, 357px)", scrollSnapAlign: "start" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative aspect-[9/16] w-full overflow-hidden">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      fetchpriority={index < 3 ? "high" : "low"}
                    />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,hsl(var(--image-scrim)/0.94)_0%,hsl(var(--image-scrim)/0.48)_48%,transparent_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <div className="mb-4 flex h-[28px] items-center md:h-[32px]">
                      <img
                        src={item.logoUrl}
                        alt={item.logoAlt}
                        className="h-full w-auto max-w-[120px] object-contain opacity-90 brightness-0 invert transition-opacity duration-200 group-hover:opacity-100"
                        loading={index < 3 ? "eager" : "lazy"}
                        decoding="async"
                        fetchpriority="low"
                      />
                    </div>
                    <h3 className="news-card-title pr-8 text-[0.92rem] font-semibold leading-tight tracking-tight text-white transition-colors duration-200 md:text-[1.15rem]">
                      {item.title}
                    </h3>
                  </div>
                  <div className="absolute bottom-5 right-5">
                    <span className="translate-x-[-4px] text-sm text-white/80 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-[hsl(var(--highlight))] group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>


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
              className="absolute left-8 top-1/2 -translate-y-1/2 z-20 text-white hover:text-white transition-colors drop-shadow-[0_0_8px_hsl(var(--background))]"
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
              className="absolute right-8 top-1/2 -translate-y-1/2 z-20 text-white hover:text-white transition-colors drop-shadow-[0_0_8px_hsl(var(--background))]"
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
