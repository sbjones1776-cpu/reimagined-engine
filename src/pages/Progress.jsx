
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery, useIsFetching } from "@tanstack/react-query";
import { 
  getUserGameProgress, 
  getUserDailyChallenges,
  getUserTutorSessions,
  subscribeUserGameProgress
} from "@/api/firebaseService";
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Target, Clock, Award, TrendingUp, ShoppingBag, Gift, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AchievementBadges from "../components/progress/AchievementBadges";
import PerformanceChart from "../components/progress/PerformanceChart";
import RecentGames from "../components/progress/RecentGames";
import Logo from "@/components/Logo";



import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserGameProgress } from "@/api/firebaseService";
import { useFirebaseUser } from '@/hooks/useFirebaseUser';

export default function Progress() {
  const { user } = useFirebaseUser();
  const { data: progress = [], isLoading } = useQuery({
    queryKey: ['gameProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await getUserGameProgress(user.email);
    },
    initialData: [],
    enabled: !!user?.email,
  });

  // Defensive: filter and sanitize
  const safeProgress = Array.isArray(progress)
    ? progress.map((g, i) => {
        const safe = { ...g };
        // Defensive date
        ["created_date", "completed_at"].forEach((field) => {
          let val = safe[field];
          if (val && typeof val === "object" && typeof val.toDate === "function") val = val.toDate();
          if (!val || isNaN(new Date(val).getTime())) safe[field] = null;
          else safe[field] = val;
        });
        // Defensive numbers
        ["score", "correct_answers", "total_questions", "time_taken", "stars_earned"].forEach((field) => {
          if (typeof safe[field] !== "number" || isNaN(safe[field])) safe[field] = 0;
        });
        // Defensive strings
        ["operation", "level"].forEach((field) => {
          if (typeof safe[field] !== "string") safe[field] = "";
        });
        return safe;
      })
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  // Basic stats
  const totalGames = safeProgress.length;
  const totalStars = safeProgress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
  const totalScore = safeProgress.reduce((sum, p) => sum + (p.score || 0), 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Progress</h1>
      <div className="flex justify-around mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold">{totalGames}</div>
          <div className="text-gray-600">Games Played</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{totalStars}</div>
          <div className="text-gray-600">Stars Earned</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{totalScore}</div>
          <div className="text-gray-600">Total Score</div>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Game History</h2>
      <div className="bg-white rounded-lg shadow divide-y">
        {safeProgress.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No games played yet.</div>
        ) : (
          safeProgress.slice(0, 20).map((game, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-bold capitalize">{game.operation || "-"}</div>
                <div className="text-xs text-gray-500">{game.level || "-"}</div>
              </div>
              <div className="text-sm text-gray-700">{game.score} pts</div>
              <div className="text-sm text-yellow-600">{game.stars_earned} ⭐</div>
              <div className="text-xs text-gray-400">
                {(() => {
                  // Defensive: Only try to create a date if value is string/number/object
                  const val = game.created_date;
                  if (!val) return "-";
                  let dateObj = val;
                  if (typeof dateObj === "object" && typeof dateObj.toDate === "function") {
                    dateObj = dateObj.toDate();
                  }
                  // If it's a string or number, try to convert
                  if (
                    typeof dateObj === "string" ||
                    typeof dateObj === "number" ||
                    Object.prototype.toString.call(dateObj) === "[object Date]"
                  ) {
                    const d = new Date(dateObj);
                    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
                  }
                  return "-";
                })()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
                        <span className="font-medium">{item.name}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={createPageUrl("Shop")}>
                    <Button variant="outline" className="w-full border-green-400 text-green-700 hover:bg-green-100" aria-label="Claim Rewards">
                      <span className="sr-only">Claim Rewards</span>
                      Claim Rewards
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* AI Tutor Stats */}
          {tutorSessions.length > 0 && (
            <Card className="mb-8 border-4 border-blue-300 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-t-xl">
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-blue-800">
                  <Brain className="w-7 h-7 text-blue-600" />
                  AI Tutor Learning Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-xl text-center border-2 border-blue-200 shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">
                      {tutorSessions.length}
                    </div>
                    <div className="text-sm text-gray-600">Tutoring Sessions</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center border-2 border-purple-200 shadow-sm">
                    <div className="text-3xl font-bold text-purple-600">
                      {tutorSessions.filter(s => s.hint_requested).length}
                    </div>
                    <div className="text-sm text-gray-600">Hints Received</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center border-2 border-green-200 shadow-sm">
                    <div className="text-3xl font-bold text-green-600">
                      {tutorSessions.filter(s => s.explanation_viewed).length}
                    </div>
                    <div className="text-sm text-gray-600">Explanations Viewed</div>
                  </div>
                </div>

                {commonMistakes.length > 0 && (
                  <div className="bg-white p-4 rounded-xl border-2 border-orange-200 shadow-sm">
                    <h4 className="font-bold mb-3 flex items-center gap-2 text-lg text-orange-700">
                      <Target className="w-5 h-5 text-orange-600" />
                      Practice These Topics
                    </h4>
                    <div className="space-y-2">
                      {commonMistakes.map((mistake, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="capitalize font-medium text-gray-700">
                            {mistake.operation} ({mistake.level})
                          </span>
                          <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                            {mistake.count} times needed help
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Star className="w-8 h-8 fill-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{getTotalStars()}</div>
                <p className="text-sm text-white/90">Game Stars</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
              <CardHeader className="pb-2">
                <Trophy className="w-8 h-8" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{getTotalScore()}</div>
                <p className="text-sm text-white/90">Total Score</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
              <CardHeader className="pb-2">
                <Target className="w-8 h-8" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{getAverageAccuracy()}%</div>
                <p className="text-sm text-white/90">Accuracy</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
              <CardHeader className="pb-2">
                <Clock className="w-8 h-8" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{Math.floor(getTotalTime() / 60)}m</div>
                <p className="text-sm text-white/90">Time Played</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-0">
              <CardHeader className="pb-2">
                <TrendingUp className="w-8 h-8" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{getGamesPlayed()}</div>
                <p className="text-sm text-white/90">Games Played</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <AchievementBadges progress={progress} />

          {/* Performance Chart */}
          <PerformanceChart progress={progress} />

          {/* Recent Games */}
          <RecentGames progress={progress} />
        </>
      )}
    </div>
  );
}

