import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import ClearHeartResultOnNavigate from "@/components/ClearHeartResultOnNavigate";
import BlockPredictIfLimitReached from "@/components/BlockPredictIfLimitReached";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <SessionProvider session={session}>
        <BlockPredictIfLimitReached />
        <ClearHeartResultOnNavigate />
        <Navbar />
        {children}
        <Footer />
      </SessionProvider>
    </>
  );
}
