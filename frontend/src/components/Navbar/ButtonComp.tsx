"use client";

import { useCurrentUser } from "@/hooks/user-current-session";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RxAvatar } from "react-icons/rx";
import SpotlightButton from "../SpotlightButton";

const ButtonComp = () => {
  const user = useCurrentUser();
  const router = useRouter();

  const handleLogin = () => {
    router.push(user ? "/dashboard" : "/login");
  };

  const renderUserAvatar = () => (
    <>
      <div className="flex flex-row items-center gap-3">
        <SpotlightButton
          main="Dashboard"
          styleDefault={false}
          customStyles={{
            button:
              "relative w-full max-w-40 overflow-hidden rounded-sm px-4 py-2 text-lg font-medium text-white cursor-pointer bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 backdrop-blur-sm hover:border-pink-400/40 duration-700",
            text: "pointer-events-none relative z-10 mix-blend-difference cursor-pointer flex flex-row items-center text-sm justify-center gap-2 text-pink-500",
            spotlight:
              "pointer-events-none absolute left-[50%] top-[50%] h-10 w-10 -translate-x-[50%] -translate-y-[50%] rounded-full bg-fuchsia-800/10",
          }}
          href="/dashboard"
        />
        <Avatar className="cursor-pointer" onClick={handleLogin}>
          {user?.image ? (
            <AvatarImage
              src={user.image}
              alt="User Avatar"
              referrerPolicy="no-referrer"
            />
          ) : (
            <AvatarFallback className="px-5 py-[0.4px] bg-white rounded-xs font-medium text-md text-black hover:bg-gray-500 transition duration-300 ease-in-out shadow-md active:scale-95">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
    </>
  );

  const renderSignInButton = () => (
    <button
      className="flex items-center gap-2 text-white transition duration-300 cursor-pointer"
      onClick={handleLogin}
    >
      <RxAvatar size={20} />
      <span className="font-medium">Sign In</span>
    </button>
  );

  return <>{user ? renderUserAvatar() : renderSignInButton()}</>;
};

export default ButtonComp;
