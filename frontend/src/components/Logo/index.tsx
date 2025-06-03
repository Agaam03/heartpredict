"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
const Logo = () => {
  const logoVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  // Animation for the text elements
  const textVariants = {
    initial: { opacity: 0 },
    animate: (custom: number) => ({
      opacity: 1,
      transition: { delay: custom * 0.1 + 0.5, duration: 0.3 },
    }),
  };

  // Animation for the dot
  const dotVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: { delay: 1.1, type: "spring", stiffness: 500 },
    },
    hover: { scale: 1.5, rotate: 180, transition: { duration: 0.3 } },
  };
  const backToHome = () => {
    if (
      localStorage.getItem("heartResult") !== null ||
      localStorage.getItem("heartAnswers") !== null
    ) {
      localStorage.removeItem("heartResult");
      localStorage.removeItem("heartAnswers");
    }
  };
  return (
    <div>
      {" "}
      {/* Logo with animation */}
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={logoVariants}
      >
        <Link
          href={"/"}
          onClick={backToHome}
          className=" text-black text-xl font-extrabold border-blue px-3 py-[0.4px] rounded-xs flex items-center bg-[#fb2c36]"
        >
          {/* Animated letters */}
          {"HEART".split("").map((letter, index) => (
            <motion.span key={index} custom={index} variants={textVariants}>
              {letter}
            </motion.span>
          ))}
          {/* Bold ANIME text */}
          {"".split("").map((letter, index) => (
            <motion.span
              key={index + 5}
              custom={index + 5}
              variants={textVariants}
            >
              {letter}
            </motion.span>
          ))}
          {/* Animated dot */}
          <motion.span variants={dotVariants}>.</motion.span>
        </Link>
      </motion.div>
    </div>
  );
};

export default Logo;
