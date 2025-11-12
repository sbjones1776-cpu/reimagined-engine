import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FacePreview from "./FacePreview";

export default function CustomizationSection({
  title,
  options,
  selected,
  onChange,
  isUnlocked,
  unlockableItems = [],
  type = "default",
  previewType = null // "eyes", "mouth", or "face" for SVG previews
}) {
  const getUnlockRequirement = (itemId) => {
    const item = unlockableItems.find(i => i.id === itemId);
    return item?.requirement || "Complete challenges to unlock";
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>
      <div className="grid grid-cols-4 gap-3">
        {options.map((option) => {
          const unlocked = isUnlocked(option.id);
          const isSelected = selected === option.id;

          if (type === "color") {
            return (
              <TooltipProvider key={option.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => unlocked && onChange(option.id)}
                      disabled={!unlocked}
                      className={`relative h-16 rounded-xl border-4 transition-all ${
                        isSelected
                          ? "border-purple-500 shadow-lg scale-110"
                          : "border-gray-200 hover:border-purple-300"
                      } ${!unlocked && "opacity-50 cursor-not-allowed"}`}
                      style={{ backgroundColor: option.color }}
                    >
                      {!unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                          ✓
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{option.label}</p>
                    {!unlocked && (
                      <p className="text-xs text-gray-400">{getUnlockRequirement(option.id)}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return (
            <TooltipProvider key={option.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => unlocked && onChange(option.id)}
                    disabled={!unlocked}
                    className={`relative p-4 rounded-xl border-4 transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50"
                    } ${!unlocked && "opacity-50 cursor-not-allowed"}`}
                  >
                    {previewType ? (
                      <div className="mb-1 flex justify-center">
                        <FacePreview type={previewType} value={option.id} size={48} />
                      </div>
                    ) : (
                      <div className="text-3xl mb-1">{option.emoji}</div>
                    )}
                    <div className="text-xs font-medium text-gray-600 truncate">{option.label}</div>
                    
                    {!unlocked && (
                      <div className="absolute top-2 right-2 bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                      </div>
                    )}
                    
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                        ✓
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{option.label}</p>
                  {!unlocked && (
                    <p className="text-xs text-gray-400">{getUnlockRequirement(option.id)}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}