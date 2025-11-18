
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
        {/* ...more cards... */}
      </div>
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
    </div>
  );
}

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
               {/* Explicitly close the conditional block here */}
               )}
              </CardContent>
            </Card>
            {/* --- End conditional block. The stats grid and following content are now outside. --- */}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          )}

          {/* Stats Grid and following content are now outside the conditional */}
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
      )}
    </div>
  );
}

