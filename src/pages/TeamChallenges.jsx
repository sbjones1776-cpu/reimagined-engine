import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Trophy, Target, Star, Coins, Clock, CheckCircle, Calendar, TrendingUp, Award } from "lucide-react";
import { format } from "date-fns";

export default function TeamChallenges() {
  const queryClient = useQueryClient();
  const [claimSuccess, setClaimSuccess] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    initialData: [],
  });

  const { data: myTeamChallenges = [] } = useQuery({
    queryKey: ['myTeamChallenges'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const all = await base44.entities.TeamChallenge.list();
      return all.filter(tc => tc.team_members?.includes(user.email) || tc.creator_email === user.email);
    },
    initialData: [],
    enabled: !!user,
  });

  const { data: myProgress = [] } = useQuery({
    queryKey: ['myProgress'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.GameProgress.filter({ created_by: user.email });
    },
    initialData: [],
    enabled: !!user,
  });

  const { data: myDailyChallenges = [] } = useQuery({
    queryKey: ['myDailyChallenges'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.DailyChallenge.filter({ created_by: user.email });
    },
    initialData: [],
    enabled: !!user,
  });

  const updateChallengeMutation = useMutation({
    mutationFn: ({ challengeId, data }) => base44.entities.TeamChallenge.update(challengeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTeamChallenges'] });
    },
  });

  const claimRewardMutation = useMutation({
    mutationFn: ({ stars, coins }) => {
      const currentStars = user.total_stars_earned || 0;
      const currentCoins = user.coins || 0;
      return base44.auth.updateMe({
        total_stars_earned: currentStars + stars,
        coins: currentCoins + coins,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setClaimSuccess(`Claimed ${variables.stars} stars and ${variables.coins} coins!`);
      setTimeout(() => setClaimSuccess(null), 3000);
    },
  });

  const getUserName = (email) => {
    const userData = allUsers.find(u => u.email === email);
    return userData?.child_name || userData?.full_name || email.split("@")[0];
  };

  const calculateMyContribution = (challenge) => {
    const startDate = new Date(challenge.start_date);
    const endDate = challenge.end_date ? new Date(challenge.end_date) : new Date();

    const relevantProgress = myProgress.filter(p => {
      const gameDate = new Date(p.created_date);
      const matchesDate = gameDate >= startDate && gameDate <= endDate;
      const matchesOperation = challenge.specific_operation === "any" || p.operation === challenge.specific_operation;
      const matchesLevel = challenge.specific_level === "any" || p.level === challenge.specific_level;
      return matchesDate && matchesOperation && matchesLevel;
    });

    const relevantDailies = myDailyChallenges.filter(dc => {
      const dcDate = new Date(dc.created_date);
      return dcDate >= startDate && dcDate <= endDate;
    });

    let contribution = 0;
    switch (challenge.challenge_type) {
      case "team_score":
        contribution = relevantProgress.reduce((sum, p) => sum + (p.score || 0), 0);
        break;
      case "combined_accuracy":
        if (relevantProgress.length > 0) {
          const totalAccuracy = relevantProgress.reduce((sum, p) => sum + ((p.correct_answers / p.total_questions) * 100), 0);
          contribution = Math.round(totalAccuracy / relevantProgress.length);
        }
        break;
      case "total_games":
        contribution = relevantProgress.length;
        break;
      case "total_stars":
        contribution = relevantProgress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
        contribution += relevantDailies.reduce((sum, dc) => sum + (dc.bonus_stars || 0), 0);
        break;
      case "daily_streak_sum":
        contribution = relevantDailies.length;
        break;
      case "speed_challenge":
        if (relevantProgress.length > 0) {
          contribution = Math.min(...relevantProgress.map(p => p.time_taken));
        }
        break;
    }

    return contribution;
  };

  // Update challenge progress
  useEffect(() => {
    if (!user || myTeamChallenges.length === 0) return;

    myTeamChallenges.forEach(challenge => {
      if (challenge.is_completed) return;

      const myContribution = calculateMyContribution(challenge);
      const currentContributions = challenge.member_contributions || {};
      
      // Update my contribution if it changed
      if (currentContributions[user.email] !== myContribution) {
        const newContributions = {
          ...currentContributions,
          [user.email]: myContribution,
        };

        // Calculate total progress
        let totalProgress = 0;
        if (challenge.challenge_type === "combined_accuracy") {
          // For accuracy, average all member contributions
          const contributions = Object.values(newContributions);
          if (contributions.length > 0) {
            totalProgress = Math.round(contributions.reduce((a, b) => a + b, 0) / contributions.length);
          }
        } else if (challenge.challenge_type === "speed_challenge") {
          // For speed, take the best (lowest) time
          const times = Object.values(newContributions).filter(t => t > 0);
          if (times.length > 0) {
            totalProgress = Math.min(...times);
          }
        } else {
          // For others, sum all contributions
          totalProgress = Object.values(newContributions).reduce((a, b) => a + b, 0);
        }

        const isCompleted = totalProgress >= challenge.target_value;

        updateChallengeMutation.mutate({
          challengeId: challenge.id,
          data: {
            member_contributions: newContributions,
            current_value: totalProgress,
            is_completed: isCompleted,
          },
        });
      }
    });
  }, [myProgress, myDailyChallenges, myTeamChallenges, user]);

  const handleClaimReward = (challenge) => {
    claimRewardMutation.mutate({
      stars: challenge.reward_stars || 0,
      coins: challenge.reward_coins || 0,
    });
  };

  const getChallengeTypeLabel = (type) => {
    const labels = {
      team_score: "Team Score Challenge",
      combined_accuracy: "Combined Accuracy Goal",
      total_games: "Total Games Challenge",
      total_stars: "Star Collection Challenge",
      daily_streak_sum: "Daily Challenge Streak",
      speed_challenge: "Speed Challenge",
    };
    return labels[type] || type;
  };

  const getChallengeTypeIcon = (type) => {
    const icons = {
      team_score: Trophy,
      combined_accuracy: Target,
      total_games: TrendingUp,
      total_stars: Star,
      daily_streak_sum: Calendar,
      speed_challenge: Clock,
    };
    return icons[type] || Trophy;
  };

  const activeGhallenges = myTeamChallenges.filter(c => !c.is_completed);
  const completedChallenges = myTeamChallenges.filter(c => c.is_completed);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
            <Users className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Team Challenges
        </h1>
        <p className="text-xl text-gray-600">Work together with friends and family!</p>
      </div>

      {claimSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Reward Claimed!</strong> {claimSuccess} 🎉
          </AlertDescription>
        </Alert>
      )}

      {myTeamChallenges.length === 0 ? (
        <Card className="border-2 border-gray-200">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold mb-2">No Team Challenges Yet</h3>
            <p className="text-gray-600 mb-6">
              Ask your parent or teacher to create a team challenge for you and your friends!
            </p>
            <Alert className="bg-blue-50 border-blue-200 text-left">
              <AlertDescription className="text-blue-800">
                <strong>What are Team Challenges?</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Work together with friends and family</li>
                  <li>Combine your progress to reach team goals</li>
                  <li>Earn bonus rewards when you succeed together</li>
                  <li>See everyone's contributions in real-time</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Active Challenges */}
          {activeChallenges.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-500" />
                Active Challenges ({activeChallenges.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {activeChallenges.map((challenge) => {
                  const Icon = getChallengeTypeIcon(challenge.challenge_type);
                  const progress = Math.min((challenge.current_value / challenge.target_value) * 100, 100);
                  const myContribution = challenge.member_contributions?.[user?.email] || 0;
                  const daysLeft = challenge.end_date 
                    ? Math.max(0, Math.ceil((new Date(challenge.end_date) - new Date()) / (1000 * 60 * 60 * 24)))
                    : null;

                  return (
                    <Card key={challenge.id} className="border-2 border-purple-200 hover:shadow-lg transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="w-6 h-6 text-purple-600" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-lg">{challenge.challenge_name}</span>
                              {daysLeft !== null && (
                                <Badge variant="outline" className="bg-white">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {daysLeft}d left
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-normal text-gray-600 mt-1">
                              {getChallengeTypeLabel(challenge.challenge_type)}
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        {challenge.description && (
                          <p className="text-gray-600">{challenge.description}</p>
                        )}

                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Team Progress</span>
                            <span className="font-bold">
                              {Math.round(challenge.current_value)} / {challenge.target_value}
                              {challenge.challenge_type === "combined_accuracy" && "%"}
                              {challenge.challenge_type === "speed_challenge" && "s"}
                            </span>
                          </div>
                          <Progress value={progress} className="h-3" />
                        </div>

                        {/* Team Members */}
                        <div>
                          <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            Team Members ({challenge.team_members?.length || 0})
                          </h4>
                          <div className="space-y-2">
                            {challenge.team_members?.map((memberEmail) => {
                              const contribution = challenge.member_contributions?.[memberEmail] || 0;
                              const isMe = memberEmail === user?.email;

                              return (
                                <div
                                  key={memberEmail}
                                  className={`flex items-center justify-between p-2 rounded-lg ${
                                    isMe ? "bg-purple-50 border-2 border-purple-200" : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {getUserName(memberEmail)}
                                    </span>
                                    {isMe && (
                                      <Badge className="bg-purple-500 text-white text-xs">You</Badge>
                                    )}
                                  </div>
                                  <span className="text-sm font-bold text-gray-700">
                                    {Math.round(contribution)}
                                    {challenge.challenge_type === "combined_accuracy" && "%"}
                                    {challenge.challenge_type === "speed_challenge" && "s"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Rewards */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border-2 border-yellow-200">
                          <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-600" />
                            Rewards on Completion
                          </h4>
                          <div className="flex gap-3 text-sm">
                            {challenge.reward_stars > 0 && (
                              <div className="flex items-center gap-1 font-bold text-yellow-600">
                                <Star className="w-4 h-4 fill-yellow-400" />
                                {challenge.reward_stars} stars
                              </div>
                            )}
                            {challenge.reward_coins > 0 && (
                              <div className="flex items-center gap-1 font-bold text-blue-600">
                                <Coins className="w-4 h-4" />
                                {challenge.reward_coins} coins
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Challenges */}
          {completedChallenges.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Completed Challenges ({completedChallenges.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {completedChallenges.map((challenge) => {
                  const Icon = getChallengeTypeIcon(challenge.challenge_type);

                  return (
                    <Card key={challenge.id} className="border-2 border-green-300 bg-green-50">
                      <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <div className="flex-1">
                            <span className="text-lg">{challenge.challenge_name}</span>
                            <p className="text-sm font-normal text-gray-600 mt-1">
                              {getChallengeTypeLabel(challenge.challenge_type)}
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <Alert className="bg-white border-green-200">
                          <Trophy className="w-4 h-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            <strong>Challenge Complete!</strong> Your team achieved the goal together! 🎉
                            {challenge.reward_message && (
                              <p className="mt-1">{challenge.reward_message}</p>
                            )}
                          </AlertDescription>
                        </Alert>

                        <div className="flex justify-between items-center">
                          <span className="font-medium">Final Score:</span>
                          <span className="text-2xl font-bold text-green-600">
                            {Math.round(challenge.current_value)} / {challenge.target_value}
                          </span>
                        </div>

                        <Button
                          onClick={() => handleClaimReward(challenge)}
                          disabled={claimRewardMutation.isPending}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
                        >
                          <Award className="w-4 h-4 mr-2" />
                          Claim Rewards
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
