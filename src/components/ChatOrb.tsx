import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ChatOrb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { scrollY } = useScroll();
  const orbOpacity = useTransform(scrollY, [200, 500], [0, 1]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
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
        { id: (Date.now() + 1).toString(), role: "assistant", content: "This is a placeholder response. Connect an LLM to bring me to life." },
      ]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating orb — fades in on scroll, bottom center, smaller */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] w-10 h-10 rounded-full flex items-center justify-center group"
            onClick={() => setIsOpen(true)}
            style={{ opacity: orbOpacity }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            aria-label="Open chat"
          >
            {/* Animated gradient blob */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, hsl(var(--foreground)), hsl(var(--highlight)), hsl(var(--foreground)), hsl(var(--highlight)), hsl(var(--foreground)))",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-[2px] rounded-full bg-background"
            />
            {/* Outer pulse rings */}
            <motion.div
              className="absolute inset-0 rounded-full border border-foreground/20"
              animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <Sparkles className="w-3.5 h-3.5 text-foreground relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel — bottom center, pill shape */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-5 left-1/2 z-[60] w-[420px] max-w-[calc(100vw-2rem)] flex flex-col overflow-hidden"
            style={{
              borderRadius: "24px",
              background: "hsl(var(--foreground))",
              x: "-50%",
            }}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "hsl(var(--highlight))" }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-xs font-medium text-background tracking-tight">
                  Ask me anything
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-background/10 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-background" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2.5" style={{ maxHeight: 320, minHeight: 120 }}>
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <motion.div
                    className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                    style={{ background: "hsl(var(--background) / 0.15)" }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-background/60" />
                  </motion.div>
                  <p className="text-[11px] text-background/40 max-w-[180px]">
                    Search or ask a question about my work.
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3.5 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-background text-foreground rounded-2xl rounded-br-sm"
                        : "bg-background/15 text-background rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-background/15 rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full bg-background/50"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-1">
              <div className="flex items-center gap-2 bg-background/10 rounded-full px-3.5 py-2 focus-within:bg-background/15 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Search or ask..."
                  className="flex-1 bg-transparent text-xs text-background placeholder:text-background/30 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-6 h-6 rounded-full bg-background flex items-center justify-center disabled:opacity-20 hover:opacity-80 transition-opacity"
                >
                  <Send className="w-3 h-3 text-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatOrb;
