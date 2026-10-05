import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Bot, User, Loader2, BookOpen } from "lucide-react";
import api from "../services/api";
import Logo from "../components/Logo";

const MODES = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "exam", label: "Exam" },
];

function Tutor() {
  const [params] = useSearchParams();
  const [topic, setTopic] = useState(params.get("topic") || "");
  const [mode, setMode] = useState("beginner");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sources, setSources] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setError("");
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setSending(true);
    try {
      const { data } = await api.post("/tutor/chat", {
        conversationId,
        topic,
        mode,
        message: text,
      });
      setConversationId(data.conversationId);
      setSources(data.sources);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  const newChat = () => {
    setMessages([]);
    setConversationId(null);
    setSources([]);
  };

  return (
    <div className="mx-auto flex h-screen max-w-4xl flex-col px-4 py-6">
      <header className="flex items-center justify-between">
        <Logo />
        <Link to="/dashboard" className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
      </header>

      <div className="glass mt-5 flex flex-wrap items-center gap-3 rounded-2xl p-3">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic, e.g. Normalization"
          className="min-w-48 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-violet-400"
        />
        <div className="flex rounded-xl bg-white/5 p-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                mode === m.id ? "bg-linear-to-r from-violet-500 to-cyan-500 font-semibold" : "text-white/60 hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button onClick={newChat} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20">
          New chat
        </button>
      </div>

      <div className="glass mt-4 flex-1 space-y-4 overflow-y-auto rounded-2xl p-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-white/50">
            <Bot className="h-12 w-12 text-violet-300" />
            <p className="mt-3 font-medium text-white/80">Ask your StudyTwin anything</p>
            <p className="text-sm">Answers use your uploaded notes first.</p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  m.role === "user" ? "bg-fuchsia-500/70" : "bg-linear-to-br from-violet-500 to-cyan-400"
                }`}
              >
                {m.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-violet-500/30" : "bg-white/8"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {sending && (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {sources.length > 0 && (
        <p className="mt-2 flex items-center gap-2 text-xs text-white/50">
          <BookOpen className="h-4 w-4" /> Used notes from: {sources.join(", ")}
        </p>
      )}
      {error && (
        <p className="mt-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
      )}

      <form onSubmit={send} className="mt-3 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-400"
        />
        <button
          type="submit"
          disabled={sending}
          className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 font-semibold disabled:opacity-60"
        >
          <Send className="h-4 w-4" /> Send
        </button>
      </form>
    </div>
  );
}

export default Tutor;