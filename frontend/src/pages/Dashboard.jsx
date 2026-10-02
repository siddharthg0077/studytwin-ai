import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, TrendingUp, Target, Flame, BookOpen, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function ScoreRing({ value }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          stroke="url(#ring)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
        {value}%
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, children, color }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -6 }}
      className="glass rounded-2xl p-6"
    >
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <p className="text-sm text-white/60">{label}</p>
      <div className="mt-1">{children}</div>
    </motion.div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="flex items-center justify-between">
        <Logo />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
        >
          <LogOut className="h-4 w-4" /> Logout
        </motion.button>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="mt-10">
        <motion.div variants={item}>
          <h1 className="text-4xl font-bold">
            Hello, <span className="text-gradient">{user?.name}</span>
          </h1>
          <p className="mt-2 text-white/60">Here is your StudyTwin overview.</p>
        </motion.div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <motion.div
            variants={item}
            className="glass flex items-center gap-6 rounded-2xl p-6 md:row-span-1"
          >
            {/* demo value: replaced with real data in the next step */}
            <ScoreRing value={74} />
            <div>
              <p className="text-sm text-white/60">Learning Score</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-emerald-300">
                <TrendingUp className="h-4 w-4" /> Improving
              </p>
            </div>
          </motion.div>

          <StatCard icon={Target} label="Strong Topics" color="bg-emerald-500/80">
            <p className="text-white/40">No data yet</p>
          </StatCard>

          <StatCard icon={Flame} label="Needs Attention" color="bg-rose-500/80">
            <p className="text-white/40">No data yet</p>
          </StatCard>
        </div>

        <motion.div variants={item} className="glass mt-5 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/80">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/60">Today's recommendation</p>
              <p className="font-semibold">Upload notes to get started</p>
            </div>
            <BookOpen className="ml-auto h-6 w-6 text-white/30" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Dashboard;