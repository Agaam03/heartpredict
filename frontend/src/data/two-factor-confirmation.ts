import { db } from "@/lib/db"

export const getTwoFactorConfirmationByUserId = async (userId : string) => {
    try {
        const confirmationToken = await db.twoFactorConfirmation.findUnique({
            where : { userId }
        })
        return confirmationToken
    } catch {
        return null
    }
}
