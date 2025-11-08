import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Firebase migration
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app as firebaseApp } from "@/firebaseConfig"; // TODO: Ensure firebaseConfig.js is set up
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Coins, CheckCircle, Lock, Calendar, Sparkles } from "lucide-react";
import { format, startOfDay, differenceInDays } from "date-fns";

const dailyRewards = [
  { day: 1, stars: 5, coins: 20, emoji: "🎁" },
  { day: 2, stars: 5, coins: 25, emoji: "⭐" },
  { day: 3, stars: 10, coins: 30, emoji: "💎" },
  { day: 4, stars: 10, coins: 35, emoji: "🎯" },
  { day: 5, stars: 15, coins: 50, emoji: "🏆" },
  { day: 6, stars: 15, coins: 60, emoji: "👑" },
  { day: 7, stars: 25, coins: 100, emoji: "🎉", special: "Bonus Pet Food!" },
];

export default function DailyLoginRewards() {
  const queryClient = useQueryClient();
  const [showCelebration, setShowCelebration] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      // TODO: Replace with Firebase query
      return { 
        email: 'user@example.com',
        coins: 0,
        daily_login_streak: 0,
        total_login_days: 0,
        last_login_date: null,
        active_pet: null,
        pet_experience: {}
      };
    },
    initialData: { 
      email: 'user@example.com',
      coins: 0,
      daily_login_streak: 0,
      total_login_days: 0,
      last_login_date: null,
      active_pet: null,
      pet_experience: {}
    },
  });

  const claimRewardMutation = useMutation({
    mutationFn: async () => {
      const today = format(startOfDay(new Date()), "yyyy-MM-dd");
      const currentStreak = user?.daily_login_streak || 0;
      const newStreak = currentStreak + 1;
      const streakDay = ((newStreak - 1) % 7) + 1;
      const reward = dailyRewards[streakDay - 1];

      const updates = {
        last_login_date: today,
        daily_login_streak: newStreak,
        total_login_days: (user?.total_login_days || 0) + 1,
        coins: (user?.coins || 0) + reward.coins,
      };

      // Add pet food on day 7
      if (streakDay === 7 && user?.active_pet) {
        const currentExp = user?.pet_experience?.[user.active_pet] || 0;
        updates.pet_experience = {
          ...(user?.pet_experience || {}),
          [user.active_pet]: currentExp + 200,
        };
      }

      const db = getFirestore(firebaseApp);
      await setDoc(doc(db, "users", user.email), updates, { merge: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    },
  });

  const canClaim = () => {
    if (!user) return false;
    const today = format(startOfDay(new Date()), "yyyy-MM-dd");
    const lastLogin = user.last_login_date;
    
    if (!lastLogin) return true;
    if (lastLogin === today) return false;
    
    // Check if streak is broken
    const lastLoginDate = new Date(lastLogin);
    const todayDate = startOfDay(new Date());
    const daysDiff = differenceInDays(todayDate, lastLoginDate);
    
    return daysDiff === 1;
  };

  const isStreakBroken = () => {
    if (!user?.last_login_date) return false;
    const lastLoginDate = new Date(user.last_login_date);
    const todayDate = startOfDay(new Date());
    const daysDiff = differenceInDays(todayDate, lastLoginDate);
    return daysDiff > 1;
  };

  const getCurrentDay = () => {
    if (!user?.daily_login_streak) return 1;
    return ((user.daily_login_streak - 1) % 7) + 1;
  };

  const hasClaimedToday = () => {
    if (!user?.last_login_date) return false;
    const today = format(startOfDay(new Date()), "yyyy-MM-dd");
    return user.last_login_date === today;
  };

  const currentStreak = user?.daily_login_streak || 0;
  const currentDay = getCurrentDay();
  const claimed = hasClaimedToday();
  const broken = isStreakBroken();

  return (
    <Card className="border-4 border-purple-300 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            <span>Daily Login Rewards</span>
          </div>
          <Badge className="bg-white text-purple-600 font-bold">
            <Sparkles className="w-4 h-4 mr-1" />
            {currentStreak} Day Streak
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {showCelebration && (
          <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-xl animate-pulse">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎉</div>
              <div>
                <p className="font-bold text-green-800">Reward Claimed!</p>
                <p className="text-sm text-green-700">Come back tomorrow for more rewards!</p>
              </div>
            </div>
          </div>
        )}

        {broken && (
          <div className="mb-4 p-4 bg-orange-50 border-2 border-orange-300 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="text-3xl">😢</div>
              <div>
                <p className="font-bold text-orange-800">Streak Reset!</p>
                <p className="text-sm text-orange-700">You missed a day. Start a new streak today!</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-7 gap-2 mb-6">
          {dailyRewards.map((reward, index) => {
            const day = index + 1;
            const isCurrent = day === currentDay;
            const isPast = !broken && currentStreak >= day;
            const isClaimed = claimed && day === currentDay;

            return (
              <div
                key={day}
                className={`relative p-3 rounded-xl text-center transition-all ${
                  isClaimed
                    ? "bg-green-100 border-2 border-green-400 scale-105"
                    : isCurrent && !claimed
                    ? "bg-purple-100 border-2 border-purple-400 scale-105 animate-pulse"
                    : isPast
                    ? "bg-gray-100 border-2 border-gray-300"
                    : "bg-white border-2 border-gray-200 opacity-60"
                }`}
              >
                <div className="text-2xl mb-1">{reward.emoji}</div>
                <div className="text-xs font-bold mb-1">Day {day}</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{reward.stars}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <Coins className="w-3 h-3 text-blue-500" />
                    <span>{reward.coins}</span>
                  </div>
                </div>
                {isClaimed && (
                  <div className="absolute -top-1 -right-1">
                    <CheckCircle className="w-5 h-5 text-green-500 fill-green-100" />
                  </div>
                )}
                {!isCurrent && !isPast && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                {reward.special && isCurrent && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <Badge className="bg-orange-500 text-white text-xs">
                      {reward.special}
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          {claimed ? (
            <div className="text-center p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-bold text-green-800">Already claimed today!</p>
              <p className="text-sm text-green-700">Come back tomorrow for more rewards</p>
            </div>
          ) : broken ? (
            <Button
              onClick={() => claimRewardMutation.mutate()}
              disabled={claimRewardMutation.isPending}
              className="w-full h-14 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Gift className="w-5 h-5 mr-2" />
              Start New Streak & Claim Day 1
            </Button>
          ) : (
            <Button
              onClick={() => claimRewardMutation.mutate()}
              disabled={!canClaim() || claimRewardMutation.isPending}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Gift className="w-5 h-5 mr-2" />
              Claim Day {currentDay} Reward
            </Button>
          )}

          <div className="text-center text-sm text-gray-600">
            <p>🏆 Total Login Days: <strong>{user?.total_login_days || 0}</strong></p>
            <p className="mt-1">💡 Log in every day to keep your streak and earn bigger rewards!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}