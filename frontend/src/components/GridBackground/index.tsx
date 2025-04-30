import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface GridBackgroundProps {
  children: ReactNode;
}

export function GridBackground({ children }: GridBackgroundProps) {
  return (
    <div className="relative flex h-[50rem] bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      {/* Konten tidak lagi dipusatkan */}
      <section className="w-full max-w-7xl mx-auto px-6 z-10">
        {children}
      </section>
    </div>
  );
}
