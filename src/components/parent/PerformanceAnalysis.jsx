import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, BarChart3 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function PerformanceAnalysis({ childProgress, childDailyChallenges }) {
  // Performance by operation
  const getPerformanceByOperation = () => {
    const operations = {
      addition: { total: 0, correct: 0, games: 0 },
      subtraction: { total: 0, correct: 0, games: 0 },
      multiplication: { total: 0, correct: 0, games: 0 },
      division: { total: 0, correct: 0, games: 0 },
    };

    childProgress.forEach(p => {
      if (operations[p.operation]) {
        operations[p.operation].games++;
        operations[p.operation].total += p.total_questions;
        operations[p.operation].correct += p.correct_answers;
      }
    });

    return Object.entries(operations).map(([op, data]) => ({
      operation: op.charAt(0).toUpperCase() + op.slice(1),
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      games: data.games,
    }));
  };

  // Performance by level
  const getPerformanceByLevel = () => {
    const levels = {
      easy: { total: 0, correct: 0, games: 0 },
      medium: { total: 0, correct: 0, games: 0 },
      hard: { total: 0, correct: 0, games: 0 },
    };

    childProgress.forEach(p => {
      if (levels[p.level]) {
        levels[p.level].games++;
        levels[p.level].total += p.total_questions;
        levels[p.level].correct += p.correct_answers;
      }
    });

    return Object.entries(levels).map(([level, data]) => ({
      level: level.charAt(0).toUpperCase() + level.slice(1),
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      games: data.games,
    }));
  };

  // Recent performance trend
  const getRecentTrend = () => {
    const recent = childProgress.slice(0, 10).reverse();
    return recent.map((game, index) => ({
      game: `Game ${index + 1}`,
      accuracy: Math.round((game.correct_answers / game.total_questions) * 100),
      score: game.score,
    }));
  };

  // Identify strengths and weaknesses
  const getStrengthsAndWeaknesses = () => {
    const operationData = getPerformanceByOperation();
    const sorted = [...operationData].sort((a, b) => b.accuracy - a.accuracy);
    
    const strengths = sorted.slice(0, 2).filter(op => op.accuracy >= 70);
    const weaknesses = sorted.slice(-2).filter(op => op.accuracy < 70 && op.games > 0);

    return { strengths, weaknesses };
  };

  const operationData = getPerformanceByOperation();
  const levelData = getPerformanceByLevel();
  const trendData = getRecentTrend();
  const { strengths, weaknesses } = getStrengthsAndWeaknesses();

  const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  if (childProgress.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-xl text-gray-600">No performance data available yet</p>
        <p className="text-gray-500 mt-2">Data will appear once the child starts playing games</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Strengths and Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-6 h-6" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strengths.length > 0 ? (
              <div className="space-y-3">
                {strengths.map((strength, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium">{strength.operation}</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">{strength.accuracy}%</Badge>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">Keep practicing to identify strengths!</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="w-6 h-6" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weaknesses.length > 0 ? (
              <div className="space-y-3">
                {weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium">{weakness.operation}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-orange-400">{weakness.accuracy}%</Badge>
                      <TrendingDown className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">Great job! No weak areas identified.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance by Operation */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Operation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={operationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="operation" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" fill="#8b5cf6" name="Accuracy %" />
              <Bar dataKey="games" fill="#ec4899" name="Games Played" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance by Level */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Difficulty Level</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={levelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" fill="#10b981" name="Accuracy %" />
              <Bar dataKey="games" fill="#f59e0b" name="Games Played" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Performance Trend */}
      {trendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="game" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#8b5cf6" strokeWidth={3} name="Accuracy %" />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} name="Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}