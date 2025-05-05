"use client";
import { GridBackground } from "@/components/GridBackground";
import React, { useState } from "react";
import { BorderBeam } from "@stianlarsen/border-beam";
import { ArrowRight, MoveRight } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  ageOptions,
  diabetesOptions,
  educationOptions,
  genHealthOptions,
  incomeOptions,
  questions,
  sexOptions,
} from "@/data/questionOption";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/storage";
import { useRouter } from "next/navigation";

const Page = () => {
  return (
    <GridBackground>
      <MultiStepQuestions />
    </GridBackground>
  );
};

export default Page;

export const MultiStepQuestions = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>(() => {
    return getFromLocalStorage("heartAnswers") || {};
  });

  const [berat, setBerat] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [health, setHealth] = useState(0);
  const router = useRouter();

  const question = questions[currentStep];

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

  const goToNextStep = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
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
        "https://heart-disease-service-297544367066.asia-southeast2.run.app/predict",
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
    <div className="text-white flex flex-col bg-[#110101c9] w-full lg:px-10 lg:pb-52 lg:pt-44 pt-24 pb-24 px-5 my-32 rounded-xl lg:mt-28 border-pink-800/30 border">
      <div className="flex lg:flex-row flex-col lg:items-center gap-2">
        <span className="text-pink-500 flex flex-row gap-2 items-center">
          {currentStep + 1} <ArrowRight size={20} strokeWidth={1.75} />
        </span>
        <h2 className="text-xl font-semibold">{question.question}</h2>
      </div>
      <p className="text-gray-400">Silakan pilih jawaban Anda</p>

      {question.type === "boolean" && (
        <div className="flex flex-col space-y-2 w-fit mt-4">
          <button
            onClick={() => handleAnswer(1)}
            className="border border-pink-800 rounded px-9 py-1 hover:bg-pink-800 transition"
          >
            <span className="font-bold text-pink-500">Y</span>{" "}
            <span className="ml-2">Yes</span>
          </button>
          <button
            onClick={() => handleAnswer(0)}
            className="border border-pink-800 rounded px-9 py-1 hover:bg-pink-800 transition"
          >
            <span className="font-bold text-pink-500">N</span>{" "}
            <span className="ml-2">No</span>
          </button>
        </div>
      )}

      {question.type === "bmi" && (
        <div className="flex flex-col space-y-3 w-fit mt-4">
          <input
            type="number"
            placeholder="Berat badan (kg)"
            value={berat}
            onChange={(e) => setBerat(e.target.value)}
            className="border border-pink-800 rounded px-4 py-2 text-white"
          />
          <input
            type="number"
            placeholder="Tinggi badan (cm)"
            value={tinggi}
            onChange={(e) => setTinggi(e.target.value)}
            className="border border-pink-800 rounded px-4 py-2 text-white"
          />
          <button
            onClick={handleBMIAnswer}
            className="border border-pink-800 rounded px-4 py-2 text-white hover:bg-pink-800 transition"
          >
            Submit
          </button>
        </div>
      )}

      {question.type === "number" && (
        <div className="flex flex-col space-y-3 w-fit mt-4">
          <input
            type="number"
            placeholder="1 - 30"
            value={health}
            onChange={(e) => setHealth(Number(e.target.value))}
            className="border border-pink-800 rounded px-4 py-2 text-white"
          />
          <button
            onClick={() => handleAnswer(health)}
            className="border border-pink-800 rounded px-4 py-2 text-white hover:bg-pink-800 transition"
          >
            Submit
          </button>
        </div>
      )}

      {question.type === "diabetes" && (
        <OptionQuestion onAnswer={handleAnswer} options={diabetesOptions} />
      )}
      {question.type === "genHlth" && (
        <OptionQuestion onAnswer={handleAnswer} options={genHealthOptions} />
      )}
      {question.type === "sex" && (
        <OptionQuestion onAnswer={handleAnswer} options={sexOptions} />
      )}
      {question.type === "age" && (
        <OptionQuestion onAnswer={handleAnswer} options={ageOptions} />
      )}
      {question.type === "education" && (
        <OptionQuestion onAnswer={handleAnswer} options={educationOptions} />
      )}
      {question.type === "income" && (
        <OptionQuestion
          onAnswer={submitAnswers}
          options={incomeOptions}
          questionsLast
        />
      )}
    </div>
  );
};

export const OptionQuestion = ({
  options,
  onAnswer,
  questionsLast,
}: {
  options: { label: string; value: number; description?: string }[];
  onAnswer: (value: number) => void;
  questionsLast?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<null | {
    label: string;
    value: number;
    description?: string;
  }>(null);

  const handleSelect = (option: (typeof options)[0]) => {
    setSelected(option);
    setIsOpen(false);
    if (!questionsLast) {
      onAnswer(option.value); // langsung kirim kalau BUKAN pertanyaan terakhir
    }
    console.log(option);
  };

  return (
    <>
      <div className="text-white flex flex-col w-full px-10 py-8 rounded-xl ">
        <div className="relative w-full max-w-xl">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full border border-pink-800 px-4 py-2 rounded bg-transparent text-left flex justify-between items-center hover:bg-pink-900 transition"
          >
            {selected ? selected.label : "Select on option"}
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-black border border-pink-800 rounded shadow-md max-h-60 overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2 cursor-pointer hover:bg-pink-800"
                >
                  <div className="font-bold text-pink-400">{option.label}</div>
                  <div className="text-sm text-gray-400">
                    {option.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="mt-4 text-sm text-gray-300">
            <strong>Keterangan:</strong> {selected.description}
          </div>
        )}
      </div>
      {questionsLast === true && selected && (
        <div className="relative justify-end ">
          <button
            onClick={() => {
              if (selected) {
                onAnswer(selected.value);
              }
            }}
            className="absolute right-6 lg:top-11 mt-4 border border-pink-800 rounded px-4 py-2 text-white hover:bg-pink-800 transition"
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
};
