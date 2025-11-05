import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Brain, Target, Award } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TutorAnalysis({ progress, tutorSessions, onWeaknessClick }) {
  const [analysisGenerated, setAnalysisGenerated] = useState(false);

  // Calculate overall statistics
  const getOverallAccuracy = () => {
    if (progress.length === 0) return 0;
    const totalAccuracy = progress.reduce((sum, p) => 
      sum + ((p.correct_answers / p.total_questions) * 100), 0
    );
    return Math.round(totalAccuracy / progress.length);
  };

  const getAverageTime = () => {
    if (progress.length === 0) return 0;
    const totalTime = progress.reduce((sum, p) => sum + p.time_taken, 0);
    return Math.round(totalTime / progress.length);
  };

  const getTrendDirection = () => {
    if (progress.length < 5) return "neutral";
    const recent = progress.slice(0, 5);
    const older = progress.slice(5, 10);
    
    const recentAvg = recent.reduce((sum, p) => 
      sum + ((p.correct_answers / p.total_questions) * 100), 0) / recent.length;
    const olderAvg = older.length > 0 
      ? older.reduce((sum, p) => sum + ((p.correct_answers / p.total_questions) * 100), 0) / older.length
      : recentAvg;

    if (recentAvg > olderAvg + 5) return "improving";
    if (recentAvg < olderAvg - 5) return "declining";
    return "stable";
  };

  // Analyze performance by operation
  const getOperationStats = () => {
    const stats = {};
    
    progress.forEach(p => {
      if (!stats[p.operation]) {
        stats[p.operation] = {
          operation: p.operation,
          totalGames: 0,
          totalCorrect: 0,
          totalQuestions: 0,
          averageTime: 0,
          totalTime: 0,
        };
      }
      
      stats[p.operation].totalGames++;
      stats[p.operation].totalCorrect += p.correct_answers;
      stats[p.operation].totalQuestions += p.total_questions;
      stats[p.operation].totalTime += p.time_taken;
    });

    return Object.values(stats).map(stat => ({
      ...stat,
      accuracy: Math.round((stat.totalCorrect / stat.totalQuestions) * 100),
      averageTime: Math.round(stat.totalTime / stat.totalGames),
    })).sort((a, b) => a.accuracy - b.accuracy);
  };

  // Analyze performance by level
  const getLevelStats = () => {
    const stats = {};
    
    progress.forEach(p => {
      if (!stats[p.level]) {
        stats[p.level] = {
          level: p.level,
          totalGames: 0,
          totalCorrect: 0,
          totalQuestions: 0,
        };
      }
      
      stats[p.level].totalGames++;
      stats[p.level].totalCorrect += p.correct_answers;
      stats[p.level].totalQuestions += p.total_questions;
    });

    return Object.values(stats).map(stat => ({
      ...stat,
      accuracy: Math.round((stat.totalCorrect / stat.totalQuestions) * 100),
    }));
  };

  // Get learning insights
  const getLearningInsights = () => {
    const insights = [];
    const operationStats = getOperationStats();
    const trend = getTrendDirection();
    const overallAccuracy = getOverallAccuracy();

    // Trend insight
    if (trend === "improving") {
      insights.push({
        type: "positive",
        icon: TrendingUp,
        title: "You're Improving!",
        message: "Your recent performance shows great progress. Keep it up!",
      });
    } else if (trend === "declining") {
      insights.push({
        type: "warning",
        icon: TrendingDown,
        title: "Need More Practice",
        message: "Your recent scores are lower. Let's focus on practice!",
      });
    }

    // Accuracy insight
    if (overallAccuracy >= 90) {
      insights.push({
        type: "positive",
        icon: Award,
        title: "Excellent Accuracy!",
        message: `You're at ${overallAccuracy}% accuracy. You're a math champion!`,
      });
    } else if (overallAccuracy < 70) {
      insights.push({
        type: "warning",
        icon: Target,
        title: "Let's Boost Your Score",
        message: `Your accuracy is ${overallAccuracy}%. Practice will help you improve!`,
      });
    }

    // Weakness insight
    if (operationStats.length > 0 && operationStats[0].accuracy < 75) {
      insights.push({
        type: "action",
        icon: Brain,
        title: "Focus Area Identified",
        message: `${operationStats[0].operation} needs attention (${operationStats[0].accuracy}% accuracy)`,
        action: () => onWeaknessClick({
          operation: operationStats[0].operation,
          level: "mixed",
        }),
      });
    }

    // Speed insight
    const avgTime = getAverageTime();
    if (avgTime < 90 && overallAccuracy >= 80) {
      insights.push({
        type: "positive",
        icon: TrendingUp,
        title: "Fast and Accurate!",
        message: `You're solving problems in ${avgTime}s with great accuracy!`,
      });
    }

    return insights;
  };

  const operationStats = getOperationStats();
  const levelStats = getLevelStats();
  const insights = getLearningInsights();
  const trend = getTrendDirection();
  const overallAccuracy = getOverallAccuracy();

  // Chart data for progress over time
  const progressChartData = progress.slice(0, 10).reverse().map((p, i) => ({
    game: `Game ${i + 1}`,
    accuracy: Math.round((p.correct_answers / p.total_questions) * 100),
    speed: Math.max(0, 120 - p.time_taken), // Inverse for visualization
  }));

  if (progress.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold mb-2">Start Playing to Get Analysis</h3>
          <p className="text-gray-600">Play some math games and I'll analyze your performance!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Overall Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-1">{overallAccuracy}%</div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
              <Progress value={overallAccuracy} className="mt-2" />
            </div>
            
            <div className="text-center p-4 bg-white rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-1">{getAverageTime()}s</div>
              <div className="text-sm text-gray-600">Avg Time per Game</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-xl">
              <div className="text-4xl font-bold text-green-600 mb-1">{progress.length}</div>
              <div className="text-sm text-gray-600">Games Analyzed</div>
            </div>
          </div>

          {/* Trend Badge */}
          <div className="flex justify-center">
            {trend === "improving" && (
              <Badge className="bg-green-500 text-white text-lg px-6 py-2">
                <TrendingUp className="w-5 h-5 mr-2" />
                Improving Trend
              </Badge>
            )}
            {trend === "declining" && (
              <Badge className="bg-orange-500 text-white text-lg px-6 py-2">
                <TrendingDown className="w-5 h-5 mr-2" />
                Needs Practice
              </Badge>
            )}
            {trend === "stable" && (
              <Badge className="bg-blue-500 text-white text-lg px-6 py-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                Steady Progress
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Learning Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <Card 
            key={index}
            className={`border-2 ${
              insight.type === "positive" ? "border-green-300 bg-green-50" :
              insight.type === "warning" ? "border-orange-300 bg-orange-50" :
              "border-blue-300 bg-blue-50"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  insight.type === "positive" ? "bg-green-500" :
                  insight.type === "warning" ? "bg-orange-500" :
                  "bg-blue-500"
                }`}>
                  <insight.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{insight.title}</h3>
                  <p className="text-sm text-gray-700 mb-3">{insight.message}</p>
                  {insight.action && (
                    <Button 
                      size="sm"
                      onClick={insight.action}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Start Practice
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance by Operation */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle>Performance by Math Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {operationStats.map((stat, index) => (
              <div key={stat.operation}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium capitalize">{stat.operation.replace(/_/g, ' ')}</span>
                    <Badge variant="outline">{stat.totalGames} games</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{stat.accuracy}%</span>
                    {stat.accuracy < 70 && (
                      <Button
                        size="sm"
                        onClick={() => onWeaknessClick({ operation: stat.operation, level: "mixed" })}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Practice
                      </Button>
                    )}
                  </div>
                </div>
                <Progress 
                  value={stat.accuracy} 
                  className={`h-3 ${
                    stat.accuracy >= 80 ? "bg-green-200" :
                    stat.accuracy >= 60 ? "bg-yellow-200" :
                    "bg-red-200"
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Chart */}
      {progressChartData.length > 0 && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Recent Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="game" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="Accuracy %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}