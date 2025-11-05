import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, CheckCircle, Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export default function OverviewStats({ childProgress, childDailyChallenges, selectedChild }) {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: unreadReplies = 0 } = useQuery({
    queryKey: ['unreadChildReplies', selectedChild?.email],
    queryFn: async () => {
      const allMessages = await base44.entities.Message.list();
      const replies = allMessages.filter(m => 
        m.parent_email === user?.email &&
        m.child_email === selectedChild?.email &&
        m.message_type === 'response' &&
        !m.parent_read
      );
      return replies.length;
    },
    initialData: 0,
    enabled: !!user?.email && !!selectedChild?.email,
  });

  const totalGames = childProgress.length;
  const totalStars = childProgress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
  const totalCorrect = childProgress.reduce((sum, p) => sum + (p.correct_answers || 0), 0);
  const totalQuestions = childProgress.reduce((sum, p) => sum + (p.total_questions || 0), 0);
  const avgAccuracy = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;
  
  const dailyChallengesCompleted = childDailyChallenges.length;
  const lastPlayed = childProgress.length > 0 ? childProgress[0].created_date : null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            Total Games
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-3xl font-bold text-blue-600">{totalGames}</p>
          <p className="text-sm text-gray-600 mt-1">
            {lastPlayed && `Last: ${format(new Date(lastPlayed), "MMM d")}`}
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 border-yellow-200">
        <CardHeader className="bg-yellow-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Total Stars
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-3xl font-bold text-yellow-600">{totalStars}</p>
          <p className="text-sm text-gray-600 mt-1">
            Avg: {totalGames > 0 ? (totalStars / totalGames).toFixed(1) : 0} per game
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Accuracy
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-3xl font-bold text-green-600">{avgAccuracy}%</p>
          <p className="text-sm text-gray-600 mt-1">
            {totalCorrect} / {totalQuestions} correct
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Daily Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-3xl font-bold text-purple-600">{dailyChallengesCompleted}</p>
          <p className="text-sm text-gray-600 mt-1">
            completed
          </p>
        </CardContent>
      </Card>

      {/* New Messages Card */}
      <Card className="border-2 border-pink-200 md:col-span-2 lg:col-span-1">
        <CardHeader className="bg-pink-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pink-600" />
            Messages
            {unreadReplies > 0 && (
              <Badge className="bg-pink-500 text-white animate-pulse ml-auto">
                {unreadReplies} New
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-3xl font-bold text-pink-600">{unreadReplies}</p>
          <p className="text-sm text-gray-600 mt-1">
            unread replies
          </p>
        </CardContent>
      </Card>
    </div>
  );
}