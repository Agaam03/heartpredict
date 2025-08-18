import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
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
  title: {
    default: "Heart Disease Risk Prediction",
    template: "%s | Heart Disease Risk Prediction",
  },
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
    "AI Healthcare",
    "Medical Prediction",
    "Next.js",
    "Web Application",
  ],
  authors: [{ name: "Agaam" }],
  creator: "M. Cita Prasetya Agam",
  publisher: "M. Cita Prasetya Agam",
  metadataBase: new URL("https://www.heartpredict.online"),

  // Open Graph Configuration
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.heartpredict.online",
    siteName: "Heart Disease Risk Prediction",
    title: "Heart Disease Risk Prediction - AI-Powered Health Assessment",
    description:
      "Advanced heart disease risk prediction using ensemble learning. Get accurate predictions and personalized AI recommendations for better heart health.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Heart Disease Risk Prediction - AI-Powered Health Assessment",
        type: "image/png",
      },
    ],
  },

  // Twitter Card Configuration
  twitter: {
    card: "summary_large_image",
    title: "Heart Disease Risk Prediction - AI-Powered Health Assessment",
    description:
      "Advanced heart disease risk prediction using ensemble learning. Get accurate predictions and personalized AI recommendations.",
    images: ["/opengraph-image.png"],
  },

  // Additional Meta Tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical URL
  alternates: {
    canonical: "https://www.heartpredict.online",
  },

  // Application Information
  applicationName: "Heart Disease Risk Prediction",
  category: "Health & Medical",

  // Additional metadata
  other: {
    "theme-color": "#000000",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Basic Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className={`${geist.className}`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
