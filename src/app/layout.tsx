import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TRIJON",
  description: "Explore the awesome collection of t-shirts, Shirts, Trackpants, Jogger and more from TRIJON.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-screen min-h-screen flex flex-col overflow-x-hidden justify-between`}>
        <TopNav/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
