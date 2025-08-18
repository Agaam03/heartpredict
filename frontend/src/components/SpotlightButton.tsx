"use client";

import { fetchPredictionResults } from "@/actions/fetch-prediction-result";
import { navigateWithLimit } from "@/lib/navigate-with-limit";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
interface SpotlightButtonProps {
  main: string;
  styleDefault?: boolean;
  download?: boolean;
  customStyles?: {
    button?: string;
    text?: string;
    spotlight?: string;
  };
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

const SpotlightButton = ({
  main,
  styleDefault = true,
  customStyles,
  download = false,
  onClick,
  href = "/predict",
  icon = <ExternalLink size={18} />,
}: SpotlightButtonProps) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { width } = (e.target as HTMLElement)?.getBoundingClientRect();
      const offset = e.offsetX;
      const left = `${(offset / width) * 100}%`;

      spanRef.current!.animate({ left }, { duration: 250, fill: "forwards" });
    };

    const handleMouseLeave = () => {
      spanRef.current!.animate(
        { left: "50%" },
        { duration: 100, fill: "forwards" }
      );
    };

    btnRef?.current?.addEventListener("mousemove", handleMouseMove);
    btnRef?.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btnRef?.current?.removeEventListener("mousemove", handleMouseMove);
      btnRef?.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClick = async () => {
    if (onClick) {
      onClick();
      return;
    }

    if (download) {
      const a = document.createElement("a");
      a.href = process.env.NEXT_PUBLIC_DOWNLOAD_DATASET_URL || "";
      a.download = "heart-dataset-by-kirollosashraf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // ✅ cukup panggil helper
    await navigateWithLimit(href, router);
  };

  // Default styles
  const defaultButtonStyles =
    "relative w-full max-w-60 overflow-hidden rounded-sm px-2 py-2 text-lg font-medium text-white cursor-pointer bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 backdrop-blur-sm hover:border-pink-400/40 duration-700";

  const defaultTextStyles =
    "pointer-events-none relative z-10 mix-blend-difference cursor-pointer flex flex-row items-center justify-center gap-2 text-pink-500";

  const defaultSpotlightStyles =
    "pointer-events-none absolute left-[50%] top-[50%] h-24 w-24 -translate-x-[50%] -translate-y-[50%] rounded-full bg-fuchsia-800/10";

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.985 }}
      ref={btnRef}
      className={styleDefault ? defaultButtonStyles : customStyles?.button}
    >
      <span className={styleDefault ? defaultTextStyles : customStyles?.text}>
        {main}
        {icon}
      </span>
      <span
        ref={spanRef}
        className={
          styleDefault ? defaultSpotlightStyles : customStyles?.spotlight
        }
      />
    </motion.button>
  );
};

export default dynamic(() => Promise.resolve(SpotlightButton), { ssr: false });
