import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ChevronRight } from "lucide-react";
import AvatarDisplay from "../avatar/AvatarDisplay";

export default function ChildSelector({ myChildren, selectedChildEmail, onSelectChild, currentUserEmail }) {
  return (
    <Card className="border-2 border-purple-200 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-purple-500" />
          Select Child
        </h2>
        {myChildren.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-600">No children linked to your account yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Children can link their account to yours in their settings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myChildren.map((child) => {
              const isSelected = child.email === selectedChildEmail;
              const avatarData = {
                avatar_skin_tone: child.avatar_skin_tone || "medium",
                avatar_hair_style: child.avatar_hair_style || "short",
                avatar_hair_color: child.avatar_hair_color || "brown",
                avatar_eyes: child.avatar_eyes || "normal",
                avatar_outfit: child.avatar_outfit || "casual",
                avatar_accessory: child.avatar_accessory || "none",
              };

              return (
                <button
                  key={child.email}
                  onClick={() => onSelectChild(child.email)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    isSelected
                      ? "border-purple-500 bg-purple-50 shadow-lg scale-105"
                      : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <AvatarDisplay avatarData={avatarData} size="medium" />
                  </div>
                  <h3 className="font-bold text-lg truncate">
                    {child.child_name || child.full_name || child.email.split("@")[0]}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{child.email}</p>
                  {isSelected && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-purple-600 text-sm font-medium">
                      Selected <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}