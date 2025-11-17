import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Target } from "lucide-react";
import { safeFormatDate } from "@/utils/utils";

export default function RecentGames({ progress }) {
  const recentGames = progress.slice(0, 10);

  const operationEmojis = {
    addition: "➕",
    subtraction: "➖",
    multiplication: "✖️",
    division: "➗",
  };

  const levelColors = {
    easy: "bg-green-500",
    medium: "bg-yellow-500",
    hard: "bg-red-500",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-500" />
          Recent Games
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentGames.map((game, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">
                  {operationEmojis[game.operation]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold capitalize">{game.operation}</span>
                    <Badge className={levelColors[game.level] + " text-white"}>
                      {game.level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {game.correct_answers}/{game.total_questions}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {game.time_taken}s
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= game.stars_earned
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {safeFormatDate(game.created_date || game.completed_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}