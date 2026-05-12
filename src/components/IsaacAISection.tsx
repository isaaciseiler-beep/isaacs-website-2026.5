import { FormEvent, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";

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

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const IsaacAISection = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [sources, setSources] = useState<ChatApiResponse["sources"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);

  const askAssistant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = query.trim();
    if (!prompt || isLoading) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setAnswer("");
    setError("");
    setSources([]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = (await response.json()) as ChatApiResponse;
      if (requestIdRef.current !== requestId) return;

      setAnswer(data.message || "");
      setError(data.error || (!data.message ? "I could not reach the AI assistant yet." : ""));
      setSources(data.sources || []);
    } catch {
      if (requestIdRef.current !== requestId) return;
      setError("I could not reach the AI assistant yet. On local dev, run this through Vercel so /api/chat is available.");
    } finally {
      if (requestIdRef.current === requestId) setIsLoading(false);
    }
  };

  return (
    <section className="relative z-20 flex min-h-[78vh] items-center px-6 py-24 md:min-h-screen md:py-32">
      <motion.div
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.56, ease: EASE }}
      >
        <p className="mb-4 text-center text-3xl font-semibold leading-none tracking-tight text-foreground md:text-5xl">
          Isaac AI
        </p>

        <form
          onSubmit={askAssistant}
          className="flex h-14 w-full max-w-2xl items-center border border-foreground/14 bg-foreground/[0.045] text-left transition-colors focus-within:border-foreground/28 md:h-16"
        >
          <div className="flex h-full w-12 shrink-0 items-center justify-center text-foreground/35 md:w-14">
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask about my work, projects, or background"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/32 md:text-base"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center bg-[hsl(var(--highlight))] text-background transition-opacity hover:opacity-82 disabled:pointer-events-none disabled:opacity-30 md:h-11 md:w-11"
            aria-label="Ask Isaac AI"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={1.7} />
          </button>
        </form>

        <p className="mt-3 max-w-2xl text-center text-xs italic leading-relaxed text-foreground/38 md:text-[13px]">
          This AI is trained off of a body of my work, and does not speak for me - it's a prototype. Let me know if you have issues with outputs{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Isaac%20AI%20output%20issue`}
            className="text-foreground/55 underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-foreground"
          >
            here
          </a>
        </p>

        {(answer || error || isLoading) && (
          <motion.div
            className="mt-8 w-full max-w-2xl border-t border-foreground/12 pt-5 text-left"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
          >
            {isLoading ? (
              <div className="flex h-5 items-center gap-1.5" aria-label="Loading AI answer">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="block h-1 w-1 bg-foreground/35"
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 1, repeat: Infinity, delay: dot * 0.16 }}
                  />
                ))}
              </div>
            ) : (
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/70">
                {answer || error}
              </p>
            )}

            {!isLoading && sources?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {sources.slice(0, 4).map((source) =>
                  source.url ? (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="max-w-full truncate bg-foreground/[0.045] px-2.5 py-1.5 text-[10px] text-foreground/45 transition-colors hover:bg-foreground/[0.08] hover:text-foreground/65"
                    >
                      {source.title}
                    </a>
                  ) : (
                    <span
                      key={source.id}
                      className="max-w-full truncate bg-foreground/[0.045] px-2.5 py-1.5 text-[10px] text-foreground/35"
                    >
                      {source.title}
                    </span>
                  ),
                )}
              </div>
            ) : null}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default IsaacAISection;
