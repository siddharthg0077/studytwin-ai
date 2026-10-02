function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-violet-600/40 blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full bg-cyan-500/30 blur-3xl animate-blob [animation-delay:-6s]" />
      <div className="absolute -bottom-40 left-1/4 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/30 blur-3xl animate-blob [animation-delay:-12s]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

export default AuroraBackground;