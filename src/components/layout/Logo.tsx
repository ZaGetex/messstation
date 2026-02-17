/**
 * Logo component for displaying HAW and Barkasse logos
 */

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

/**
 * Main HAW logo component with fallback
 */
export default function Logo({
  src = "/HAW-Logo.png",
  alt = "HAW Logo",
  width = 60,
  height = 60,
  className = "",
}: LogoProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback logo when image cannot be loaded
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
        unoptimized={true}
      />
    </div>
  );
}

/**
 * Secondary Barkasse logo component with fallback
 */
export function Logo2({
  src = "/Barkasse-Logo-alt.png",
  alt = "Barkasse Logo",
  width = 60,
  height = 60,
  className = "",
}: LogoProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback logo when image cannot be loaded
  const fallbackLogo = (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-accent-dark to-primary-300 text-white font-bold rounded-lg ${className}`}
      style={{ width, height }}
    >
      <span className="text-sm">Barkasse</span>
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
        unoptimized={true}
      />
    </div>
  );
}

