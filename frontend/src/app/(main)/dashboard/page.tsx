import { auth, signOut } from "@/auth";
import React from "react";

const Page = async () => {
  const session = await auth();
  return (
    <div className="text-white">
      {JSON.stringify(session, null, 2)}
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit" className="cursor-pointer">
          Sign Out
        </button>
      </form>
    </div>
  );
};

export default Page;
