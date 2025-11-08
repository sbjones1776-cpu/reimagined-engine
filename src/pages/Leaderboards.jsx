import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Trophy, Medal, Users, Clock, Target, Zap, Plus, 
  UserPlus, Award, Crown, Star, TrendingUp, Calendar
} from "lucide-react";
import { format, startOfWeek, startOfMonth, getWeek } from "date-fns";
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { 
  getAllGameProgress,
  getAllDailyChallenges,
  getAllUsers,
  getUserFriendConnections,
  getPendingFriendRequests,
  sendFriendRequest,
  updateFriendRequestStatus
} from '@/api/firebaseService';

export default function Leaderboards() {
  const queryClient = useQueryClient();
  const [friendEmail, setFriendEmail] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const { user } = useFirebaseUser();

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => getAllUsers(),
    staleTime: 300000,
    gcTime: 600000,
  });

  const { data: allProgress = [] } = useQuery({
    queryKey: ['allProgress'],
    queryFn: () => getAllGameProgress(),
    staleTime: 300000,
    gcTime: 600000,
  });

  const { data: allDailyChallenges = [] } = useQuery({
    queryKey: ['allDailyChallenges'],
    queryFn: () => getAllDailyChallenges(),
    staleTime: 300000,
    gcTime: 600000,
  });

  const { data: myFriends = [] } = useQuery({
    queryKey: ['myFriends', user?.email],
    queryFn: () => getUserFriendConnections(user.email),
    enabled: !!user?.email,
    staleTime: 60000,
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequests', user?.email],
    queryFn: () => getPendingFriendRequests(user.email),
    enabled: !!user?.email,
    staleTime: 60000,
  });

  const sendFriendRequestMutation = useMutation({
    mutationFn: async ({ user_email, friend_email }) => {
      return await sendFriendRequest(user_email, friend_email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFriends', user?.email] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests', user?.email] });
      setInviteSuccess(true);
      setFriendEmail("");
      setTimeout(() => setInviteSuccess(false), 3000);
    },
  });

  const updateFriendRequestMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await updateFriendRequestStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFriends', user?.email] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests', user?.email] });
    },
  });

  // Get current tournament IDs
  const weekId = `${format(new Date(), "yyyy")}-W${getWeek(new Date())}`;
  const monthId = `${format(new Date(), "yyyy")}-M${format(new Date(), "MM")}`;

  // Category-specific leaderboards
  const getCategoryLeaderboard = (operation, level = null) => {
    const filtered = allProgress.filter(p => {
      if (level) {
        return p.operation === operation && p.level === level;
      }
      return p.operation === operation;
    });

    const userStats = {};
    filtered.forEach(game => {
      const email = game.user_email;
      if (!userStats[email]) {
        userStats[email] = {
          email,
          totalScore: 0,
          bestScore: 0,
          gamesPlayed: 0,
          totalAccuracy: 0,
        };
      }
      userStats[email].totalScore += game.score;
      userStats[email].bestScore = Math.max(userStats[email].bestScore, game.score);
      userStats[email].gamesPlayed++;
      userStats[email].totalAccuracy += (game.correct_answers / game.total_questions) * 100;
    });

    return Object.values(userStats)
      .map(stat => ({
        ...stat,
        avgAccuracy: Math.round(stat.totalAccuracy / stat.gamesPlayed),
      }))
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 10);
  };

  // Speed leaderboard (fastest times)
  const getSpeedLeaderboard = () => {
    const userBestTimes = {};
    allProgress.forEach(game => {
      const email = game.user_email;
      if (!userBestTimes[email] || game.time_taken < userBestTimes[email].time) {
        userBestTimes[email] = {
          email,
          time: game.time_taken,
          score: game.score,
          accuracy: Math.round((game.correct_answers / game.total_questions) * 100),
        };
      }
    });

    return Object.values(userBestTimes)
      .sort((a, b) => a.time - b.time)
      .slice(0, 10);
  };

  // Friends leaderboard
  const getFriendsLeaderboard = () => {
    const friendEmails = myFriends.map(f => 
      f.user_email === user?.email ? f.friend_email : f.user_email
    );
    friendEmails.push(user?.email);

    const friendStats = {};
    allProgress.forEach(game => {
      const email = game.user_email;
      if (friendEmails.includes(email)) {
        if (!friendStats[email]) {
          friendStats[email] = {
            email,
            totalScore: 0,
            gamesPlayed: 0,
            totalStars: 0,
          };
        }
        friendStats[email].totalScore += game.score;
        friendStats[email].gamesPlayed++;
        friendStats[email].totalStars += game.stars_earned || 0;
      }
    });

    return Object.values(friendStats)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  };

  // Tournament leaderboard
  const getTournamentLeaderboard = (period) => {
    const periodStart = period === "weekly" ? startOfWeek(new Date()) : startOfMonth(new Date());
    
    const tournamentStats = {};
    allProgress.forEach(game => {
      const gameDate = game.completed_at?.toDate ? game.completed_at.toDate() : new Date();
      const email = game.user_email;
      if (gameDate >= periodStart) {
        if (!tournamentStats[email]) {
          tournamentStats[email] = {
            email,
            totalScore: 0,
            gamesPlayed: 0,
            totalStars: 0,
          };
        }
        tournamentStats[email].totalScore += game.score;
        tournamentStats[email].gamesPlayed++;
        tournamentStats[email].totalStars += game.stars_earned || 0;
      }
    });

    return Object.values(tournamentStats)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  };

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

  const getUserName = (email) => {
    const userData = allUsers.find(u => u.email === email);
    return userData?.child_name || userData?.full_name || email.split("@")[0];
  };

  const handleSendRequest = () => {
    if (!friendEmail || friendEmail === user?.email) return;
    sendFriendRequestMutation.mutate({
      user_email: user.email,
      friend_email: friendEmail,
      connection_type: "friend",
    });
  };

  const LeaderboardCard = ({ title, icon: Icon, data, renderStats }) => (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-6 h-6 text-purple-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No data available yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.email === user?.email;

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
                          {getUserName(entry.email)}
                        </span>
                        {isCurrentUser && (
                          <Badge className="bg-purple-500 text-white">You</Badge>
                        )}
                      </div>
                      {renderStats(entry)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
          Leaderboards
        </h1>
        <p className="text-xl text-gray-600">Compete with friends and players worldwide!</p>
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm text-gray-700">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span>{allUsers.length} Players</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
            <Star className="w-4 h-4 text-purple-600" />
            <span>{allProgress.length} Game Entries</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{allDailyChallenges.length} Daily Challenges</span>
          </div>
        </div>
      </div>

      {inviteSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <UserPlus className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Friend request sent successfully! 🎉
          </AlertDescription>
        </Alert>
      )}

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card className="mb-6 border-2 border-blue-300 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-blue-600" />
              Pending Friend Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium">{getUserName(request.user_email)}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateFriendRequestMutation.mutate({ id: request.id, status: "accepted" })}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateFriendRequestMutation.mutate({ id: request.id, status: "declined" })}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="tournaments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
        </TabsList>

        {/* Tournaments Tab */}
        <TabsContent value="tournaments" className="space-y-6">
          <Card className="border-4 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-600" />
                Active Tournaments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-purple-600" />
                    <div>
                      <h3 className="font-bold text-lg">Weekly Tournament</h3>
                      <p className="text-sm text-gray-600">Resets every Monday</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Tournament ID:</span>
                      <span className="font-bold">{weekId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Prize:</span>
                      <span className="font-bold text-yellow-600">50 Bonus Stars ⭐</span>
                    </div>
                  </div>
                  <Badge className="w-full justify-center bg-purple-500 text-white">Active Now</Badge>
                </div>

                <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-lg">Monthly Tournament</h3>
                      <p className="text-sm text-gray-600">Resets on 1st of month</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Tournament ID:</span>
                      <span className="font-bold">{monthId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Prize:</span>
                      <span className="font-bold text-yellow-600">100 Bonus Stars ⭐</span>
                    </div>
                  </div>
                  <Badge className="w-full justify-center bg-blue-500 text-white">Active Now</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <LeaderboardCard
              title="Weekly Leaders"
              icon={TrendingUp}
              data={getTournamentLeaderboard("weekly")}
              renderStats={(entry) => (
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {entry.totalScore} pts
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {entry.totalStars}
                  </span>
                  <span>{entry.gamesPlayed} games</span>
                </div>
              )}
            />

            <LeaderboardCard
              title="Monthly Leaders"
              icon={Award}
              data={getTournamentLeaderboard("monthly")}
              renderStats={(entry) => (
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {entry.totalScore} pts
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {entry.totalStars}
                  </span>
                  <span>{entry.gamesPlayed} games</span>
                </div>
              )}
            />
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <LeaderboardCard
              title="Multiplication Masters (Hard)"
              icon={Zap}
              data={getCategoryLeaderboard("multiplication", "hard")}
              renderStats={(entry) => (
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                  <span>Best: {entry.bestScore}</span>
                  <span>Avg: {entry.avgAccuracy}%</span>
                  <span>{entry.gamesPlayed} games</span>
                </div>
              )}
            />

            <LeaderboardCard
              title="Addition Champions"
              icon={Plus}
              data={getCategoryLeaderboard("addition")}
              renderStats={(entry) => (
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                  <span>Best: {entry.bestScore}</span>
                  <span>Avg: {entry.avgAccuracy}%</span>
                  <span>{entry.gamesPlayed} games</span>
                </div>
              )}
            />

            <LeaderboardCard
              title="Division Experts (Hard)"
              icon={Target}
              data={getCategoryLeaderboard("division", "hard")}
              renderStats={(entry) => (
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                  <span>Best: {entry.bestScore}</span>
                  <span>Avg: {entry.avgAccuracy}%</span>
                  <span>{entry.gamesPlayed} games</span>
                </div>
              )}
            />

            <LeaderboardCard
              title="Subtraction Stars"
              icon={Medal}
              data={getCategoryLeaderboard("subtraction")}
              renderStats={(entry) => (
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                  <span>Best: {entry.bestScore}</span>
                  <span>Avg: {entry.avgAccuracy}%</span>
                  <span>{entry.gamesPlayed} games</span>
                </div>
              )}
            />
          </div>
        </TabsContent>

        {/* Friends Tab */}
        <TabsContent value="friends" className="space-y-6">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-blue-600" />
                Invite Friends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter friend's email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  type="email"
                />
                <Button
                  onClick={handleSendRequest}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={sendFriendRequestMutation.isPending || !friendEmail}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Connected friends: {myFriends.length}
              </p>
            </CardContent>
          </Card>

          <LeaderboardCard
            title="Friends & Family Leaderboard"
            icon={Users}
            data={getFriendsLeaderboard()}
            renderStats={(entry) => (
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {entry.totalScore} pts
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {entry.totalStars}
                </span>
                <span>{entry.gamesPlayed} games</span>
              </div>
            )}
          />
        </TabsContent>

        {/* Special Tab */}
        <TabsContent value="special" className="space-y-6">
          <LeaderboardCard
            title="Speed Demons (Fastest Completion)"
            icon={Clock}
            data={getSpeedLeaderboard()}
            renderStats={(entry) => (
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1 font-bold text-blue-600">
                  <Clock className="w-4 h-4" />
                  {entry.time}s
                </span>
                <span>{entry.score} pts</span>
                <span>{entry.accuracy}% accuracy</span>
              </div>
            )}
          />

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-green-600" />
                Special Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <h4 className="font-bold mb-1">Perfect Score Club</h4>
                  <p className="text-sm text-gray-600">
                    {allProgress.filter(p => (p.correct_answers / p.total_questions) === 1).length} perfect games
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <h4 className="font-bold mb-1">Speed Masters</h4>
                  <p className="text-sm text-gray-600">
                    {allProgress.filter(p => p.time_taken < 60).length} games under 60s
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl text-center">
                  <div className="text-4xl mb-2">🔥</div>
                  <h4 className="font-bold mb-1">Daily Warriors</h4>
                  <p className="text-sm text-gray-600">
                    {allDailyChallenges.length} daily challenges completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

