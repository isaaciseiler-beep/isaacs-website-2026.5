import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatApiResponse {
  message?: string;
  error?: string;
}

const DOT_SIZE = 36;
const DOT_BOTTOM = 20;
const DOT_RIGHT = 20;

const fastSlowTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 32,
  mass: 0.6,
};

const ChatOrb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<"search" | "ai">("search");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(DOT_BOTTOM);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastScrollY = useRef(0);

  // Show orb after scrolling, and clamp to footer top
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 10);

      const footer = document.getElementById("footer");
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const windowH = window.innerHeight;
        if (footerTop < windowH) {
          setBottomOffset(windowH - footerTop + DOT_BOTTOM);
        } else {
          setBottomOffset(DOT_BOTTOM);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Collapse on scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - lastScrollY.current) > 2) {
        setIsOpen(false);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    lastScrollY.current = window.scrollY;
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const endpoint = mode === "ai" ? "/api/chat" : "/api/search";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          query: userMsg.content,
        }),
      });

      const data = (await response.json()) as ChatApiResponse;
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            data.message ||
            data.error ||
            (mode === "ai"
              ? "I could not reach the AI assistant yet."
              : "No results found. Search indexing is not yet connected."),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            mode === "ai"
              ? "I could not reach the AI assistant yet. On local dev, run this through Vercel so /api/chat is available."
              : "Search is not connected yet.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const softShadow = "0 6px 20px -6px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.18)";

  if (!isVisible && !isOpen) return null;

  return (
    <>
      {/* Closed: circle */}
      <AnimatePresence>
        {!isOpen && isVisible && (
          <motion.button
            className="fixed z-[60] flex items-center justify-center rounded-full"
            style={{
              bottom: bottomOffset,
              right: DOT_RIGHT,
              width: DOT_SIZE,
              height: DOT_SIZE,
              background: "hsl(var(--highlight))",
              boxShadow: softShadow,
            }}
            onClick={() => toast("Indexed search and AI assistant coming soon")}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.12, 1], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.18 }}
            aria-label="Open chat"
          />
        )}
      </AnimatePresence>

      {/* Open: morphs from circle */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[55]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed z-[60] flex flex-col items-stretch overflow-hidden"
              style={{
                bottom: bottomOffset,
                right: DOT_RIGHT,
                transformOrigin: "bottom right",
              filter: "none",
              }}
              initial={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: DOT_SIZE / 2,
                opacity: 0.8,
              }}
              animate={{
                width: "min(80vw, 896px)",
                height: "auto",
                borderRadius: 0,
                opacity: 1,
              }}
              exit={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: DOT_SIZE / 2,
                opacity: 0,
              }}
              transition={fastSlowTransition}
            >
              {/* Conversation area */}
              <AnimatePresence>
                {messages.length > 0 && (
                  <motion.div
                    className="w-full mb-2 max-h-[50vh] overflow-y-auto scrollbar-hide"
                    style={{
                      borderRadius: 24,
                      background: "hsl(var(--background) / 0.35)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                      boxShadow: "none",
                    }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={fastSlowTransition}
                  >
                    <div className="px-5 py-4 space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <p
                            className={`text-xs leading-relaxed max-w-[85%] ${
                              msg.role === "user"
                                ? "text-foreground/90"
                                : "text-foreground/60"
                            }`}
                          >
                            {msg.content}
                          </p>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-1 h-1 rounded-full bg-foreground/30"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input pill */}
              <div
                className="w-full flex items-center gap-2 px-4"
                style={{ borderRadius: 100, background: "hsl(var(--highlight))", boxShadow: "none", height: DOT_SIZE }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={mode === "ai" ? "Ask me anything…" : "Search my work…"}
                  className="flex-1 bg-transparent text-xs text-background placeholder:text-background/25 outline-none min-w-0"
                />
                <AnimatePresence>
                  {mode === "ai" && input.trim() && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      onClick={handleSend}
                      className="w-6 h-6 rounded-full bg-background flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
                    >
                      <ArrowUp className="w-3 h-3 text-foreground" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Mode buttons */}
              <div className="w-full flex items-center justify-between mt-2.5 px-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMode("search")}
                    className={`pill-button !px-4 !py-1.5 !text-[10px] ${
                      mode === "search" ? "opacity-100" : "opacity-30 hover:opacity-50"
                    }`}
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setMode("ai")}
                    className={`pill-button !px-4 !py-1.5 !text-[10px] ${
                      mode === "ai" ? "opacity-100" : "opacity-30 hover:opacity-50"
                    }`}
                  >
                    AI
                  </button>
                </div>
                <AnimatePresence>
                  {mode === "ai" && (
                    <motion.p
                      className="text-foreground/20"
                      style={{ fontSize: 8 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Trained on my knowledge. May be inaccurate.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatOrb;
