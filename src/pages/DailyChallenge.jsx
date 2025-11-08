import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
// Firebase migration
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app as firebaseApp } from "@/firebaseConfig"; // TODO: Ensure firebaseConfig.js is set up
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Star, Clock, Flame, Users, ArrowLeft, CheckCircle, Zap, Target, Brain, Award } from "lucide-react";
import { format, startOfDay } from "date-fns";
import QuestionCard from "../components/game/QuestionCard";
import CelebrationAnimation from "../components/game/CelebrationAnimation";
import Leaderboard from "../components/daily/Leaderboard";
import { generateDailyChallenge, calculateDailyChallengeRewards } from "../components/daily/DailyChallengeGenerator";
import TextToSpeech from "@/components/ui/TextToSpeech";

export default function DailyChallenge() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [challengeData, setChallengeData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [showCelebration, setShowCelebration] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  // Explanation state for incorrect answers (pause before moving on)
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationData, setExplanationData] = useState(null); // { questionObj, userAnswer, correctAnswer, explanation }

  const todayDate = format(startOfDay(new Date()), "yyyy-MM-dd");

  // Determine challenge type for today (rotates daily)
  const getChallengeType = () => {
    const dayOfWeek = new Date().getDay();
    const challengeTypes = [
      "streak_builder",      // Sunday - easier to maintain streaks
      "standard_mixed",      // Monday
      "speed_round",         // Tuesday
      "concept_mastery",     // Wednesday
      "accuracy_focus",      // Thursday
      "word_problem_day",    // Friday
      "brain_teaser",        // Saturday
    ];
    return challengeTypes[dayOfWeek];
  };

  const challengeType = getChallengeType();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const db = getFirestore(firebaseApp);
      // TODO: Replace with actual user ID
      // Example: getDoc(doc(db, "users", "USER_ID"))
      return null;
    },
  });

  const { data: todaysChallenges = [] } = useQuery({
    queryKey: ['dailyChallenges', todayDate],
    queryFn: async () => {
      const db = getFirestore(firebaseApp);
      const q = query(collection(db, "dailyChallenges"), where("challenge_date", "==", todayDate));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    },
    initialData: [],
  });

  const { data: userChallenges = [] } = useQuery({
    queryKey: ['userDailyChallenges'],
    queryFn: async () => {
      const db = getFirestore(firebaseApp);
      if (!user?.email) return [];
      const q = query(collection(db, "dailyChallenges"), where("created_by", "==", user.email));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    },
    initialData: [],
    enabled: !!user,
  });

  const hasCompletedToday = todaysChallenges.some(c => c.created_by === user?.email);

  // Calculate streak
  const getStreak = () => {
    if (userChallenges.length === 0) return 0;
    
    const sortedChallenges = [...userChallenges].sort((a, b) => 
      new Date(b.challenge_date) - new Date(a.challenge_date)
    );
    
    let streak = 0;
    let currentDate = startOfDay(new Date());
    
    for (const challenge of sortedChallenges) {
      const challengeDate = startOfDay(new Date(challenge.challenge_date));
      const daysDiff = Math.floor((currentDate - challengeDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = getStreak();

  useEffect(() => {
    if (!isFinished && hasStarted) {
      const interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isFinished, hasStarted]);

  const saveChallengeeMutation = useMutation({
    mutationFn: (challengeData) => base44.entities.DailyChallenge.create(challengeData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dailyChallenges'] });
      queryClient.invalidateQueries({ queryKey: ['userDailyChallenges'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      
      // Award coins
      const coins = variables.bonus_coins || 0;
      const newTotalCoins = (user?.coins || 0) + coins;
      base44.auth.updateMe({ coins: newTotalCoins });
    },
  });

  const handleStart = () => {
    const challenge = generateDailyChallenge(todayDate, challengeType);
    setChallengeData(challenge);
    setStartTime(Date.now());
    setHasStarted(true);
  };

  const handleAnswer = (selectedAnswer) => {
    const correct = selectedAnswer === challengeData.questions[currentQuestion].answer;
    setAnswers([...answers, { question: currentQuestion, correct }]);
    
    if (correct) {
      setScore(score + 10);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
    }
    // WRONG ANSWER FLOW: show explanation BEFORE advancing
    if (!correct) {
      const qObj = challengeData.questions[currentQuestion];
      setExplanationData({
        questionObj: qObj,
        userAnswer: selectedAnswer,
        correctAnswer: qObj.answer,
        explanation: qObj.explanation || 'Review the steps to solve this problem.',
      });
      setShowExplanation(true);
      return; // Do not advance yet
    }

    // CORRECT ANSWER FLOW: advance or finish
    if (currentQuestion < challengeData.totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      finalizeChallenge(correct);
    }
  };

  // Build a kid-friendly, step-by-step solution and a single TTS string
  const buildStepByStep = (qObj, correct) => {
    const q = (qObj?.question || '').trim();
    const steps = [];
    let op = null;
    let a = null;
    let b = null;

    // Parse basic "A op B" formats
    const parse = (str) => {
      const ops = [
        { key: '+', name: 'addition' },
        { key: '-', name: 'subtraction' },
        { key: '×', name: 'multiplication' },
        { key: 'x', name: 'multiplication' },
        { key: '⋅', name: 'multiplication' },
        { key: '·', name: 'multiplication' },
        { key: '÷', name: 'division' },
        { key: '/', name: 'division' },
      ];
      for (const o of ops) {
        if (str.includes(` ${o.key} `)) {
          const [left, right] = str.split(` ${o.key} `);
          const A = parseFloat(left.replace(/[^0-9.\-]/g, ''));
          const B = parseFloat(right.replace(/[^0-9.\-]/g, ''));
          if (!Number.isNaN(A) && !Number.isNaN(B)) {
            return { op: o.name, a: A, b: B };
          }
        }
      }
      return null;
    };

    const parsed = parse(q);
    if (parsed) { op = parsed.op; a = parsed.a; b = parsed.b; }

    // Generate steps for recognized patterns
    if (op === 'addition') {
      steps.push(`Set up the problem: ${a} + ${b}`);
      const ones = (a % 10) + (b % 10);
      if (a >= 10 && b >= 10) {
        steps.push(`Add the ones place: ${(a % 10)} + ${(b % 10)} = ${ones}${ones >= 10 ? ' (carry 1)' : ''}`);
        steps.push(`Add the tens (and carry if needed): ${Math.floor(a / 10)} + ${Math.floor(b / 10)}${ones >= 10 ? ' + 1' : ''}`);
      } else {
        steps.push(`Add the numbers: ${a} + ${b}`);
      }
      steps.push(`Final answer: ${correct}`);
    } else if (op === 'subtraction') {
      steps.push(`Set up the problem: ${a} - ${b}`);
      if ((a % 10) < (b % 10) && a >= 10) {
        steps.push('Borrow from the tens place so you can subtract the ones place.');
      }
      steps.push(`Subtract to find the difference: ${a} - ${b} = ${correct}`);
    } else if (op === 'multiplication') {
      steps.push(`Think of ${a} groups of ${b}.`);
      if (a >= 10 || b >= 10) {
        steps.push(`Break it apart to make it easier, then multiply and add.`);
      }
      steps.push(`Multiply: ${a} × ${b} = ${correct}`);
    } else if (op === 'division') {
      steps.push(`How many ${b}'s fit into ${a}?`);
      steps.push(`Count groups or use facts until you reach ${a}.`);
      steps.push(`So, ${a} ÷ ${b} = ${correct}`);
    } else if (q.includes('.') || /\d+\.\d+/.test(q)) {
      steps.push('Line up the decimal points.');
      steps.push('Add or subtract carefully column by column.');
      steps.push(`Final answer: ${correct}`);
    } else {
      // Fallback to provided explanation text
      if (qObj?.explanation) {
        steps.push(qObj.explanation);
      } else {
        steps.push('Solve step by step to find the answer.');
      }
    }

    const tts = [
      `Let's solve it step by step.`,
      ...steps.map((s, i) => `Step ${i + 1}. ${s}`),
    ].join(' ');
    return { steps, tts };
  };

  // Helper to finalize the challenge (used after last question or after final explanation)
  const finalizeChallenge = (wasLastAnswerCorrect) => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const correctAnswers = answers.filter(a => a.correct).length + (wasLastAnswerCorrect ? 1 : 0);
    const finalScore = score + (wasLastAnswerCorrect ? 10 : 0);
    const accuracy = (correctAnswers / challengeData.totalQuestions) * 100;

    const rewards = calculateDailyChallengeRewards(challengeData, accuracy, timeTaken, streak);

    saveChallengeeMutation.mutate({
      challenge_date: todayDate,
      challenge_type: challengeType,
      score: finalScore,
      correct_answers: correctAnswers,
      total_questions: challengeData.totalQuestions,
      time_taken: timeTaken,
      bonus_stars: rewards.bonusStars,
      bonus_coins: rewards.bonusCoins,
      streak_bonus: streak >= 3,
      perfect_score_bonus: rewards.perfectScoreBonus,
      speed_bonus: rewards.speedBonus,
      challenge_objective: challengeData.objective,
      concepts_covered: challengeData.concepts,
    });

    setTimeout(() => setIsFinished(true), 500);
  };

  // Continue button after showing explanation for an incorrect answer
  const handleContinueAfterExplanation = () => {
    setShowExplanation(false);
    setExplanationData(null);
    if (currentQuestion < challengeData.totalQuestions - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Finished (last was incorrect)
      finalizeChallenge(false);
    }
  };

  const getChallengeIcon = (type) => {
    const icons = {
      standard_mixed: Calendar,
      speed_round: Zap,
      accuracy_focus: Target,
      concept_mastery: Brain,
      word_problem_day: Award,
      brain_teaser: Trophy,
      grade_level_challenge: Award,
      streak_builder: Flame,
    };
    return icons[type] || Calendar;
  };

  const getChallengeColor = (type) => {
    const colors = {
      standard_mixed: "from-purple-500 to-pink-500",
      speed_round: "from-yellow-500 to-orange-500",
      accuracy_focus: "from-green-500 to-emerald-500",
      concept_mastery: "from-blue-500 to-cyan-500",
      word_problem_day: "from-indigo-500 to-purple-500",
      brain_teaser: "from-red-500 to-pink-500",
      grade_level_challenge: "from-teal-500 to-cyan-500",
      streak_builder: "from-orange-500 to-red-500",
    };
    return colors[type] || "from-purple-500 to-pink-500";
  };

  const ChallengeIcon = getChallengeIcon(challengeType);
  const challengeColor = getChallengeColor(challengeType);

  if (!hasStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Home"))}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {hasCompletedToday ? (
          <Card className="border-4 border-green-300 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <CardTitle className="text-3xl">Challenge Complete!</CardTitle>
              <p className="text-lg mt-2 opacity-90">You've already completed today's challenge</p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Your Results Today</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{todaysChallenges.find(c => c.created_by === user?.email)?.score}</div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <div className="text-2xl font-bold">{todaysChallenges.find(c => c.created_by === user?.email)?.bonus_stars}</div>
                    <div className="text-sm text-gray-600">Bonus Stars</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{todaysChallenges.find(c => c.created_by === user?.email)?.time_taken}s</div>
                    <div className="text-sm text-gray-600">Time</div>
                  </div>
                </div>
              </div>

              <Leaderboard todaysChallenges={todaysChallenges} currentUser={user} />

              <div className="text-center">
                <p className="text-gray-600 mb-4">Come back tomorrow for a new challenge!</p>
                <Button
                  onClick={() => navigate(createPageUrl("Home"))}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-4 border-purple-300 shadow-2xl">
            <CardHeader className={`bg-gradient-to-r ${challengeColor} text-white text-center py-12`}>
              <div className="text-7xl mb-4">
                <ChallengeIcon className="w-20 h-20 mx-auto" />
              </div>
              <CardTitle className="text-4xl mb-2">
                {challengeType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </CardTitle>
              <p className="text-xl opacity-90">{format(new Date(), "MMMM d, yyyy")}</p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {(() => {
                const preview = generateDailyChallenge(todayDate, challengeType);
                return (
                  <>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <Target className="w-6 h-6 text-blue-600" />
                        Today's Objective
                      </h3>
                      <p className="text-lg text-gray-700">{preview.objective}</p>
                      <p className="text-sm text-gray-600 mt-2">{preview.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border-2 border-yellow-200">
                        <Star className="w-12 h-12 text-yellow-500 mb-3" />
                        <h3 className="text-xl font-bold mb-2">Bonus Rewards</h3>
                        <p className="text-gray-600">Up to 5 bonus stars & extra coins!</p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200">
                        <Flame className="w-12 h-12 text-orange-500 mb-3" />
                        <h3 className="text-xl font-bold mb-2">Current Streak</h3>
                        <p className="text-2xl font-bold text-orange-600">{streak} {streak === 1 ? "Day" : "Days"}</p>
                        {streak >= 3 && (
                          <Badge className="mt-2 bg-orange-500">+1 Bonus Star!</Badge>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        Challenge Details
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-bold">Questions:</span> {preview.totalQuestions}
                        </div>
                        <div>
                          <span className="font-bold">Concepts:</span> {preview.concepts.join(', ')}
                        </div>
                        <div>
                          <span className="font-bold">Players Today:</span> {todaysChallenges.length}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        How to Earn Bonus Rewards
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          70%+ accuracy: 1 bonus star
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          85%+ accuracy: 2 bonus stars
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          95%+ accuracy: 3 bonus stars
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-500" />
                          Complete quickly: +1 star & coins
                        </li>
                        <li className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-500" />
                          3+ day streak: +1 extra star & coins
                        </li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleStart}
                      className={`w-full h-16 text-xl bg-gradient-to-r ${challengeColor} hover:opacity-90 shadow-lg`}
                    >
                      Start Today's Challenge
                    </Button>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (isFinished) {
    const correctAnswers = answers.filter(a => a.correct).length;
    const accuracy = (correctAnswers / challengeData.totalQuestions) * 100;
    const todayChallenge = todaysChallenges.find(c => c.created_by === user?.email);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-4 border-yellow-300 shadow-2xl">
          <div className={`bg-gradient-to-r ${challengeColor} py-12 text-white text-center`}>
            <div className="text-8xl mb-4">🏆</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Challenge Complete!</h1>
            <p className="text-xl">Great job on today's challenge!</p>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-3xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">
                  {correctAnswers}/{challengeData.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-3xl font-bold text-blue-600">{timer}s</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500 fill-yellow-500" />
                <div className="text-3xl font-bold text-yellow-600">{todayChallenge?.bonus_stars || 0}</div>
                <div className="text-sm text-gray-600">Bonus Stars</div>
              </div>
            </div>

            {/* Bonus indicators */}
            <div className="flex flex-wrap gap-3 justify-center">
              {todayChallenge?.perfect_score_bonus && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-base">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Perfect Score Bonus!
                </Badge>
              )}
              {todayChallenge?.speed_bonus && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 text-base">
                  <Zap className="w-4 h-4 mr-2" />
                  Speed Bonus!
                </Badge>
              )}
              {todayChallenge?.streak_bonus && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-base">
                  <Flame className="w-4 h-4 mr-2" />
                  Streak Bonus! ({streak} days)
                </Badge>
              )}
            </div>

            {todayChallenge?.bonus_coins > 0 && (
              <div className="bg-gradient-to-r from-cyan-100 to-blue-100 p-4 rounded-xl border-2 border-cyan-300 text-center">
                <p className="font-bold text-lg">Earned {todayChallenge.bonus_coins} Bonus Coins! 🪙</p>
              </div>
            )}

            <Leaderboard todaysChallenges={todaysChallenges} currentUser={user} />

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1 h-14 text-lg gap-2"
                onClick={() => navigate(createPageUrl("Home"))}
              >
                <ArrowLeft className="w-5 h-5" />
                Back Home
              </Button>
              
              <Button
                className={`flex-1 h-14 text-lg bg-gradient-to-r ${challengeColor} hover:opacity-90 gap-2`}
                onClick={() => navigate(createPageUrl("Progress"))}
              >
                <Trophy className="w-5 h-5" />
                View Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / challengeData.totalQuestions) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {showCelebration && <CelebrationAnimation />}
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <ChallengeIcon className="w-5 h-5 mr-2" />
            {challengeType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Badge>
          
          <div className="flex items-center gap-4">
            {challengeData?.timeLimit && (
              <Badge variant={timer > challengeData.timeLimit ? "destructive" : "outline"} className="text-lg px-4 py-2">
                <Clock className="w-5 h-5 mr-2" />
                {timer}s / {challengeData.timeLimit}s
              </Badge>
            )}
            {!challengeData?.timeLimit && (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-gray-800">{timer}s</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-800">{score}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {challengeData.totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </div>

      {/* Question OR Explanation */}
      {showExplanation && explanationData ? (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border-4 border-red-300 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center text-2xl">✖</div>
              <h2 className="text-2xl font-bold text-red-600">Let's Learn From This One</h2>
            </div>
            <p className="text-lg font-semibold mb-2">Question:</p>
            <p className="text-3xl font-bold mb-4">{explanationData.questionObj.question}</p>
            {/* TTS for the whole step-by-step */}
            {(() => {
              const built = buildStepByStep(explanationData.questionObj, explanationData.correctAnswer);
              return (
                <div className="mb-4">
                  <TextToSpeech text={built.tts} style="button" label="🔊 Read the steps" />
                </div>
              );
            })()}
            <div className="grid md:grid-cols-3 gap-4 mb-6 text-center">
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                <p className="text-sm font-medium text-red-600 mb-1">Your Answer</p>
                <p className="text-2xl font-bold text-red-600">{explanationData.userAnswer}</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200">
                <p className="text-sm font-medium text-green-600 mb-1">Correct Answer</p>
                <p className="text-2xl font-bold text-green-600">{explanationData.correctAnswer}</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
                <p className="text-sm font-medium text-purple-600 mb-1">Question #</p>
                <p className="text-2xl font-bold text-purple-600">{currentQuestion + 1}</p>
              </div>
            </div>
            {/* Step-by-step list */}
            {(() => {
              const built = buildStepByStep(explanationData.questionObj, explanationData.correctAnswer);
              return (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 rounded-xl mb-6">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">✨ Let's solve it step by step</h3>
                  <ol className="list-decimal pl-5 space-y-1 text-gray-800">
                    {built.steps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ol>
                </div>
              );
            })()}
            {explanationData.explanation && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 p-6 rounded-xl mb-6">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">🧠 Step-by-Step Explanation</h3>
                <p className="whitespace-pre-line leading-relaxed text-gray-700">{explanationData.explanation}</p>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                onClick={handleContinueAfterExplanation}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 px-8 h-14 text-lg"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      ) : (
        challengeData && challengeData.questions.length > 0 && (
          <QuestionCard
            question={challengeData.questions[currentQuestion]}
            onAnswer={handleAnswer}
            questionNumber={currentQuestion + 1}
          />
        )
      )}
    </div>
  );
}