import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Users, X } from "lucide-react";

export default function TeamChallengeCreator() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [newChallenge, setNewChallenge] = useState({
    challenge_name: "",
    challenge_type: "team_score",
    target_value: 1000,
    description: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    reward_stars: 10,
    reward_coins: 50,
    reward_message: "",
    specific_operation: "any",
    specific_level: "any",
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    initialData: [],
  });

  // Get children linked to this parent
  const myChildren = allUsers.filter(u => u.parent_email === currentUser?.email);

  const createChallengeMutation = useMutation({
    mutationFn: (challengeData) => base44.entities.TeamChallenge.create(challengeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamChallenges'] });
      queryClient.invalidateQueries({ queryKey: ['myTeamChallenges'] });
      setShowForm(false);
      setSelectedMembers([]);
      setNewChallenge({
        challenge_name: "",
        challenge_type: "team_score",
        target_value: 1000,
        description: "",
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
        reward_stars: 10,
        reward_coins: 50,
        reward_message: "",
        specific_operation: "any",
        specific_level: "any",
      });
    },
  });

  const handleCreateChallenge = () => {
    if (!newChallenge.challenge_name || selectedMembers.length === 0) return;

    createChallengeMutation.mutate({
      ...newChallenge,
      creator_email: currentUser.email,
      team_members: selectedMembers,
    });
  };

  const toggleMember = (email) => {
    if (selectedMembers.includes(email)) {
      setSelectedMembers(selectedMembers.filter(e => e !== email));
    } else {
      setSelectedMembers([...selectedMembers, email]);
    }
  };

  const challengeTypes = [
    { value: "team_score", label: "Team Score Challenge", description: "Combine all team members' scores" },
    { value: "combined_accuracy", label: "Combined Accuracy Goal", description: "Average accuracy across all members" },
    { value: "total_games", label: "Total Games Challenge", description: "Total number of games played by the team" },
    { value: "total_stars", label: "Star Collection Challenge", description: "Collect stars together as a team" },
    { value: "daily_streak_sum", label: "Daily Challenge Streak", description: "Combined daily challenge completions" },
    { value: "speed_challenge", label: "Speed Challenge", description: "Best (fastest) time from any team member" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-500" />
          Team Challenges
        </h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Team Challenge
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-purple-300">
          <CardHeader className="bg-purple-50">
            <CardTitle>Create New Team Challenge</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="challenge_name">Challenge Name</Label>
              <Input
                id="challenge_name"
                value={newChallenge.challenge_name}
                onChange={(e) => setNewChallenge({ ...newChallenge, challenge_name: e.target.value })}
                placeholder="e.g., Family Math Marathon"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge_type">Challenge Type</Label>
              <Select
                value={newChallenge.challenge_type}
                onValueChange={(value) => setNewChallenge({ ...newChallenge, challenge_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {challengeTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">
                {challengeTypes.find(t => t.value === newChallenge.challenge_type)?.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specific_operation">Specific Operation (Optional)</Label>
                <Select
                  value={newChallenge.specific_operation}
                  onValueChange={(value) => setNewChallenge({ ...newChallenge, specific_operation: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Operation</SelectItem>
                    <SelectItem value="addition">Addition Only</SelectItem>
                    <SelectItem value="subtraction">Subtraction Only</SelectItem>
                    <SelectItem value="multiplication">Multiplication Only</SelectItem>
                    <SelectItem value="division">Division Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specific_level">Specific Level (Optional)</Label>
                <Select
                  value={newChallenge.specific_level}
                  onValueChange={(value) => setNewChallenge({ ...newChallenge, specific_level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Level</SelectItem>
                    <SelectItem value="easy">Easy Only</SelectItem>
                    <SelectItem value="medium">Medium Only</SelectItem>
                    <SelectItem value="hard">Hard Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_value">Target Value</Label>
              <Input
                id="target_value"
                type="number"
                min="1"
                value={newChallenge.target_value}
                onChange={(e) => setNewChallenge({ ...newChallenge, target_value: parseInt(e.target.value) })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={newChallenge.start_date}
                  onChange={(e) => setNewChallenge({ ...newChallenge, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={newChallenge.end_date}
                  onChange={(e) => setNewChallenge({ ...newChallenge, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newChallenge.description}
                onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                placeholder="Describe the challenge..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reward_stars">Reward Stars (per member)</Label>
                <Input
                  id="reward_stars"
                  type="number"
                  min="0"
                  value={newChallenge.reward_stars}
                  onChange={(e) => setNewChallenge({ ...newChallenge, reward_stars: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward_coins">Reward Coins (per member)</Label>
                <Input
                  id="reward_coins"
                  type="number"
                  min="0"
                  value={newChallenge.reward_coins}
                  onChange={(e) => setNewChallenge({ ...newChallenge, reward_coins: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reward_message">Reward Message (Optional)</Label>
              <Input
                id="reward_message"
                value={newChallenge.reward_message}
                onChange={(e) => setNewChallenge({ ...newChallenge, reward_message: e.target.value })}
                placeholder="e.g., Amazing teamwork! You did it together!"
              />
            </div>

            <div className="space-y-2">
              <Label>Select Team Members</Label>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 max-h-60 overflow-y-auto">
                {myChildren.length === 0 ? (
                  <p className="text-gray-600 text-sm">No children linked to your account</p>
                ) : (
                  myChildren.map((child) => (
                    <div key={child.email} className="flex items-center gap-2">
                      <Checkbox
                        id={child.email}
                        checked={selectedMembers.includes(child.email)}
                        onCheckedChange={() => toggleMember(child.email)}
                      />
                      <Label htmlFor={child.email} className="cursor-pointer flex-1">
                        {child.child_name || child.full_name || child.email}
                      </Label>
                    </div>
                  ))
                )}
              </div>
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMembers.map((email) => {
                    const child = myChildren.find(c => c.email === email);
                    return (
                      <Badge key={email} className="bg-purple-500 text-white">
                        {child?.child_name || child?.full_name || email}
                        <button
                          onClick={() => toggleMember(email)}
                          className="ml-2 hover:bg-purple-600 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCreateChallenge}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
                disabled={!newChallenge.challenge_name || selectedMembers.length === 0 || createChallengeMutation.isPending}
              >
                {createChallengeMutation.isPending ? "Creating..." : "Create Challenge"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
