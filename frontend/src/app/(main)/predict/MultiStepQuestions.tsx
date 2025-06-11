"use client";
import {
  ageOptions,
  diabetesOptions,
  educationOptions,
  genHealthOptions,
  incomeOptions,
  questions,
  sexOptions,
} from "@/data/questionOption";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/local-storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  Activity,
  User,
  Scale,
  Calendar,
  GraduationCap,
  DollarSign,
  Stethoscope,
} from "lucide-react";
import OptionQuestion from "./OptionQuestion";

const MultiStepQuestions = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [berat, setBerat] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [health, setHealth] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedAnswers = getFromLocalStorage("heartAnswers");
    if (storedAnswers) {
      setAnswers(storedAnswers);
    }
  }, []);

  const question = questions[currentStep];
  const progressPercent = ((currentStep + 1) / questions.length) * 100;

  // Fungsi untuk mendapatkan icon berdasarkan tipe pertanyaan
  const getQuestionIcon = (type: string) => {
    switch (type) {
      case "boolean":
        return <Heart className="w-6 h-6 text-pink-500" />;
      case "bmi":
        return <Scale className="w-6 h-6 text-pink-500" />;
      case "number":
        return <Activity className="w-6 h-6 text-pink-500" />;
      case "diabetes":
        return <Stethoscope className="w-6 h-6 text-pink-500" />;
      case "genHlth":
        return <Activity className="w-6 h-6 text-pink-500" />;
      case "sex":
        return <User className="w-6 h-6 text-pink-500" />;
      case "age":
        return <Calendar className="w-6 h-6 text-pink-500" />;
      case "education":
        return <GraduationCap className="w-6 h-6 text-pink-500" />;
      case "income":
        return <DollarSign className="w-6 h-6 text-pink-500" />;
      default:
        return <Heart className="w-6 h-6 text-pink-500" />;
    }
  };

  const handleAnswer = (value: number) => {
    const key = questions[currentStep].id;
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    saveToLocalStorage("heartAnswers", updated);
    goToNextStep();
  };

  const handleBMIAnswer = () => {
    const beratNum = parseFloat(berat);
    const tinggiNum = parseFloat(tinggi) / 100; // konversi cm ke meter

    if (!beratNum || !tinggiNum || tinggiNum === 0) {
      alert("Mohon masukkan berat dan tinggi dengan benar.");
      return;
    }

    const bmi = beratNum / (tinggiNum * tinggiNum);
    const updated = { ...answers, BMI: parseFloat(bmi.toFixed(1)) };
    setAnswers(updated);
    saveToLocalStorage("heartAnswers", updated);
    goToNextStep();
  };

  const handleNumberAnswer = () => {
    const healthNum = parseInt(health);
    if (!healthNum || healthNum < 1 || healthNum > 30) {
      alert("Mohon masukkan angka antara 1-30.");
      return;
    }
    handleAnswer(healthNum);
  };

  const goToNextStep = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      // Hapus jawaban dari step saat ini di localStorage
      const currentQuestionId = questions[currentStep].id;
      const updatedAnswers = { ...answers };

      // Hapus jawaban saat ini
      if (currentQuestionId === "BMI") {
        delete updatedAnswers.BMI;
      } else {
        delete updatedAnswers[currentQuestionId];
      }

      setAnswers(updatedAnswers);
      saveToLocalStorage("heartAnswers", updatedAnswers);

      // Reset input fields
      setBerat("");
      setTinggi("");
      setHealth("");

      // Kembali ke step sebelumnya
      setCurrentStep((prev) => prev - 1);
    }
  };

  const submitAnswers = async (value: number) => {
    try {
      const key = questions[currentStep].id;
      const updated = { ...answers, [key]: value };
      setAnswers(updated);
      saveToLocalStorage("heartAnswers", updated);
      console.log(updated);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/predict`,
        // `${process.env.NEXT_PUBLIC_BACKEND_DEV}/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updated),
        }
      );

      const result = await response.json();
      console.log("Hasil prediksi:", result);
      localStorage.setItem("heartResult", JSON.stringify(result));
      localStorage.removeItem("heartAnswers");
      router.push("/result");
    } catch (error) {
      console.error("Gagal mengirim ke backend:", error);
    }
  };

  return (
    <div className=" bg-black py-8 px-4">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-pink-500/20 rounded-xs border border-pink-500/30">
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Health Assessment
          </h1>
          <p className="text-gray-300 text-lg">
            Evaluasi kesehatan jantung Anda dengan menjawab beberapa pertanyaan
            sederhana
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-800/50 rounded-md px-2 py-1 mb-8">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-gray-300">Progress</span>
            <span className="text-sm text-pink-500 font-semibold">
              {currentStep + 1} / {questions.length}
            </span>
          </div>
          <div className="bg-slate-700 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-pink-500/10 to-red-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="max-w-7xl mx-auto px-6 ">
        <div className="bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 lg:p-12 shadow-2xl">
          {/* Question Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 bg-slate-700/50 rounded-xl border border-slate-600/50">
              {getQuestionIcon(question.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm font-medium border border-pink-500/30">
                  Question {currentStep + 1}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                {question.question}
              </h2>
              <p className="text-gray-400 mt-2 text-lg">
                Silakan pilih jawaban yang paling sesuai dengan kondisi Anda
              </p>
            </div>
          </div>

          {/* Question Content */}
          <div className="space-y-6">
            {question.type === "boolean" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(1)}
                  className="group bg-slate-700/30 hover:bg-pink-500/20 border border-slate-600/50 hover:border-pink-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                      <span className="text-green-400 font-bold">Y</span>
                    </div>
                    <span className="text-white font-semibold text-lg">
                      Yes
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => handleAnswer(0)}
                  className="group bg-slate-700/30 hover:bg-pink-500/20 border border-slate-600/50 hover:border-pink-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                      <span className="text-red-400 font-bold">N</span>
                    </div>
                    <span className="text-white font-semibold text-lg">No</span>
                  </div>
                </button>
              </div>
            )}

            {question.type === "bmi" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-gray-300 font-medium">
                      Berat Badan (kg)
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 65"
                      value={berat}
                      onChange={(e) => setBerat(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300 font-medium">
                      Tinggi Badan (cm)
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 170"
                      value={tinggi}
                      onChange={(e) => setTinggi(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                    />
                  </div>
                </div>
                <button
                  onClick={handleBMIAnswer}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25"
                >
                  Calculate BMI & Continue
                </button>
              </div>
            )}

            {question.type === "number" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-gray-300 font-medium">
                    Masukkan nilai (1-30)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 15"
                    min="1"
                    max="30"
                    value={health}
                    onChange={(e) => setHealth(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                  />
                  <p className="text-sm text-gray-400">
                    Rentang nilai yang valid: 1 sampai 30
                  </p>
                </div>
                <button
                  onClick={handleNumberAnswer}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25"
                >
                  Submit Answer
                </button>
              </div>
            )}

            {question.type === "diabetes" && (
              <OptionQuestion
                onAnswer={handleAnswer}
                options={diabetesOptions}
              />
            )}
            {question.type === "genHlth" && (
              <OptionQuestion
                onAnswer={handleAnswer}
                options={genHealthOptions}
              />
            )}
            {question.type === "sex" && (
              <OptionQuestion onAnswer={handleAnswer} options={sexOptions} />
            )}
            {question.type === "age" && (
              <OptionQuestion onAnswer={handleAnswer} options={ageOptions} />
            )}
            {question.type === "education" && (
              <OptionQuestion
                onAnswer={handleAnswer}
                options={educationOptions}
              />
            )}
            {question.type === "income" && (
              <OptionQuestion
                onAnswer={submitAnswers}
                options={incomeOptions}
                questionsLast
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700/50">
            <button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentStep === 0
                  ? "text-gray-500 cursor-not-allowed bg-slate-700/20"
                  : "text-white bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-sm">
                {currentStep === questions.length - 1
                  ? "Final Question"
                  : "Next: Question " + (currentStep + 2)}
              </span>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="  mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Akurat</h3>
                <p className="text-gray-400 text-sm">
                  Hasil berdasarkan data medis
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Heart className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Aman</h3>
                <p className="text-gray-400 text-sm">Data Anda terlindungi</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Stethoscope className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Cepat</h3>
                <p className="text-gray-400 text-sm">
                  Hasil dalam hitungan detik
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepQuestions;
