import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] font-light">

      <div
        className="absolute inset-0 
        bg-[linear-gradient(to_right,#22c55e15_1px,transparent_1px),linear-gradient(to_bottom,#22c55e15_1px,transparent_1px)] 
        bg-size-[40px_40px] opacity-30"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-[#0a0a0a] to-black" />

      <div className="relative max-w-4xl mx-auto px-4 py-32 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 
          text-sm tracking-wide text-green-400 bg-[#112117] border border-green-900 rounded-full"
        >
          🚀 AI-Powered Job Matching
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-white"
        >
          Find your perfect job with{" "}
          <span className="bg-linear-to-r from-green-400 to-green-600 bg-clip-text text-transparent font-normal">
            AI precision
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Upload your resume and let our AI analyze your skills to match you
          with the most relevant jobs instantly.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={() => navigate("/login")}
            className="px-9 py-3.5 rounded-lg 
            bg-green-500 text-black text-lg tracking-wide
            hover:bg-green-400 transition 
            shadow-[0_0_15px_rgba(34,197,94,0.4)]"
          >
            Upload Resume
          </button>

          <button
            onClick={() => navigate("/jobs")}
            className="px-9 py-3.5 rounded-lg 
            border border-gray-700 text-gray-300 text-lg tracking-wide
            hover:border-green-500 hover:text-green-400 transition"
          >
            Browse Jobs
          </button>
        </motion.div>

        {/* Secondary Text */}
        <p className="mt-4 text-sm text-gray-500">
          Free to use • Instant results • AI powered
        </p>
      </div>
    </section>
  );
};

export default Hero;
