import { FormEvent, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
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
  const [submittedPrompt, setSubmittedPrompt] = useState("");
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
    setSubmittedPrompt(prompt);
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

  const hasResponse = Boolean(answer || error || isLoading);

  return (
    <section className="relative z-20 flex items-start px-6 pb-14 pt-12 md:pb-16 md:pt-16">
      <motion.div
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.56, ease: EASE }}
      >
        <p className="mb-5 text-center text-3xl font-semibold leading-none tracking-tight text-foreground md:text-5xl">
          Isaac AI
        </p>

        <div className="flex h-[340px] w-full max-w-2xl flex-col bg-foreground/[0.035] text-left shadow-[0_0_70px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out focus-within:bg-foreground/[0.045] md:h-[400px]">
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-3 pt-4 md:px-5 md:pt-5">
            {hasResponse && (
              <>
              <div className="ml-auto max-w-[86%] bg-foreground/[0.08] px-3 py-2 text-sm leading-relaxed text-foreground/75 md:max-w-[78%]">
                {submittedPrompt || query.trim()}
              </div>

              <motion.div
                className="mr-auto max-w-[92%] bg-background/45 px-3.5 py-3 md:max-w-[84%]"
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
                  <p className="whitespace-pre-line text-[14px] leading-relaxed text-foreground/72 md:text-[15px]">
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
                          className="max-w-full truncate bg-foreground/[0.055] px-2.5 py-1.5 text-[10px] text-foreground/45 transition-colors hover:bg-foreground/[0.09] hover:text-foreground/65"
                        >
                          {source.title}
                        </a>
                      ) : (
                        <span
                          key={source.id}
                          className="max-w-full truncate bg-foreground/[0.055] px-2.5 py-1.5 text-[10px] text-foreground/35"
                        >
                          {source.title}
                        </span>
                      ),
                    )}
                  </div>
                ) : null}
              </motion.div>
              </>
            )}
          </div>

          <form
            onSubmit={askAssistant}
            className="flex min-h-[70px] items-end gap-3 px-4 py-3 md:px-5"
          >
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Ask about my work, projects, or background"
              rows={1}
              className="max-h-32 min-h-11 min-w-0 flex-1 resize-none bg-transparent py-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-foreground/32 md:text-base"
            />
            <motion.button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="flex h-11 w-11 shrink-0 items-center justify-center bg-[hsl(50_33%_7%)] text-white shadow-[0_10px_24px_rgba(18,24,14,0.24)] transition-colors hover:bg-[hsl(50_33%_12%)] disabled:pointer-events-none disabled:bg-foreground/12 disabled:text-foreground/32 disabled:shadow-none"
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ y: 0, scale: 0.94 }}
              transition={{ duration: 0.18, ease: EASE }}
              aria-label="Ask Isaac AI"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={1.7} />
            </motion.button>
          </form>
        </div>

        <p className="mt-2.5 max-w-xl text-center text-[9px] italic leading-relaxed text-foreground/30 md:text-[10px]">
          This AI is trained on a body of my work and does not speak for me. It is a prototype. Report output issues{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Isaac%20AI%20output%20issue`}
            className="text-foreground/45 underline decoration-foreground/15 underline-offset-4 transition-colors hover:text-foreground"
          >
            here
          </a>
          .
        </p>
      </motion.div>
    </section>
  );
};

export default IsaacAISection;
