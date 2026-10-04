import { motion } from "framer-motion";

const styles = {
  new: { bar: "from-slate-400 to-slate-300", text: "text-white/50", label: "New" },
  weak: { bar: "from-rose-500 to-orange-400", text: "text-rose-300", label: "Weak" },
  medium: { bar: "from-amber-400 to-yellow-300", text: "text-amber-300", label: "Medium" },
  strong: { bar: "from-emerald-400 to-cyan-400", text: "text-emerald-300", label: "Strong" },
};

function TopicBar({ topic }) {
  const s = styles[topic.status] || styles.new;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{topic.name}</span>
        <span className={s.text}>
          {s.label} {topic.status !== "new" && `· ${topic.score}%`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={`h-full rounded-full bg-linear-to-r ${s.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${topic.score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default TopicBar;