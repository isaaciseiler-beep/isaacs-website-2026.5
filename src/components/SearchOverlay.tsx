import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate, hasSearchResults, searchSite, type SearchResult } from "@/lib/searchIndex";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface SearchTriggerProps {
  variant?: "header" | "sidebar";
  className?: string;
  style?: CSSProperties;
  onOpen?: () => void;
}

const ResultRow = ({ result, onSelect }: { result: SearchResult; onSelect: (result: SearchResult) => void }) => (
  <button
    type="button"
    onClick={() => onSelect(result)}
    className="group grid w-full grid-cols-[48px_1fr_auto] items-center gap-3 border-t border-foreground/10 py-3 text-left transition-colors duration-300 hover:border-foreground/20"
  >
    <div className="h-12 w-12 overflow-hidden bg-foreground/10">
      {result.image ? (
        <img src={result.image} alt="" className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" loading="lazy" />
      ) : null}
    </div>
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate text-sm font-medium leading-tight text-foreground">{result.title}</p>
        {result.date ? <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/30">{formatDate(result.date)}</span> : null}
      </div>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-foreground/50">{result.description}</p>
    </div>
    <ArrowUpRight className="h-4 w-4 text-foreground/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" strokeWidth={1.5} />
  </button>
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
            className="fixed inset-0 z-[80] bg-background/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed right-3 top-3 z-[85] flex max-h-[calc(100svh-1.5rem)] w-[calc(100vw-1.5rem)] flex-col overflow-hidden border border-foreground/12 bg-background/95 shadow-[0_32px_120px_-40px_rgb(0_0_0/0.75)] backdrop-blur-2xl md:right-6 md:top-5 md:w-[min(720px,calc(100vw-3rem))]"
            initial={{ opacity: 0, x: 28, scale: 0.985, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 18, scale: 0.985, filter: "blur(8px)" }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            <div className="flex h-16 items-center gap-3 border-b border-foreground/10 px-4 md:px-5">
              <Search className="h-4 w-4 shrink-0 text-foreground/35" strokeWidth={1.5} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                className="h-full min-w-0 flex-1 bg-transparent text-lg font-medium tracking-tight text-foreground outline-none placeholder:text-foreground/25 md:text-xl"
              />
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-foreground/40 transition-colors duration-200 hover:text-foreground"
                aria-label="Close search"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="min-h-[280px] overflow-y-auto px-4 pb-5 md:max-h-[min(70svh,720px)] md:px-5">
              {!hasQuery ? (
                <div className="grid min-h-[280px] place-items-center">
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Projects", "News", "Photos", "Inspiration"].map((label) => (
                      <span key={label} className="font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/25">{label}</span>
                    ))}
                  </div>
                </div>
              ) : hasResults ? (
                <div className="py-1">
                  {groups.map((group) =>
                    group.results.length ? (
                      <section key={group.category} className="pt-5">
                        <div className="mb-2 flex items-center justify-between">
                          <h2 className="font-mono text-[10px] uppercase tracking-[0.26em] text-foreground/45">{group.label}</h2>
                          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/25">{group.results.length}</span>
                        </div>
                        <div>
                          {group.results.map((result) => (
                            <ResultRow key={result.id} result={result} onSelect={handleSelect} />
                          ))}
                        </div>
                      </section>
                    ) : null,
                  )}
                </div>
              ) : (
                <div className="grid min-h-[280px] place-items-center">
                  <p className="text-sm text-foreground/35">No strong matches.</p>
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
          className={`fixed right-6 top-4 z-[60] flex h-7 w-7 items-center justify-center transition-opacity duration-200 hover:opacity-70 ${className ?? ""}`}
          style={style}
          aria-label="Search"
        >
          <Search className="h-4 w-4" strokeWidth={1.65} />
        </button>
      )}
      <SearchPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default SearchTrigger;
