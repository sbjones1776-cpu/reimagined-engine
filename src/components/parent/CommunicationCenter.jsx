import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Firebase migration
import { getFirestore, collection, query, where, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { app as firebaseApp } from "@/firebaseConfig"; // TODO: Ensure firebaseConfig.js is set up
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Send, Heart, Star, ThumbsUp, Trophy, Info, CheckCircle, Reply, Trash2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function CommunicationCenter({ childEmail, parentEmail }) {
  const queryClient = useQueryClient();
  const [messageType, setMessageType] = useState("encouragement");
  const [messageText, setMessageText] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [priority, setPriority] = useState("normal");

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', childEmail, parentEmail],
    queryFn: async () => {
      const db = getFirestore(firebaseApp);
      const q = query(collection(db, "messages"), where("parent_email", "==", parentEmail), where("child_email", "==", childEmail));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data()).sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    initialData: [],
    enabled: !!childEmail && !!parentEmail,
  });

  const unreadCount = messages.filter(m => 
    m.child_email === parentEmail && !m.parent_read
  ).length;

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData) => {
      const db = getFirestore(firebaseApp);
      await addDoc(collection(db, "messages"), {
        parent_email: parentEmail,
        child_email: childEmail,
        message_type: messageData.type,
        subject: messageData.subject,
        message_text: messageData.text,
        priority: messageData.priority,
        reply_to_message_id: messageData.replyTo || null,
        is_read: false,
        parent_read: true,
        created_date: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
      setMessageText("");
      setMessageSubject("");
      setSelectedTemplate("");
      setReplyingTo(null);
      setPriority("normal");
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId) => {
      const db = getFirestore(firebaseApp);
      await updateDoc(doc(db, "messages", messageId), { parent_read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId) => {
      const db = getFirestore(firebaseApp);
      await deleteDoc(doc(db, "messages", messageId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const templates = {
    encouragement: [
      { subject: "You're Doing Great!", text: "I'm so proud of how hard you're working! Keep it up! 🌟" },
      { subject: "Amazing Progress!", text: "You're doing an amazing job! Your effort really shows! 💪" },
      { subject: "Math Superstar", text: "Great progress today! You're a math superstar! ⭐" },
      { subject: "Keep Going!", text: "I love seeing you tackle these challenges! Keep going! 🚀" },
      { subject: "So Proud of You", text: "Your determination is inspiring! Way to go! 🎯" },
    ],
    feedback: [
      { subject: "Nice Improvement!", text: "I noticed you're improving in addition. Excellent work!" },
      { subject: "Great Accuracy", text: "Your accuracy is getting better every day!" },
      { subject: "Love Your Effort", text: "I can see you're putting in great effort. Keep it up!" },
      { subject: "Wonderful Progress", text: "You're making wonderful progress. I'm proud of you!" },
    ],
    reminder: [
      { subject: "Daily Challenge", text: "Don't forget to complete your daily challenge today! 📅" },
      { subject: "Practice Time", text: "Remember to practice your multiplication today!" },
      { subject: "Almost There", text: "You're close to reaching your goal! Keep practicing! 🎯" },
      { subject: "Lesson Time", text: "Time to work on your assigned lesson! You've got this! 📚" },
    ],
    celebration: [
      { subject: "Congratulations!", text: "Congratulations on completing your goal! 🎉" },
      { subject: "Three Stars!", text: "You earned all 3 stars! Amazing! ⭐⭐⭐" },
      { subject: "Incredible Achievement", text: "What an incredible achievement! So proud! 🏆" },
      { subject: "Math Champion", text: "You're a math champion! Great job! 👑" },
    ],
    question: [
      { subject: "How's Math Going?", text: "How are you finding the math challenges? Any topics you'd like more help with?" },
      { subject: "Need Help?", text: "Is there anything you're struggling with? I'm here to help!" },
      { subject: "What's Your Favorite?", text: "What's your favorite math topic so far?" },
    ],
  };

  const messageIcons = {
    encouragement: Heart,
    feedback: Star,
    reminder: Info,
    celebration: Trophy,
    question: MessageSquare,
    response: Reply,
  };

  const messageColors = {
    encouragement: "from-pink-400 to-rose-500",
    feedback: "from-blue-400 to-purple-500",
    reminder: "from-yellow-400 to-orange-500",
    celebration: "from-green-400 to-emerald-500",
    question: "from-indigo-400 to-blue-500",
    response: "from-gray-400 to-slate-500",
  };

  const priorityColors = {
    low: "text-gray-500",
    normal: "text-blue-500",
    high: "text-red-500",
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    sendMessageMutation.mutate({
      type: replyingTo ? 'response' : messageType,
      text: messageText,
      subject: messageSubject || templates[messageType]?.[0]?.subject || 'Message from Parent',
      priority: priority,
      replyTo: replyingTo?.id,
    });
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setMessageText(template.text);
    setMessageSubject(template.subject);
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    setMessageType('response');
    setMessageSubject(`Re: ${message.subject}`);
    setMessageText('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-green-600" />
            Communication Center
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white animate-pulse">
                {unreadCount} New
              </Badge>
            )}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Send messages and receive responses from your child
          </p>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="w-5 h-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Real-time messaging with your child!</strong> Messages appear instantly in their inbox, 
          and they can respond directly. Both of you will see notifications for new messages.
        </AlertDescription>
      </Alert>

      {replyingTo && (
        <Alert className="bg-purple-50 border-purple-300">
          <Reply className="w-5 h-5 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <div className="flex items-start justify-between">
              <div>
                <strong>Replying to:</strong> {replyingTo.subject}
                <p className="text-sm mt-1 italic">"{replyingTo.message_text}"</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
                className="text-purple-600"
              >
                Cancel
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-2 border-green-300">
        <CardHeader className="bg-green-50">
          <CardTitle>
            {replyingTo ? 'Send Reply' : 'Send a Message'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {!replyingTo && (
            <div className="space-y-2">
              <Label htmlFor="message_type">Message Type</Label>
              <Select
                value={messageType}
                onValueChange={setMessageType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="encouragement">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Encouragement
                    </div>
                  </SelectItem>
                  <SelectItem value="feedback">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Feedback
                    </div>
                  </SelectItem>
                  <SelectItem value="reminder">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Reminder
                    </div>
                  </SelectItem>
                  <SelectItem value="celebration">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Celebration
                    </div>
                  </SelectItem>
                  <SelectItem value="question">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Question
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {!replyingTo && (
            <div className="space-y-2">
              <Label>Quick Templates</Label>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {templates[messageType]?.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div>
                      <div className="font-bold text-sm">{template.subject}</div>
                      <div className="text-xs text-gray-600 mt-1">{template.text}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
              placeholder="Message subject..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message_text">Message</Label>
            <Textarea
              id="message_text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Write your message..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Send className="w-4 h-4 mr-2" />
            {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-lg">Message History</h4>
          <Badge variant="outline">{messages.length} Messages</Badge>
        </div>
        
        {messages.length === 0 ? (
          <Card className="border-2 border-gray-200">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl text-gray-600 mb-2">No messages yet</p>
              <p className="text-gray-500">Start a conversation with your child!</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => {
            const Icon = messageIcons[message.message_type] || MessageSquare;
            const gradient = messageColors[message.message_type] || "from-gray-400 to-gray-500";
            const isFromChild = message.child_email === parentEmail;
            const isUnread = isFromChild && !message.parent_read;

            return (
              <Card 
                key={message.id} 
                className={`border-2 transition-all ${
                  isUnread 
                    ? "border-blue-400 bg-blue-50 shadow-lg" 
                    : "border-gray-200 hover:shadow-md"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={`bg-gradient-to-r ${gradient} text-white`}>
                          {message.message_type}
                        </Badge>
                        {isFromChild && (
                          <Badge className="bg-purple-500 text-white">
                            <Reply className="w-3 h-3 mr-1" />
                            Reply from child
                          </Badge>
                        )}
                        {message.priority !== 'normal' && (
                          <Badge variant="outline" className={priorityColors[message.priority]}>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {message.priority}
                          </Badge>
                        )}
                        {isUnread && (
                          <Badge className="bg-blue-500 text-white animate-pulse">
                            NEW
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500 ml-auto">
                          {format(new Date(message.created_date), "MMM d, h:mm a")}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{message.subject}</h4>
                      <p className="text-gray-800 whitespace-pre-wrap">{message.message_text}</p>
                      
                      <div className="flex gap-2 mt-3">
                        {isFromChild && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReply(message)}
                            className="text-purple-600 border-purple-300"
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                        )}
                        {isUnread && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsReadMutation.mutate(message.id)}
                            className="text-blue-600 border-blue-300"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Delete this message?')) {
                              deleteMessageMutation.mutate(message.id);
                            }
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-lg">Quick Praise Buttons</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => {
              setMessageType("encouragement");
              setMessageSubject("Great job today!");
              setMessageText("Great job today! 🌟");
              handleSendMessage();
            }}
          >
            <Star className="w-6 h-6 text-yellow-500" />
            <span className="text-xs">Great Job!</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => {
              setMessageType("encouragement");
              setMessageSubject("I'm proud of you!");
              setMessageText("I'm proud of you! 💪");
              handleSendMessage();
            }}
          >
            <Heart className="w-6 h-6 text-pink-500" />
            <span className="text-xs">Proud!</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => {
              setMessageType("encouragement");
              setMessageSubject("Keep it up!");
              setMessageText("Keep it up! 🚀");
              handleSendMessage();
            }}
          >
            <ThumbsUp className="w-6 h-6 text-blue-500" />
            <span className="text-xs">Keep Going!</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => {
              setMessageType("celebration");
              setMessageSubject("Amazing work!");
              setMessageText("Amazing work! 🎉");
              handleSendMessage();
            }}
          >
            <Trophy className="w-6 h-6 text-green-500" />
            <span className="text-xs">Amazing!</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}