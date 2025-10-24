import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import Logo from "@/components/Logo";
import DateTime from "@/components/DateTime";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barkasse Messstation Dashboard",
  description: "Live-Messwerte deiner Station auf einen Blick",
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
        {/** <body
  className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-[#2c1e68] via-[#1a4c9c] to-[#2aa4d8] min-h-screen`}*/}
        <ThemeProvider>
          {/* Stationäres Logo - bleibt beim Scrollen immer sichtbar */}

          <ThemeToggle />
          {/* <main className="flex flex-col items-center w-full min-h-screen p-4 bg-gradient-to-b from-[#2c1e68] via-[#1a4c9c] to-[#2aa4d8] sm:p-6 md:p-10">*/}
          <main className="flex flex-col items-center w-full min-h-screen p-4 bg-gradient-to-br from-background-light via-accent-light to-primary-50 dark:from-background-dark dark:via-primary-600 dark:to-primary-700 sm:p-6 md:p-10">
            {/* Header mit Datum und Logo */}
            <div className="relative w-full mb-[-60px]">
              {/* Logo - centered above content on mobile, absolute on desktop */}
              <div className="flex justify-center sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-0">
                <div className="flex items-center justify-center gap-4">
                  <Logo
                    width={300}
                    height={300}
                    className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]"
                  />
                  <div
                    className="w-px bg-gray-400 dark:bg-gray-600 self-center mt-[-180px]"
                    style={{ height: "100px" }}
                  ></div>
                  <Logo
                    width={300}
                    height={300}
                    className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]"
                  />
                </div>
              </div>
              {/* Datum oben rechts */}
              <div className="flex justify-end">
                {/* TODO: Messtation Datum und Uhrzeit anzeigen*/}
                <DateTime />
              </div>
            </div>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
