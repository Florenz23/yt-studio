import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthButton } from "@/components/AuthButton";
import { TRPCProvider } from "@/components/TRPCProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TRPCProvider>
            <div className="min-h-screen bg-background">
              {/* Header with Auth */}
              <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                  <div className="text-foreground font-semibold text-lg">
                    YT Studio
                  </div>
                  <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    <AuthButton />
                  </div>
                </div>
              </header>
              
              {/* Main Content */}
              <main className="px-6 py-8">
                <div className="max-w-6xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
