import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  // Baca sitemap utama hasil generate next-sitemap
  const filePath = path.join(process.cwd(), "public", "sitemap.xml");
  const sitemap = fs.readFileSync(filePath, "utf8");

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
