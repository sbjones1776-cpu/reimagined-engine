import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Clock, Calendar, Target } from "lucide-react";
import { safeFormatDate } from "@/utils/utils";

export default function ProgressTimeline({ childProgress, childDailyChallenges }) {
  // Combine and sort all activities
  const allActivities = [
    ...childProgress.map(p => ({ ...p, type: "game" })),
    ...childDailyChallenges.map(c => ({ ...c, type: "daily" }))
  ].sort((a, b) => {
    // Defensive: handle missing/invalid dates
    const dateA = a.created_date ? new Date(a.created_date) : null;
    const dateB = b.created_date ? new Date(b.created_date) : null;
    const timeA = dateA && !isNaN(dateA.getTime()) ? dateA.getTime() : 0;
    const timeB = dateB && !isNaN(dateB.getTime()) ? dateB.getTime() : 0;
    return timeB - timeA;
  });

  const recentActivities = allActivities.slice(0, 20);

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

  if (recentActivities.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-xl text-gray-600">No activity recorded yet</p>
        <p className="text-gray-500 mt-2">Activities will appear here as the child plays</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Calendar className="w-6 h-6 text-purple-500" />
        Recent Activity Timeline
      </h3>

      <div className="space-y-3">
        {recentActivities.map((activity, index) => {
          const accuracy = Math.round((activity.correct_answers / activity.total_questions) * 100);
          
          return (
            <Card key={index} className="border-2 border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      {activity.type === "daily" ? (
                        <Calendar className="w-6 h-6 text-purple-600" />
                      ) : (
                        <span className="text-2xl">{operationEmojis[activity.operation]}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {activity.type === "daily" ? (
                          <h4 className="font-bold text-lg">Daily Challenge</h4>
                        ) : (
                          <>
                            <h4 className="font-bold text-lg capitalize">{activity.operation}</h4>
                            <Badge className={levelColors[activity.level] + " text-white"}>
                              {activity.level}
                            </Badge>
                          </>
                        )}
                        <span className="text-sm text-gray-500">
                          {safeFormatDate(activity.created_date)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">{activity.score} pts</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-500" />
                          <span className="font-medium">
                            {activity.correct_answers}/{activity.total_questions} ({accuracy}%)
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{activity.time_taken}s</span>
                        </div>

                        {activity.stars_earned !== undefined && (
                          <div className="flex items-center gap-1">
                            {[...Array(3)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < activity.stars_earned
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {activity.bonus_stars !== undefined && activity.bonus_stars > 0 && (
                          <div className="flex items-center gap-1">
                            <Badge className="bg-yellow-500 text-white">
                              +{activity.bonus_stars} Bonus ⭐
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}