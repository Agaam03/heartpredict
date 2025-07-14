"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { predictionResultSchema } from "@/schemas"
import { z } from "zod"

export const savePrediction = async (values : z.infer<typeof predictionResultSchema>) => {
    const session = await auth()
    if (!session || !session.user?.id) {
        return {error: "User not authenticated"}
    }
    const validatedValues = predictionResultSchema.safeParse(values);
    if (!validatedValues.success) {
        return {error: "Invalid input"}
    }

    const data = validatedValues.data
    const saved = await db.predictionResult.create({
        data: {
            userId: session.user.id,
            prediction: data.prediction,
            predictionLabel: data.predictionLabel,
            probability: data.probability,
            confidence: data.confidence,
            riskLevel: data.riskLevel,
            advice: data.advice,
            modelProbabilities: data.modelProbabilities,
            inputData: data.inputData,
        },
    })

    return saved
}