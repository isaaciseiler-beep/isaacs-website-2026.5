import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { hasSearchResults, searchSite, type SearchResult } from "@/lib/searchIndex";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface SearchTriggerProps {
  variant?: "header" | "sidebar";
  className?: string;
  style?: CSSProperties;
  onOpen?: () => void;
}

const ResultCard = ({
  index,
  result,
  onSelect,
}: {
  index: number;
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
}) => (
  <motion.button
    type="button"
    onClick={() => onSelect(result)}
    className="group block w-full text-left"
    initial={{ opacity: 0, x: 18, filter: "blur(6px)" }}
    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
    transition={{ delay: 0.05 + index * 0.035, duration: 0.46, ease: EASE }}
  >
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/10">
      {result.image ? (
        <img
          src={result.image}
          alt=""
          className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.025] group-hover:grayscale-0"
          loading="lazy"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background)/0.68)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-white/0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/85" strokeWidth={1.5} />
    </div>
    <p className="mt-2 text-sm font-medium leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-foreground/70">
      {result.title}
    </p>
  </motion.button>
);

const SearchPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const groups = useMemo(() => searchSite(query, 5), [query]);
  const hasQuery = query.trim().length > 0;
  const hasResults = hasSearchResults(groups);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 180);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const handleSelect = (result: SearchResult) => {
    onClose();
    if (result.external) {
      window.open(result.href, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(result.href);
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-background/18 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_TEXT }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="site-sidebar-panel fixed right-0 top-0 z-[85] isolate flex h-[100svh] w-screen flex-col overflow-hidden bg-background px-6 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-20 text-foreground shadow-[-40px_0_120px_-70px_rgb(0_0_0/0.9)] md:h-screen md:w-[240px] md:py-20"
            initial={{ x: "100%", opacity: 0.72, clipPath: "inset(0 0 0 100%)", filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, clipPath: "inset(0 0 0 0%)", filter: "blur(0px)" }}
            exit={{ x: "100%", opacity: 0.78, clipPath: "inset(0 0 0 84%)", filter: "blur(7px)" }}
            transition={{ duration: 0.52, ease: EASE_TEXT, clipPath: { duration: 0.62, ease: EASE } }}
          >
            <div className="mb-8 flex items-center gap-2 md:mb-6">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Search className="h-5 w-5 shrink-0 text-foreground/35 md:h-3.5 md:w-3.5" strokeWidth={1.5} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search"
                  className="min-w-0 flex-1 bg-transparent text-[28px] font-medium leading-none text-foreground outline-none placeholder:text-foreground/30 md:text-sm md:leading-normal"
                />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center text-foreground/35 transition-colors duration-200 hover:text-foreground md:h-5 md:w-5"
                aria-label="Close search"
              >
                <X className="h-5 w-5 md:h-3.5 md:w-3.5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pb-4 scrollbar-hide">
              {!hasQuery ? (
                <div className="h-full" aria-hidden />
              ) : hasResults ? (
                <div>
                  {groups.map((group) =>
                    group.results.length ? (
                      <motion.section
                        key={group.category}
                        className="pb-8"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.42, ease: EASE, delay: 0.02 }}
                      >
                        <div className="mb-3">
                          <h2 className="font-mono text-[10px] uppercase tracking-[0.26em] text-foreground/45">{group.label}</h2>
                        </div>
                        <div className="space-y-5">
                          {group.results.map((result, resultIndex) => (
                            <ResultCard key={result.id} index={resultIndex} result={result} onSelect={handleSelect} />
                          ))}
                        </div>
                      </motion.section>
                    ) : null,
                  )}
                </div>
              ) : (
                <div className="grid h-full min-h-[220px] place-items-center">
                  <p className="text-[28px] font-medium leading-none text-foreground/30 md:text-sm md:leading-normal">No matches</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

const SearchTrigger = ({ variant = "header", className, style, onOpen }: SearchTriggerProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    onOpen?.();
    setOpen(true);
  };

  return (
    <>
      {variant === "sidebar" ? (
        <button
          type="button"
          onClick={handleOpen}
          className={`group flex w-fit items-center gap-2 py-1.5 text-left text-[28px] font-medium leading-none text-foreground/30 transition-colors duration-300 hover:text-foreground/60 md:text-sm md:leading-normal ${className ?? ""}`}
        >
          <Search className="h-5 w-5 md:h-3.5 md:w-3.5" strokeWidth={1.5} />
          <span>Search</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className={`site-nav-toggle-xray fixed right-6 top-4 z-[60] flex h-[25px] w-[25px] items-center justify-center transition-opacity duration-200 hover:opacity-70 ${className ?? ""}`}
          style={style}
          aria-label="Search"
        >
          <Search className="h-3.5 w-3.5" strokeWidth={1.65} />
        </button>
      )}
      <SearchPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default SearchTrigger;
