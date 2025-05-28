import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const testimonials = [
    {
      name: "Aarav Singh",
      role: "Tech Professional",
      avatar: "👨🏽‍💻",
      quote:
        "This app helped me realize what I was bottling up. The insights are scarily accurate, and I've become much more aware of my emotional patterns.",
      rating: 5,
    },
    {
      name: "Sanya Patel",
      role: "Yoga Instructor",
      avatar: "👩🏽‍🦱",
      quote:
        "Journaling feels like therapy now — and I love seeing my emotional charts evolve. It's become an essential part of my daily mindfulness practice.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Graduate Student",
      avatar: "👨🏻‍🎓",
      quote:
        "I was skeptical at first, but the AI insights have helped me recognize stress triggers I never noticed before. Life-changing tool for self-awareness.",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  const cardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    }),
  };

  const nextTestimonial = () => {
    setDirection(1);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const renderStars = (rating) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className="text-yellow-400">
          {i < rating ? "★" : "☆"}
        </span>
      ));

  return (
    <motion.section
      className="py-20 px-4 sm:px-8 relative overflow-hidden -mt-16 z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Removed individual background elements */}

      {/* Content */}
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div className="mb-12" variants={itemVariants}>
          <div className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-4 py-1 rounded-full text-sm font-medium mb-4">
            TESTIMONIALS
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Our{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-500 dark:from-indigo-400 dark:to-sky-300">
              Users
            </span>{" "}
            Say
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of people who have transformed their self-awareness through journaling
          </p>
        </motion.div>

        <motion.div className="max-w-3xl mx-auto relative" variants={itemVariants}>
          <div className="relative h-80 sm:h-72 mb-8 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full"
              >
                <div className="bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 rounded-2xl shadow-xl p-6 sm:p-8 border border-white/50 dark:border-gray-700/50">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg">
                      {testimonials[activeIndex].avatar}
                    </div>
                    <div className="text-yellow-400 mb-4">
                      {renderStars(testimonials[activeIndex].rating)}
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-200 italic mb-6 max-w-2xl">
                      "{testimonials[activeIndex].quote}"
                    </p>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {testimonials[activeIndex].name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {testimonials[activeIndex].role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4">
            <motion.button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 shadow-md flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors border border-gray-100/60 dark:border-gray-700/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 shadow-md flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors border border-gray-100/60 dark:border-gray-700/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goToTestimonial(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === activeIndex ? "bg-indigo-500" : "bg-gray-400 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}