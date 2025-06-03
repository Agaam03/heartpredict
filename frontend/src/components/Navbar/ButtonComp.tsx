import { auth, signOut } from "@/auth";
import { Sign } from "crypto";
import React from "react";

const ButtonComp = async () => {
  const session = await auth();
  const handleLogin = async( ) => {
    if (session) {
      await signOut();
    } else {
      window.location.href = "/login";
    }
  }
  return (
    <button
      type="submit"
      onClick={handleLogin}
      className="px-5 py-[0.4px] bg-white rounded-xs font-medium text-md text-black cursor-pointer hover:bg-gray-500 transition duration-300 ease-in-out shadow-md active:scale-95"
    >
      {session ? "Sign Out" : "Sign In"}
    </button>
  );
};

export default ButtonComp;
