"use client";

import { GridBackground } from "@/components/GridBackground";
import React from "react";

import "highlight.js/styles/github.css"; // Gaya highlight, bisa ganti ke dracula, atom-one-dark, dll
import ResultPage from "./ResultPage";

const Page = () => {
  return (
    <GridBackground>
      <ResultPage />
    </GridBackground>
  );
};

export default Page;
