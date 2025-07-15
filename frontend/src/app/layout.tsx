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
  robots: "index, follow",
  applicationName: "Heart Disease Risk Predictor",
  generator: "Next.js",
  openGraph: {
    title: "Heart Disease Risk Prediction",
    description:
      "An intelligent health prediction system using ensemble machine learning models (RF, FFNN, XGBoost). Receive accurate predictions and AI-driven prevention suggestions.",
    url: "https://heartpredict-two.vercel.app",
    siteName: "Heart Disease Predictor",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
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
