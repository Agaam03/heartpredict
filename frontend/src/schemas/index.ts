import { z } from 'zod';
export const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1,{message: 'Password is required' }),
    code: z.optional(z.string()),
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

export const predictionResultSchema = z.object({
  prediction: z.number().int().min(0).max(1),
  predictionLabel: z.enum(['Positive', 'Negative']),
  probability: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  riskLevel: z.string().min(3), // bisa dibuat enum kalau punya list fix
  advice: z.string().min(10),

  modelProbabilities: z.object({
    random_forest: z.number().min(0).max(1),
    ffnn: z.number().min(0).max(1),
    xgboost: z.number().min(0).max(1),
  }),

  inputData: z.object({
    HighBP: z.number().int().min(0).max(1),
    HighChol: z.number().int().min(0).max(1),
    CholCheck: z.number().int().min(0).max(1),
    BMI: z.number().min(0),
    Smoker: z.number().int().min(0).max(1),
    Stroke: z.number().int().min(0).max(1),
    Diabetes: z.number().int().min(0).max(2),
    PhysActivity: z.number().int().min(0).max(1),
    Fruits: z.number().int().min(0).max(1),
    Veggies: z.number().int().min(0).max(1),
    HvyAlcoholConsump: z.number().int().min(0).max(1),
    AnyHealthcare: z.number().int().min(0).max(1),
    NoDocbcCost: z.number().int().min(0).max(1),
    GenHlth: z.number().int().min(1).max(5),
    MentHlth: z.number().int().min(0),
    PhysHlth: z.number().int().min(0),
    DiffWalk: z.number().int().min(0).max(1),
    Sex: z.number().int().min(0).max(1),
    Age: z.number().int().min(1).max(13),
    Education: z.number().int().min(1).max(6),
    Income: z.number().int().min(1).max(8),
  }),
})
