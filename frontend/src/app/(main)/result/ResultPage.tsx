// Main Result Page Component
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ResultCard from "./ResultCard";

const ResultPage = () => {
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("heartResult");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, []);

  const backToHome = () => {
    localStorage.removeItem("heartAnswers");
  };

  if (!result) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => {
          backToHome();
          router.push("/");
        }}
        className="mb-2 mt-1.5 flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Kembali ke Halaman Utama</span>
      </motion.button>

      <ResultCard result={result} />
    </div>
  );
};

export default ResultPage;
