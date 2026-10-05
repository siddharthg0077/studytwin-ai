import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Trash2, Loader2, Sparkles } from "lucide-react";
import api from "../services/api";

const formatSize = (bytes) =>
  bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

function DocumentsPanel({ onAnalyzed }) {
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const loadDocs = useCallback(async () => {
    try {
      const { data } = await api.get("/documents");
      setDocs(data);
    } catch {
      setError("Could not load documents");
    }
  }, []);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  const upload = async (file) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/documents", formData);
      await loadDocs();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const analyze = async (id) => {
    setError("");
    setAnalyzingId(id);
    try {
      await api.post(`/documents/${id}/analyze`);
      await loadDocs();
      if (onAnalyzed) await onAnalyzed();
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed");
    } finally {
      setAnalyzingId(null);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocs((d) => d.filter((x) => x._id !== id));
    } catch {
      setError("Could not delete document");
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files[0]);
        }}
        className={`flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragging
            ? "border-violet-400 bg-violet-500/10"
            : "border-white/15 hover:border-white/30 hover:bg-white/5"
        }`}
      >
        {uploading ? (
          <Loader2 className="h-10 w-10 animate-spin text-violet-300" />
        ) : (
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
            <UploadCloud className="h-10 w-10 text-violet-300" />
          </motion.div>
        )}
        <p className="mt-3 font-medium">
          {uploading ? "Reading your document..." : "Drop a file here or click to browse"}
        </p>
        <p className="text-sm text-white/50">PDF, PPTX or TXT, up to 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.pptx,.txt"
          className="hidden"
          onChange={(e) => upload(e.target.files[0])}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mt-5 space-y-2">
        <AnimatePresence>
          {docs.map((d) => (
            <motion.div
              key={d._id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3"
            >
              <FileText className="h-5 w-5 shrink-0 text-cyan-300" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{d.originalName}</p>
                <p className="text-xs text-white/50">
                  {formatSize(d.size)} · {d.charCount.toLocaleString()} characters read
                  {d.analysis?.subjectName &&
                    ` · ${d.analysis.subjectName}, ${d.analysis.topics.length} topics, ${d.analysis.difficulty}`}
                </p>
              </div>
              <button
                onClick={() => analyze(d._id)}
                disabled={analyzingId === d._id}
                className="flex items-center gap-1.5 rounded-lg bg-violet-500/20 px-3 py-1.5 text-xs font-medium text-violet-200 hover:bg-violet-500/30 disabled:opacity-60"
              >
                {analyzingId === d._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {d.analysis?.subjectName ? "Re-analyze" : "Analyze"}
              </button>
              <button
                onClick={() => remove(d._id)}
                className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-rose-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {docs.length === 0 && !uploading && (
          <p className="text-center text-sm text-white/40">No documents uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default DocumentsPanel;