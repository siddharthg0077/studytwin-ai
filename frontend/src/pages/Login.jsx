import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-slate-400">Log in to your StudyTwin</p>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-500">
            Login
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          No account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;