import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";
import {
  askSiteAssistant,
  countUserMessages,
  isChatLimitReached,
  MAX_CHAT_USER_MESSAGES,
  type ChatRequestMessage,
  type ChatSource,
} from "@/lib/chatClient";

interface ChatMessage extends ChatRequestMessage {
  id: string;
  sources?: ChatSource[];
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const createMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const IsaacAISection = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pageScrollBeforeFocusRef = useRef(0);
  const focusRestoreTimersRef = useRef<number[]>([]);

  const userMessageCount = countUserMessages(messages);
  const limitReached = isChatLimitReached(messages);

  useEffect(() => {
    const list = messageListRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const clearFocusRestoreTimers = () => {
    focusRestoreTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    focusRestoreTimersRef.current = [];
  };

  const restorePageScrollAfterFocus = () => {
    clearFocusRestoreTimers();
    const restore = () => window.scrollTo(0, pageScrollBeforeFocusRef.current);
    window.requestAnimationFrame(restore);
    focusRestoreTimersRef.current = [40, 120, 240, 420, 700].map((delay) => window.setTimeout(restore, delay));
  };

  const askAssistant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = query.trim();
    if (!prompt || isLoading || limitReached) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const userMessage: ChatMessage = { id: createMessageId(), role: "user", content: prompt };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setQuery("");
    setIsLoading(true);

    try {
      const data = await askSiteAssistant(nextMessages.map(({ role, content }) => ({ role, content })));
      if (requestIdRef.current !== requestId) return;

      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: data.message || "The AI assistant is temporarily unavailable. Please try again shortly.",
          sources: data.sources || [],
        },
      ]);
    } catch (error) {
      if (requestIdRef.current !== requestId) return;
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: error instanceof Error ? error.message : "The AI assistant is temporarily unavailable. Please try again shortly.",
        },
      ]);
    } finally {
      if (requestIdRef.current === requestId) setIsLoading(false);
    }
  };

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

        <div className="flex h-[340px] w-full max-w-2xl flex-col overflow-hidden rounded-[8px] border border-foreground/[0.08] bg-foreground/[0.035] text-left shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition-all duration-500 ease-out focus-within:border-foreground/[0.14] focus-within:bg-foreground/[0.045] md:h-[400px]">
          <div
            ref={messageListRef}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 pb-3 pt-4 scrollbar-hide md:px-5 md:pt-5"
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`max-w-[92%] rounded-[8px] px-3.5 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.08)] ${
                  message.role === "user"
                    ? "ml-auto bg-foreground text-background md:max-w-[78%]"
                    : "mr-auto border border-foreground/[0.07] bg-background/55 text-foreground/78 md:max-w-[84%]"
                }`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, ease: EASE }}
              >
                <p className="whitespace-pre-line text-[14px] leading-relaxed md:text-[15px]">{message.content}</p>
              </motion.div>
            ))}

            {isLoading ? (
              <motion.div
                className="mr-auto max-w-[84%] rounded-[8px] border border-foreground/[0.07] bg-background/55 px-3.5 py-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, ease: EASE }}
              >
                <div className="flex h-5 items-center gap-1.5" aria-label="Loading AI answer">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="block h-1.5 w-1.5 rounded-full bg-foreground/45"
                      animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: dot * 0.16 }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : null}
          </div>

          <form
            onSubmit={askAssistant}
            className="flex min-h-[76px] items-end gap-3 border-t border-foreground/[0.07] bg-background/20 px-3 py-3 md:px-4"
          >
            <textarea
              ref={textareaRef}
              value={query}
              onPointerDown={(event) => {
                pageScrollBeforeFocusRef.current = window.scrollY;
                if (document.activeElement !== textareaRef.current) {
                  event.preventDefault();
                  textareaRef.current?.focus({ preventScroll: true });
                  restorePageScrollAfterFocus();
                }
              }}
              onFocus={restorePageScrollAfterFocus}
              onBlur={clearFocusRestoreTimers}
              onChange={(event) => {
                setQuery(event.target.value);
                restorePageScrollAfterFocus();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={limitReached ? "Conversation limit reached" : "Ask about my work, projects, or background"}
              rows={1}
              disabled={limitReached}
              aria-label={`Message ${Math.min(userMessageCount + 1, MAX_CHAT_USER_MESSAGES)} of ${MAX_CHAT_USER_MESSAGES}`}
              className="max-h-32 min-h-11 min-w-0 flex-1 resize-none rounded-[8px] bg-foreground/[0.045] px-3.5 py-3 text-base leading-relaxed text-foreground outline-none transition-colors placeholder:text-foreground/36 focus:bg-foreground/[0.07]"
            />
            <span className="shrink-0 font-mono text-[9px] text-foreground/25" aria-hidden>
              {userMessageCount}/{MAX_CHAT_USER_MESSAGES}
            </span>
            <motion.button
              type="submit"
              disabled={!query.trim() || isLoading || limitReached}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[hsl(50_33%_7%)] text-white shadow-[0_10px_24px_rgba(18,24,14,0.24)] transition-colors hover:bg-[hsl(50_33%_12%)] disabled:pointer-events-none disabled:bg-foreground/12 disabled:text-foreground/32 disabled:shadow-none"
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
