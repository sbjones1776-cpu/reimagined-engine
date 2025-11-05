import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Target, AlertCircle, Play, TrendingDown, Book, Zap } from "lucide-react";

export default function WeaknessAnalyzer({ progress, tutorSessions, onPracticeClick }) {
  // Analyze weaknesses from progress
  const analyzeWeaknesses = () => {
    const weaknesses = [];
    const operationStats = {};
    
    // Analyze game progress
    progress.forEach(p => {
      if (!operationStats[p.operation]) {
        operationStats[p.operation] = {
          operation: p.operation,
          level: p.level,
          totalGames: 0,
          totalCorrect: 0,
          totalQuestions: 0,
          totalTime: 0,
        };
      }
      
      operationStats[p.operation].totalGames++;
      operationStats[p.operation].totalCorrect += p.correct_answers;
      operationStats[p.operation].totalQuestions += p.total_questions;
      operationStats[p.operation].totalTime += p.time_taken;
    });

    // Calculate accuracy and identify weaknesses
    Object.values(operationStats).forEach(stat => {
      const accuracy = (stat.totalCorrect / stat.totalQuestions) * 100;
      
      if (accuracy < 75 || stat.totalGames < 3) {
        let severity = "medium";
        let reason = "";
        
        if (accuracy < 50) {
          severity = "high";
          reason = "Very low accuracy";
        } else if (accuracy < 65) {
          severity = "high";
          reason = "Low accuracy";
        } else if (accuracy < 75) {
          severity = "medium";
          reason = "Room for improvement";
        } else if (stat.totalGames < 3) {
          severity = "low";
          reason = "Need more practice";
        }

        weaknesses.push({
          operation: stat.operation,
          level: stat.level,
          accuracy: Math.round(accuracy),
          totalGames: stat.totalGames,
          severity,
          reason,
        });
      }
    });

    return weaknesses.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  };

  // Analyze common mistakes from tutor sessions
  const analyzeCommonMistakes = () => {
    const mistakes = {};
    
    tutorSessions.forEach(session => {
      const key = `${session.operation}-${session.level}`;
      if (!mistakes[key]) {
        mistakes[key] = {
          operation: session.operation,
          level: session.level,
          count: 0,
          examples: [],
        };
      }
      mistakes[key].count++;
      if (mistakes[key].examples.length < 3) {
        mistakes[key].examples.push(session.question);
      }
    });

    return Object.values(mistakes)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const weaknesses = analyzeWeaknesses();
  const commonMistakes = analyzeCommonMistakes();

  // Generate recommendations
  const getRecommendations = () => {
    const recommendations = [];

    if (weaknesses.length === 0) {
      recommendations.push({
        type: "success",
        title: "Great Job!",
        message: "You're performing well across all topics! Keep practicing to maintain your skills.",
        icon: "🎉",
      });
    } else {
      const highPriority = weaknesses.filter(w => w.severity === "high");
      if (highPriority.length > 0) {
        recommendations.push({
          type: "urgent",
          title: "Priority Practice Areas",
          message: `Focus on ${highPriority.map(w => w.operation).join(", ")} to improve quickly.`,
          icon: "🎯",
        });
      }

      const needsMorePractice = weaknesses.filter(w => w.totalGames < 3);
      if (needsMorePractice.length > 0) {
        recommendations.push({
          type: "info",
          title: "Try New Topics",
          message: `Play more games in ${needsMorePractice.map(w => w.operation).join(", ")} to build confidence.`,
          icon: "💪",
        });
      }
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  if (progress.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold mb-2">No Data Yet</h3>
          <p className="text-gray-600">Play some games first, then I'll identify areas to improve!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <Alert 
            key={index}
            className={`${
              rec.type === "urgent" ? "bg-red-50 border-red-300" :
              rec.type === "success" ? "bg-green-50 border-green-300" :
              "bg-blue-50 border-blue-300"
            }`}
          >
            <span className="text-2xl mr-2">{rec.icon}</span>
            <AlertDescription>
              <strong>{rec.title}:</strong> {rec.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Identified Weaknesses */}
      {weaknesses.length > 0 && (
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-orange-600" />
              Areas Needing Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weaknesses.map((weakness, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border-2 ${
                  weakness.severity === "high" ? "bg-red-50 border-red-300" :
                  weakness.severity === "medium" ? "bg-orange-50 border-orange-300" :
                  "bg-yellow-50 border-yellow-300"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg capitalize">
                        {weakness.operation.replace(/_/g, ' ')}
                      </h3>
                      <Badge 
                        className={`${
                          weakness.severity === "high" ? "bg-red-500" :
                          weakness.severity === "medium" ? "bg-orange-500" :
                          "bg-yellow-500"
                        } text-white`}
                      >
                        {weakness.severity === "high" ? "High Priority" :
                         weakness.severity === "medium" ? "Medium" : "Low"}
                      </Badge>
                      <Badge variant="outline">
                        {weakness.level}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-600">Accuracy</span>
                        <div className="text-2xl font-bold">{weakness.accuracy}%</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Games Played</span>
                        <div className="text-2xl font-bold">{weakness.totalGames}</div>
                      </div>
                    </div>

                    <p className="text-sm font-medium text-gray-700 mb-2">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      {weakness.reason}
                    </p>
                  </div>

                  <Button
                    onClick={() => onPracticeClick({
                      operation: weakness.operation,
                      level: weakness.level,
                    })}
                    className="bg-blue-500 hover:bg-blue-600 ml-4"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Practice Now
                  </Button>
                </div>

                {/* Practice Tips */}
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    <Zap className="w-4 h-4 inline mr-1 text-yellow-500" />
                    AI Tip:
                  </p>
                  <p className="text-sm text-gray-600">
                    {getWeaknessTip(weakness)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Common Mistakes */}
      {commonMistakes.length > 0 && (
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-6 h-6 text-purple-600" />
              Common Mistakes to Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {commonMistakes.map((mistake, index) => (
              <div key={index} className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold capitalize">
                    {mistake.operation} ({mistake.level})
                  </h3>
                  <Badge className="bg-purple-500 text-white">
                    {mistake.count} mistakes
                  </Badge>
                </div>
                {mistake.examples.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Examples:</span> {mistake.examples.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function to generate tips
function getWeaknessTip(weakness) {
  const tips = {
    addition: "Try breaking down larger numbers into smaller, easier pieces. Practice counting up from the first number.",
    subtraction: "Use a number line to visualize taking away. Count backwards or think 'what do I add to get to the bigger number?'",
    multiplication: "Memorize the times tables! Look for patterns like doubling or skip counting.",
    division: "Think of division as 'sharing equally' or 'how many groups'. Draw circles to visualize!",
    fractions: "Draw pictures to see the parts. Remember: the bottom number shows how many pieces total.",
    decimals: "Line up the decimal points! Think of money - $1.50 is 1 dollar and 50 cents.",
    word_problems: "Read carefully! Underline key numbers and words like 'total', 'difference', or 'each'.",
  };

  return tips[weakness.operation] || "Practice regularly and take your time. You can do this!";
}