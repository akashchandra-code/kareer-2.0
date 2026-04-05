import { motion } from "framer-motion";
import { Brain, Target, Zap, BarChart3, Search, Briefcase } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Resume Analysis",
    desc: "Smart AI extracts skills, experience, and key insights from your resume.",
  },
  {
    icon: Target,
    title: "Smart Matching",
    desc: "Get highly relevant job matches based on your profile and skills.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Receive job recommendations instantly without long waiting times.",
  },
  {
    icon: BarChart3,
    title: "Match Score",
    desc: "See match percentage and understand how well you fit a role.",
  },
  {
    icon: Search,
    title: "Skill-Based Search",
    desc: "Find jobs based on your specific skills and technologies.",
  },
  {
    icon: Briefcase,
    title: "Multiple Roles",
    desc: "Explore opportunities across different domains and industries.",
  },
];

const Features = () => {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] font-light py-28 px-6">
      
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
          ✨ Powerful Features
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-5xl text-white tracking-tight"
        >
          Everything you need to{" "}
          <span className="bg-linear-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            land your job
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5 text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Built with powerful AI tools to help you find the best opportunities faster.
        </motion.p>

        {/* Feature Grid */}
        <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="
                  p-8 rounded-2xl 
                  bg-[#111111] border border-[#1f1f1f]
                  hover:border-green-500/40
                  hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]
                  hover:-translate-y-1
                  transition duration-300
                "
              >
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center rounded-xl 
                bg-[#112117] text-green-400 mx-auto">
                  <Icon size={26} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-lg text-white">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;