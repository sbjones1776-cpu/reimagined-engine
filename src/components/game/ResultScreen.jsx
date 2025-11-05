
import React from "react";
import TextToSpeech from "@/components/ui/TextToSpeech";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert"; // New import
import { Trophy, Star, Target, Clock, Home, RotateCcw, ArrowRight, Coins, Sparkles } from "lucide-react"; // Updated lucide-react imports

export default function ResultScreen({ 
  score, 
  correctAnswers, 
  totalQuestions, 
  timeTaken, 
  operation,
  level,
  coinsEarned = 0,
  activePowerUps = {}
}) {
  const navigate = useNavigate();
  
  const percentage = (correctAnswers / totalQuestions) * 100;
  let stars = 0;
  let message = "";
  let emoji = "";
  
  if (percentage >= 90) {
    stars = 3;
    message = "Outstanding! You're a math superstar!";
    emoji = "🌟";
  } else if (percentage >= 70) {
    stars = 2;
    message = "Great job! Keep practicing!";
    emoji = "🎉";
  } else if (percentage >= 50) {
    stars = 1;
    message = "Good effort! Try again to improve!";
    emoji = "👍";
  } else {
    stars = 0;
    message = "Keep practicing! You'll get better!";
    emoji = "💪";
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-4 border-yellow-300 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 py-12 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-8xl mb-4"
            >
              {emoji}
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-2">
              Challenge Complete!
              <TextToSpeech text="Challenge Complete!" style="icon" label="Read title" />
            </h1>
            <p className="text-xl flex items-center gap-2">
              {message}
              <TextToSpeech text={message} style="icon" label="Read message" />
            </p>
          </div>

          <CardContent className="p-8 space-y-6"> {/* Added space-y-6 */}
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-3xl font-bold text-purple-600 flex items-center gap-2">
                  {score}
                  <TextToSpeech text={`Your score is ${score}`} style="icon" label="Read score" />
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-3xl font-bold text-green-600 flex items-center gap-2">
                  {correctAnswers}/{totalQuestions}
                  <TextToSpeech text={`You got ${correctAnswers} out of ${totalQuestions} correct`} style="icon" label="Read correct answers" />
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-3xl font-bold text-blue-600 flex items-center gap-2">
                  {timeTaken}s
                  <TextToSpeech text={`Time taken: ${timeTaken} seconds`} style="icon" label="Read time" />
                </div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500 fill-yellow-500" />
                <div className="text-3xl font-bold text-yellow-600 flex items-center gap-2">
                  {stars}
                  <TextToSpeech text={`You earned ${stars} stars`} style="icon" label="Read stars" />
                </div>
                <div className="text-sm text-gray-600">Stars</div>
              </div>
            </div>

            {/* Coins Earned */}
            {coinsEarned > 0 && (
              <Card className="border-2 border-cyan-300 bg-gradient-to-r from-cyan-50 to-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Coins className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          Coins Earned!
                          <TextToSpeech text={`You earned ${coinsEarned} coins!`} style="icon" label="Read coins" />
                        </h3>
                        <p className="text-sm text-gray-600">Use them in the shop for power-ups</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-cyan-600 flex items-center gap-2">
                      +{coinsEarned}
                      <TextToSpeech text={`Plus ${coinsEarned} coins`} style="icon" label="Read coins" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Power-up effects */}
            {Object.keys(activePowerUps).length > 0 && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 flex items-center gap-2">
                  <strong>Power-ups were active!</strong> Your rewards have been boosted!
                  <TextToSpeech text="Power-ups were active! Your rewards have been boosted!" style="icon" label="Read power-ups" />
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1 h-14 text-lg gap-2"
                onClick={() => navigate(createPageUrl("Home"))}
              >
                <Home className="w-5 h-5" />
                Back Home
              </Button>
              
              <Button
                variant="outline"
                className="flex-1 h-14 text-lg gap-2"
                onClick={() => window.location.reload()}
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </Button>
              
              <Button
                className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 gap-2"
                onClick={() => navigate(createPageUrl("Progress"))}
              >
                View Progress
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
