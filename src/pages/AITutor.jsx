import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
// Firebase migration
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app as firebaseApp } from "@/firebaseConfig"; // TODO: Ensure firebaseConfig.js is set up
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, TrendingDown, Target, BookOpen, Zap, Award, Sparkles, Play, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import WeaknessAnalyzer from "../components/tutor/WeaknessAnalyzer";
import PracticeExercises from "../components/tutor/PracticeExercises";
import TutorAnalysis from "../components/tutor/TutorAnalysis";

export default function AITutor() {
  const [activeTab, setActiveTab] = useState("analysis");
  const [selectedWeakness, setSelectedWeakness] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['gameProgress'],
    queryFn: () => base44.entities.GameProgress.list('-created_date'),
    initialData: [],
  });

  const { data: tutorSessions = [] } = useQuery({
    queryKey: ['tutorSessions'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.TutorSession.filter({ created_by: user.email });
    },
    initialData: [],
  });

  const getTotalTutoringSessions = () => tutorSessions.length;
  const getHintsRequested = () => tutorSessions.filter(s => s.hint_requested).length;
  const getExplanationsViewed = () => tutorSessions.filter(s => s.explanation_viewed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <Brain className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Math Tutor
        </h1>
        <p className="text-xl text-gray-600">Your personal learning assistant powered by AI</p>
      </div>

      {/* Welcome Message */}
      <Alert className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Welcome to your AI Tutor!</strong> I analyze your performance, identify areas for improvement, and create personalized practice exercises just for you. Let's make math fun and easy! 🚀
        </AlertDescription>
      </Alert>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-6 text-center">
            <Brain className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold mb-1">{getTotalTutoringSessions()}</div>
            <p className="text-sm text-white/90">Tutoring Sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold mb-1">{getHintsRequested()}</div>
            <p className="text-sm text-white/90">Hints Received</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold mb-1">{getExplanationsViewed()}</div>
            <p className="text-sm text-white/90">Explanations Read</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold mb-1">{progress.length}</div>
            <p className="text-sm text-white/90">Games Analyzed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card className="border-4 border-purple-200 shadow-xl">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="analysis">
                <TrendingDown className="w-4 h-4 mr-2" />
                Performance Analysis
              </TabsTrigger>
              <TabsTrigger value="weaknesses">
                <Target className="w-4 h-4 mr-2" />
                Areas to Improve
              </TabsTrigger>
              <TabsTrigger value="practice">
                <Play className="w-4 h-4 mr-2" />
                Practice Exercises
              </TabsTrigger>
            </TabsList>

            {/* Performance Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <TutorAnalysis 
                progress={progress}
                tutorSessions={tutorSessions}
                onWeaknessClick={(weakness) => {
                  setSelectedWeakness(weakness);
                  setActiveTab("practice");
                }}
              />
            </TabsContent>

            {/* Weaknesses Tab */}
            <TabsContent value="weaknesses" className="space-y-6">
              <WeaknessAnalyzer
                progress={progress}
                tutorSessions={tutorSessions}
                onPracticeClick={(weakness) => {
                  setSelectedWeakness(weakness);
                  setActiveTab("practice");
                }}
              />
            </TabsContent>

            {/* Practice Exercises Tab */}
            <TabsContent value="practice" className="space-y-6">
              <PracticeExercises
                selectedWeakness={selectedWeakness}
                progress={progress}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            How Your AI Tutor Works
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold mb-2">1. Analyze Performance</h3>
            <p className="text-sm text-gray-600">AI reviews your games and identifies patterns in mistakes</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold mb-2">2. Find Weaknesses</h3>
            <p className="text-sm text-gray-600">Discover specific topics where you need more practice</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold mb-2">3. Personalized Practice</h3>
            <p className="text-sm text-gray-600">Get custom exercises designed just for you</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}