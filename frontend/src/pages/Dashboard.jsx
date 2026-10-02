

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hello, {user?.name} 👋</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
      <p className="mt-2 text-slate-400">Your StudyTwin dashboard will appear here.</p>

      {<div className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">Good Morning Averyone👋</h1>
      <p className="mt-2 text-slate-400">Your StudyTwin dashboard will appear here.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-900 p-6">
          <p className="text-slate-400">Learning Score</p>
          <p className="mt-2 text-4xl font-bold text-sky-400">--%</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-6">
          <p className="text-success-400">Strong Topics</p>
          <p className="mt-2 text-slate-500">No data yet</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-6">
          <p className="text-slate-400">Needs Attention</p>
          <p className="mt-2 text-slate-500">No data yet</p>
        </div>
      </div>
    </div>}
    </div>
  );
}

export default Dashboard;