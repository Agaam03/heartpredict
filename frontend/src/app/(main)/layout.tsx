import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import ClearHeartResultOnNavigate from "@/components/ClearHeartResultOnNavigate";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <SessionProvider session={session}>
        <ClearHeartResultOnNavigate />
        <Navbar />
        {children}
        <Footer />
      </SessionProvider>
    </>
  );
}
