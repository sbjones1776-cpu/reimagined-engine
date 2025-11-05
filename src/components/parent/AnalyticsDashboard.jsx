import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  Download,
  RefreshCw,
  Clock
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from "recharts";
import { format, subDays, startOfWeek, startOfMonth } from "date-fns";

export default function AnalyticsDashboard({ childEmail, childProgress, childDailyChallenges }) {
  const [timeRange, setTimeRange] = useState("week");
  const [selectedOperation, setSelectedOperation] = useState("all");

  const getFilteredData = () => {
    let startDate;
    const now = new Date();

    switch (timeRange) {
      case "week":
        startDate = startOfWeek(now);
        break;
      case "month":
        startDate = startOfMonth(now);
        break;
      case "all":
        startDate = new Date(0);
        break;
      default:
        startDate = subDays(now, 7);
    }

    const filtered = childProgress.filter(p => new Date(p.created_date) >= startDate);
    return selectedOperation === "all" 
      ? filtered 
      : filtered.filter(p => p.operation === selectedOperation);
  };

  const filteredData = getFilteredData();

  const getDailyActivity = () => {
    const days = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
      days[date] = { date: format(subDays(new Date(), 6 - i), "EEE"), games: 0, accuracy: 0, totalQuestions: 0, correctAnswers: 0 };
      return date;
    });

    filteredData.forEach(p => {
      const date = format(new Date(p.created_date), "yyyy-MM-dd");
      if (days[date]) {
        days[date].games++;
        days[date].totalQuestions += p.total_questions;
        days[date].correctAnswers += p.correct_answers;
      }
    });

    return Object.values(days).map(day => ({
      ...day,
      accuracy: day.totalQuestions > 0 ? Math.round((day.correctAnswers / day.totalQuestions) * 100) : 0,
    }));
  };

  const getOperationDistribution = () => {
    const dist = {
      addition: 0,
      subtraction: 0,
      multiplication: 0,
      division: 0,
    };

    filteredData.forEach(p => {
      if (dist[p.operation] !== undefined) {
        dist[p.operation]++;
      }
    });

    return Object.entries(dist).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: name === "addition" ? "#10b981" : name === "subtraction" ? "#3b82f6" : name === "multiplication" ? "#8b5cf6" : "#f59e0b",
    }));
  };

  const getSkillRadar = () => {
    const skills = {
      addition: { total: 0, correct: 0 },
      subtraction: { total: 0, correct: 0 },
      multiplication: { total: 0, correct: 0 },
      division: { total: 0, correct: 0 },
    };

    filteredData.forEach(p => {
      if (skills[p.operation]) {
        skills[p.operation].total += p.total_questions;
        skills[p.operation].correct += p.correct_answers;
      }
    });

    return Object.entries(skills).map(([name, data]) => ({
      skill: name.charAt(0).toUpperCase() + name.slice(1),
      score: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }));
  };

  const getTimeOfDayAnalysis = () => {
    const timeSlots = {
      Morning: 0,
      Afternoon: 0,
      Evening: 0,
      Night: 0,
    };

    filteredData.forEach(p => {
      const hour = new Date(p.created_date).getHours();
      if (hour >= 6 && hour < 12) timeSlots.Morning++;
      else if (hour >= 12 && hour < 17) timeSlots.Afternoon++;
      else if (hour >= 17 && hour < 21) timeSlots.Evening++;
      else timeSlots.Night++;
    });

    return Object.entries(timeSlots).map(([name, value]) => ({
      name,
      games: value,
    }));
  };

  const getPerformanceTrend = () => {
    const last10 = filteredData.slice(-10).reverse();
    return last10.map((game, index) => ({
      game: `Game ${index + 1}`,
      accuracy: Math.round((game.correct_answers / game.total_questions) * 100),
      speed: game.time_taken,
    }));
  };

  const getKeyMetrics = () => {
    if (filteredData.length === 0) return {
      totalGames: 0,
      avgAccuracy: 0,
      avgSpeed: 0,
      totalStars: 0,
      improvementRate: 0,
    };

    const totalGames = filteredData.length;
    const avgAccuracy = Math.round(
      filteredData.reduce((sum, p) => sum + (p.correct_answers / p.total_questions) * 100, 0) / totalGames
    );
    const avgSpeed = Math.round(
      filteredData.reduce((sum, p) => sum + p.time_taken, 0) / totalGames
    );
    const totalStars = filteredData.reduce((sum, p) => sum + (p.stars_earned || 0), 0);

    const recent5 = filteredData.slice(0, 5);
    const previous5 = filteredData.slice(5, 10);
    
    const recentAvg = recent5.length > 0 
      ? recent5.reduce((sum, p) => sum + (p.correct_answers / p.total_questions) * 100, 0) / recent5.length
      : 0;
    const previousAvg = previous5.length > 0
      ? previous5.reduce((sum, p) => sum + (p.correct_answers / p.total_questions) * 100, 0) / previous5.length
      : 0;

    const improvementRate = previousAvg > 0 ? Math.round(((recentAvg - previousAvg) / previousAvg) * 100) : 0;

    return {
      totalGames,
      avgAccuracy,
      avgSpeed,
      totalStars,
      improvementRate,
    };
  };

  const dailyActivity = getDailyActivity();
  const operationDist = getOperationDistribution();
  const skillRadar = getSkillRadar();
  const timeAnalysis = getTimeOfDayAnalysis();
  const performanceTrend = getPerformanceTrend();
  const metrics = getKeyMetrics();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            Advanced Analytics Dashboard
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive performance insights and trends
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedOperation} onValueChange={setSelectedOperation}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ops</SelectItem>
              <SelectItem value="addition">Addition</SelectItem>
              <SelectItem value="subtraction">Subtraction</SelectItem>
              <SelectItem value="multiplication">Multiplication</SelectItem>
              <SelectItem value="division">Division</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Games</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{metrics.totalGames}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Avg Accuracy</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{metrics.avgAccuracy}%</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Avg Speed</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">{metrics.avgSpeed}s</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-gray-600">Stars</span>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{metrics.totalStars}</p>
          </CardContent>
        </Card>

        <Card className={`border-2 ${metrics.improvementRate >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {metrics.improvementRate >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
              <span className="text-sm text-gray-600">Trend</span>
            </div>
            <p className={`text-3xl font-bold ${metrics.improvementRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.improvementRate > 0 ? '+' : ''}{metrics.improvementRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-purple-200">
        <CardContent className="p-6">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="time">Time</TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Activity (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={dailyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="games" 
                        stroke="#8b5cf6" 
                        fill="#8b5cf6" 
                        fillOpacity={0.6}
                        name="Games Played" 
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                        name="Accuracy %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={skillRadar}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar 
                        name="Accuracy %" 
                        dataKey="score" 
                        stroke="#8b5cf6" 
                        fill="#8b5cf6" 
                        fillOpacity={0.6} 
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution">
              <Card>
                <CardHeader>
                  <CardTitle>Operation Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={operationDist}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {operationDist.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="game" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="accuracy" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        name="Accuracy %" 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="speed" 
                        stroke="#f59e0b" 
                        strokeWidth={3}
                        name="Speed (seconds)" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="time">
              <Card>
                <CardHeader>
                  <CardTitle>Time of Day Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={timeAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="games" fill="#8b5cf6" name="Games Played" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-gray-600 mb-1">Most Active Time</p>
                      <p className="font-bold text-blue-700">
                        {timeAnalysis.reduce((max, slot) => slot.games > max.games ? slot : max, timeAnalysis[0])?.name || "N/A"}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-gray-600 mb-1">Recommended Practice Time</p>
                      <p className="font-bold text-purple-700">
                        {timeAnalysis.reduce((max, slot) => slot.games > max.games ? slot : max, timeAnalysis[0])?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}