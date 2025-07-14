"use server"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deletePrediction(predictionId: string) {
  try {
    // Validate the prediction ID
    if (!predictionId || typeof predictionId !== "string") {
      throw new Error("Invalid prediction ID");
    }

    // Check if prediction exists
    const existingPrediction = await db.predictionResult.findUnique({
      where: {
        id: predictionId,
      },
    });

    if (!existingPrediction) {
      throw new Error("Prediction not found");
    }

    // Delete the prediction
    await db.predictionResult.delete({
      where: {
        id: predictionId,
      },
    });
    revalidatePath("/dashboard");
    
    return { success: true, message: "Prediction deleted successfully" };
  } catch (error) {
    console.error("Error deleting prediction:", error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Failed to delete prediction" };
  }
}