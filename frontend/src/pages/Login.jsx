import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-1 text-white/60">Log in to continue with your StudyTwin</p>

      {error && (
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {error}
        </motion.p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <InputField
          icon={Mail}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          icon={Lock}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 via-fuchsia-500 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Login <ArrowRight className="h-5 w-5" />
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-6 text-sm text-white/60">
        No account?{" "}
        <Link to="/register" className="font-medium text-violet-300 hover:underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;