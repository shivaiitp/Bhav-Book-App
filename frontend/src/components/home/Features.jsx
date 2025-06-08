// src/components/Features.jsx
import { motion } from "framer-motion";
import { useMemo } from "react";

// Move static data outside component to prevent recreation
const FEATURES_DATA = [
  {
    icon: "📝",
    title: "Daily Journaling",
    desc: "Capture your thoughts, moods, and moments with ease through our intuitive interface designed for seamless daily reflection.",
    color: "from-blue-500 to-sky-400",
  },
  {
    icon: "🤖",
    title: "AI Insights",
    desc: "Discover patterns in your writing with our advanced AI that provides meaningful feedback on your emotional patterns and recurring themes.",
    color: "from-indigo-500 to-purple-400",
  },
  {
    icon: "📈",
    title: "Emotional Trends",
    desc: "Track your emotional journey with beautiful visualizations that help you understand how your feelings evolve and change over time.",
    color: "from-fuchsia-500 to-pink-500",
  },
];

// Move animation variants outside component
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function Features() {
  // Memoize features to prevent unnecessary re-renders
  const features = useMemo(() => FEATURES_DATA, []);

  return (
    <section className="relative py-24 px-4 sm:px-8 lg:px-16 overflow-hidden pb-32">
      <motion.div 
        className="max-w-6xl mx-auto text-center relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <motion.div 
          className="mb-20" 
          variants={itemVariants}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-sky-300">Works</span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-light">
            Our powerful tools work together to transform your journaling experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, i) => (
            <motion.div
              key={`feature-${i}`} // More specific key
              className="relative group"
              variants={itemVariants}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 rounded-2xl transition-opacity duration-500 -m-1 p-1 blur-md`}></div>
              
              <div className="relative bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full transform group-hover:-translate-y-2 group-hover:scale-[1.02] overflow-hidden border border-gray-100/60 dark:border-gray-700/50">
                <div className="flex justify-center mb-6 relative">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-4xl shadow-lg`}>
                    <span>{feature.icon}</span>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 dark:opacity-20 blur-xl rounded-full scale-150`}></div>
                </div>
                
                <h3 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${feature.color} mb-4`}>
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
