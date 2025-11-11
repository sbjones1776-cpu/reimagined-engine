
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, TrendingUp, Target, Settings, Info, BookOpen, Shield, Crown, MessageSquare, BarChart3, UserCog, ClipboardList, Bell, CreditCard } from "lucide-react";
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import ChildSelector from "../components/parent/ChildSelector";
import OverviewStats from "../components/parent/OverviewStats";
import PerformanceAnalysis from "../components/parent/PerformanceAnalysis";
import GoalManager from "../components/parent/GoalManager";
import ProgressTimeline from "../components/parent/ProgressTimeline";
import TeamChallengeCreator from "../components/parent/TeamChallengeCreator";
import ParentalControls from "../components/parent/ParentalControls";
import LessonAssignment from "../components/parent/LessonAssignment";
import CommunicationCenter from "../components/parent/CommunicationCenter";
import StudentAccountManager from "../components/parent/StudentAccountManager";
import AnalyticsDashboard from "../components/parent/AnalyticsDashboard";
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import PremiumFeatureLock from '@/components/PremiumFeatureLock';

export default function ParentPortal() {
  const queryClient = useQueryClient();
  const [selectedChildEmail, setSelectedChildEmail] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPremiumLock, setShowPremiumLock] = useState(false);
  const { user: enrichedUser } = useFirebaseUser();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      // TODO: Replace with Firebase query
      return { 
        email: 'parent@example.com', 
        is_parent_mode: true,
        is_premium_parent: false,
        is_family_teacher: false
      };
    },
    initialData: { 
      email: 'parent@example.com', 
      is_parent_mode: true,
      is_premium_parent: false,
      is_family_teacher: false
    },
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      // TODO: Replace with Firebase query to get linked children
      return [];
    },
    initialData: [],
  });

  // Get children linked to this parent
  const myChildren = allUsers.filter(u => u.parent_email === currentUser?.email);

  // Get progress data for selected child
  const { data: childProgress = [] } = useQuery({
    queryKey: ['childProgress', selectedChildEmail],
    queryFn: async () => {
      // TODO: Replace with Firebase query
      return [];
    },
    initialData: [],
    enabled: !!selectedChildEmail,
  });

  const { data: childDailyChallenges = [] } = useQuery({
    queryKey: ['childDailyChallenges', selectedChildEmail],
    queryFn: async () => {
      // TODO: Replace with Firebase query
      return [];
    },
    initialData: [],
    enabled: !!selectedChildEmail,
  });

  const { data: childGoals = [] } = useQuery({
    queryKey: ['childGoals', selectedChildEmail],
    queryFn: async () => {
      // TODO: Replace with Firebase query
      return [];
    },
    initialData: [],
    enabled: !!selectedChildEmail,
  });

  const enableParentModeMutation = useMutation({
    mutationFn: async (isEnabled) => {
      // TODO: Implement Firebase user update
      console.log('Parent mode toggle:', isEnabled);
      alert('Parent mode settings are currently being migrated to Firebase. This feature will be available soon!');
      throw new Error('Parent mode pending implementation');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const selectedChild = myChildren.find(c => c.email === selectedChildEmail);
  const childData = allUsers.find(u => u.email === selectedChildEmail);

  // Check if user has premium access (parent portal is premium-only)
  const hasPremiumParent = currentUser?.entitlements?.premium || false;

  if (!currentUser?.is_parent_mode) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-4 border-purple-300 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-12">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <CardTitle className="text-4xl mb-2">Parent & Teacher Portal</CardTitle>
            <p className="text-xl opacity-90">Monitor and guide your child's learning journey</p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="w-5 h-5 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Welcome to the Parent Portal!</strong> This feature allows you to:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>View detailed progress across all game modes</li>
                  <li>Track performance trends and identify strengths/weaknesses</li>
                  <li>Set custom goals and challenges</li>
                  <li>Monitor daily challenge participation</li>
                  <li>Control app usage and customize learning focus</li>
                  <li>Set time limits and manage feature access</li>
                  <li>Assign specific lessons and practice areas</li>
                  <li>Communicate directly with your child</li>
                  <li>Manage multiple student accounts</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                <h3 className="font-bold mb-2">Track Progress</h3>
                <p className="text-sm text-gray-600">See detailed statistics and performance trends</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                <Target className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-bold mb-2">Assign Lessons</h3>
                <p className="text-sm text-gray-600">Create custom lessons and practice goals</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h3 className="font-bold mb-2">Communicate</h3>
                <p className="text-sm text-gray-600">Send feedback and encouragement</p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => enableParentModeMutation.mutate(true)}
                className="h-14 px-8 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={enableParentModeMutation.isPending}
              >
                <Users className="w-5 h-5 mr-2" />
                {enableParentModeMutation.isPending ? "Enabling..." : "Enable Parent Mode"}
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                You can switch back to regular mode anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show premium upsell if in parent mode but not subscribed to premium features
  if (!hasPremiumParent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-4 border-yellow-300 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-12">
            <Crown className="w-20 h-20 mx-auto mb-4" />
            <CardTitle className="text-4xl mb-2">Unlock Premium Parent Features</CardTitle>
            <p className="text-xl opacity-90">Get full access to advanced parental controls and analytics</p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Shield className="w-5 h-5 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Premium Parent Subscription Includes:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Advanced parental controls (time limits, content filtering)</li>
                  <li>Detailed progress analytics and performance insights</li>
                  <li>Custom goal setting and weekly/monthly reports</li>
                  <li>Focus topic recommendations</li>
                  <li>Feature access management</li>
                  <li>Lesson assignment capabilities</li>
                  <li>Communication center with your child</li>
                  <li>Student account management tools</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="text-center">
              <Button 
                className="h-14 px-8 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                onMouseEnter={() => { try { import('./Subscription'); } catch {} }}
                onFocus={() => { try { import('./Subscription'); } catch {} }}
                onClick={() => window.location.assign(createPageUrl("Subscription"))}
              >
                <Crown className="w-5 h-5 mr-2" />
                View Subscription Plans
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Starting at $4.99/month • Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check premium access
  React.useEffect(() => {
    if (enrichedUser && !enrichedUser.hasPremiumAccess) {
      setShowPremiumLock(true);
    }
  }, [enrichedUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Premium Feature Lock */}
      {showPremiumLock && (
        <PremiumFeatureLock
          featureName="Parent & Teacher Dashboard"
          description="Monitor your child's progress with detailed analytics, set learning goals, manage parental controls, and communicate with AI tutors."
          isOpen={showPremiumLock}
          onClose={() => setShowPremiumLock(false)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Parent & Teacher Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive learning management & monitoring</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => window.location.assign(createPageUrl("Subscription"))}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Manage Subscription
          </Button>
          <Button
            variant="outline"
            onClick={() => enableParentModeMutation.mutate(false)}
          >  
            <Settings className="w-4 h-4 mr-2" />
            Exit Parent Mode
          </Button>
          <Button 
            className="bg-gradient-to-r from-yellow-400 to-orange-500"
            onClick={() => window.location.assign(createPageUrl("Subscription"))}
          >  
            <Crown className="w-4 h-4 mr-2" />
            {currentUser?.subscription_tier === "family_teacher" ? "Family Plan" : "Premium"}
          </Button>
        </div>
      </div>

      {/* Child Selector */}
      <div className="mb-8">
        <ChildSelector
          myChildren={myChildren}
          selectedChildEmail={selectedChildEmail}
          onSelectChild={setSelectedChildEmail}
          currentUserEmail={currentUser?.email}
        />
      </div>

      {selectedChild ? (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card 
              className="border-2 border-blue-200 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => setActiveTab("communication")}
            >
              <CardContent className="p-4 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-bold text-sm">Quick Message</h3>
                <p className="text-xs text-gray-600 mt-1">Send encouragement</p>
              </CardContent>
            </Card>

            <Card 
              className="border-2 border-green-200 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => setActiveTab("lessons")}
            >
              <CardContent className="p-4 text-center">
                <ClipboardList className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-bold text-sm">New Assignment</h3>
                <p className="text-xs text-gray-600 mt-1">Create lesson</p>
              </CardContent>
            </Card>

            <Card 
              className="border-2 border-purple-200 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => setActiveTab("analytics")}
            >
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-bold text-sm">View Report</h3>
                <p className="text-xs text-gray-600 mt-1">Generate PDF</p>
              </CardContent>
            </Card>

            <Card 
              className="border-2 border-orange-200 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => setActiveTab("goals")}
            >
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <h3 className="font-bold text-sm">Set Goal</h3>
                <p className="text-xs text-gray-600 mt-1">New challenge</p>
              </CardContent>
            </Card>
          </div>

          {/* Overview Stats */}
          <OverviewStats
            childProgress={childProgress}
            childDailyChallenges={childDailyChallenges}
            selectedChild={selectedChild}
          />

          {/* Main Dashboard Tabs */}
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
                  <TabsTrigger value="overview">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="analytics">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="lessons">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Lessons
                  </TabsTrigger>
                  <TabsTrigger value="goals">
                    <Target className="w-4 h-4 mr-2" />
                    Goals
                  </TabsTrigger>
                  <TabsTrigger value="communication">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </TabsTrigger>
                  <TabsTrigger value="team">
                    <Users className="w-4 h-4 mr-2" />
                    Team
                  </TabsTrigger>
                  <TabsTrigger value="controls">
                    <Shield className="w-4 h-4 mr-2" />
                    Controls
                  </TabsTrigger>
                  <TabsTrigger value="accounts">
                    <UserCog className="w-4 h-4 mr-2" />
                    Accounts
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <PerformanceAnalysis
                    childProgress={childProgress}
                    childDailyChallenges={childDailyChallenges}
                  />
                  <ProgressTimeline
                    childProgress={childProgress}
                    childDailyChallenges={childDailyChallenges}
                  />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <AnalyticsDashboard
                    childEmail={selectedChildEmail}
                    childProgress={childProgress}
                    childDailyChallenges={childDailyChallenges}
                  />
                </TabsContent>

                <TabsContent value="lessons" className="space-y-6">
                  <LessonAssignment
                    childEmail={selectedChildEmail}
                    childProgress={childProgress}
                  />
                </TabsContent>

                <TabsContent value="goals" className="space-y-6">
                  <GoalManager
                    childEmail={selectedChildEmail}
                    childGoals={childGoals}
                    childProgress={childProgress}
                    childDailyChallenges={childDailyChallenges}
                  />
                </TabsContent>

                <TabsContent value="communication" className="space-y-6">
                  <CommunicationCenter
                    childEmail={selectedChildEmail}
                    parentEmail={currentUser?.email}
                  />
                </TabsContent>

                <TabsContent value="team" className="space-y-6">
                  <TeamChallengeCreator />
                </TabsContent>

                <TabsContent value="controls" className="space-y-6">
                  <ParentalControls
                    childEmail={selectedChildEmail}
                    currentControls={childData?.parental_controls || {}}
                  />
                </TabsContent>

                <TabsContent value="accounts" className="space-y-6">
                  <StudentAccountManager
                    myChildren={myChildren}
                    parentEmail={currentUser?.email}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-2 border-gray-200">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold mb-2">No Child Selected</h3>
            <p className="text-gray-600 mb-6">
              {myChildren.length > 0
                ? "Select a child from above to view their progress"
                : "Add a child account to start monitoring their progress"}
            </p>
            {myChildren.length === 0 && (
              <Alert className="bg-blue-50 border-blue-200 text-left">
                <Info className="w-5 h-5 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>How to add a child:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Have your child create an account</li>
                    <li>In their account settings, they can add your email as their parent</li>
                    <li>Their progress will then appear in your portal</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

