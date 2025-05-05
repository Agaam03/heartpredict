"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  // Animation variants for the logo
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
    <section className="sticky top-0 w-full bg-transparent backdrop-blur-xl z-50 border-b-[0.2px] border-b-gray-600 shadow-md">
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-row justify-between items-center mx-8 py-3">
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
          {/* GitHub Icon */}
          <button className="px-5 py-[0.4px] bg-white rounded-xs font-medium uppercase text-md text-black">
            Log in
          </button>
        </div>
      </main>
    </section>
  );
};

export default Navbar;
