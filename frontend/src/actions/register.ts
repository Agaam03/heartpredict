"use server"

import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; 
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedValues = RegisterSchema.safeParse(values);
    if (!validatedValues.success) {
        return {error: "Invalid input"}
    }

    const { name, email, password } = validatedValues.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return {error: "Email already exists"};
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    const verifToken = await generateVerificationToken(email);

    await sendVerificationEmail(verifToken.email, verifToken.token);

    return {success: "Confirmation Email Sent!"};

  
}
