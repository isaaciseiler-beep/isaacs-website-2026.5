import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { hasSearchResults, searchSite, type SearchResult } from "@/lib/searchIndex";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface SearchTriggerProps {
  variant?: "header" | "sidebar";
  className?: string;
  style?: CSSProperties;
  open?: boolean;
  renderPanel?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
}

interface ChatApiResponse {
  message?: string;
  error?: string;
  sources?: Array<{
    id: string;
    title: string;
    source: string;
    url?: string;
  }>;
}

const SEARCH_IDEAS = [
  { id: "public-ai", label: "Public AI", query: "state government ai policy genai" },
  { id: "education", label: "Education", query: "education classroom fulbright chatgpt teaching" },
  { id: "civic", label: "Civic Work", query: "congress philanthropy public service st louis" },
  { id: "platforms", label: "Platforms", query: "ai digital platforms journalism research" },
  { id: "climate", label: "Climate", query: "electric vehicle charging infrastructure gis" },
  { id: "visual", label: "Visual", query: "photography maps design portfolio" },
];

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
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[hsl(50_33%_7%)]">
      {result.image ? (
        <img
          src={result.image}
          alt=""
          className="h-full w-full object-cover grayscale transition-[filter] duration-700 ease-out group-hover:grayscale-0"
          loading="lazy"
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,hsl(50_33%_7%/0.94)_0%,hsl(50_33%_7%/0.66)_44%,hsl(68_100%_81%/0.10)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.24em] text-white/42">{result.subtitle}</p>
        <p className="text-lg font-semibold leading-none tracking-tight text-[#f3f6ff] transition-colors duration-300 group-hover:text-[hsl(var(--highlight))]">
          {result.title}
        </p>
      </div>
      <ArrowUpRight
        className="absolute right-3 top-3 h-4 w-4 text-white/45 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[hsl(var(--highlight))]"
        strokeWidth={1.5}
      />
    </div>
  </motion.button>
);

