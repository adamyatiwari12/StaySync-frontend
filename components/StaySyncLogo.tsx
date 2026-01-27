"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function StaySyncLogo({
  size = "default",
}: {
  size?: "small" | "default" | "large";
}) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dimensions = {
    small: 64,
    default: 96,
    large: 128,
  };

  const dim = dimensions[size];

  // Prevent hydration mismatch
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient id="staySyncGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* Shield */}
      <path
        d="M256 32C170 32 96 64 96 64v160c0 144 160 224 160 224s160-80 160-224V64s-74-32-160-32Z"
        stroke="url(#staySyncGradient)"
        strokeWidth="20"
        strokeLinejoin="round"
      />

      {/* House */}
      <path
        d="M176 248V184L256 128L336 184V248"
        stroke="url(#staySyncGradient)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Link icon */}
      <path
        d="M228 248h-20a36 36 0 0 1 0-72h20"
        stroke="url(#staySyncGradient)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M284 248h20a36 36 0 0 0 0-72h-20"
        stroke="url(#staySyncGradient)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M232 212h48"
        stroke="url(#staySyncGradient)"
        strokeWidth="16"
        strokeLinecap="round"
      />
    </svg>
  );
}
