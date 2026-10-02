function InputField({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 outline-none transition focus:border-violet-400 focus:bg-white/10 focus:ring-4 focus:ring-violet-500/20"
      />
    </div>
  );
}

export default InputField;