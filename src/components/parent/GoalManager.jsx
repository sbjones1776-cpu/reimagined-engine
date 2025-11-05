import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, CheckCircle, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function GoalManager({ childEmail, childGoals, childProgress, childDailyChallenges }) {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goal_type: "total_stars",
    target_value: 10,
    title: "",
    description: "",
    reward_message: "",
    operation: "",
    level: "",
    due_date: "",
  });

  const createGoalMutation = useMutation({
    mutationFn: (goalData) => base44.entities.CustomGoal.create({
      ...goalData,
      child_email: childEmail,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childGoals'] });
      setShowAddForm(false);
      setNewGoal({
        goal_type: "total_stars",
        target_value: 10,
        title: "",
        description: "",
        reward_message: "",
        operation: "",
        level: "",
        due_date: "",
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (goalId) => base44.entities.CustomGoal.delete(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childGoals'] });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ goalId, data }) => base44.entities.CustomGoal.update(goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childGoals'] });
    },
  });

  // Calculate current progress for each goal
  const calculateProgress = (goal) => {
    let current = 0;

    switch (goal.goal_type) {
      case "total_stars":
        current = childProgress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
        break;
      case "games_played":
        current = childProgress.length;
        break;
      case "accuracy":
        if (childProgress.length > 0) {
          const totalAccuracy = childProgress.reduce((sum, p) => sum + ((p.correct_answers / p.total_questions) * 100), 0);
          current = Math.round(totalAccuracy / childProgress.length);
        }
        break;
      case "daily_streak":
        current = calculateDailyStreak();
        break;
      case "specific_operation":
        const opGames = childProgress.filter(p => 
          p.operation === goal.operation && 
          (!goal.level || p.level === goal.level)
        );
        current = opGames.length;
        break;
    }

    // Update if needed
    if (current !== goal.current_value) {
      updateGoalMutation.mutate({ goalId: goal.id, data: { current_value: current } });
    }

    // Check if completed
    if (current >= goal.target_value && !goal.is_completed) {
      updateGoalMutation.mutate({ goalId: goal.id, data: { is_completed: true } });
    }

    return current;
  };

  const calculateDailyStreak = () => {
    if (childDailyChallenges.length === 0) return 0;
    const sorted = [...childDailyChallenges].sort((a, b) => new Date(b.challenge_date) - new Date(a.challenge_date));
    let streak = 0;
    let currentDate = new Date();
    for (const challenge of sorted) {
      const challengeDate = new Date(challenge.challenge_date);
      const daysDiff = Math.floor((currentDate - challengeDate) / (1000 * 60 * 60 * 24));
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const handleCreateGoal = () => {
    if (!newGoal.title) return;
    createGoalMutation.mutate(newGoal);
  };

  const goalTypeLabels = {
    total_stars: "Total Stars",
    games_played: "Games Played",
    accuracy: "Average Accuracy",
    daily_streak: "Daily Streak",
    specific_operation: "Practice Specific Operation",
  };

  return (
    <div className="space-y-6">
      {/* Add Goal Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-500" />
          Custom Goals & Challenges
        </h3>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <Card className="border-2 border-purple-300">
          <CardHeader className="bg-purple-50">
            <CardTitle>Create New Goal</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="e.g., Master Multiplication"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal_type">Goal Type</Label>
              <Select
                value={newGoal.goal_type}
                onValueChange={(value) => setNewGoal({ ...newGoal, goal_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(goalTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newGoal.goal_type === "specific_operation" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="operation">Operation</Label>
                  <Select
                    value={newGoal.operation}
                    onValueChange={(value) => setNewGoal({ ...newGoal, operation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="addition">Addition</SelectItem>
                      <SelectItem value="subtraction">Subtraction</SelectItem>
                      <SelectItem value="multiplication">Multiplication</SelectItem>
                      <SelectItem value="division">Division</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level (Optional)</Label>
                  <Select
                    value={newGoal.level}
                    onValueChange={(value) => setNewGoal({ ...newGoal, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>Any Level</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="target">Target Value</Label>
              <Input
                id="target"
                type="number"
                min="1"
                value={newGoal.target_value}
                onChange={(e) => setNewGoal({ ...newGoal, target_value: parseInt(e.target.value) })}
              />
              <p className="text-sm text-gray-500">
                {newGoal.goal_type === "accuracy" ? "Target percentage (e.g., 80 for 80%)" : "Target number"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                placeholder="Additional details about this goal..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reward">Reward Message (Optional)</Label>
              <Input
                id="reward"
                value={newGoal.reward_message}
                onChange={(e) => setNewGoal({ ...newGoal, reward_message: e.target.value })}
                placeholder="e.g., Great job! You're a multiplication master!"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date (Optional)</Label>
              <Input
                id="due_date"
                type="date"
                value={newGoal.due_date}
                onChange={(e) => setNewGoal({ ...newGoal, due_date: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCreateGoal}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
                disabled={!newGoal.title || createGoalMutation.isPending}
              >
                {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {childGoals.length === 0 ? (
          <Card className="border-2 border-gray-200">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl text-gray-600 mb-2">No goals set yet</p>
              <p className="text-gray-500">Create custom goals to motivate and track progress</p>
            </CardContent>
          </Card>
        ) : (
          childGoals.map((goal) => {
            const current = calculateProgress(goal);
            const progress = Math.min((current / goal.target_value) * 100, 100);
            const isCompleted = goal.is_completed || current >= goal.target_value;

            return (
              <Card key={goal.id} className={`border-2 ${isCompleted ? "border-green-300 bg-green-50" : "border-purple-200"}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="flex items-center gap-2">
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <Target className="w-6 h-6 text-purple-500" />
                          )}
                          {goal.title}
                        </CardTitle>
                        <Badge variant="outline">{goalTypeLabels[goal.goal_type]}</Badge>
                        {isCompleted && (
                          <Badge className="bg-green-500">Completed!</Badge>
                        )}
                      </div>
                      {goal.description && (
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      )}
                      {goal.due_date && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-4 h-4" />
                          Due: {format(new Date(goal.due_date), "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteGoalMutation.mutate(goal.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Progress</span>
                      <span className="font-bold">
                        {current} / {goal.target_value}
                        {goal.goal_type === "accuracy" && "%"}
                      </span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    {isCompleted && goal.reward_message && (
                      <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3 text-center">
                        <p className="text-sm font-medium text-green-800">🎉 {goal.reward_message}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}