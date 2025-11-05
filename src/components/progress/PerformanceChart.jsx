import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

export default function PerformanceChart({ progress }) {
  // Get last 10 games
  const recentGames = progress.slice(0, 10).reverse();
  
  const chartData = recentGames.map((game, index) => ({
    name: `Game ${index + 1}`,
    score: game.score,
    accuracy: Math.round((game.correct_answers / game.total_questions) * 100),
  }));

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-500" />
          Performance Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} />
              <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Play some games to see your performance chart!
          </div>
        )}
      </CardContent>
    </Card>
  );
}