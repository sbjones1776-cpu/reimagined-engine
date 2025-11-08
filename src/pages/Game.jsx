
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { 
  saveGameProgress, 
  updateUserProfile,
  getUserGameProgress 
} from "@/api/firebaseService";
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // Added CardContent
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert"; // Added Alert, AlertDescription
import { Star, Trophy, ArrowLeft, Clock, Brain, Zap, Lock, Target } from "lucide-react"; // Added Lock, Target
import QuestionCard from "../components/game/QuestionCard";
import ResultScreen from "../components/game/ResultScreen";
import CelebrationAnimation from "../components/game/CelebrationAnimation";
import AITutor from "../components/game/AITutor";
import AdaptiveDifficulty from "../components/game/AdaptiveDifficulty";
import TimeTracker from "../components/parent/TimeTracker"; // Added TimeTracker
import { generateQuestion } from "../components/game/QuestionGenerator";
import { format } from "date-fns"; // Added format

export default function Game() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const urlParams = new URLSearchParams(window.location.search);
  const initialOperation = urlParams.get("operation");
  const initialLevel = urlParams.get("level");

  const [operation, setOperation] = useState(initialOperation);
  const [level, setLevel] = useState(initialLevel);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [showCelebration, setShowCelebration] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showTutor, setShowTutor] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [showDifficultyAdjustment, setShowDifficultyAdjustment] = useState(false);
  const [difficultyAdjustment, setDifficultyAdjustment] = useState(null);
  const [activePowerUps, setActivePowerUps] = useState({});
  const [showFocusReminder, setShowFocusReminder] = useState(false); // Added state

  const totalQuestions = 10;

  const { user } = useFirebaseUser();

  const { data: recentProgress = [] } = useQuery({
    queryKey: ['recentProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const progress = await getUserGameProgress(user.email);
      return progress.slice(0, 5);
    },
    initialData: [],
    enabled: !!user?.email,
  });

  // Check premium status from entitlements
  const isPremium = user?.entitlements?.premium || false;

  // Free tier limitations: only basic concepts and Easy level
  const freeTierConcepts = [
    "addition", "subtraction", "multiplication", "division",
    "addition_single_digit", "subtraction_single_digit",
    "counting", "number_comparison"
  ];
  const freeTierLevels = ["easy"];

  // Check parental controls (or apply free tier limits)
  const parentalControls = user?.parental_controls || {};
  const focusOperations = parentalControls.focus_operations || [];
  const focusPriority = parentalControls.focus_priority || "suggest";
  const focusReminderFreq = parentalControls.focus_reminder_frequency || "never";
  
  // Apply free tier limits if not premium, otherwise use parental controls
  const allConcepts = ["addition", "subtraction", "multiplication", "division", "fractions", "decimals", "percentages", "word_problems", "money_math", "time", "geometry", "mixed", "counting", "number_comparison", "skip_counting_2s", "skip_counting_5s", "skip_counting_10s", "even_odd", "ordering_numbers", "place_value", "addition_single_digit", "subtraction_single_digit"];
  const allowedOperations = isPremium 
    ? (parentalControls.allowed_operations || allConcepts)
    : freeTierConcepts;
  const allowedLevels = isPremium
    ? (parentalControls.allowed_levels || ["easy", "medium", "hard", "expert"])
    : freeTierLevels;
  
  // Check time limits
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const dailyUsageTracking = user?.daily_usage_tracking || {};
  const todayUsage = dailyUsageTracking[todayKey] || { total_minutes: 0, by_operation: {} };
  const dailyLimit = parentalControls.daily_time_limit_minutes || 0;
  const operationLimits = parentalControls.time_limits_by_operation || {};
  const enforceTimeLimits = parentalControls.enforce_time_limits !== false;

  // Check if operation/level is allowed
  const isOperationAllowed = allowedOperations.includes(operation);
  const isLevelAllowed = allowedLevels.includes(level);
  
  // Check time limits
  const isTimeLimitReached = enforceTimeLimits && dailyLimit > 0 && (todayUsage.total_minutes || 0) >= dailyLimit;
  const isOperationTimeLimitReached = enforceTimeLimits && operation && operationLimits[operation] && (todayUsage.by_operation?.[operation] || 0) >= operationLimits[operation];

  // Show focus reminder
  useEffect(() => {
    if (focusOperations.length > 0 && focusReminderFreq === "every_session" && !focusOperations.includes(operation)) {
      setShowFocusReminder(true);
    }
  }, [operation, focusOperations, focusReminderFreq]);

  useEffect(() => {
    generateQuestions();
    setStartTime(Date.now());
  }, [operation, level]);

  useEffect(() => {
    if (!isFinished) {
      const interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isFinished]);

  const checkAdaptiveDifficulty = () => {
    if (recentProgress.length < 3) return null;

    const recentAccuracy = recentProgress.map(p => 
      (p.correct_answers / p.total_questions) * 100
    );
    const avgAccuracy = recentAccuracy.reduce((a, b) => a + b, 0) / recentAccuracy.length;

    if (avgAccuracy >= 90 && level !== "expert") {
      return "harder";
    } else if (avgAccuracy < 60 && level !== "easy") {
      return "easier";
    }
    return null;
  };

  const adjustDifficulty = (adjustment) => {
    if (adjustment === "harder") {
      if (level === "easy") setLevel("medium");
      else if (level === "medium") setLevel("hard");
      else if (level === "hard") setLevel("expert");
    } else if (adjustment === "easier") {
      if (level === "expert") setLevel("hard");
      else if (level === "hard") setLevel("medium");
      else if (level === "medium") setLevel("easy");
    }
  };

  const generateQuestions = () => {
    const newQuestions = [];
    for (let i = 0; i < totalQuestions; i++) {
      newQuestions.push(generateQuestion(operation, level));
    }
    setQuestions(newQuestions);
  };

  const awardCoins = (correctAnswers, timeTaken) => {
    let coins = correctAnswers * 5;
    
    if (timeTaken < 60) coins += 20;
    else if (timeTaken < 120) coins += 10;
    
    if (correctAnswers === totalQuestions) coins += 30;
    
    if (activePowerUps.double_coins) coins *= 2;
    
    return coins;
  };

  const saveProgressMutation = useMutation({
    mutationFn: async (progressData) => {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }
      
      // Save game progress to Firestore
      const savedProgress = await saveGameProgress(user.email, progressData);
      
      // Update user coins and pet experience
      const coins = progressData.coins_earned || 0;
      const newTotalCoins = (user?.coins || 0) + coins;
      
      const updates = {
        coins: newTotalCoins,
        total_stars_earned: (user?.total_stars_earned || 0) + (progressData.stars_earned || 0)
      };
      
      // Update pet experience if user has an active pet
      const activePet = user?.active_pet;
      if (activePet) {
        const currentExp = user?.pet_experience?.[activePet] || 0;
        const xpGained = progressData.correct_answers * 10;
        updates.pet_experience = {
          ...(user?.pet_experience || {}),
          [activePet]: currentExp + xpGained,
        };
      }
      
      await updateUserProfile(user.email, updates);
      
      return savedProgress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameProgress'] });
      queryClient.invalidateQueries({ queryKey: ['recentProgress'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const handleAnswer = (selectedAnswer) => {
    const correct = selectedAnswer === questions[currentQuestion].answer;
    setAnswers([...answers, { question: currentQuestion, correct }]);
    
    if (correct) {
      setScore(score + 10);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
      
      setTimeout(() => {
        moveToNextQuestion();
      }, 500);
    } else {
      setWrongAnswer({
        question: questions[currentQuestion].question,
        correctAnswer: questions[currentQuestion].answer,
        userAnswer: selectedAnswer,
        explanation: questions[currentQuestion].explanation,
      });
      setShowTutor(true);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      
      if ((currentQuestion + 1) % 3 === 0) {
        const adjustment = checkAdaptiveDifficulty();
        if (adjustment) {
          setDifficultyAdjustment(adjustment);
          setShowDifficultyAdjustment(true);
          adjustDifficulty(adjustment);
          setTimeout(() => {
            generateQuestions();
          }, 2000);
        }
      }
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const correctAnswers = answers.filter(a => a.correct).length;
    let finalScore = score;
    
    if (activePowerUps.double_stars) {
      finalScore *= 2;
    }
    
    let stars = 0;
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage >= 90) stars = 3;
    else if (percentage >= 70) stars = 2;
    else if (percentage >= 50) stars = 1;

    if (activePowerUps.double_stars && stars > 0) {
      stars = Math.min(stars * 2, 3);
    }

    const coinsEarned = awardCoins(correctAnswers, timeTaken);

    const learningObjectives = {
      addition: "Practice adding numbers accurately",
      subtraction: "Practice subtracting numbers accurately",
      multiplication: "Master multiplication facts and techniques",
      division: "Understand division and practice calculations",
      fractions: "Work with fractions - add, subtract, multiply, divide",
      decimals: "Practice decimal operations",
      percentages: "Calculate percentages",
      word_problems: "Apply math to real-world scenarios",
      money: "Work with dollars and cents",
      time: "Practice telling time and calculating elapsed time",
      geometry: "Understand shapes, area, perimeter, and volume",
      mixed: "Practice multiple operations",
    };

    saveProgressMutation.mutate({
      level,
      operation,
      score: finalScore,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      time_taken: timeTaken,
      stars_earned: stars,
      coins_earned: coinsEarned,
      learning_objective: learningObjectives[operation] || "Mathematical problem solving",
    });

    setTimeout(() => {
      setIsFinished(true);
    }, 500);
  };

  const handleTutorContinue = () => {
    setShowTutor(false);
    setWrongAnswer(null);
    moveToNextQuestion();
  };

  // Check if game is blocked
  if (!operation || !level) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600 mb-4">Invalid game configuration</p>
        <Button onClick={() => navigate(createPageUrl("Home"))}>
          Go Back Home
        </Button>
      </div>
    );
  }

  if (!isOperationAllowed || !isLevelAllowed) {
    const isPremiumLocked = !isPremium && (!freeTierConcepts.includes(operation) || !freeTierLevels.includes(level));
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className={`border-4 ${isPremiumLocked ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-red-300'} shadow-xl`}>
          <CardContent className="p-12 text-center">
            {isPremiumLocked ? (
              <>
                <Lock className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
                <div className="inline-flex items-center gap-2 mb-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-2xl font-bold text-yellow-700">Premium Content</h2>
                </div>
                <p className="text-gray-700 mb-4 font-medium">
                  {!freeTierConcepts.includes(operation) && "This math concept is available in Premium."}
                  {!freeTierLevels.includes(level) && freeTierConcepts.includes(operation) && "This difficulty level is available in Premium."}
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Upgrade to unlock 80+ math concepts and all difficulty levels!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => navigate(createPageUrl("Subscription"))}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate(createPageUrl("Home"))}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Lock className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h2 className="text-2xl font-bold mb-4 text-red-700">Content Restricted</h2>
                <p className="text-gray-600 mb-6">
                  {!isOperationAllowed && "This math concept is currently restricted by your parent."}
                  {!isLevelAllowed && isOperationAllowed && "This difficulty level is currently restricted by your parent."}
                </p>
                <Button onClick={() => navigate(createPageUrl("Home"))}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isTimeLimitReached || isOperationTimeLimitReached) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-4 border-orange-300 shadow-xl">
          <CardContent className="p-12 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-orange-500" />
            <h2 className="text-2xl font-bold mb-4 text-orange-700">Time Limit Reached</h2>
            <p className="text-gray-600 mb-6">
              You've used your allotted time for today. Great job practicing! Come back tomorrow to continue learning.
            </p>
            <div className="text-sm text-gray-500 mb-6">
              Time resets at midnight 🌙
            </div>
            <Button onClick={() => navigate(createPageUrl("Home"))}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your challenge...</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const correctAnswers = answers.filter(a => a.correct).length;
    return (
      <ResultScreen
        score={score}
        correctAnswers={correctAnswers}
        totalQuestions={totalQuestions}
        timeTaken={timer}
        operation={operation}
        level={level}
        coinsEarned={awardCoins(correctAnswers, timer)}
        activePowerUps={activePowerUps}
      />
    );
  }

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {showCelebration && <CelebrationAnimation />}
      
      {/* AI Tutor Modal */}
      {showTutor && wrongAnswer && (
        <AITutor
          question={wrongAnswer.question}
          correctAnswer={wrongAnswer.correctAnswer}
          userAnswer={wrongAnswer.userAnswer}
          explanation={wrongAnswer.explanation}
          operation={operation}
          level={level}
          onContinue={handleTutorContinue}
        />
      )}

      {/* Adaptive Difficulty Notification */}
      {showDifficultyAdjustment && (
        <AdaptiveDifficulty
          adjustment={difficultyAdjustment}
          onClose={() => setShowDifficultyAdjustment(false)}
        />
      )}

      {/* Focus Reminder */}
      {showFocusReminder && (
        <Alert className="mb-6 bg-purple-50 border-purple-300">
          <Target className="w-5 h-5 text-purple-600" />
          <AlertDescription className="text-purple-800 flex items-center justify-between">
            <div>
              <strong>Parent Suggestion:</strong> Your parent recommends focusing on{" "}
              {focusOperations.join(", ")}. Try playing those games!
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFocusReminder(false)}
              className="ml-4 text-purple-700 hover:bg-purple-100"
            >
              Got it
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Time Tracker */}
      <TimeTracker operation={operation} />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("Home"))}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            {Object.keys(activePowerUps).length > 0 && (
              <Badge variant="outline" className="text-lg px-4 py-2 bg-yellow-50 border-yellow-300">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Power-Ups Active
              </Badge>
            )}
            <Badge variant="outline" className="text-lg px-4 py-2 bg-white">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              AI Tutor Active
            </Badge>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-gray-800">{timer}s</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-800">{score}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </div>

      {/* Question */}
      {questions.length > 0 && (
        <QuestionCard
          question={questions[currentQuestion]}
          onAnswer={handleAnswer}
          questionNumber={currentQuestion + 1}
        />
      )}
    </div>
  );
}
