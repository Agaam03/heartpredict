import React from "react";
import { GridBeam } from "../GridBeam";
import { WordRotate } from "../magicui/word-rotate";
import { Grab, HeartPulse } from "lucide-react";
import Link from "next/link";
import HeartBeam from "../HeartBeatBeam";

const HeroSection = () => {
  return (
    <GridBeam className="relative flex w-full items-center justify-center overflow-hidden">
      {/* Content Container */}

      <div className="relative z-10 flex flex-col items-start justify-center max-w-7xl mx-auto text-white text-left lg:-mt-32 -mt-80">
        <h1 className="flex items-center">
          <HeartPulse className="text-red-500 mr-2 animate-pulse" size={28} />
          <span className="text-red-400 font-medium tracking-wider">
            SMART HEALTH PREDICTION
          </span>
        </h1>

        <div className="flex flex-wrap items-center lg:gap-4  md:gap-2 text-4xl md:text-8xl lg:text-9xl font-semibold uppercase mb-4 gap-[1px] ">
          <span>Check Your</span>
          <span className="inline-block lg:min-w-[7ch] md:min-w-[6ch] min-w-[1ch] ">
            <WordRotate duration={5000} words={["Heart", "Health"]} />
          </span>
        </div>

        <p className="text-lg mb-8 max-w-xl">
          Temukan wawasan mendalam tentang kondisi kesehatan dengan cepat dan
          akurat membuka jalan bagi masa depan medis yang lebih cerdas dan
          berdaya.
        </p>
        <Link
          href={"/predict"}
          className="bg-white text-black font-medium py-2 px-4 rounded-md shadow hover:bg-gray-200 transition duration-300"
        >
          Try Predictive Analysis
        </Link>
      </div>
    </GridBeam>
  );
};

export default HeroSection;
