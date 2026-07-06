import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SurfaceCheck — Automated Attack Surface Analyzer",
  description:
    "Check your website for security vulnerabilities. Get plain-English explanations and step-by-step developer fixes in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark bg-[#030508] text-[#eef2ff]`}
    >
      <body className="min-h-full flex flex-col bg-[#030508] text-[#eef2ff] selection:bg-cyan-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
