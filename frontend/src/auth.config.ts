import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas"
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./data/user"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        const validatedValues = LoginSchema.safeParse(credentials)
        if (validatedValues.success) {
          const { email, password } = validatedValues.data

          const user = await getUserByEmail(email)
          if (!user || !user.password) return null
          
          const passwordMatch = await bcrypt.compare(password, user.password)
          if (passwordMatch) return user
        }
        return null
      }
    })
  ],
} satisfies NextAuthConfig