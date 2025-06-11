"use server"

import { getUserByEmail } from "@/data/user"
import { getVerificationTokenByToken } from "@/data/verification-token"
import { db } from "@/lib/db"

export const newAccountVerification = async (token : string) => {
    const exisToken = await getVerificationTokenByToken(token)

    if (!exisToken) return { error : "Token does not exist!"}

    const hasExpired = new Date(exisToken.expires ) < new Date()

    if (hasExpired) return { error : "Token has Expired"}

    const existUser = await getUserByEmail(exisToken.email)

    if (!existUser) return { error : "Email does not exist!"}

    await db.user.update({
        where : { id : existUser.id},
        data : {
            emailVerified : new Date(),
            email: exisToken.email
        }
    })

    await db.verificationToken.delete({
        where : { id : exisToken.id}
    })

    return { success : "Email verified!"}
}