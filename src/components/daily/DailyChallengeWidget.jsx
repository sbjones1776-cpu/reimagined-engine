import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Flame, CheckCircle, Clock } from "lucide-react";
import { format, startOfDay } from "date-fns";

export default function DailyChallengeWidget() {
  const todayDate = format(startOfDay(new Date()), "yyyy-MM-dd");

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: todaysChallenges = [] } = useQuery({
    queryKey: ['dailyChallenges', todayDate],
    queryFn: () => base44.entities.DailyChallenge.filter({ challenge_date: todayDate }),
    initialData: [],
  });

  const { data: userChallenges = [] } = useQuery({
    queryKey: ['userDailyChallenges'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.DailyChallenge.filter({ created_by: user.email });
    },
    initialData: [],
    enabled: !!user,
  });

  const hasCompletedToday = todaysChallenges.some(c => c.created_by === user?.email);

  // Calculate streak
  const getStreak = () => {
    if (userChallenges.length === 0) return 0;
    
    const sortedChallenges = [...userChallenges].sort((a, b) => 
      new Date(b.challenge_date) - new Date(a.challenge_date)
    );
    
    let streak = 0;
    let currentDate = startOfDay(new Date());
    
    for (const challenge of sortedChallenges) {
      const challengeDate = startOfDay(new Date(challenge.challenge_date));
      const daysDiff = Math.floor((currentDate - challengeDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = getStreak();

  return (
    <Card className="border-4 border-purple-300 shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-6 text-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Daily Challenge</h3>
              <p className="text-sm opacity-90">{format(new Date(), "MMMM d, yyyy")}</p>
            </div>
          </div>
          {hasCompletedToday ? (
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="w-4 h-4 mr-1" />
              Done
            </Badge>
          ) : (
            <Badge className="bg-white text-purple-600 font-bold">
              New!
            </Badge>
          )}
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 w-fit">
            <Flame className="w-5 h-5 text-orange-300" />
            <span className="font-bold">{streak} Day Streak!</span>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        {hasCompletedToday ? (
          <>
            <div className="text-center py-4">
              <div className="text-5xl mb-3">🎉</div>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                Challenge Completed!
              </p>
              <p className="text-gray-600">
                You've earned {todaysChallenges.find(c => c.created_by === user?.email)?.bonus_stars || 0} bonus stars today
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 p-3 rounded-xl text-center">
                <Trophy className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                <div className="font-bold text-lg">{todaysChallenges.find(c => c.created_by === user?.email)?.score}</div>
                <div className="text-xs text-gray-600">Your Score</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl text-center">
                <Clock className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                <div className="font-bold text-lg">{todaysChallenges.find(c => c.created_by === user?.email)?.time_taken}s</div>
                <div className="text-xs text-gray-600">Your Time</div>
              </div>
            </div>

            <Link to={createPageUrl("DailyChallenge")}>
              <Button variant="outline" className="w-full">
                View Leaderboard
              </Button>
            </Link>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Questions</span>
                <span className="font-bold">15 Mixed Problems</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Bonus Rewards</span>
                <span className="font-bold">Up to 3 Stars ⭐</span>
              </div>
              {streak >= 3 && (
                <div className="flex items-center justify-between text-sm bg-orange-50 p-2 rounded-lg">
                  <span className="text-gray-600">Streak Bonus</span>
                  <span className="font-bold text-orange-600">+1 Extra Star 🔥</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Players Today</span>
                <span className="font-bold">{todaysChallenges.length}</span>
              </div>
            </div>

            <Link to={createPageUrl("DailyChallenge")}>
              <Button className="w-full h-12 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg">
                Start Challenge
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}