import { z } from 'zod';
export const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1,{message: 'Password is required' }),
    rememberMe: z.boolean().optional(),
})
export const RegisterSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export const ResetSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
})
export const NewPasswordSchema = z.object({
    password: z.string().min(8,{message: 'Minimum 8 characters required' }),
})