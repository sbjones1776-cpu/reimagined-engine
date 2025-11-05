import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCog, Mail, User, Shield, Calendar, Trophy, Star, Clock, Settings, Info, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import AvatarDisplay from "../avatar/AvatarDisplay";

export default function StudentAccountManager({ myChildren, parentEmail }) {
  const queryClient = useQueryClient();
  const [selectedChildForEdit, setSelectedChildForEdit] = useState(null);
  const [childName, setChildName] = useState("");

  const updateChildNameMutation = useMutation({
    mutationFn: async ({ childEmail, newName }) => {
      const allUsers = await base44.entities.User.list();
      const child = allUsers.find(u => u.email === childEmail);
      if (!child) throw new Error("Child not found");
      
      return base44.entities.User.update(child.id, {
        child_name: newName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      setSelectedChildForEdit(null);
      setChildName("");
    },
  });

  const resetParentalControlsMutation = useMutation({
    mutationFn: async (childEmail) => {
      const allUsers = await base44.entities.User.list();
      const child = allUsers.find(u => u.email === childEmail);
      if (!child) throw new Error("Child not found");
      
      return base44.entities.User.update(child.id, {
        parental_controls: {
          daily_time_limit: 0,
          allowed_operations: ["addition", "subtraction", "multiplication", "division"],
          allowed_levels: ["easy", "medium", "hard"],
          focus_operations: [],
          disabled_features: [],
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });

  const handleUpdateName = (childEmail) => {
    if (!childName.trim()) return;
    updateChildNameMutation.mutate({ childEmail, newName: childName });
  };

  const getAccountStatus = (child) => {
    const hasControls = child.parental_controls && Object.keys(child.parental_controls).length > 0;
    const hasRestrictions = hasControls && (
      child.parental_controls.daily_time_limit > 0 ||
      child.parental_controls.disabled_features?.length > 0 ||
      child.parental_controls.allowed_operations?.length < 4
    );

    return {
      hasControls,
      hasRestrictions,
      status: hasRestrictions ? "restricted" : hasControls ? "monitored" : "open",
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold flex items-center gap-2">
          <UserCog className="w-6 h-6 text-purple-600" />
          Student Account Management
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Manage linked student accounts and their settings
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="w-5 h-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Managing Multiple Students:</strong> You can monitor and control settings for all students linked to your account. 
          Each student maintains their own progress and achievements while you guide their learning journey.
        </AlertDescription>
      </Alert>

      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Account Overview</span>
            <Badge className="bg-purple-500 text-white text-lg px-4 py-2">
              {myChildren.length} {myChildren.length === 1 ? "Student" : "Students"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-600">Active Students</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">{myChildren.length}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">With Controls</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {myChildren.filter(c => getAccountStatus(c).hasControls).length}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Combined Stars</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {myChildren.reduce((sum, c) => sum + (c.total_stars_earned || 0), 0)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h4 className="font-bold text-lg">Student Accounts</h4>
        {myChildren.length === 0 ? (
          <Card className="border-2 border-gray-200">
            <CardContent className="p-12 text-center">
              <UserCog className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold mb-2">No Students Linked</h3>
              <p className="text-gray-600 mb-6">
                Have your students add your email ({parentEmail}) as their parent/teacher email in their profile settings.
              </p>
              <Alert className="bg-blue-50 border-blue-200 text-left">
                <Info className="w-5 h-5 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>How students can link their account:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Go to their Avatar/Profile page</li>
                    <li>Scroll to "Parent/Teacher Access" section</li>
                    <li>Enter your email: <strong>{parentEmail}</strong></li>
                    <li>Click Save</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          myChildren.map((child) => {
            const accountStatus = getAccountStatus(child);
            const avatarData = {
              avatar_skin_tone: child.avatar_skin_tone || "medium",
              avatar_hair_style: child.avatar_hair_style || "short",
              avatar_hair_color: child.avatar_hair_color || "brown",
              avatar_eyes: child.avatar_eyes || "normal",
              avatar_outfit: child.avatar_outfit || "casual",
              avatar_accessory: child.avatar_accessory || "none",
            };

            const statusColors = {
              open: "bg-green-100 text-green-700 border-green-300",
              monitored: "bg-blue-100 text-blue-700 border-blue-300",
              restricted: "bg-orange-100 text-orange-700 border-orange-300",
            };

            const statusIcons = {
              open: CheckCircle,
              monitored: Shield,
              restricted: AlertTriangle,
            };

            const StatusIcon = statusIcons[accountStatus.status];

            return (
              <Card key={child.email} className="border-2 border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-start gap-4">
                      <AvatarDisplay avatarData={avatarData} size="medium" />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">
                            {child.child_name || child.full_name || "Student"}
                          </h3>
                          <Badge className={statusColors[accountStatus.status]}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {accountStatus.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{child.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {format(new Date(child.created_date), "MMM d, yyyy")}</span>
                          </div>
                        </div>

                        {selectedChildForEdit === child.email ? (
                          <div className="mt-3 space-y-2">
                            <Input
                              placeholder="Display name"
                              value={childName}
                              onChange={(e) => setChildName(e.target.value)}
                              className="w-full"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateName(child.email)}
                                disabled={updateChildNameMutation.isPending}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedChildForEdit(null);
                                  setChildName("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3"
                            onClick={() => {
                              setSelectedChildForEdit(child.email);
                              setChildName(child.child_name || "");
                            }}
                          >
                            <Settings className="w-3 h-3 mr-1" />
                            Edit Name
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-600" />
                          <span className="text-xs text-gray-600">Stars</span>
                        </div>
                        <p className="text-xl font-bold text-yellow-700">
                          {child.total_stars_earned || 0}
                        </p>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-1 mb-1">
                          <Trophy className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-gray-600">Coins</span>
                        </div>
                        <p className="text-xl font-bold text-blue-700">
                          {child.coins || 0}
                        </p>
                      </div>

                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-1 mb-1">
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span className="text-xs text-gray-600">Badges</span>
                        </div>
                        <p className="text-xl font-bold text-purple-700">
                          {child.earned_badges?.length || 0}
                        </p>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-gray-600">Time Limit</span>
                        </div>
                        <p className="text-lg font-bold text-green-700">
                          {child.parental_controls?.daily_time_limit || "∞"}
                          {child.parental_controls?.daily_time_limit > 0 && "m"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {accountStatus.hasControls && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-sm">Active Controls:</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm("Reset all parental controls for this student?")) {
                              resetParentalControlsMutation.mutate(child.email);
                            }
                          }}
                        >
                          Reset Controls
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        {child.parental_controls?.daily_time_limit > 0 && (
                          <Badge variant="outline" className="justify-start">
                            <Clock className="w-3 h-3 mr-1" />
                            {child.parental_controls.daily_time_limit}m/day
                          </Badge>
                        )}
                        {child.parental_controls?.allowed_operations?.length < 4 && (
                          <Badge variant="outline" className="justify-start">
                            <XCircle className="w-3 h-3 mr-1" />
                            {4 - child.parental_controls.allowed_operations.length} ops blocked
                          </Badge>
                        )}
                        {child.parental_controls?.focus_operations?.length > 0 && (
                          <Badge variant="outline" className="justify-start bg-purple-50">
                            <Star className="w-3 h-3 mr-1" />
                            {child.parental_controls.focus_operations.length} focus areas
                          </Badge>
                        )}
                        {child.parental_controls?.disabled_features?.length > 0 && (
                          <Badge variant="outline" className="justify-start">
                            <XCircle className="w-3 h-3 mr-1" />
                            {child.parental_controls.disabled_features.length} features disabled
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Account Management Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-900">
          <p>
            <strong>Adding Students:</strong> Have each student add your email in their profile settings to link their account to yours.
          </p>
          <p>
            <strong>Display Names:</strong> Set custom display names to easily identify students (especially useful for teachers with multiple students).
          </p>
          <p>
            <strong>Controls:</strong> Each student can have individual parental controls. Configure them in the "Controls" tab.
          </p>
          <p>
            <strong>Privacy:</strong> Students cannot see messages between their account and yours. All communication is one-way (parent to child).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}