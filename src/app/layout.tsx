// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import Shell from "@/components/Shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Telegraphic Summary",
    template: "%s · Telegraphic Summary",
  },
  description:
    "Interpret a research data table with the telegraphic summary method of Bautista and Bondad (1997): summarize each row, group the rows, then write.",
  metadataBase: new URL("https://telsum.stimmie.dev"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} antialiased`}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
