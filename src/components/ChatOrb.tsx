import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ChatOrb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"search" | "ai">("search");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastScrollY = useRef(0);

  // Collapse on scroll down, but preserve messages
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastScrollY.current) > 30) {
        setIsOpen(false);
      }
      lastScrollY.current = currentY;
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

  return (
    <>
      {/* Closed state: pulsing dot bottom-right */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="fixed z-[60] flex items-center justify-center"
            style={{ bottom: 24, right: 24 }}
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            aria-label="Open chat"
          >
            {/* Self-pulsing dot — scales itself, no outer ring */}
            <motion.div
              className="relative w-3 h-3 rounded-full overflow-hidden"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                boxShadow: "0 0 12px 2px hsl(var(--foreground) / 0.15), 0 0 4px 1px hsl(var(--highlight) / 0.1)",
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, hsl(var(--foreground)), hsl(var(--highlight)), hsl(200 60% 78%), hsl(var(--foreground)))",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Open state: pill expands from bottom-right */}
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

            {/* Anchored to bottom-right, expands leftward */}
            <motion.div
              className="fixed z-[60] flex flex-col items-end"
              style={{ bottom: 16, right: 16 }}
              initial={{ width: 12, opacity: 0 }}
              animate={{ width: "min(50vw, 600px)", opacity: 1 }}
              exit={{ width: 12, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 28,
                mass: 0.8,
              }}
            >
              {/* Conversation area */}
              <AnimatePresence>
                {messages.length > 0 && (
                  <motion.div
                    className="w-full mb-2 max-h-[50vh] overflow-y-auto scrollbar-hide"
                    style={{
                      borderRadius: 16,
                      background: "hsl(var(--background) / 0.35)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                      boxShadow: "0 4px 30px -4px hsl(var(--foreground) / 0.08), 0 0 20px -4px hsl(var(--foreground) / 0.04)",
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
                  boxShadow: "0 4px 24px -4px hsl(var(--foreground) / 0.12), 0 0 16px -4px hsl(var(--foreground) / 0.06)",
                }}
              >
                {/* Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={mode === "ai" ? "Ask me anything…" : "Search my work…"}
                  className="flex-1 bg-transparent text-xs text-background placeholder:text-background/25 outline-none min-w-0"
                />

                {/* Send */}
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

                {/* Close (dot) */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
                  aria-label="Close chat"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: "conic-gradient(from 0deg, hsl(var(--background) / 0.8), hsl(var(--highlight) / 0.6), hsl(200 60% 78% / 0.6), hsl(var(--background) / 0.8))",
                    }}
                  />
                </button>
              </div>

              {/* Mode buttons + disclosure — below the pill */}
              <div className="w-full flex items-center justify-between mt-2 px-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMode("search")}
                    className={`mono-text px-2.5 py-1 transition-colors duration-200 ${
                      mode === "search"
                        ? "text-foreground/80"
                        : "text-foreground/25 hover:text-foreground/40"
                    }`}
                    style={{ fontSize: 9 }}
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setMode("ai")}
                    className={`mono-text px-2.5 py-1 transition-colors duration-200 ${
                      mode === "ai"
                        ? "text-foreground/80"
                        : "text-foreground/25 hover:text-foreground/40"
                    }`}
                    style={{ fontSize: 9 }}
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
