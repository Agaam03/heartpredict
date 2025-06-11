"use server"

import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedValues = LoginSchema.safeParse(values);
    if (!validatedValues.success) {
        return {error: "Invalid input"}
    }

    const { email, password, code } = validatedValues.data;

    const exisUser = await getUserByEmail(email);
    if (!exisUser || !exisUser.password || !exisUser.email) return { error: "Email does not exist!" };

    if (!exisUser.emailVerified) {
      const verifToken = await generateVerificationToken(exisUser.email)
      await sendVerificationEmail(verifToken.email, verifToken.token)
      return { success : "Confirmation email sent!" };
    }

    if (exisUser.isTwoFactorEnabled && exisUser.email){
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(exisUser.email)

        if (!twoFactorToken) return { error : "Invalid code!"}

        if (twoFactorToken.token !== code) return { error : "Token is not same!"}

        const hasExpired = new Date(twoFactorToken.expires) < new Date()

        if (hasExpired) return { error : "Token has expired!"}

        await db.twoFactorToken.delete({
          where : {id : twoFactorToken.id}
        })
        const existConfirmation = await getTwoFactorConfirmationByUserId(exisUser.id)

        if (existConfirmation) {
          await db.twoFactorConfirmation.delete({
            where : {id : existConfirmation.id}
          })
        }

        await db.twoFactorConfirmation.create({
          data : {
            userId : exisUser.id
          }
        })
      } else {
        const twoFactorToken = await generateTwoFactorToken(exisUser.email)
        await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)
  
        return { twoFactor : true}
      }
    }

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      });
    } catch (error) {
        if (error instanceof AuthError) {
          switch (error.type) {
            case "CredentialsSignin":
              return { error: "Invalid email or password" };
            default:
              return { error: "Something went wrong!" };
            }
          }

          throw error; 
        }
    };
