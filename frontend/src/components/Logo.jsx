import { BrainCircuit } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/30">
        <BrainCircuit className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-semibold tracking-tight">
        StudyTwin <span className="text-gradient">A I </span>
      </span>
    </div>
  );
}

export default Logo;