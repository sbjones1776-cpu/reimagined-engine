import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Clock, Target } from "lucide-react";

export default function Leaderboard({ todaysChallenges, currentUser }) {
  // Sort by score (desc), then by time (asc)
  const sortedChallenges = [...todaysChallenges].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time_taken - b.time_taken;
  });

  const topChallenges = sortedChallenges.slice(0, 10);
  const currentUserRank = sortedChallenges.findIndex(c => c.created_by === currentUser?.email) + 1;

  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-500">#{rank}</span>;
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return "from-yellow-100 to-yellow-200 border-yellow-300";
    if (rank === 2) return "from-gray-100 to-gray-200 border-gray-300";
    if (rank === 3) return "from-amber-100 to-amber-200 border-amber-300";
    return "from-white to-gray-50 border-gray-200";
  };

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
        <CardTitle className="flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-600" />
          Today's Leaderboard
          {currentUserRank > 0 && (
            <Badge variant="outline" className="ml-auto bg-white">
              You're #{currentUserRank}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {topChallenges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Be the first to complete today's challenge!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topChallenges.map((challenge, index) => {
              const rank = index + 1;
              const isCurrentUser = challenge.created_by === currentUser?.email;
              const accuracy = Math.round((challenge.correct_answers / challenge.total_questions) * 100);

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    isCurrentUser 
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 shadow-md" 
                      : `bg-gradient-to-r ${getMedalColor(rank)} border`
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {getMedalIcon(rank)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {isCurrentUser ? "You" : challenge.created_by?.split("@")[0] || "Player"}
                        </span>
                        {isCurrentUser && (
                          <Badge className="bg-purple-500 text-white">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          {challenge.score} pts
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {accuracy}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {challenge.time_taken}s
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {challenge.bonus_stars > 0 && (
                    <Badge className="bg-yellow-500 text-white">
                      +{challenge.bonus_stars} ⭐
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}