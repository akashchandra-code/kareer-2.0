import { motion } from "framer-motion";
import { Upload, Brain, Target } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Resume",
    desc: "Upload your resume and let our system understand your profile instantly.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    desc: "Our AI extracts your skills, experience, and matches you intelligently.",
  },
  {
    icon: Target,
    title: "Get Matched",
    desc: "Receive the best job matches with accuracy and relevance.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] font-light px-6 ">
      
      {/* Grid Background */}
      <div
        className="absolute inset-0 
        bg-[linear-gradient(to_right,#22c55e15_1px,transparent_1px),linear-gradient(to_bottom,#22c55e15_1px,transparent_1px)] 
        bg-size-[40px_40px] opacity-30"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-[#0a0a0a] to-black" />

      <div className="relative max-w-6xl mx-auto text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 
          text-sm tracking-wide text-green-400 bg-[#112117] border border-green-900 rounded-full"
        >
          ⚙️ Simple 3-Step Process
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-5xl text-white tracking-tight"
        >
          How it{" "}
          <span className="bg-linear-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            works
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5 text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Get matched with the right jobs in just a few simple steps using AI.
        </motion.p>

        {/* Steps */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="
                  p-8 rounded-2xl 
                  bg-[#111111] border border-[#1f1f1f]
                  hover:border-green-500/40 
                  hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]
                  transition duration-300
                "
              >
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center rounded-xl 
                bg-[#112117] text-green-400 mx-auto">
                  <Icon size={26} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-xl text-white">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;