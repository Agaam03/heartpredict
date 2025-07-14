import { db } from "@/lib/db"
import { PredictionById } from "@/types/prediction";
import { t } from "framer-motion/dist/types.d-DDSxwf0n";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: { email }
        })
        return user;
        
    } catch {
      return null;   
    }
}
export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id }
        })
        return user;
        
    } catch {
      return null;   
    }
}
export const getUserAccountByUserId = async (userId: string) => {
    try {
        const user = await db.account.findFirst({
            where: { userId }
        })
        return user;
        
    } catch {
      return null;   
    }
}

export const getUserPredictions = async (userId : string) => {
    try {
        const predictions = await db.predictionResult.findMany({
            where: { userId },
        })
        return predictions;
    
    } catch (error) {
        console.error("Error fetching user predictions:", error);
        return [];
    }
}