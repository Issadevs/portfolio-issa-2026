"use client";

import Image from "next/image";
import { useState } from "react";
import { brands, type BrandKey } from "@/lib/branding";

interface BrandLogoProps {
  brand: BrandKey;
  size?: number;
  dark?: boolean;
  showLabel?: boolean;
  className?: string;
}

export default function BrandLogo({
  brand,
  size = 32,
  dark = false,
  showLabel = false,
  className,
}: BrandLogoProps) {
  const [error, setError] = useState(false);
  const config = brands[brand];
  const src = dark && config.darkLogoSrc ? config.darkLogoSrc : config.logoSrc;

  const logo = error ? (
    <span
      className={`inline-flex items-center justify-center rounded text-white font-bold flex-shrink-0 ${config.fallbackBg}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {config.initials}
    </span>
  ) : (
    <Image
      src={src}
      alt={config.name}
      width={size}
      height={size}
      className="object-contain flex-shrink-0"
      onError={() => setError(true)}
    />
  );

  if (!showLabel) {
    return <span className={className}>{logo}</span>;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      {logo}
      <span className="font-medium leading-none">{config.name}</span>
    </span>
  );
}
