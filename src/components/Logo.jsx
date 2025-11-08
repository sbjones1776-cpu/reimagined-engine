import React from "react";

/**
 * Reusable app logo component.
 * Props:
 *  - size: "xs" | "sm" | "md" | "lg" | "xl" (default: md)
 *  - variant: "circle" | "plain" (default: circle)
 *  - className: extra classes merged onto wrapper
 */
export default function Logo({ size = "md", variant = "circle", className = "" }) {
  const sizes = {
    xs: { wrapper: "w-6 h-6", img: "w-5 h-5" },
    sm: { wrapper: "w-8 h-8", img: "w-6 h-6" },
    md: { wrapper: "w-12 h-12", img: "w-10 h-10" },
    lg: { wrapper: "w-20 h-20", img: "w-16 h-16" },
    xl: { wrapper: "w-32 h-32", img: "w-24 h-24" },
  };
  const s = sizes[size] || sizes.md;

  const circleClasses = "bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-lg overflow-hidden flex items-center justify-center";

  return (
    <div className={`${variant === "circle" ? circleClasses : ""} ${s.wrapper} ${className}`.trim()}>
      <img
        src="/icons/New Logo.png"
        alt="App icon"
        className={`${s.img} object-contain ${variant === "circle" ? "transform -rotate-12" : ""}`}
        loading="lazy"
      />
    </div>
  );
}
