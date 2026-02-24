import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const ChatbotFAB = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const { tr, lang } = useLang();

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    // Mock bot reply
    setTimeout(() => {
      const reply = lang === "mr"
        ? "मी तुम्हाला मदत करण्यासाठी येथे आहे! कृपया तुमचा प्रश्न विचारा."
        : "I'm here to help! Please ask your farming question.";
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    }, 800);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-4 z-50 w-[calc(100%-2rem)] max-w-sm bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-primary p-3 flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <span className="font-bold text-sm">{tr("chatbot")}</span>
              </div>
              <button onClick={() => setOpen(false)}><X size={18} /></button>
            </div>

            {/* Messages */}
            <div className="h-60 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  {lang === "mr" ? "नमस्कार! मी तुमचा शेती सहाय्यक आहे 🌾" : "Hello! I'm your farming assistant 🌾"}
                </p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    m.role === "user"
                      ? "gradient-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-2 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={tr("askQuestion")}
                className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button onClick={sendMessage} className="gradient-primary rounded-xl w-10 h-10 flex items-center justify-center text-primary-foreground">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 gradient-primary rounded-full shadow-xl flex items-center justify-center text-primary-foreground"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </>
  );
};

export default ChatbotFAB;
