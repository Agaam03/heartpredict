"use client";

import { fetchPredictionResults } from "@/actions/fetch-prediction-result";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "react-hot-toast";

// fungsi helper
export const navigateWithLimit = async (href: string, router: AppRouterInstance) => {
  if (href === "/predict") {
    try {
      const dataPrediction = await fetchPredictionResults();

      if (dataPrediction.length >= 5) {
        toast.error(
          "Anda sudah memiliki lebih dari 5 prediksi, silahkan hapus terlebih dahulu",
          {
            style: {
              border: "1px solid #f6339a",
              padding: "16px",
              color: "#f6339a",
              background: "#000000",
              minWidth: window.innerWidth < 480 ? "250px" : "400px",
            },
            iconTheme: {
              primary: "#f6339a",
              secondary: "#0d0d0d",
            },
          }
        );
        return; // ❌ stop, jangan ke /predict
      }
    } catch (err) {
      console.error("Gagal cek prediksi:", err);
    }
  }

  // default: tetap navigasi
  router.push(href);
};
