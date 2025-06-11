"use server"
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const newPassword = async (values : z.infer<typeof NewPasswordSchema>, token?: string | null) => {
    if (!token) return { error : "Token is missing!"}

    const validateFields = NewPasswordSchema.safeParse(values)
    if (!validateFields.success) return {error : "Password required"}

    const { password } = validateFields.data
    const hashedPassword = await bcrypt.hash(password,10)

    const existingToken = await getPasswordResetTokenByToken(token)
    if (!existingToken) return { error : "Token is null!"}
    const hasExpired = new Date(existingToken.expires ) < new Date()
    if (hasExpired) return {error : "Token has expired!"}

    const existingUser = await getUserByEmail(existingToken.email)
    if(!existingUser) return {error : "Email does not exits!"}

    await db.user.update({
        where : { id : existingUser.id},
        data : { password : hashedPassword }
    })

    await db.passwordResetToken.delete({
        where : {id: existingToken.id}
    })

    return { success : "New Password has been created!"}
}