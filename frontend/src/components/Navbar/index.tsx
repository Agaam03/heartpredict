"use client";
import React from "react";
import Logo from "../Logo";
const Navbar = () => {
  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <section className="sticky top-0 w-full bg-transparent backdrop-blur-xl z-50 border-b-[0.2px] border-b-gray-600 shadow-md">
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-row justify-between items-center mx-8 py-3">
          {/* Logo with animation */}
          <Logo />
          <button
            onClick={handleLogin}
            className="px-5 py-[0.4px] bg-white rounded-xs font-medium text-md text-black cursor-pointer hover:bg-gray-500 transition duration-300 ease-in-out shadow-md active:scale-95"
          >
            Sign In
          </button>
        </div>
      </main>
    </section>
  );
};

export default Navbar;
