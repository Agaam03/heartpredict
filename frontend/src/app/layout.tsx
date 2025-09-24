import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

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

  // Open Graph
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
        url: "https://www.heartpredict.online/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Heart Disease Risk Prediction - AI-Powered Health Assessment",
        type: "image/png",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Heart Disease Risk Prediction - AI-Powered Health Assessment",
    description:
      "Advanced heart disease risk prediction using ensemble learning. Get accurate predictions and personalized AI recommendations.",
    images: ["https://www.heartpredict.online/opengraph-image.png"],
  },

  // Robots
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

  // App info
  applicationName: "Heart Disease Risk Prediction",
  category: "Health & Medical",

  // Favicon & App Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  // Theme color
  other: {
    "theme-color": "#000000",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black" suppressHydrationWarning>
      <head>
        {/* Manifest for PWA */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Performance preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Structured data for Organization logo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              url: "https://www.heartpredict.online",
              logo: "https://www.heartpredict.online/favicon.ico",
            }),
          }}
        />
        {/* AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7243017697676726"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <meta name="google-adsense-account" content="ca-pub-7243017697676726" />
      </head>
      <body className={`${geist.className}`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
