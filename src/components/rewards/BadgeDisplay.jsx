import React from "react";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

export default function BadgeDisplay({ badge, size = "medium" }) {
  if (!badge) return null;

  const sizes = {
    small: "w-8 h-8 text-lg",
    medium: "w-12 h-12 text-2xl",
    large: "w-20 h-20 text-4xl",
  };

  const sizeClass = sizes[size] || sizes.medium;

  return (
    <div className="relative inline-block">
      <div className={`${sizeClass} rounded-full bg-gradient-to-br ${badge.gradient} flex items-center justify-center shadow-lg border-2 border-white`}>
        <span>{badge.emoji}</span>
      </div>
      {size !== "small" && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <Badge variant="outline" className="text-xs bg-white">
            {badge.name}
          </Badge>
        </div>
      )}
    </div>
  );
}