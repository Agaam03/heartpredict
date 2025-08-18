/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL, // ganti dengan domain kamu
  generateRobotsTxt: true, // otomatis bikin robots.txt
  sitemapSize: 5000, // default batas url per file
  changefreq: "daily", // optional, frekuensi update
  priority: 0.7, // optional, prioritas default
};
