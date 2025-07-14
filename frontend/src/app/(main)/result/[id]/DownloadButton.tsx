"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PredictionById } from "@/types/prediction";
import { useCurrentUser } from "@/hooks/user-current-session";
import {
  ageOptions,
  diabetesOptions,
  educationOptions,
  genHealthOptions,
  incomeOptions,
  sexOptions,
} from "@/data/questionOption";

interface Props {
  result: PredictionById | null;
}

const DownloadButton: React.FC<Props> = ({ result }) => {
  const user = useCurrentUser();
  const [isDownloading, setIsDownloading] = useState(false);

  // Helper function to get readable values
  const getReadableValue = (key: string, value: any): string => {
    const numValue = Number(value);

    switch (key) {
      case "Diabetes":
        return (
          diabetesOptions.find((opt) => opt.value === numValue)?.label ||
          value.toString()
        );
      case "GenHlth":
        return (
          genHealthOptions.find((opt) => opt.value === numValue)?.label ||
          value.toString()
        );
      case "Sex":
        return (
          sexOptions.find((opt) => opt.value === numValue)?.label ||
          value.toString()
        );
      case "Age":
        return (
          ageOptions.find((opt) => opt.value === numValue)?.label ||
          value.toString()
        );
      case "Education":
        return (
          educationOptions.find((opt) => opt.value === numValue)?.label ||
          value.toString()
        );
      case "Income":
        return (
          incomeOptions.find((opt) => opt.value === numValue)?.label ||
          value.toString()
        );
      case "HighBP":
      case "HighChol":
      case "CholCheck":
      case "Smoker":
      case "Stroke":
      case "PhysActivity":
      case "Fruits":
      case "Veggies":
      case "HvyAlcoholConsump":
      case "AnyHealthcare":
      case "NoDocbcCost":
      case "DiffWalk":
        return numValue === 1 ? "Ya" : "Tidak";
      case "BMI":
        return `${value} kg/m²`;
      case "MentHlth":
        return `${value} hari`;
      case "PhysHlth":
        return `${value} hari`;
      default:
        return value.toString();
    }
  };

  // Helper function to get field labels
  const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      HighBP: "Tekanan Darah Tinggi",
      HighChol: "Kolesterol Tinggi",
      CholCheck: "Cek Kolesterol (5 tahun)",
      BMI: "Body Mass Index",
      Smoker: "Perokok Aktif",
      Stroke: "Riwayat Stroke",
      Diabetes: "Diabetes",
      PhysActivity: "Aktivitas Fisik",
      Fruits: "Konsumsi Buah",
      Veggies: "Konsumsi Sayuran",
      HvyAlcoholConsump: "Konsumsi Alkohol Berat",
      AnyHealthcare: "Akses Layanan Kesehatan",
      NoDocbcCost: "Tidak ke Dokter (Biaya)",
      GenHlth: "Kondisi Kesehatan Umum",
      MentHlth: "Kesehatan Mental Buruk",
      PhysHlth: "Kesehatan Fisik Buruk",
      DiffWalk: "Kesulitan Berjalan",
      Sex: "Jenis Kelamin",
      Age: "Usia",
      Education: "Tingkat Pendidikan",
      Income: "Tingkat Pendapatan",
    };
    return labels[key] || key;
  };

  const handleDownloadPdf = async () => {
    if (!result) return;

    setIsDownloading(true);

    try {
      const doc = new jsPDF();
      let currentY = 20;

      // Color scheme
      const colors = {
        primary: [41, 128, 185] as [number, number, number], // Blue
        secondary: [52, 152, 219] as [number, number, number], // Light blue
        accent: [22, 160, 133] as [number, number, number], // Teal
        success: [39, 174, 96] as [number, number, number], // Green
        danger: [231, 76, 60] as [number, number, number], // Red
        warning: [241, 196, 15] as [number, number, number], // Yellow
        text: [44, 62, 80] as [number, number, number], // Dark text
        lightBlue: [174, 214, 241] as [number, number, number], // Very light blue
        lightGray: [236, 240, 241] as [number, number, number], // Light gray
        mediumGray: [149, 165, 166] as [number, number, number], // Medium gray
        white: [255, 255, 255] as [number, number, number], // White
      };

      // Header background
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, 210, 35, "F");

      // Company/System name
      doc.setFontSize(18);
      doc.setTextColor(...colors.white);
      doc.text("Health Analysis System", 20, 15);

      // Report type
      doc.setFontSize(12);
      doc.text("Laporan Prediksi Kesehatan", 20, 25);

      // Report number and date (right aligned)
      doc.setFontSize(10);
      doc.text("No: RPT-2024", 150, 15);
      doc.text("Tanggal: " + new Date().toLocaleDateString("id-ID"), 150, 22);
      doc.text("Waktu: " + new Date().toLocaleTimeString("id-ID"), 150, 29);

      currentY = 50;

      // Two column layout for patient info and prediction
      // Left column - Patient Info
      doc.setFillColor(...colors.lightBlue);
      doc.rect(20, currentY, 80, 8, "F");
      doc.setFontSize(11);
      doc.setTextColor(...colors.text);
      doc.text("Informasi Pasien", 22, currentY + 6);

      currentY += 12;
      doc.setFontSize(9);
      doc.text("Nama Pasien", 22, currentY);
      doc.text("ID Laporan", 22, currentY + 8);
      doc.text("Status Prediksi", 22, currentY + 16);

      doc.setFontSize(9);
      doc.text(user?.name || "Tidak Diketahui", 22, currentY + 4);
      doc.text(result.id.substring(0, 12) + "...", 22, currentY + 12);

      const isHighRisk = result.prediction === 1;
      doc.setTextColor(...(isHighRisk ? colors.danger : colors.success));
      doc.text(result.prediction_label, 22, currentY + 20);

      // Right column - Prediction Summary
      doc.setFillColor(...colors.lightBlue);
      doc.rect(110, 50, 80, 8, "F");
      doc.setFontSize(11);
      doc.setTextColor(...colors.text);
      doc.text("Ringkasan Prediksi Kesehatan", 112, 56);

      currentY = 62;
      doc.setFontSize(9);
      doc.text("Confidence Level", 112, currentY);
      doc.text("Risk Level", 112, currentY + 8);
      doc.text("Stacking Probability", 112, currentY + 16);

      doc.setFontSize(9);
      doc.setTextColor(...colors.text);
      doc.text(`${(result.confidence * 100).toFixed(1)}%`, 112, currentY + 4);
      doc.text(result.risk_level, 112, currentY + 12);
      doc.text(
        `${(result.stackingPrediction * 100).toFixed(1)}%`,
        112,
        currentY + 20
      );

      currentY = 90;

      // Model Performance section
      doc.setFillColor(...colors.accent);
      doc.rect(20, currentY, 170, 8, "F");
      doc.setFontSize(11);
      doc.setTextColor(...colors.white);
      doc.text("Performa Model AI", 22, currentY + 6);

      currentY += 12;

      const modelData = [
        [
          "Random Forest",
          `${(result.model_probabilities.random_forest * 100).toFixed(1)}%`,
          "Tree-based Model",
        ],
        [
          "Neural Network",
          `${(result.model_probabilities.ffnn * 100).toFixed(1)}%`,
          "Deep Learning",
        ],
        [
          "XGBoost",
          `${(result.model_probabilities.xgboost * 100).toFixed(1)}%`,
          "Gradient Boosting",
        ],
      ];

      autoTable(doc, {
        startY: currentY,
        margin: { left: 20, right: 20 },
        theme: "grid",
        headStyles: {
          fillColor: colors.secondary as [number, number, number],
          textColor: colors.white as [number, number, number],
          fontSize: 10,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 9,
          textColor: colors.text as [number, number, number],
        },
        alternateRowStyles: {
          fillColor: colors.lightGray as [number, number, number],
        },
        head: [["Model", "Probabilitas", "Jenis"]],
        body: modelData,
        columnStyles: {
          0: { cellWidth: 56.7, halign: "left" },
          1: { cellWidth: 56.7, halign: "center" },
          2: { cellWidth: 56.7, halign: "center" },
        },
        didDrawPage: (data) => {
          currentY = data.cursor?.y || currentY;
        },
      });

      currentY += 10;

      // Input Data section
      doc.setFillColor(...colors.warning);
      doc.rect(20, currentY, 170, 8, "F");
      doc.setFontSize(11);
      doc.setTextColor(...colors.text);
      doc.text("Data Input Kesehatan", 22, currentY + 6);

      currentY += 12;

      // Prepare input data for table
      const inputData = Object.entries(result.inputData).map(([key, value]) => [
        getFieldLabel(key),
        getReadableValue(key, value),
      ]);

      autoTable(doc, {
        startY: currentY,
        margin: { left: 20, right: 20 },
        theme: "grid",
        headStyles: {
          fillColor: colors.primary as [number, number, number],
          textColor: colors.white as [number, number, number],
          fontSize: 10,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 8,
          textColor: colors.text as [number, number, number],
        },
        alternateRowStyles: {
          fillColor: colors.lightGray as [number, number, number],
        },
        head: [["Parameter Kesehatan", "Nilai"]],
        body: inputData,
        columnStyles: {
          0: { cellWidth: 85, halign: "left" },
          1: { cellWidth: 85, halign: "center" },
        },
        didDrawPage: (data) => {
          currentY = data.cursor?.y || currentY;
        },
      });

      // Summary box at bottom
      if (currentY < 250) {
        currentY = Math.max(currentY + 10, 250);

        const summaryColor = isHighRisk ? colors.danger : colors.success;
        doc.setFillColor(...summaryColor);
        doc.rect(20, currentY, 170, 20, "F");

        doc.setFontSize(12);
        doc.setTextColor(...colors.white);
        doc.text("KESIMPULAN", 25, currentY + 8);

        doc.setFontSize(10);
        const conclusion = isHighRisk
          ? "Deteksi indikasi risiko penyakit jantung. Konsultasi dengan dokter disarankan."
          : "Kondisi kesehatan jantung dalam batas normal. Lanjutkan gaya hidup sehat.";
        doc.text(conclusion, 25, currentY + 16, { maxWidth: 160 });
      }

      // Footer
      doc.setFillColor(...colors.mediumGray);
      doc.rect(0, 285, 210, 12, "F");

      doc.setFontSize(8);
      doc.setTextColor(...colors.white);
      doc.text(
        "Disclaimer: Hasil prediksi ini hanya untuk referensi medis dan tidak menggantikan konsultasi dengan dokter.",
        105,
        291,
        {
          align: "center",
          maxWidth: 190,
        }
      );

      // Save the PDF
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `health-analysis-${user?.name || "report"}-${timestamp}.pdf`;

      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownloadPdf}
      disabled={!result || isDownloading}
      className={`
        relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-white 
        transition-all duration-300 transform 
        shadow-lg cursor-pointer xl:w-64 w-full 
        ${
          result && !isDownloading
            ? "bg-gradient-to-r bg-red-900/75 hover:bg-red-900"
            : "bg-gray-400 cursor-not-allowed"
        }
      `}
    >
      {/* Loading spinner */}
      {isDownloading && (
        <div className="absolute inset-0 bg-blue-600 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
        </div>
      )}

      {/* Button content */}
      <div
        className={`relative z-10 flex items-center justify-center space-x-2 ${isDownloading ? "opacity-0" : "opacity-100"}`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>Download Report</span>
      </div>
    </button>
  );
};

export default DownloadButton;
