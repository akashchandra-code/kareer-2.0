import { motion } from "framer-motion";
import { CheckCircle, Zap, Brain, TrendingUp } from "lucide-react";

const points = [
  {
    icon: CheckCircle,
    title: "Accurate Matches",
    desc: "Get highly relevant job suggestions based on your real skills.",
  },
  {
    icon: Zap,
    title: "Save Time",
    desc: "No more endless scrolling. Find the right jobs instantly.",
  },
  {
    icon: Brain,
    title: "AI Powered",
    desc: "Advanced AI understands your resume better than keywords.",
  },
  {
    icon: TrendingUp,
    title: "Better Decisions",
    desc: "Know where you stand with match scores and insights.",
  },
];

const WhyChoose = () => {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] font-light px-6 py-24">
      
      {/* Grid Background */}
      <div
        className="absolute inset-0 
        bg-[linear-gradient(to_right,#22c55e15_1px,transparent_1px),linear-gradient(to_bottom,#22c55e15_1px,transparent_1px)] 
        bg-size-[40px_40px] opacity-30"
      />

      {/* Dark Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-[#0a0a0a] to-black" />

      <div className="relative max-w-6xl mx-auto text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 
          text-sm tracking-wide text-green-400 bg-[#112117] border border-green-900 rounded-full"
        >
          💡 Why Choose Kareer
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl lg:text-5xl text-white tracking-tight"
        >
          Smarter way to{" "}
          <span className="bg-linear-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            find jobs
          </span>
        </motion.h2>

        {/* Subtext */}
        <p className="mt-5 text-gray-400 text-lg max-w-2xl mx-auto">
          Designed to simplify your job search using intelligent automation.
        </p>

        {/* Points */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {points.map((point, i) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="
                  flex items-start gap-4 p-6 rounded-2xl 
                  bg-[#111111] border border-[#1f1f1f]
                  hover:border-green-500/40
                  hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]
                  transition duration-300
                "
              >
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center rounded-lg 
                bg-[#112117] text-green-400 shrink-0">
                  <Icon size={22} strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="text-left">
                  <h3 className="text-lg text-white">{point.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{point.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;