import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Loader2 } from "lucide-react";
import Modal from "./Modal";
import InputField from "./InputField";

function AddNameModal({ open, onClose, title, placeholder, onSubmit }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(name.trim());
      setName("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}
        <InputField
          icon={Pencil}
          type="text"
          placeholder={placeholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-linear-to-r from-violet-500 via-fuchsia-500 to-cyan-500 py-3 font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add"}
        </motion.button>
      </form>
    </Modal>
  );
}

export default AddNameModal;