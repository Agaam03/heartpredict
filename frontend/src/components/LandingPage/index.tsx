"use client";
import React, { useState } from "react";
import {
  HeartPulse,
  Activity,
  Zap,
  ChevronRight,
  Globe,
  Smartphone,
  Cloud,
  Brain,
} from "lucide-react";
import SpotlightButton from "../SpotlightButton";

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden    ">
      {/* Keep the diagonal background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Left side - darker gradient */}
        <div
          className="absolute inset-0 "
          style={{
            clipPath: "polygon(0 0, 60% 0, 40% 100%, 0% 100%)",
          }}
        />

        {/* Right side - darker background */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            clipPath: "polygon(60% 0, 100% 0, 100% 100%, 40% 100%)",
          }}
        />

        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex items-center space-x-2 mb-6 p-2 px-4 bg-red-500/20 backdrop-blur-sm rounded-md w-fit animate-pulse">
              <HeartPulse className="text-red-500 animate-pulse" size={20} />
              <span className="text-red-400 font-medium tracking-wider text-sm">
                SMART HEALTH PREDICTION
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Check. Test. Predict.
              </h1>
              <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                AI-powered heart disease prediction using advanced machine
                learning algorithms for accurate, instant health analysis.
              </p>
              <p className="text-sm text-gray-400 max-w-lg">
                Harness the power of Random Forest and Feedforward Neural
                Networks to deliver accurate, rapid predictions.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <SpotlightButton
                main="Try Analysis"
                styleDefault={false}
                customStyles={{
                  button:
                    "relative w-full max-w-40 overflow-hidden rounded-sm px-2 py-2 text-lg font-medium text-white cursor-pointer bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 backdrop-blur-sm hover:border-pink-400/40 duration-700",
                  text: "pointer-events-none relative z-10 mix-blend-difference cursor-pointer flex flex-row items-center text-sm justify-center gap-2 text-pink-500",
                  spotlight:
                    "pointer-events-none absolute left-[50%] top-[50%] h-10 w-10 -translate-x-[50%] -translate-y-[50%] rounded-full bg-fuchsia-800/10",
                }}
                href="/predict"
              />
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-400">
              <span>Supported on Windows, Linux, and macOS</span>
            </div>
          </div>

          {/* Right Column - Cards */}
          <div className="relative">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Build it with <span className="text-red-400">AI Health</span>
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 - Web Analysis */}
              <div className="group p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Globe className="text-blue-400" size={20} />
                  </div>
                  <h3 className="text-white font-semibold">Web Analysis</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Build web-based health prediction tools for hospitals,
                  clinics, and personal use.
                </p>
              </div>

              {/* Card 2 - Mobile Health */}
              <div className="group p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 backdrop-blur-sm hover:border-pink-400/40 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-pink-500/20">
                    <Smartphone className="text-pink-400" size={20} />
                  </div>
                  <h3 className="text-white font-semibold">Mobile Health</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Use a single model to build native health apps for iOS and
                  Android platforms.
                </p>
              </div>

              {/* Card 3 - Cloud Processing */}
              <div className="group p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <Cloud className="text-cyan-400" size={20} />
                  </div>
                  <h3 className="text-white font-semibold">Cloud</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Build scalable and resilient cloud-native health apps that run
                  on all major providers.
                </p>
              </div>

              {/* Card 4 - AI & ML */}
              <div className="group p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Brain className="text-purple-400" size={20} />
                  </div>
                  <h3 className="text-white font-semibold">AI & ML</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Build smart health apps with TensorFlow, PyTorch, and Azure ML
                  integration.
                </p>
              </div>
            </div>

            {/* Bottom Links */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
              {[
                "Neural Networks",
                "Random Forest",
                "Health Analytics",
                "Prediction Models",
                "Medical AI",
                "Health Tech",
                "Diagnostics",
                "Data Science",
              ].map((item, index) => (
                <button
                  key={index}
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-1 group"
                >
                  <span>{item}</span>
                  <ChevronRight
                    className="group-hover:translate-x-1 transition-transform duration-300"
                    size={14}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating 3D Element */}
      <div className="absolute top-20 right-20 w-64 h-64 hidden lg:block">
        <div className="relative w-full h-full">
          {/* Main floating card */}
          <div className="absolute top-0 right-0 w-48 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl backdrop-blur-sm border border-purple-400/30 transform rotate-12 animate-pulse">
            <div className="p-4 space-y-2">
              <div className="w-8 h-8 bg-red-500/30 rounded-lg flex items-center justify-center">
                <HeartPulse className="text-red-400" size={16} />
              </div>
              <div className="space-y-1">
                <div className="w-20 h-2 bg-gray-600 rounded"></div>
                <div className="w-16 h-2 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>

          {/* Secondary floating card */}
          <div className="absolute bottom-0 left-0 w-40 h-28 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm border border-blue-400/30 transform -rotate-6 animate-pulse delay-500">
            <div className="p-3 space-y-2">
              <div className="w-6 h-6 bg-blue-500/30 rounded-lg flex items-center justify-center">
                <Activity className="text-blue-400" size={14} />
              </div>
              <div className="space-y-1">
                <div className="w-16 h-1.5 bg-gray-600 rounded"></div>
                <div className="w-12 h-1.5 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
    </section>
  );
};

export default HeroSection;
