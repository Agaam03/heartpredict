"use client";

import { GridBackground } from "@/components/GridBackground";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  AlertTriangle,
  ArrowLeft,
  Heart,
  Activity,
  HeartPulse,
} from "lucide-react";

import "highlight.js/styles/github.css"; // Gaya highlight, bisa ganti ke dracula, atom-one-dark, dll
import MarkdownWithSyntaxHighlighting from "@/components/MarkdownWithSyntaxHighlighting";

const Page = () => {
  return (
    <GridBackground>
      <ResultPage />
    </GridBackground>
  );
};

export default Page;

// Result Card Component
interface Result {
  prediction_label: string;
  probability: string;
  risk_level: string;
  advice: string;
}

const ResultCard = ({ result }: { result: Result }) => {
  const isPositive = result.prediction_label === "Positive";
  const riskColor = isPositive ? "text-red-500" : "text-green-500";
  const probability = (Number(result.probability) * 100).toFixed(1);
  const highRisk = result.risk_level === "High Risk";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/80 backdrop-blur-sm border border-pink-800/30 rounded-xl overflow-hidden shadow-xl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#70090e] to-purple- p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 justify-center">
            <HeartPulse className="text-red-500 mr-2 animate-pulse" size={28} />
            Result Prediction Model
          </h1>
          <Activity className="text-pink-300 w-8 h-8 animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Status Card */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-gray-800/50 rounded-lg p-6  border border-gray-700"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg text-gray-400 mb-1">Status Prediksi</h2>
              <div className="text-2xl font-bold flex items-center gap-2">
                {isPositive ? (
                  <>
                    <AlertCircle className="text-red-500" />
                    <span className="text-red-500">
                      {result.prediction_label}
                    </span>
                  </>
                ) : (
                  <>
                    <Check className="text-green-500" />
                    <span className="text-green-500">
                      {result.prediction_label}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Circular Progress */}
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#1f2937"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke={isPositive ? "#ef4444" : "#10b981"}
                  strokeWidth="8"
                  strokeDasharray={`${Number(probability) * 2.83} 283`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dy=".3em"
                  fontSize="20"
                  fontWeight="bold"
                  fill="white"
                >
                  {probability}%
                </text>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Risk Level */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-lg text-gray-400 mb-1">Level Risiko</h2>
          <div className="flex items-center gap-2">
            {highRisk ? (
              <>
                <AlertTriangle className="text-red-500" />
                <span className="text-xl font-bold text-red-500">
                  {result.risk_level}
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="text-yellow-500" />
                <span className="text-xl font-bold text-yellow-500">
                  {result.risk_level}
                </span>
              </>
            )}
          </div>
        </motion.div>

        {/* Advice Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-1 bg-pink-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-pink-300">
              Saran Pencegahan dan Penanganan
            </h2>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700 ">
            <MarkdownWithSyntaxHighlighting content={result.advice} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Main Result Page Component
export const ResultPage = () => {
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("heartResult");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, []);

  if (!result) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => router.push("/")}
        className="mb-2 mt-1.5 flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Kembali ke Halaman Utama</span>
      </motion.button>

      <ResultCard result={result} />
    </div>
  );
};
