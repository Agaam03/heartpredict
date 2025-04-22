import React from "react";
import { Particles } from "../magicui/particles";

const HeroSection = () => {
  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden h-screen">
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color="#ffffff"
        refresh
      />
      <div className="flex flex-col items-center justify-center max-w-7xl mx-auto h-screen  text-white text-center p-4">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Heart Disease Prediction
        </h1>
        <p className="text-lg mb-8">
          Predict the risk of heart disease using machine learning.
        </p>
        <button className="bg-white text-black  font-semibold py-2 px-4 rounded shadow hover:bg-gray-200 transition duration-300">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
