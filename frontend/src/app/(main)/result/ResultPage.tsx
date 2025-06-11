"use client";
import SpotlightButton from "@/components/SpotlightButton";
import MarkdownWithSyntaxHighlighting from "@/components/MarkdownWithSyntaxHighlighting";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Check,
  HeartPulse,
  Brain,
  TreePine,
  Layers,
  TrendingUp,
  Shield,
  Info,
  Download,
  Share2,
  Calendar,
  Bot,
  Network,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Result Card Component
interface Result {
  prediction: number;
  probability: number;
  confidence: number;
  risk_level: string;
  model_probabilities: {
    random_forest: number;
    ffnn: number;
    xgboost: number;
  };
  prediction_label: string;
  advice: string;
}

const ResultPage = () => {
  const [result, setResult] = useState<Result | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("heartResult");
    if (stored) {
      try {
        const parsed: Result = JSON.parse(stored);
        setResult(parsed);
      } catch (error) {
        console.error("Gagal parsing heartResult:", error);
      }
    } else {
      router.push("/");
    }
  }, []);

  const mainProbability = result
    ? (result.probability * 100).toFixed(1)
    : "0.0";
  const confidenceScore = result ? (result.confidence * 100).toFixed(1) : "0.0";

  const rfProbability = result
    ? (result.model_probabilities.random_forest * 100).toFixed(1)
    : "0.0";
  const nnProbability = result
    ? (result.model_probabilities.ffnn * 100).toFixed(1)
    : "0.0";
  const xgbProbability = result
    ? (result.model_probabilities.xgboost * 100).toFixed(1)
    : "0.0";

  const models = [
    {
      name: "Random Forest",
      icon: TreePine,
      probability: rfProbability,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      name: "FeedForward Neural Network",
      icon: Brain,
      probability: nnProbability,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      name: "XGBoost Model",
      icon: Network,
      probability: xgbProbability,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
  ];

  // Determine if the result is high risk
  const highRisk = result && result.risk_level === "High Risk";

  const getRiskIcon = () => {
    if (highRisk) return <AlertTriangle className="text-red-400" />;
    if (result && result.risk_level === "Medium Risk")
      return <AlertCircle className="text-yellow-400" />;
    return <Shield className="text-green-400" />;
  };

  const getRiskColor = () => {
    if (highRisk) return "text-red-400";
    if (result && result.risk_level === "Medium Risk") return "text-yellow-400";
    return "text-green-400";
  };

  // Determine if the prediction is positive (e.g., indicating risk)
  const isPositive = result ? result.prediction === 1 : false;

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-pink-500/20 rounded-full border border-pink-500/30">
              <HeartPulse className="w-12 h-12 text-pink-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Health Analysis Results
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Hasil analisis kesehatan jantung Anda berdasarkan pemodelan AI
            terdepan
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </motion.div>

        {/* Main Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Primary Prediction Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl w-full"
          >
            <div className="flex flex-row items-center justify-between mb-6 gap-4 ">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                  Primary Prediction
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  Hasil prediksi utama dari ensemble model
                </p>
              </div>
              <Activity className="text-pink-400 w-6 h-6 sm:w-8 sm:h-8 animate-pulse self-start sm:self-auto mt-" />
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-4 w-full">
                <div className="flex items-start gap-3">
                  {isPositive ? (
                    <>
                      <div className="p-3 bg-red-500/20 rounded-full border border-red-500/30">
                        <AlertCircle className="text-red-400 w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-2xl sm:text-3xl font-bold text-red-400">
                          {result?.prediction_label}
                        </span>
                        <p className="text-gray-400 text-sm">
                          Indikasi risiko terdeteksi
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-green-500/20 rounded-full border border-green-500/30">
                        <Check className="text-green-400 w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-2xl sm:text-3xl font-bold text-green-400">
                          {result?.prediction_label}
                        </span>
                        <p className="text-gray-400 text-sm">
                          Kondisi kesehatan baik
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">
                      Confidence Score
                    </span>
                    <span className="text-white font-semibold">
                      {confidenceScore}%
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm my-2 sm:my-4">
                    Confidence menunjukkan tingkat keyakinan sistem terhadap
                    hasil prediksi akhir berdasarkan gabungan tiga model. Makin
                    tinggi nilainya, makin konsisten dan stabil hasil model.
                  </p>
                  <div className="bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${confidenceScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Circular Progress */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="rgb(51 65 85)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={isPositive ? "rgb(239 68 68)" : "rgb(34 197 94)"}
                    strokeWidth="6"
                    strokeDasharray={`${Number(mainProbability) * 2.51} 251`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {mainProbability}%
                    </div>
                    <div className="text-xs text-gray-400">Probability</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Risk Level Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
          >
            <div className="text-center">
              <div className="mb-6">
                <div className="p-4 bg-slate-700/30 rounded-full w-fit mx-auto mb-4">
                  {getRiskIcon()}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Risk Level
                </h3>
                <div className={`text-2xl font-bold ${getRiskColor()}`}>
                  {result?.risk_level}
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Assessment</span>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-white font-semibold mt-1">
                    Comprehensive
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Data Points</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-white font-semibold mt-1">
                    10+ Factors
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Model Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Model Comparison
              </h2>
              <p className="text-gray-400">
                Perbandingan prediksi dari berbagai model AI
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full border border-purple-500/30">
              <Layers className="w-6 h-6 text-purple-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className={`${model.bgColor} border ${model.borderColor} rounded-xl p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <model.icon className="w-6 h-6 text-white" />
                    <h3 className="font-semibold text-white">{model.name}</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Probability</span>
                    <span className="text-white font-bold text-lg">
                      {model.probability}%
                    </span>
                  </div>

                  <div className="bg-slate-700/30 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${model.color} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${model.probability}%` }}
                    ></div>
                  </div>

                  <div className="text-xs text-gray-400 mt-2">
                    {index === 0 && "Tree-based ensemble learning"}
                    {index === 1 && "Deep learning architecture"}
                    {index === 2 && "XGBoost Model predictions"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Advice Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl mb-8"
        >
          <div className="flex lg:flex-row flex-col lg:items-center justify-between gap-3 mb-6">
            <div className="flex flex-row items-center gap-2">
              <div className="h-8 w-2 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
              <h2 className="lg:text-2xl font-bold text-white">
                Rekomendasi & Saran Medis
              </h2>
              <Bot className="lg:w-8 lg:h-8 text-purple-400 animate-pulse" />
            </div>
            <SpotlightButton
              main="Chat AI Doctor"
              styleDefault={false}
              customStyles={{
                button:
                  "relative w-full lg:max-w-43 max-w-34 overflow-hidden rounded-sm lg:p-2 p-1 font-medium text-white cursor-pointer text-sm bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:border-blue-600 duration-700",
                text: "pointer-events-none relative z-10 mix-blend-difference cursor-pointer flex flex-row items-center lg:text-sm text-xs justify-center gap-2 text-white",
                spotlight:
                  "pointer-events-none absolute left-[50%] top-[50%] h-10 w-10 -translate-x-[50%] -translate-y-[50%] rounded-full bg-transparent",
              }}
              href="/dashboard"
              icon={<Bot className="w-5 h-5" />}
            />
          </div>

          <div className="bg-slate-700/20 rounded-xl p-6 border border-slate-600/30">
            <MarkdownWithSyntaxHighlighting content={result?.advice ?? ""} />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25">
            <Download className="w-5 h-5" />
            Download Report
          </button>

          <button className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300">
            <Share2 className="w-5 h-5" />
            Share Results
          </button>

          <button className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300">
            <Activity className="w-5 h-5" />
            New Assessment
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="bg-slate-800/20 border border-slate-700/30 rounded-xl p-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Info className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm font-medium">
                Medical Disclaimer
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Hasil prediksi ini hanya untuk referensi dan tidak menggantikan
              konsultasi medis profesional. Selalu konsultasikan dengan dokter
              untuk diagnosis dan pengobatan yang tepat.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ResultPage), { ssr: false });
