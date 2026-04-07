import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const DOT_SIZE = 14;
const DOT_BOTTOM = 24;
const DOT_RIGHT = 24;

const ChatOrb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"search" | "ai">("search");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastScrollY = useRef(0);

  // Collapse on scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - lastScrollY.current) > 30) {
        setIsOpen(false);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
    lastScrollY.current = window.scrollY;
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: mode === "ai"
            ? "This is a placeholder AI response. Connect an LLM to bring me to life."
            : "No results found. Search indexing is not yet connected.",
        },
      ]);
      setIsLoading(false);
    }, 1200);
  };

  // The orb color — light blue from the site palette
  const orbColor = "hsl(200 60% 78%)";
  const bgShadow = "hsl(var(--background))";

  return (
    <>
      {/* Closed: circle dot */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="fixed z-[60] flex items-center justify-center"
            style={{ bottom: DOT_BOTTOM, right: DOT_RIGHT }}
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            aria-label="Open chat"
          >
            <motion.div
              className="rounded-full"
              style={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                background: orbColor,
                boxShadow: `0 0 16px 4px ${bgShadow}, 0 0 6px 1px hsl(200 60% 78% / 0.15)`,
              }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Open: expands from the dot position */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[55]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* 
              Container is anchored at bottom-right (same as dot).
              It morphs from a tiny circle to the full chat panel.
              transformOrigin bottom-right keeps expansion rooted at the dot.
            */}
            <motion.div
              className="fixed z-[60] flex flex-col items-stretch"
              style={{
                bottom: DOT_BOTTOM - 4,
                right: DOT_RIGHT - 4,
                transformOrigin: "bottom right",
              }}
              initial={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: DOT_SIZE / 2,
                opacity: 0.6,
              }}
              animate={{
                width: "min(50vw, 560px)",
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
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 26,
                mass: 0.7,
              }}
            >
              {/* Conversation area */}
              <AnimatePresence>
                {messages.length > 0 && (
                  <motion.div
                    className="w-full mb-2 max-h-[50vh] overflow-y-auto scrollbar-hide"
                    style={{
                      background: "hsl(var(--background) / 0.35)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                      boxShadow: `0 4px 30px -4px ${bgShadow}`,
                    }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                className="w-full flex items-center gap-2 px-4 py-2.5"
                style={{
                  borderRadius: 100,
                  background: "hsl(var(--foreground))",
                  boxShadow: `0 4px 24px -4px ${bgShadow}`,
                }}
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
                  {input.trim() && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      onClick={handleSend}
                      className="w-6 h-6 rounded-full bg-background flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
                    >
                      <Send className="w-3 h-3 text-foreground" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Close dot */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
                  aria-label="Close chat"
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: DOT_SIZE - 4,
                      height: DOT_SIZE - 4,
                      background: orbColor,
                    }}
                  />
                </button>
              </div>

              {/* Mode buttons + disclosure */}
              <div className="w-full flex items-center justify-between mt-2.5 px-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMode("search")}
                    className={`font-mono text-[11px] tracking-widest uppercase px-3 py-1 border transition-colors duration-200 ${
                      mode === "search"
                        ? "text-foreground/80 border-foreground/30"
                        : "text-foreground/25 border-foreground/10 hover:text-foreground/40 hover:border-foreground/20"
                    }`}
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setMode("ai")}
                    className={`font-mono text-[11px] tracking-widest uppercase px-3 py-1 border transition-colors duration-200 ${
                      mode === "ai"
                        ? "text-foreground/80 border-foreground/30"
                        : "text-foreground/25 border-foreground/10 hover:text-foreground/40 hover:border-foreground/20"
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
