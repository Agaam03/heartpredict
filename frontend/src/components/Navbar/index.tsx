"use client";
import React from "react";
import Logo from "../Logo";
import ButtonComp from "./ButtonComp";
const Navbar = () => {
  return (
    <section className="sticky top-0 w-full bg-transparent backdrop-blur-xl z-50 border-b-[0.2px] border-b-gray-600 shadow-md">
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-row justify-between items-center mx-8 py-3">
          {/* Logo with animation */}
          <Logo />
          <ButtonComp />
        </div>
      </main>
    </section>
  );
};

export default Navbar;
