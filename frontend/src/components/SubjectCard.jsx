import { motion } from "framer-motion";
import { Library, Plus } from "lucide-react";
import TopicBar from "./TopicBar";

function SubjectCard({ subject, onAddTopic, onDeleteTopic }) {
  const count = subject.topics.length;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-cyan-400">
          <Library className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{subject.name}</h3>
          <p className="text-sm text-white/50">
            {count} {count === 1 ? "topic" : "topics"}
          </p>
        </div>
        <button
          onClick={() => onAddTopic(subject)}
          className="ml-auto flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
        >
          <Plus className="h-4 w-4" /> Topic
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {count === 0 ? (
          <p className="text-sm text-white/40">No topics yet. Add your first one.</p>
        ) : (
          subject.topics.map((t) => (
            <TopicBar key={t._id} topic={t} onDelete={onDeleteTopic} />
          ))
        )}
      </div>
    </motion.div>
  );
}

export default SubjectCard;