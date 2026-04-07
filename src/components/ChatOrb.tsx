import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
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

  const handleClose = () => {
    setIsOpen(false);
  };

  // Orb position: bottom-right
  const orbX = "calc(100vw - 40px)";
  const orbY = "calc(100vh - 40px)";

  return (
    <>
      {/* Pulsing dot — bottom right */}
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
            {/* Outer pulse */}
            <motion.div
              className="absolute rounded-full"
              style={{ width: 28, height: 28 }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-full h-full rounded-full bg-foreground/20" />
            </motion.div>

            {/* Main dot with swirling colors */}
            <div className="relative w-3 h-3 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, hsl(var(--foreground)), hsl(var(--highlight)), hsl(200 60% 78%), hsl(var(--foreground)))",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              {/* Soft glow overlay */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, hsl(var(--foreground) / 0.9) 20%, transparent 70%)",
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded interface */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close */}
            <motion.div
              className="fixed inset-0 z-[55]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Chat panel container */}
            <motion.div
              className="fixed z-[60] flex flex-col items-center"
              style={{ bottom: 20, left: "50%", x: "-50%" }}
              initial={{
                opacity: 0,
                scale: 0.1,
                originX: 1,
                originY: 1,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
                mass: 0.8,
              }}
            >
              {/* Floating conversation area */}
              <AnimatePresence>
                {messages.length > 0 && (
                  <motion.div
                    className="w-[50vw] max-w-[600px] min-w-[320px] mb-3 max-h-[50vh] overflow-y-auto scrollbar-hide"
                    style={{
                      borderRadius: 20,
                      background: "hsl(var(--background) / 0.4)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                    }}
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
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

              {/* Pill input bar */}
              <motion.div
                className="flex flex-col items-center"
                style={{
                  width: "50vw",
                  maxWidth: 600,
                  minWidth: 320,
                }}
              >
                <div
                  className="w-full flex items-center gap-2 px-4 py-2.5"
                  style={{
                    borderRadius: 100,
                    background: "hsl(var(--foreground))",
                  }}
                >
                  {/* Mode toggle */}
                  <div className="flex items-center shrink-0">
                    <button
                      onClick={() => setMode("search")}
                      className={`text-[10px] font-medium tracking-wide uppercase transition-colors duration-200 px-1.5 py-0.5 ${
                        mode === "search"
                          ? "text-background"
                          : "text-background/30 hover:text-background/50"
                      }`}
                    >
                      Search
                    </button>
                    {/* Toggle switch */}
                    <button
                      onClick={() => setMode(mode === "search" ? "ai" : "search")}
                      className="relative mx-1 w-7 h-3.5 rounded-full transition-colors duration-300"
                      style={{
                        background: mode === "ai"
                          ? "hsl(var(--highlight) / 0.5)"
                          : "hsl(var(--background) / 0.2)",
                      }}
                    >
                      <motion.div
                        className="absolute top-0.5 w-2.5 h-2.5 rounded-full"
                        style={{ background: "hsl(var(--background))" }}
                        animate={{ left: mode === "ai" ? 14 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                    <button
                      onClick={() => setMode("ai")}
                      className={`text-[10px] font-medium tracking-wide uppercase transition-colors duration-200 px-1.5 py-0.5 ${
                        mode === "ai"
                          ? "text-background"
                          : "text-background/30 hover:text-background/50"
                      }`}
                    >
                      AI
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-4 bg-background/15 shrink-0" />

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

                  {/* Send / Close */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {input.trim() && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={handleSend}
                        className="w-6 h-6 rounded-full bg-background flex items-center justify-center hover:opacity-80 transition-opacity"
                      >
                        <Send className="w-3 h-3 text-foreground" />
                      </motion.button>
                    )}
                    <button
                      onClick={handleClose}
                      className="w-6 h-6 rounded-full hover:bg-background/10 flex items-center justify-center transition-colors"
                    >
                      <motion.div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: "conic-gradient(from 0deg, hsl(var(--foreground)), hsl(var(--highlight)), hsl(200 60% 78%), hsl(var(--foreground)))",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      />
                    </button>
                  </div>
                </div>

                {/* Disclosure */}
                <AnimatePresence>
                  {mode === "ai" && (
                    <motion.p
                      className="text-[9px] text-foreground/25 mt-2 text-center px-4"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      Trained on my knowledge base & experience. Responses may be inaccurate.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatOrb;
