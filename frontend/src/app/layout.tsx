import type { Metadata } from "next";
import { Oswald, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geist = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--geist",
  style: "normal",
});

export const metadata: Metadata = {
  title: "Heart Disease Risk Prediction",
  description:
    "A web-based application for heart disease risk prediction using an ensemble learning model combining Random Forest, Feedforward Neural Network (FFNN), and XGBoost. Provides accurate predictions and AI-generated recommendations.",
  keywords: [
    "Heart Disease Prediction",
    "prediksi penyakit jantung",
    "Ensemble Learning",
    "prediksi",
    "Feedforward Neural Network",
    "XGBoost",
    "AI Recommendations",
    "Health Tech",
    "Machine Learning",
    "Random Forest",
    "FFNN",
    "XGBoost",
    "Ensemble Learning",
    "AI Healthcare",
    "Medical Prediction",
    "Next.js",
    "Web Application",
  ],
  authors: [{ name: "Agaam" }],
  creator: "M. Cita Prasetya Agam",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black" suppressHydrationWarning>
      <body className={`${geist.className}`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
