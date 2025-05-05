"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Loading = () => {
  const [loadingProgress, setLoadingProgress] = useState(42);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 10);
        return newProgress > 99 ? 99 : newProgress;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const spinnerVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const fadeInVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{ backgroundColor: "#000000" }}
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInVariants}
        className="text-center space-y-6 p-12 rounded-2xl relative"
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 blur-3xl rounded-full z-0"
          variants={pulseVariants}
          animate="pulse"
        />

        {/* Animated Logo */}
        <motion.div
          className="mx-auto relative z-10"
          whileHover={{ scale: 1.05 }}
        >
          <motion.h1
            className="font-bold text-3xl"
            style={{
              backgroundImage: "linear-gradient(to right, #9290C3, #535C91)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            HEART<span style={{ color: "#fff" }}>DISEASE</span>.
          </motion.h1>
        </motion.div>

        {/* Animated Loading Bar */}
        <motion.div
          className="h-2 rounded-full w-60 overflow-hidden z-10 relative"
          style={{ backgroundColor: "#1B1A55" }}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ type: "spring", stiffness: 50 }}
            className="h-full rounded-full"
            style={{
              backgroundImage: "linear-gradient(to right, #535C91, #9290C3)",
            }}
          />

          {/* Particle effect on loading bar */}
          <motion.div
            className="absolute top-0 h-full w-12 opacity-75"
            style={{
              background:
                "linear-gradient(90deg, transparent, #9290C3, transparent)",
            }}
            animate={{
              x: ["-100%", "400%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Floating Dots */}
        <div className="flex justify-center space-x-5 z-10 relative">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              variants={floatingVariants}
              animate="float"
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? "#535C91" : "#9290C3",
                animationDelay: `${i * 0.3}s`,
              }}
              custom={i}
            />
          ))}
        </div>

        {/* Progress Percentage with spinner */}
        <div className="flex items-center justify-center space-x-3 text-white z-10 relative">
          <motion.div
            variants={spinnerVariants}
            animate="spin"
            className="w-6 h-6"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <motion.path
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                stroke="#9290C3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="60"
                strokeDashoffset="60"
                animate={{
                  strokeDashoffset: [60, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </motion.div>
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-base"
            style={{ color: "#9290C3" }}
          >
            Loading... {loadingProgress}%
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;
