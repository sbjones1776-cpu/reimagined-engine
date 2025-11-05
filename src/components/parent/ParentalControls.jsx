import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Clock, Target, Lock, Save, AlertTriangle, CheckCircle, Plus, Trash2, Star, Calendar } from "lucide-react";

export default function ParentalControls({ childEmail, currentControls }) {
  const queryClient = useQueryClient();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [controls, setControls] = useState({
    // Time Limits
    daily_time_limit_minutes: 0, // 0 = unlimited
    time_limits_by_operation: {}, // e.g., {addition: 15, subtraction: 10}
    enforce_time_limits: true,
    time_limit_warning_minutes: 5, // Warn when 5 minutes left
    
    // Content Filtering
    allowed_operations: ["addition", "subtraction", "multiplication", "division"],
    allowed_levels: ["easy", "medium", "hard"],
    blocked_features: [], // e.g., ["shop", "leaderboards"]
    
    // Focus Topics
    focus_operations: [],
    focus_priority: "suggest", // "suggest" or "enforce"
    focus_reminder_frequency: "daily", // "never", "daily", "every_session"
    
    // Learning Goals (legacy - keeping for compatibility)
    weekly_goal_games: 0,
    weekly_goal_stars: 0,
    monthly_goal_games: 0,
    monthly_goal_accuracy: 0,
  });

  // Custom Learning Goals (separate from controls for better management)
  const [customGoals, setCustomGoals] = useState([]);
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target_type: "games_completed", // games_completed, stars_earned, accuracy, time_spent
    target_value: 10,
    operation: "any", // any, addition, subtraction, etc.
    level: "any", // any, easy, medium, hard
    deadline: "",
  });

  useEffect(() => {
    if (currentControls) {
      setControls({ ...controls, ...currentControls });
      if (currentControls.custom_learning_goals) {
        setCustomGoals(currentControls.custom_learning_goals);
      }
    }
  }, [currentControls]);

  const updateControlsMutation = useMutation({
    mutationFn: async () => {
      const allUsers = await base44.entities.User.list();
      const childUser = allUsers.find(u => u.email === childEmail);
      
      if (!childUser) throw new Error("Child not found");
      
      return base44.entities.User.update(childUser.id, {
        parental_controls: {
          ...controls,
          custom_learning_goals: customGoals,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const handleSave = () => {
    updateControlsMutation.mutate();
  };

  const operations = [
    { id: "addition", name: "Addition", emoji: "➕" },
    { id: "subtraction", name: "Subtraction", emoji: "➖" },
    { id: "multiplication", name: "Multiplication", emoji: "✖️" },
    { id: "division", name: "Division", emoji: "➗" },
    { id: "fractions", name: "Fractions", emoji: "½" },
    { id: "decimals", name: "Decimals", emoji: "0.5" },
    { id: "percentages", name: "Percentages", emoji: "%" },
    { id: "word_problems", name: "Word Problems", emoji: "📖" },
    { id: "money", name: "Money Math", emoji: "💰" },
    { id: "time", name: "Time", emoji: "⏰" },
    { id: "geometry", name: "Geometry", emoji: "🔷" },
    { id: "mixed", name: "Mixed", emoji: "🧩" },
  ];

  const levels = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" },
    { id: "expert", name: "Expert" },
  ];

  const features = [
    { id: "shop", name: "Shop", description: "Disable access to the rewards shop" },
    { id: "leaderboards", name: "Leaderboards", description: "Hide competitive leaderboards" },
    { id: "team_challenges", name: "Team Challenges", description: "Disable team-based challenges" },
    { id: "daily_challenge", name: "Daily Challenge", description: "Disable daily challenges" },
    { id: "power_ups", name: "Power-Ups", description: "Prevent using power-ups in games" },
  ];

  const toggleOperation = (opId, type) => {
    const key = type === "allowed" ? "allowed_operations" : "focus_operations";
    const current = controls[key];
    
    if (current.includes(opId)) {
      setControls({ ...controls, [key]: current.filter(id => id !== opId) });
    } else {
      setControls({ ...controls, [key]: [...current, opId] });
    }
  };

  const toggleLevel = (levelId) => {
    const current = controls.allowed_levels;
    if (current.includes(levelId)) {
      setControls({ ...controls, allowed_levels: current.filter(id => id !== levelId) });
    } else {
      setControls({ ...controls, allowed_levels: [...current, levelId] });
    }
  };

  const toggleFeature = (featureId) => {
    const current = controls.blocked_features || [];
    if (current.includes(featureId)) {
      setControls({ ...controls, blocked_features: current.filter(id => id !== featureId) });
    } else {
      setControls({ ...controls, blocked_features: [...current, featureId] });
    }
  };

  const updateOperationTimeLimit = (opId, minutes) => {
    setControls({
      ...controls,
      time_limits_by_operation: {
        ...(controls.time_limits_by_operation || {}),
        [opId]: parseInt(minutes) || 0,
      }
    });
  };

  const addCustomGoal = () => {
    if (!newGoal.title) return;
    
    setCustomGoals([...customGoals, { ...newGoal, id: Date.now().toString() }]);
    setNewGoal({
      title: "",
      description: "",
      target_type: "games_completed",
      target_value: 10,
      operation: "any",
      level: "any",
      deadline: "",
    });
    setShowAddGoalForm(false);
  };

  const deleteGoal = (goalId) => {
    setCustomGoals(customGoals.filter(g => g.id !== goalId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          Advanced Parental Controls
        </h3>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <Save className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Settings saved successfully! Changes are now active.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="time-limits" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="time-limits">
            <Clock className="w-4 h-4 mr-2" />
            Time Limits
          </TabsTrigger>
          <TabsTrigger value="content">
            <Lock className="w-4 h-4 mr-2" />
            Content Filter
          </TabsTrigger>
          <TabsTrigger value="focus">
            <Target className="w-4 h-4 mr-2" />
            Focus Topics
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Star className="w-4 h-4 mr-2" />
            Custom Goals
          </TabsTrigger>
        </TabsList>

        {/* TIME LIMITS TAB */}
        <TabsContent value="time-limits" className="space-y-6">
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Daily Time Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Overall Time Limit */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="daily_limit" className="text-base font-bold">
                    Overall Daily Time Limit
                  </Label>
                  <Switch
                    checked={controls.enforce_time_limits}
                    onCheckedChange={(checked) => setControls({ ...controls, enforce_time_limits: checked })}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    id="daily_limit"
                    type="number"
                    min="0"
                    max="480"
                    value={controls.daily_time_limit_minutes}
                    onChange={(e) => setControls({ ...controls, daily_time_limit_minutes: parseInt(e.target.value) || 0 })}
                    className="max-w-xs"
                    disabled={!controls.enforce_time_limits}
                  />
                  <span className="text-gray-600">minutes per day</span>
                </div>
                <p className="text-sm text-gray-600">
                  {controls.daily_time_limit_minutes === 0 
                    ? "Set to 0 for unlimited time" 
                    : `Child can use the app for ${controls.daily_time_limit_minutes} minutes per day`}
                </p>
              </div>

              {/* Warning Time */}
              <div className="space-y-3 pt-4 border-t">
                <Label htmlFor="warning_time" className="text-base font-bold">
                  Time Limit Warning
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="warning_time"
                    type="number"
                    min="1"
                    max="30"
                    value={controls.time_limit_warning_minutes}
                    onChange={(e) => setControls({ ...controls, time_limit_warning_minutes: parseInt(e.target.value) || 5 })}
                    className="max-w-xs"
                    disabled={!controls.enforce_time_limits || controls.daily_time_limit_minutes === 0}
                  />
                  <span className="text-gray-600">minutes before limit</span>
                </div>
                <p className="text-sm text-gray-600">
                  Show a warning when this many minutes remain
                </p>
              </div>

              {/* Per-Operation Time Limits */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-base font-bold">Time Limits by Math Concept (Optional)</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Set specific time limits for individual math concepts. Leave at 0 for no limit.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {operations.map((op) => (
                    <div key={op.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">{op.emoji}</span>
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{op.name}</Label>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max="120"
                        value={controls.time_limits_by_operation?.[op.id] || 0}
                        onChange={(e) => updateOperationTimeLimit(op.id, e.target.value)}
                        className="w-20"
                        disabled={!controls.enforce_time_limits}
                      />
                      <span className="text-xs text-gray-500">min</span>
                    </div>
                  ))}
                </div>
              </div>

              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 text-sm">
                  <strong>How it works:</strong> Time limits are enforced per calendar day. When time runs out, your child will be notified and games will be locked until the next day.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTENT FILTERING TAB */}
        <TabsContent value="content" className="space-y-6">
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Allowed Math Concepts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Select which math concepts your child can access. At least one must be selected.
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                {operations.map((op) => (
                  <div
                    key={op.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      controls.allowed_operations.includes(op.id)
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    onClick={() => toggleOperation(op.id, "allowed")}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{op.emoji}</div>
                      <div className="text-sm font-medium">{op.name}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Alert className="bg-yellow-50 border-yellow-200 mt-4">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 text-sm">
                  At least one operation must be allowed for your child to play games.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                Allowed Difficulty Levels
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Control which difficulty levels your child can play.
              </p>
              <div className="grid grid-cols-4 gap-3">
                {levels.map((level) => (
                  <div
                    key={level.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      controls.allowed_levels.includes(level.id)
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    onClick={() => toggleLevel(level.id)}
                  >
                    <div className="text-center font-medium">{level.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-600" />
                Feature Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Control which app features your child can access.
              </p>
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200"
                >
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">{feature.name}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                  <Switch
                    checked={!controls.blocked_features?.includes(feature.id)}
                    onCheckedChange={() => toggleFeature(feature.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FOCUS TOPICS TAB */}
        <TabsContent value="focus" className="space-y-6">
          <Card className="border-2 border-indigo-200">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Focus Topics & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-bold mb-3 block">Select Focus Operations</Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Highlight specific math concepts for your child to practice more.
                  </p>
                  <div className="grid md:grid-cols-3 gap-3">
                    {operations.map((op) => (
                      <div
                        key={op.id}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          controls.focus_operations.includes(op.id)
                            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                            : "border-gray-200 bg-gray-50"
                        }`}
                        onClick={() => toggleOperation(op.id, "focus")}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{op.emoji}</div>
                          <div className="text-sm font-medium">{op.name}</div>
                          {controls.focus_operations.includes(op.id) && (
                            <Badge className="mt-2 bg-indigo-500 text-white text-xs">
                              Focus
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {controls.focus_operations.length > 0 && (
                  <>
                    <div className="pt-4 border-t space-y-3">
                      <Label className="text-base font-bold">Focus Priority Mode</Label>
                      <div className="space-y-2">
                        <div 
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            controls.focus_priority === "suggest" 
                              ? "border-indigo-500 bg-indigo-50" 
                              : "border-gray-200 bg-white"
                          }`}
                          onClick={() => setControls({ ...controls, focus_priority: "suggest" })}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              controls.focus_priority === "suggest" ? "border-indigo-500" : "border-gray-300"
                            }`}>
                              {controls.focus_priority === "suggest" && (
                                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold">Suggest (Recommended)</h4>
                              <p className="text-sm text-gray-600">
                                Show reminders and highlight focus topics, but allow access to all enabled content
                              </p>
                            </div>
                          </div>
                        </div>

                        <div 
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            controls.focus_priority === "enforce" 
                              ? "border-indigo-500 bg-indigo-50" 
                              : "border-gray-200 bg-white"
                          }`}
                          onClick={() => setControls({ ...controls, focus_priority: "enforce" })}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              controls.focus_priority === "enforce" ? "border-indigo-500" : "border-gray-300"
                            }`}>
                              {controls.focus_priority === "enforce" && (
                                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold">Enforce (Strict)</h4>
                              <p className="text-sm text-gray-600">
                                Only allow focus topics - other content will be locked
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-3">
                      <Label className="text-base font-bold">Reminder Frequency</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["never", "daily", "every_session"].map((freq) => (
                          <div
                            key={freq}
                            className={`p-3 rounded-lg border-2 cursor-pointer text-center transition-all ${
                              controls.focus_reminder_frequency === freq
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-200 bg-white"
                            }`}
                            onClick={() => setControls({ ...controls, focus_reminder_frequency: freq })}
                          >
                            <div className="font-medium capitalize">
                              {freq === "every_session" ? "Every Game" : freq}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {controls.focus_operations.length === 0 && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Target className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      Select at least one operation above to set it as a focus topic for your child.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CUSTOM GOALS TAB */}
        <TabsContent value="goals" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Custom Learning Goals</h3>
              <p className="text-sm text-gray-600">Create personalized goals tailored to your child's needs</p>
            </div>
            <Button
              onClick={() => setShowAddGoalForm(!showAddGoalForm)}
              className="bg-indigo-500 hover:bg-indigo-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>

          {showAddGoalForm && (
            <Card className="border-2 border-indigo-300">
              <CardHeader className="bg-indigo-50">
                <CardTitle>Create New Learning Goal</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal_title">Goal Title</Label>
                  <Input
                    id="goal_title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Master Multiplication Tables"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal_description">Description (Optional)</Label>
                  <Textarea
                    id="goal_description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Add more details about this goal..."
                    rows={2}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target_type">Goal Type</Label>
                    <select
                      id="target_type"
                      value={newGoal.target_type}
                      onChange={(e) => setNewGoal({ ...newGoal, target_type: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="games_completed">Games Completed</option>
                      <option value="stars_earned">Stars Earned</option>
                      <option value="accuracy">Accuracy (%)</option>
                      <option value="time_spent">Time Spent (minutes)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target_value">Target Value</Label>
                    <Input
                      id="target_value"
                      type="number"
                      min="1"
                      value={newGoal.target_value}
                      onChange={(e) => setNewGoal({ ...newGoal, target_value: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal_operation">Operation</Label>
                    <select
                      id="goal_operation"
                      value={newGoal.operation}
                      onChange={(e) => setNewGoal({ ...newGoal, operation: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="any">Any Operation</option>
                      {operations.map(op => (
                        <option key={op.id} value={op.id}>{op.emoji} {op.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal_level">Difficulty Level</Label>
                    <select
                      id="goal_level"
                      value={newGoal.level}
                      onChange={(e) => setNewGoal({ ...newGoal, level: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="any">Any Level</option>
                      {levels.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal_deadline">Deadline (Optional)</Label>
                  <Input
                    id="goal_deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={addCustomGoal}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                    disabled={!newGoal.title}
                  >
                    Add Goal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddGoalForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Goals List */}
          <div className="space-y-4">
            {customGoals.length === 0 ? (
              <Card className="border-2 border-gray-200">
                <CardContent className="p-12 text-center">
                  <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl text-gray-600 mb-2">No custom goals yet</p>
                  <p className="text-gray-500">Create goals to motivate and guide your child's learning</p>
                </CardContent>
              </Card>
            ) : (
              customGoals.map((goal) => (
                <Card key={goal.id} className="border-2 border-indigo-200">
                  <CardHeader className="bg-indigo-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-indigo-600" />
                          {goal.title}
                        </CardTitle>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mt-2">{goal.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteGoal(goal.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="font-bold">Type:</span> {goal.target_type.replace('_', ' ')}
                      </div>
                      <div>
                        <span className="font-bold">Target:</span> {goal.target_value}
                      </div>
                      <div>
                        <span className="font-bold">Operation:</span> {goal.operation}
                      </div>
                      <div>
                        <span className="font-bold">Level:</span> {goal.level}
                      </div>
                    </div>
                    {goal.deadline && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Deadline: {goal.deadline}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={handleSave}
          disabled={updateControlsMutation.isPending}
          className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-500"
        >
          <Save className="w-5 h-5 mr-2" />
          {updateControlsMutation.isPending ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
}