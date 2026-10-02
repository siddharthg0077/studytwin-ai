import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

const Hero3D = lazy(() => import("./Hero3D"));

function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col p-12 lg:flex">
        <Logo />
        <div className="absolute inset-x-0 top-20 bottom-60">
          <Suspense fallback={null}>
            <Hero3D />
          </Suspense>
        </div>
        <div className="relative z-10 mt-auto">
          <h2 className="text-5xl font-bold leading-tight">
            AI that learns <span className="text-gradient">how you study</span>
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/60">
            Upload your notes. Get quizzes, a study plan and a tutor built around your weak topics.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass w-full max-w-md rounded-3xl p-8"
        >
          <div className="mb-6 lg:hidden">
            <Logo />
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;