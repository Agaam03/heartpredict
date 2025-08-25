"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { fetchPredictionResults } from "@/actions/fetch-prediction-result";

const BlockPredictIfLimitReached = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkPredictionLimit = async () => {
      if (pathname.startsWith("/predict")) {
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

            router.push("/"); // keluar dari /predict
          }
        } catch (error) {
          console.error("Gagal mengambil prediksi:", error);
        }
      }
    };

    checkPredictionLimit();
  }, [pathname, router]);

  return null;
};

export default BlockPredictIfLimitReached;
