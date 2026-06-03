import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SupplyChain Shield India | Greener Logistics",
  description:
    "AI-powered platform matching empty return trucks with cargo shipments across India. Reduce emissions, increase profits.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<html lang="en" className="dark">
      <body className={`${dmSans.variable} font-sans`}>{children}</body>
    </html>
  );
}
