import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Zap, Target, Trophy, Star, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AchievementBadges({ progress }) {
  const achievements = [
    {
      id: "first_game",
      name: "First Steps",
      description: "Complete your first game",
      icon: Star,
      color: "from-blue-400 to-blue-600",
      unlocked: progress.length >= 1,
    },
    {
      id: "ten_games",
      name: "Practice Makes Perfect",
      description: "Play 10 games",
      icon: Zap,
      color: "from-yellow-400 to-orange-600",
      unlocked: progress.length >= 10,
    },
    {
      id: "perfect_score",
      name: "Perfect Score",
      description: "Get 100% on any level",
      icon: Trophy,
      color: "from-purple-400 to-pink-600",
      unlocked: progress.some(p => {
        if (typeof p.correct_answers !== 'number' || typeof p.total_questions !== 'number' || p.total_questions === 0) return false;
        return (p.correct_answers / p.total_questions) === 1;
      }),
    },
    {
      id: "three_stars",
      name: "Star Collector",
      description: "Earn 3 stars in a game",
      icon: Star,
      color: "from-yellow-400 to-yellow-600",
      unlocked: progress.some(p => p.stars_earned === 3),
    },
    {
      id: "speed_demon",
      name: "Speed Demon",
      description: "Complete a game in under 60 seconds",
      icon: Flame,
      color: "from-red-400 to-orange-600",
      unlocked: progress.some(p => p.time_taken < 60),
    },
    {
      id: "master",
      name: "Math Master",
      description: "Complete all operations on hard",
      icon: Award,
      color: "from-indigo-400 to-purple-600",
      unlocked: ["addition", "subtraction", "multiplication", "division"].every(op =>
        progress.some(p => {
          if (typeof p.stars_earned !== 'number' || typeof p.operation !== 'string' || typeof p.level !== 'string') return false;
          return p.operation === op && p.level === "hard" && p.stars_earned >= 2;
        })
      ),
    },
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`text-center p-4 rounded-xl border-2 transition-all ${
                  achievement.unlocked
                    ? "bg-gradient-to-br " + achievement.color + " text-white border-transparent shadow-lg"
                    : "bg-gray-100 border-gray-200 opacity-50"
                }`}
              >
                <Icon className={`w-12 h-12 mx-auto mb-2 ${achievement.unlocked ? "" : "text-gray-400"}`} />
                <h4 className="font-bold text-sm mb-1">{achievement.name}</h4>
                <p className={`text-xs ${achievement.unlocked ? "text-white/90" : "text-gray-500"}`}>
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}