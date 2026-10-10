"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Activity } from "lucide-react"; // Default fallback icon

interface SpecialtyIconProps {
  src: string | null;
  alt: string;
  className?: string;
}

export default function SpecialtyIcon({ src, alt, className }: SpecialtyIconProps) {
  const [hasError, setHasError] = useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    // If the image failed to load before React hydrated the event listeners
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight === 0) {
      setHasError(true);
    }
  }, [src]);

  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-lg ${className}`}>
        <Activity className="w-1/2 h-1/2 opacity-50" />
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
