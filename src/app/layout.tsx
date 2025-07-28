import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthButton } from "@/components/AuthButton";
import TRPCProvider from "@/components/TRPCProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube Title Generator - Create Viral Video Titles",
  description: "Generate 5 high-converting YouTube title variations using proven viral formulas and psychological triggers to maximize click-through rates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header with Auth */}
            <header className="w-full px-6 py-4">
              <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div className="text-white font-semibold text-lg">
                  YT Studio
                </div>
                <AuthButton />
              </div>
            </header>
            
            {/* Main Content */}
            <main className="px-6 py-8">
              {children}
            </main>
          </div>
        </TRPCProvider>
      </body>
    </html>
  );
}
