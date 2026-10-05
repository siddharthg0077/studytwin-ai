import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const styles = {
  new: { bar: "from-slate-400 to-slate-300", text: "text-white/50", label: "New" },
  weak: { bar: "from-rose-500 to-orange-400", text: "text-rose-300", label: "Weak" },
  medium: { bar: "from-amber-400 to-yellow-300", text: "text-amber-300", label: "Medium" },
  strong: { bar: "from-emerald-400 to-cyan-400", text: "text-emerald-300", label: "Strong" },
};



function TopicBar({ topic, onDelete }) {
  const s = styles[topic.status] || styles.new;
  return (
    <div className="group mb-1.5 flex items-center justify-between text-sm">
  <span className="font-medium">{topic.name}</span>
  <span className="flex items-center gap-2">
    <span className={s.text}>
      {s.label} {topic.status !== "new" && `· ${topic.score}%`}
    </span>
    <button
      onClick={() => onDelete(topic)}
      className="rounded p-1 text-white/30 opacity-0 transition hover:text-rose-300 group-hover:opacity-100"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  </span>
</div>
  );
}

export default TopicBar;