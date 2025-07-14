"use server";

import { auth } from "@/auth";
import { ageOptions } from "@/data/questionOption";
import { db } from "@/lib/db";
import { PredictionById } from "@/types/prediction";
import { revalidatePath } from "next/cache";

const getRiskLabel = (prob: number): string => {
  if (prob > 0.5) return "Berisiko Tinggi";
  if (prob > 0.1) return "Berisiko Sedang";
  return "Berisiko Rendah";
}

export const fetchPredictionResults = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const data = await db.predictionResult.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const results = data.map((item: any) => {
    const input = item.inputData || {};
    const modelProbabilities = item.modelProbabilities || {};

    return {
      id: item.id,
      patientName: session.user ?? "Pasien Tanpa Nama",
      age:
        ageOptions.find((option) => option.value === input.Age)?.label ??
        input.Age ??
        "Tidak diketahui",
      gender: input.Sex === 1 ? "Laki-laki" : "Perempuan",
      bmi: input.BMI ?? "Tidak tersedia",
      diabetes: input.Diabetes === 1 ? "Ya" : "Tidak",
      highBP: input.HighBP === 1 ? "Ya" : "Tidak",
      smoking: input.Smoking === 1 ? "Ya" : "Tidak",

      date: new Date(item.createdAt).toLocaleDateString("id-ID"),
      time: new Date(item.createdAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),

      rfPrediction: getRiskLabel(modelProbabilities?.random_forest ?? 0),
      nnPrediction: getRiskLabel(modelProbabilities?.ffnn ?? 0),
      xgbPrediction: getRiskLabel(modelProbabilities?.xgboost ?? 0),

      rfProbability: modelProbabilities?.random_forest ?? 0,
      nnProbability: modelProbabilities?.ffnn ?? 0,
      xgbProbability: modelProbabilities?.xgboost ?? 0,

      stackingPrediction: getRiskLabel(item.probability ?? 0),
      stackingConfidence: item.confidence ?? 0,
      probability: item.probability ?? 0,
      riskLevel: item.riskLevel ?? "-",
      advice: item.advice ?? "-",
      finalResult: getRiskLabel(item.probability ?? 0)
    };
  });

  revalidatePath("/dashboard");
  return results;
};


export async function fetchPredictionResultsById(id: string): Promise<PredictionById | null> {
  const data = await db.predictionResult.findUnique({ where: { id } });

  if (!data) return null;

  const parsedModelProb = data.modelProbabilities as {
    random_forest: number;
    ffnn: number;
    xgboost: number;
  };

  const mapped: PredictionById = {
    id: data.id,
    userId: data.userId,
    prediction: data.prediction,
    stackingPrediction: data.probability,
    prediction_label: data.predictionLabel,
    confidence: data.confidence,
    risk_level: data.riskLevel,
    advice: data.advice,
    inputData: data.inputData,
    createdAt: data.createdAt,
    model_probabilities: {
      random_forest: parsedModelProb.random_forest,
      ffnn: parsedModelProb.ffnn,
      xgboost: parsedModelProb.xgboost,
    },
  };

  return mapped;
}
