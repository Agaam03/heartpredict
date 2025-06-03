"use server"

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedValues = LoginSchema.safeParse(values);
    if (!validatedValues.success) {
        return {error: "Invalid input"}
    }

    const { email, password } = validatedValues.data;

    const exisUser = await getUserByEmail(email);
    if (!exisUser || !exisUser.password || !exisUser.email) return { error: "Email does not exist!" };

    if (!exisUser.emailVerified) {
      const verifToken = await generateVerificationToken(exisUser.email)
      await sendVerificationEmail(verifToken.email, verifToken.token)
      return { success : "Confirmation email sent!" };
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
