"use client";
import React, { useState } from "react";
import { GridBeam } from "../GridBeam";
import { WordRotate } from "../magicui/word-rotate";
import { HeartPulse, Activity, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";
var ReactRotatingText = require("react-rotating-text");
import { RotatingText } from "rotating-text";
import "rotating-text/dist/index.css";
const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GridBeam className="relative flex w-full items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br " />

      {/* Animated background pulse circles */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-blue-500/10 rounded-full animate-pulse"
        style={{ animationDuration: "6s" }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-start justify-center text-white text-left mt-36 mb-80">
        <div className="flex items-center space-x-2 mb-2 p-1 px-3 bg-red-500/20 backdrop-blur-sm rounded-full">
          <HeartPulse className="text-red-500 animate-pulse" size={20} />
          <span className="text-red-400 font-medium tracking-wider text-sm">
            SMART HEALTH PREDICTION
          </span>
        </div>

        <div className="flex flex-wrap items-center lg:gap-4 md:gap-2 text-4xl md:text-[86px] lg:text-9xl font-semibold uppercase mb-4 gap-1">
          <span className="text-white/90">Check Your</span>
          <span className="inline-block lg:min-w-[7ch] md:min-w-[6ch] min-w-[1ch] bg-gradient-to-r from-red-500 to-purple-700 bg-clip-text text-transparent ">
            <ReactRotatingText
              items={["Heart", "Health"]}
              typingInterval={70}
              deletingInterval={90}
              cursor={true}
              className="pl-2"
              pause={2500}
            />
          </span>
        </div>

        <p className="text-lg mb-3 max-w-xl text-gray-200 leading-relaxed">
          Harness the power of Random Forest and Feedforward Neural Networks to
          deliver accurate, rapid heart disease predictions, paving the way for
          a smarter, healthier future.
        </p>

        {/* Feature highlights */}
        <div className="flex flex-wrap gap-6 mt-1 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-blue-500/20 rounded-full">
              <Activity className="text-blue-400" size={16} />
            </div>
            <span className="text-sm text-gray-300">99% Accuracy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-green-500/20 rounded-full">
              <Zap className="text-green-400" size={16} />
            </div>
            <span className="text-sm text-gray-300">Instant Analysis</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-3">
          <Link
            href="/predict"
            className={`group relative overflow-hidden bg-white text-black font-medium py-2 px-6 rounded-md shadow hover:bg-gray-100 transition duration-300 flex items-center ${
              isHovered ? "scale-105" : ""
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="mr-2">Try Predictive Analysis</span>
            <ChevronRight
              className={`transition-transform duration-300 ${
                isHovered ? "translate-x-1" : ""
              }`}
              size={18}
            />
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-red-500/20 to-purple-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </GridBeam>
  );
};

export default HeroSection;
