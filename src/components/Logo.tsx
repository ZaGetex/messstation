"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({ 
  src = "/HAW-Logo.png", // Standard Logo-Pfad
  alt = "HAW Logo",
  width = 60,
  height = 60,
  className = ""
}: LogoProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback-Logo wenn das Bild nicht geladen werden kann
  const fallbackLogo = (
    <div 
      className={`flex items-center justify-center bg-gradient-to-br from-primary-400 to-accent-medium text-white font-bold rounded-lg ${className}`}
      style={{ width, height }}
    >
      <span className="text-sm">HAW</span>
    </div>
  );

  if (imageError) {
    return fallbackLogo;
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-contain rounded-lg"
        onError={() => setImageError(true)}
        priority
        unoptimized={src.endsWith('.jpg')} // Für JPG-Dateien
      />
    </div>
  );
}
