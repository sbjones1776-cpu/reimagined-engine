import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, BookOpen, CheckCircle, Clock, Target, Trash2, Calendar, Send, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function LessonAssignment({ childEmail, childProgress }) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    operation: "addition",
    level: "easy",
    target_games: 5,
    target_accuracy: 80,
    due_date: "",
    instructions: "",
  });

  // Fetch existing lesson assignments
  const { data: assignments = [] } = useQuery({
    queryKey: ['lessonAssignments', childEmail],
    queryFn: async () => {
      return base44.entities.CustomGoal.filter({ 
        child_email: childEmail,
        goal_type: "specific_operation" 
      });
    },
    initialData: [],
    enabled: !!childEmail,
  });

  const createLessonMutation = useMutation({
    mutationFn: (lessonData) => base44.entities.CustomGoal.create({
      ...lessonData,
      child_email: childEmail,
      goal_type: "specific_operation",
      target_value: lessonData.target_games,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['childGoals'] });
      setShowCreateForm(false);
      setNewLesson({
        title: "",
        description: "",
        operation: "addition",
        level: "easy",
        target_games: 5,
        target_accuracy: 80,
        due_date: "",
        instructions: "",
      });
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (lessonId) => base44.entities.CustomGoal.delete(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['childGoals'] });
    },
  });

  const handleCreateLesson = () => {
    if (!newLesson.title) return;
    createLessonMutation.mutate(newLesson);
  };

  // Calculate progress for each lesson
  const getLessonProgress = (lesson) => {
    const relevantGames = childProgress.filter(p => 
      p.operation === lesson.operation && 
      p.level === lesson.level &&
      new Date(p.created_date) >= new Date(lesson.created_date)
    );

    const gamesCompleted = relevantGames.length;
    const avgAccuracy = relevantGames.length > 0
      ? relevantGames.reduce((sum, g) => sum + (g.correct_answers / g.total_questions) * 100, 0) / relevantGames.length
      : 0;

    return {
      gamesCompleted,
      avgAccuracy: Math.round(avgAccuracy),
      isComplete: gamesCompleted >= lesson.target_value && avgAccuracy >= (lesson.target_accuracy || 70),
    };
  };

  // Suggested lessons based on weak areas
  const getSuggestedLessons = () => {
    const operationPerformance = {
      addition: { total: 0, correct: 0 },
      subtraction: { total: 0, correct: 0 },
      multiplication: { total: 0, correct: 0 },
      division: { total: 0, correct: 0 },
    };

    childProgress.forEach(p => {
      if (operationPerformance[p.operation]) {
        operationPerformance[p.operation].total += p.total_questions;
        operationPerformance[p.operation].correct += p.correct_answers;
      }
    });

    const suggestions = [];
    Object.entries(operationPerformance).forEach(([op, data]) => {
      if (data.total > 0) {
        const accuracy = (data.correct / data.total) * 100;
        if (accuracy < 70) {
          suggestions.push({
            operation: op,
            level: accuracy < 50 ? "easy" : "medium",
            reason: `Low accuracy: ${Math.round(accuracy)}%`,
          });
        }
      }
    });

    return suggestions;
  };

  const suggestions = getSuggestedLessons();

  const operationEmojis = {
    addition: "➕",
    subtraction: "➖",
    multiplication: "✖️",
    division: "➗",
  };

  const levelColors = {
    easy: "bg-green-500",
    medium: "bg-yellow-500",
    hard: "bg-red-500",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Lesson Assignments
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Create custom practice lessons tailored to your child's needs
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Lesson
        </Button>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Alert className="bg-yellow-50 border-yellow-300">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Suggested Focus Areas:</strong>
            <div className="mt-2 space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{operationEmojis[suggestion.operation]}</span>
                    <div>
                      <p className="font-medium capitalize">{suggestion.operation} - {suggestion.level}</p>
                      <p className="text-sm text-gray-600">{suggestion.reason}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setNewLesson({
                        ...newLesson,
                        operation: suggestion.operation,
                        level: suggestion.level,
                        title: `Practice ${suggestion.operation.charAt(0).toUpperCase() + suggestion.operation.slice(1)}`,
                      });
                      setShowCreateForm(true);
                    }}
                  >
                    Create Lesson
                  </Button>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Create Lesson Form */}
      {showCreateForm && (
        <Card className="border-2 border-blue-300">
          <CardHeader className="bg-blue-50">
            <CardTitle>Create New Lesson Assignment</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                placeholder="e.g., Master Two-Digit Addition"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newLesson.description}
                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                placeholder="What should the student learn from this lesson?"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operation">Operation</Label>
                <Select
                  value={newLesson.operation}
                  onValueChange={(value) => setNewLesson({ ...newLesson, operation: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addition">➕ Addition</SelectItem>
                    <SelectItem value="subtraction">➖ Subtraction</SelectItem>
                    <SelectItem value="multiplication">✖️ Multiplication</SelectItem>
                    <SelectItem value="division">➗ Division</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Difficulty Level</Label>
                <Select
                  value={newLesson.level}
                  onValueChange={(value) => setNewLesson({ ...newLesson, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_games">Target Games</Label>
                <Input
                  id="target_games"
                  type="number"
                  min="1"
                  max="50"
                  value={newLesson.target_games}
                  onChange={(e) => setNewLesson({ ...newLesson, target_games: parseInt(e.target.value) })}
                />
                <p className="text-xs text-gray-500">Number of games to complete</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_accuracy">Target Accuracy (%)</Label>
                <Input
                  id="target_accuracy"
                  type="number"
                  min="50"
                  max="100"
                  value={newLesson.target_accuracy}
                  onChange={(e) => setNewLesson({ ...newLesson, target_accuracy: parseInt(e.target.value) })}
                />
                <p className="text-xs text-gray-500">Minimum accuracy to complete</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date (Optional)</Label>
              <Input
                id="due_date"
                type="date"
                value={newLesson.due_date}
                onChange={(e) => setNewLesson({ ...newLesson, due_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions for Student</Label>
              <Textarea
                id="instructions"
                value={newLesson.instructions}
                onChange={(e) => setNewLesson({ ...newLesson, instructions: e.target.value })}
                placeholder="Any specific tips or guidance?"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCreateLesson}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                disabled={!newLesson.title || createLessonMutation.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                {createLessonMutation.isPending ? "Assigning..." : "Assign Lesson"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Lessons */}
      <div className="space-y-4">
        <h4 className="font-bold text-lg">Active Assignments</h4>
        {assignments.length === 0 ? (
          <Card className="border-2 border-gray-200">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl text-gray-600 mb-2">No lessons assigned yet</p>
              <p className="text-gray-500">Create custom lessons to guide your child's learning</p>
            </CardContent>
          </Card>
        ) : (
          assignments.map((lesson) => {
            const progress = getLessonProgress(lesson);
            const progressPercent = Math.min((progress.gamesCompleted / lesson.target_value) * 100, 100);

            return (
              <Card key={lesson.id} className={`border-2 ${progress.isComplete ? "border-green-300 bg-green-50" : "border-blue-200"}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{operationEmojis[lesson.operation]}</span>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {lesson.title}
                            {progress.isComplete && (
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={levelColors[lesson.level] + " text-white"}>
                              {lesson.level}
                            </Badge>
                            {lesson.due_date && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Due: {format(new Date(lesson.due_date), "MMM d")}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {lesson.description && (
                        <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                      )}
                      {lesson.instructions && (
                        <Alert className="mt-2">
                          <AlertDescription className="text-sm">
                            <strong>Instructions:</strong> {lesson.instructions}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteLessonMutation.mutate(lesson.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">Games</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {progress.gamesCompleted} / {lesson.target_value}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">Accuracy</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {progress.avgAccuracy}%
                          <span className="text-sm text-gray-500"> / {lesson.target_accuracy || 70}%</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span className="font-bold">{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-3" />
                    </div>

                    {progress.isComplete && (
                      <Alert className="bg-green-100 border-green-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>Great job!</strong> This lesson has been completed successfully.
                        </AlertDescription>
                      </Alert>
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