export const SearchPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const [selectedIdeaIds, setSelectedIdeaIds] = useState<string[]>([]);
  const [aiQuery, setAiQuery] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiSources, setAiSources] = useState<ChatApiResponse["sources"]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const latestQueryRef = useRef("");
  const aiRequestIdRef = useRef(0);
  const navigate = useNavigate();
  const groups = useMemo(() => searchSite(query, 5), [query]);
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const hasResults = hasSearchResults(groups);
  const showAiPanel = hasQuery && trimmedQuery.length > 2;

  useEffect(() => {
    latestQueryRef.current = trimmedQuery;
    if (trimmedQuery !== aiQuery) {
      setAiMessage("");
      setAiError("");
      setAiSources([]);
    }
  }, [aiQuery, trimmedQuery]);

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
    if (!open) {
      setQuery("");
      setSelectedIdeaIds([]);
      setAiQuery("");
      setAiMessage("");
      setAiError("");
      setAiSources([]);
      setAiLoading(false);
      aiRequestIdRef.current += 1;
    }
  }, [open]);

  const toggleIdea = (ideaId: string) => {
    setSelectedIdeaIds((current) => {
      const next = current.includes(ideaId)
        ? current.filter((id) => id !== ideaId)
        : [...current, ideaId];
      setQuery(
        next
          .map((id) => SEARCH_IDEAS.find((idea) => idea.id === id)?.query)
          .filter(Boolean)
          .join(" "),
      );
      return next;
    });
  };

  const askAssistant = async () => {
    const requestQuery = trimmedQuery;
    if (!requestQuery || aiLoading) return;

    const requestId = aiRequestIdRef.current + 1;
    aiRequestIdRef.current = requestId;
    setAiQuery(requestQuery);
    setAiMessage("");
    setAiError("");
    setAiSources([]);
    setAiLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: requestQuery }],
        }),
      });
      const data = (await response.json()) as ChatApiResponse;

      if (aiRequestIdRef.current !== requestId || latestQueryRef.current !== requestQuery) return;

      setAiMessage(data.message || "");
      setAiError(data.error || (!data.message ? "I could not reach the AI assistant yet." : ""));
      setAiSources(data.sources || []);
    } catch {
      if (aiRequestIdRef.current !== requestId || latestQueryRef.current !== requestQuery) return;
      setAiError("I could not reach the AI assistant yet. On local dev, run this through Vercel so /api/chat is available.");
    } finally {
      if (aiRequestIdRef.current === requestId && latestQueryRef.current === requestQuery) {
        setAiLoading(false);
      }
    }
  };

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
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed right-0 top-0 z-[85] isolate flex h-[100dvh] w-screen flex-col overflow-hidden px-6 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-32 text-foreground md:w-[390px]"
            initial={{ x: "100%", opacity: 0.96, filter: "blur(8px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ x: "100%", opacity: 0.96, filter: "blur(8px)" }}
            transition={{ duration: 0.4, ease: EASE_TEXT }}
          >
            <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,hsl(var(--background)/0)_0%,hsl(var(--background)/0.94)_16%,hsl(var(--background))_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-background via-background/95 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-background via-background/80 to-transparent" />

            <div className="absolute right-6 top-4 z-10 flex h-[25px] w-[calc(100%-3rem)] items-center justify-end gap-2 md:w-[342px]">
              <button
                type="button"
                onClick={onClose}
                className="flex h-[25px] w-[25px] shrink-0 items-center justify-center text-foreground/35 transition-colors duration-200 hover:text-foreground"
                aria-label="Close search"
              >
                <X className="h-5 w-5 md:h-3.5 md:w-3.5" strokeWidth={1.5} />
              </button>
              <motion.div
                className="flex min-w-0 flex-1 origin-right items-center justify-end gap-2 overflow-hidden"
                initial={{ width: 25, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                exit={{ width: 25, opacity: 0 }}
                transition={{ duration: 0.48, ease: EASE }}
              >
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setSelectedIdeaIds([]);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") askAssistant();
                  }}
                  placeholder="Search"
                  className="min-w-0 flex-1 bg-transparent text-right text-[28px] font-medium leading-none text-foreground outline-none placeholder:text-foreground/30 md:text-sm md:leading-normal"
                />
                <Search className="h-5 w-5 shrink-0 text-foreground/45 md:h-3.5 md:w-3.5" strokeWidth={1.5} />
              </motion.div>
            </div>

            <motion.div
              className="absolute right-6 top-12 z-10 flex w-[calc(100%-3rem)] flex-wrap justify-end gap-1.5 md:w-[342px]"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.34, ease: EASE_TEXT, delay: 0.06 }}
            >
              {SEARCH_IDEAS.map((idea) => {
                const selected = selectedIdeaIds.includes(idea.id);
                return (
                  <button
                    key={idea.id}
                    type="button"
                    onClick={() => toggleIdea(idea.id)}
                    className={`px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors duration-200 ${
                      selected
                        ? "bg-[hsl(var(--highlight))] text-[hsl(var(--background))]"
                        : "bg-foreground/[0.045] text-foreground/45 hover:bg-foreground/[0.08] hover:text-foreground/72"
                    }`}
                    aria-pressed={selected}
                  >
                    {idea.label}
                  </button>
                );
              })}
            </motion.div>

            <div className="min-h-0 flex-1 overflow-y-auto pb-4 pt-2 scrollbar-hide">
              {!hasQuery ? (
                <div className="grid h-full min-h-[260px] place-items-center">
                  <p className="max-w-[18rem] text-right text-[13px] leading-relaxed text-foreground/35">
                    Select a few ideas or type your own search.
                  </p>
                </div>
              ) : (
                <div>
                  {showAiPanel ? (
                    <motion.section
                      className="pb-5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.42, ease: EASE, delay: 0.01 }}
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h2 className="font-mono text-[10px] uppercase tracking-[0.26em] text-foreground/45">AI</h2>
                        <button
                          type="button"
                          onClick={askAssistant}
                          disabled={aiLoading}
                          className="flex h-7 items-center gap-1.5 bg-foreground/[0.045] px-2.5 text-[11px] font-medium text-foreground/55 transition-colors hover:bg-foreground/[0.08] hover:text-foreground disabled:pointer-events-none disabled:opacity-45"
                        >
                          <Sparkles className="h-3 w-3" strokeWidth={1.6} />
                          <span>{aiLoading ? "Thinking" : aiMessage || aiError ? "Ask again" : "Ask AI"}</span>
                        </button>
                      </div>
                      {aiMessage || aiError || aiLoading ? (
                        <div className="text-[13px] leading-relaxed text-foreground/65">
                          {aiLoading ? (
                            <div className="flex h-5 items-center gap-1.5" aria-label="Loading AI answer">
                              {[0, 1, 2].map((dot) => (
                                <motion.span
                                  key={dot}
                                  className="block h-1 w-1 rounded-full bg-foreground/35"
                                  animate={{ opacity: [0.25, 1, 0.25] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: dot * 0.16 }}
                                />
                              ))}
                            </div>
                          ) : (
                            <p className="whitespace-pre-line">{aiMessage || aiError}</p>
                          )}
                          {!aiLoading && aiSources?.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {aiSources.slice(0, 3).map((source) =>
                                source.url ? (
                                  <button
                                    key={source.id}
                                    type="button"
                                    onClick={() => window.open(source.url, "_blank", "noopener,noreferrer")}
                                    className="max-w-full truncate bg-foreground/[0.045] px-2 py-1 text-[10px] text-foreground/45 transition-colors hover:bg-foreground/[0.08] hover:text-foreground/65"
                                  >
                                    {source.title}
                                  </button>
                                ) : (
                                  <span key={source.id} className="max-w-full truncate bg-foreground/[0.045] px-2 py-1 text-[10px] text-foreground/35">
                                    {source.title}
                                  </span>
                                ),
                              )}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </motion.section>
                  ) : null}

                  {hasResults ? (
                    groups.map((group) =>
                      group.results.length ? (
                        <motion.section
                          key={group.category}
                          className="pb-8 pt-5 first:pt-0"
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
                    )
                  ) : (
                    <div className="grid min-h-[220px] place-items-center">
                      <p className="text-[28px] font-medium leading-none text-foreground/30 md:text-sm md:leading-normal">No matches</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

const SearchTrigger = ({
  variant = "header",
  className,
  style,
  open,
  renderPanel = true,
  onOpen,
  onClose,
  onOpenChange,
}: SearchTriggerProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof open === "boolean";
  const panelOpen = isControlled ? open : internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
    if (nextOpen) onOpen?.();
    else onClose?.();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

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
      ) : !panelOpen ? (
        <button
          type="button"
          onClick={handleOpen}
          className={`site-nav-toggle-xray fixed right-6 top-4 z-[60] flex h-[25px] w-[25px] items-center justify-center transition-opacity duration-200 hover:opacity-70 ${className ?? ""}`}
          style={style}
          aria-label="Search"
        >
          <Search className="h-3.5 w-3.5" strokeWidth={1.65} />
        </button>
      ) : null}
      {renderPanel ? <SearchPanel open={panelOpen} onClose={handleClose} /> : null}
    </>
  );
};

export default SearchTrigger;
