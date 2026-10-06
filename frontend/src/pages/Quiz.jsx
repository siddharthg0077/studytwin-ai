import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Trophy } from "lucide-react";
import api from "../services/api";
import Logo from "../components/Logo";

function Quiz() {
  const [params] = useSearchParams();
  const topicId = params.get("topicId");
  const topicName = params.get("name") || "this topic";

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const start = async () => {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.post("/quiz/generate", { topicId, count: 5 });
      setQuiz(data);
      setAnswers(new Array(data.questions.length).fill(""));
    } catch (err) {
      setError(err.response?.data?.message || "Could not create quiz");
    } finally {
      setLoading(false);
    }
  };

  const setAnswer = (i, value) =>
    setAnswers((a) => a.map((x, idx) => (idx === i ? value : x)));

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post(`/quiz/${quiz._id}/submit`, { answers });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="flex items-center justify-between">
        <Logo />
        <Link to="/dashboard" className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
      </header>

      <h1 className="mt-8 text-3xl font-bold">
        Quiz: <span className="text-gradient">{quiz?.topicName || topicName}</span>
      </h1>

      {error && (
        <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
      )}

      {!topicId && <p className="mt-6 text-white/60">Open a quiz from a topic on the dashboard.</p>}

      {topicId && !quiz && (
        <button
          onClick={start}
          disabled={loading}
          className="mt-6 flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 font-semibold disabled:opacity-60"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {loading ? "Writing your questions..." : "Start 5-question quiz"}
        </button>
      )}

      {quiz && !result && (
        <div className="mt-6 space-y-5">
          {quiz.questions.map((q, i) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-5"
            >
              <p className="font-medium">
                {i + 1}. {q.question}
              </p>
              {q.type === "short" ? (
                <textarea
                  rows={3}
                  value={answers[i]}
                  onChange={(e) => setAnswer(i, e.target.value)}
                  placeholder="Type your answer..."
                  className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none focus:border-violet-400"
                />
              ) : (
                <div className="mt-3 space-y-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAnswer(i, opt)}
                      className={`block w-full rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                        answers[i] === opt
                          ? "border-violet-400 bg-violet-500/20"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 font-semibold disabled:opacity-60"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {loading ? "Grading..." : "Submit answers"}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-5">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass flex items-center gap-5 rounded-2xl p-6"
          >
            <Trophy className="h-12 w-12 text-amber-300" />
            <div>
              <p className="text-4xl font-bold">{result.percent}%</p>
              <p className="text-white/60">
                Topic is now <span className="font-semibold text-white">{result.topicStatus}</span> ({result.topicScore}%)
              </p>
            </div>
          </motion.div>

          {result.results.map((r, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <div className="flex items-start gap-3">
                {r.correct ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
                )}
                <div className="text-sm">
                  <p className="font-medium">{r.question}</p>
                  <p className="mt-1 text-white/60">Your answer: {r.yourAnswer || "(blank)"}</p>
                  {!r.correct && <p className="text-emerald-300">Correct: {r.correctAnswer}</p>}
                  <p className="mt-1 text-white/70">{r.feedback}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-3">
            <button onClick={start} className="rounded-xl bg-white/10 px-5 py-2.5 hover:bg-white/20">
              Try another quiz
            </button>
            <Link to="/dashboard" className="rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-2.5 font-semibold">
              Back to dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;