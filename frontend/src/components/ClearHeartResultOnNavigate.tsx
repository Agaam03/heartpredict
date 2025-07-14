"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { predictRoutes } from "@/routes";

const ClearHeartResultOnNavigate = () => {
  const pathname = usePathname();

  useEffect(() => {
    const isPredictRoute = predictRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isPredictRoute) {
      localStorage.removeItem("heartResult");
      localStorage.removeItem("heartAnswers");
    }
  }, [pathname]);

  return null;
};
export default ClearHeartResultOnNavigate;
