import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

export default function PetDisplay({ pet, experience, size = "medium" }) {
  if (!pet) return null;

  const sizes = {
    small: "w-16 h-16 text-3xl",
    medium: "w-24 h-24 text-5xl",
    large: "w-32 h-32 text-7xl",
  };

  const sizeClass = sizes[size] || sizes.medium;

  // Calculate level and progress
  const exp = experience || 0;
  const level = Math.floor(exp / 100) + 1;
  const expToNextLevel = 100;
  const currentExp = exp % 100;
  const progress = (currentExp / expToNextLevel) * 100;

  return (
    <div className="relative">
      <div className={`${sizeClass} rounded-2xl bg-gradient-to-br ${pet.gradient} flex items-center justify-center shadow-lg border-4 border-white relative overflow-hidden`}>
        <div className="text-center">
          <div>{pet.emoji}</div>
        </div>
        
        {/* Level badge */}
        <Badge className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1">
          Lv.{level}
        </Badge>

        {/* Evolution sparkles */}
        {level >= pet.evolveLevel && !pet.isEvolved && (
          <div className="absolute inset-0 flex items-center justify-center bg-yellow-400/20">
            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
          </div>
        )}
      </div>

      {size !== "small" && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{pet.name}</span>
            <span>{currentExp}/{expToNextLevel} XP</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
}