
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


// Utility to sanitize a single game object
function sanitizeGame(game) {
  // Defensive: ensure all expected fields are present and valid
  const safe = { ...game };
  // Dates: created_date, completed_at
  ["created_date", "completed_at"].forEach((field) => {
    let val = safe[field];
    if (val && typeof val === "object" && typeof val.toDate === "function") {
      val = val.toDate();
    }
    if (val && isNaN(new Date(val).getTime())) {
      safe[field] = null;
    } else {
      safe[field] = val;
    }
  });
  // Numbers: score, correct_answers, total_questions, time_taken, stars_earned
  ["score", "correct_answers", "total_questions", "time_taken", "stars_earned"].forEach((field) => {
    if (typeof safe[field] !== "number" || isNaN(safe[field])) {
      safe[field] = 0;
    }
  });
  // Strings: operation, level
  ["operation", "level"].forEach((field) => {
    if (typeof safe[field] !== "string") {
      safe[field] = "";
    }
  });
  return safe;
}

export default function Progress() {
  const { user } = useFirebaseUser();

  // Local state for realtime progress (will be kept in sync with query for initial load)
  const [realtimeProgress, setRealtimeProgress] = React.useState([]);

  const { data: initialProgress = [], isLoading } = useQuery({
    queryKey: ['gameProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await getUserGameProgress(user.email);
    },
    initialData: [],
    enabled: !!user?.email,
    onSuccess: (data) => {
      // Seed realtime state if empty
      if (!realtimeProgress.length) setRealtimeProgress(data);
    }
  });

  // Subscribe to realtime updates
  React.useEffect(() => {
    if (!user?.email) return;
    const unsubscribe = subscribeUserGameProgress(user.email, (data) => {
      setRealtimeProgress(data);
    });
    return () => unsubscribe();
  }, [user?.email]);

  // Sanitize progress data before using in UI
  const rawProgress = realtimeProgress.length ? realtimeProgress : initialProgress;
  const progress = Array.isArray(rawProgress) ? rawProgress.map(sanitizeGame) : [];

  const { data: dailyChallenges = [] } = useQuery({
    queryKey: ['userDailyChallenges', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await getUserDailyChallenges(user.email);
    },
    initialData: [],
    enabled: !!user?.email,
  });

  const { data: tutorSessions = [] } = useQuery({
    queryKey: ['tutorSessions', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await getUserTutorSessions(user.email);
    },
    initialData: [],
    enabled: !!user?.email,
  });

  const getTotalStars = () => {
    return progress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
  };

  const getDailyChallengeStars = () => {
    return dailyChallenges.reduce((sum, c) => sum + (c.bonus_stars || 0), 0);
  };

  const getTotalScore = () => {
    return progress.reduce((sum, p) => sum + (p.score || 0), 0);
  };

  const getAverageAccuracy = () => {
    if (progress.length === 0) return 0;
    const totalAccuracy = progress.reduce((sum, p) => {
      return sum + ((p.correct_answers / p.total_questions) * 100);
    }, 0);
    return Math.round(totalAccuracy / progress.length);
  };

  const getTotalTime = () => {
    return progress.reduce((sum, p) => sum + (p.time_taken || 0), 0);
  };

  const getGamesPlayed = () => {
    return progress.length;
  };

  const totalStarsEarned = getTotalStars() + getDailyChallengeStars();
  const availableStars = totalStarsEarned - (user?.stars_spent || 0);

  // Check for newly unlockable items
  const checkUnlockableItems = () => {
    const gamesPlayed = getGamesPlayed();
    const hasThreeStars = progress.some(p => p.stars_earned === 3);
    const hasPerfectScore = progress.some(p => (p.correct_answers / p.total_questions) === 1);
    const hasCompletedHard = progress.some(p => p.level === "hard" && p.stars_earned >= 2);
    const dailyStreak = dailyChallenges.length; // Simplified

    const unlockables = [];
    
    if (gamesPlayed >= 5) unlockables.push({ name: "Curly Hair", emoji: "🦱" });
    if (gamesPlayed >= 7) unlockables.push({ name: "Hat", emoji: "🎩" });
    if (gamesPlayed >= 10) unlockables.push({ name: "Sporty Outfit", emoji: "⚽" });
    if (totalStarsEarned >= 10) unlockables.push({ name: "Spiky Hair", emoji: "⚡" });
    if (hasThreeStars) unlockables.push({ name: "Cool Eyes", emoji: "😎" });
    if (hasPerfectScore) unlockables.push({ name: "Heart Eyes & Pirate Outfit", emoji: "😍🏴‍☠️" });
    if (hasCompletedHard) unlockables.push({ name: "Purple Hair, Superhero Outfit & Cape", emoji: "🦸" });
    if (dailyStreak >= 7) unlockables.push({ name: "Artist Outfit", emoji: "🎨" });

    return unlockables.slice(0, 3); // Show top 3
  };

  const newUnlockables = checkUnlockableItems();

  // Indicate when progress is updating/refetching
  const isFetchingProgress = useIsFetching({ queryKey: ['gameProgress', user?.email] }) > 0;

  const getCommonMistakes = () => {
    const mistakes = {};
    tutorSessions.forEach(session => {
      const key = `${session.operation}-${session.level}`;
      if (!mistakes[key]) {
        mistakes[key] = {
          operation: session.operation,
          level: session.level,
          count: 0,
        };
      }
      mistakes[key].count++;
    });

    return Object.values(mistakes)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

  const commonMistakes = getCommonMistakes();

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Live updating indicator */}
      {isFetchingProgress && (
        <div className="fixed top-20 right-4 z-40">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-2 rounded-full shadow border">
            <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full" />
            <span className="text-sm text-gray-700">Updating…</span>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Your Progress
        </h1>
        <p className="text-xl text-gray-600">Keep up the great work! 🎉</p>
      </div>

      {progress.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex justify-center mb-4">
              <Logo size="lg" variant="circle" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No games played yet!</h3>
            <p className="text-gray-600">Start playing to see your progress here.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stars and Shop CTA */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-2 border-4 border-yellow-300 shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-8 h-8 text-white fill-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-800">{availableStars} Stars Available</h3>
                      <p className="text-sm text-gray-600">
                        {totalStarsEarned} total earned • {user?.stars_spent || 0} spent
                      </p>
                    </div>
                  </div>
                  <Link to={createPageUrl("Shop")}>
                    <Button className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" aria-label="Visit Shop">
                      <ShoppingBag className="w-5 h-5 mr-2" aria-hidden="true" />
                      <span className="sr-only">Visit Shop</span>
                      Visit Shop
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {newUnlockables.length > 0 && (
              <Card className="border-4 border-green-300 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Gift className="w-6 h-6 text-green-600" />
                    <h3 className="font-bold text-lg text-green-800">New Rewards!</h3>
                  </div>
                  <div className="space-y-2 mb-3">
                    {newUnlockables.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-xl">{item.emoji}</span>
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

