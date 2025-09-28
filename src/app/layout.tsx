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
        <ThemeProvider>
          {/* Stationäres Logo - bleibt beim Scrollen immer sichtbar */}

          <ThemeToggle />

          <main className="flex flex-col items-center w-full min-h-screen p-4 bg-gradient-to-br from-background-light via-accent-light to-primary-50 dark:from-background-dark dark:via-primary-600 dark:to-primary-700 sm:p-6 md:p-10">
            {/* Header mit Datum und Logo */}
            <div className="relative w-full flex items-start justify-center mb-4">
              {/* Logo mittig */}
              <div className="absolute left-1/2 -translate-x-1/2">
                <Logo width={300} height={300} />
              </div>
              {/* Datum oben rechts */}
              <div className="absolute right-0">
                {" "}
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
