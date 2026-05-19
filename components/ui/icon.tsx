"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

interface IconProps {
  icon: IconProp;
  className?: string;
  size?: "xs" | "sm" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

export default function Icon({ icon, className = "", size }: IconProps) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      size={size === "xs" ? "xs" :
        size === "sm" ? "sm" :
        size === "lg" ? "lg" :
        size === "xl" ? "xl" :
        size === "2xl" ? "2x" :
        size === "3xl" ? "3x" :
        size === "4xl" ? "4x" :
        size === "5xl" ? "5x" :
        undefined}
    />
  );
}
