import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Play, Check, X, Brain, Star, Sparkles, RefreshCw, Target } from "lucide-react";
import { generateQuestion } from "../game/QuestionGenerator";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PracticeExercises({ selectedWeakness, progress }) {
  const [currentExercise, setCurrentExercise] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [practiceMode, setPracticeMode] = useState(null);

  // Generate practice recommendations
  const getPracticeRecommendations = () => {
    const recommendations = [];
    const operationStats = {};

    progress.forEach(p => {
      if (!operationStats[p.operation]) {
        operationStats[p.operation] = {
          operation: p.operation,
          level: p.level,
          totalCorrect: 0,
          totalQuestions: 0,
        };
      }
      operationStats[p.operation].totalCorrect += p.correct_answers;
      operationStats[p.operation].totalQuestions += p.total_questions;
    });

    // Find topics with less than 75% accuracy
    Object.values(operationStats).forEach(stat => {
      const accuracy = (stat.totalCorrect / stat.totalQuestions) * 100;
      if (accuracy < 75) {
        recommendations.push({
          operation: stat.operation,
          level: stat.level,
          accuracy: Math.round(accuracy),
          priority: accuracy < 60 ? "high" : "medium",
        });
      }
    });

    return recommendations.sort((a, b) => a.accuracy - b.accuracy).slice(0, 5);
  };

  const generateNewExercise = () => {
    if (practiceMode) {
      const question = generateQuestion(practiceMode.operation, practiceMode.level);
      setCurrentExercise(question);
      setUserAnswer("");
      setIsCorrect(null);
      setShowExplanation(false);
    }
  };

  const startPracticeSession = (operation, level) => {
    setPracticeMode({ operation, level });
    setExerciseCount(0);
    setCorrectCount(0);
    const question = generateQuestion(operation, level);
    setCurrentExercise(question);
    setUserAnswer("");
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const handleSubmit = () => {
    if (!currentExercise || userAnswer === "") return;

    const correct = parseInt(userAnswer) === currentExercise.answer;
    setIsCorrect(correct);
    setExerciseCount(exerciseCount + 1);
    
    if (correct) {
      setCorrectCount(correctCount + 1);
    } else {
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    generateNewExercise();
  };

  const recommendations = getPracticeRecommendations();

  // Start with selected weakness
  useEffect(() => {
    if (selectedWeakness && !practiceMode) {
      startPracticeSession(selectedWeakness.operation, selectedWeakness.level);
    }
  }, [selectedWeakness]);

  return (
    <div className="space-y-6">
      {/* Practice Stats */}
      {practiceMode && exerciseCount > 0 && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">{exerciseCount}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {exerciseCount > 0 ? Math.round((correctCount / exerciseCount) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Exercise */}
      {practiceMode && currentExercise ? (
        <Card className="border-4 border-purple-300 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6" />
                <span className="capitalize">{practiceMode.operation} Practice</span>
              </div>
              <Badge className="bg-white text-purple-600">
                {practiceMode.level}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Question */}
            <div className="text-center mb-8">
              <h3 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">
                {currentExercise.question}
              </h3>

              {/* Answer Input */}
              {isCorrect === null && (
                <div className="max-w-md mx-auto">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSubmit();
                    }}
                    placeholder="Type your answer..."
                    className="w-full text-3xl font-bold text-center p-4 border-4 border-purple-300 rounded-xl mb-4"
                    autoFocus
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={userAnswer === ""}
                    className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Check Answer
                  </Button>
                </div>
              )}

              {/* Feedback */}
              {isCorrect !== null && (
                <div className="space-y-6">
                  {isCorrect ? (
                    <Alert className="bg-green-50 border-green-300">
                      <Check className="w-6 h-6 text-green-600" />
                      <AlertDescription className="text-green-800 text-lg">
                        <strong>Correct! 🎉</strong> Great job!
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-red-50 border-red-300">
                      <X className="w-6 h-6 text-red-600" />
                      <AlertDescription className="text-red-800 text-lg">
                        <strong>Not quite.</strong> The correct answer is <strong>{currentExercise.answer}</strong>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Explanation for incorrect answers */}
                  {!isCorrect && showExplanation && currentExercise.explanation && (
                    <Card className="bg-blue-50 border-2 border-blue-300">
                      <CardContent className="p-6">
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-blue-600" />
                          Let me explain:
                        </h4>
                        <p className="text-gray-700">{currentExercise.explanation}</p>
                      </CardContent>
                    </Card>
                  )}

                  <Button
                    onClick={handleNext}
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Next Question
                    <Play className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Practice Selection */
        <div className="space-y-6">
          {/* Recommended Practice */}
          {recommendations.length > 0 && (
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-orange-600" />
                  Recommended Practice Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold capitalize mb-1">
                        {rec.operation.replace(/_/g, ' ')}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`${
                            rec.priority === "high" ? "bg-red-500" : "bg-orange-500"
                          } text-white`}
                        >
                          {rec.priority === "high" ? "High Priority" : "Medium"}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Current: {rec.accuracy}% accuracy
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => startPracticeSession(rec.operation, rec.level)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* All Topics Quick Practice */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-purple-600" />
                Quick Practice by Topic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {["addition", "subtraction", "multiplication", "division"].map(op => (
                  <Button
                    key={op}
                    onClick={() => startPracticeSession(op, "medium")}
                    variant="outline"
                    className="h-16 text-lg capitalize"
                  >
                    {op}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Full Game Mode */}
          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Ready for a Full Challenge?</h3>
              <p className="text-gray-700 mb-4">
                Try a complete game with stars and rewards!
              </p>
              <Link to={createPageUrl("Home")}>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Play className="w-5 h-5 mr-2" />
                  Go to Games
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}