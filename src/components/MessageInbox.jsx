import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MessageSquare, 
  Send, 
  Heart, 
  Star, 
  Info, 
  Trophy, 
  Reply, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Mail,
  MailOpen
} from "lucide-react";
import { format } from "date-fns";

export default function MessageInbox({ user }) {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReplied, setShowReplied] = useState(false);

  const { data: messages = [] } = useQuery({
    queryKey: ['childMessages', user?.email],
    queryFn: async () => {
      const allMessages = await base44.entities.Message.list();
      return allMessages
        .filter(m => 
          m.child_email === user?.email || 
          (m.parent_email === user?.email && m.message_type === 'response')
        )
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    initialData: [],
    enabled: !!user?.email,
  });

  const unreadCount = messages.filter(m => 
    m.child_email === user?.email && !m.is_read
  ).length;

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId) => {
      return base44.entities.Message.update(messageId, { is_read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childMessages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
    },
  });

  const sendReplyMutation = useMutation({
    mutationFn: async ({ messageId, replyText, parentEmail }) => {
      return base44.entities.Message.create({
        parent_email: user?.email,  // Child becomes "parent" in reply
        child_email: parentEmail,    // Parent becomes "child" in reply
        message_type: 'response',
        subject: `Re: ${selectedMessage?.subject}`,
        message_text: replyText,
        reply_to_message_id: messageId,
        is_read: false,
        parent_read: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childMessages'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setReplyText("");
      setSelectedMessage(null);
      setShowReplied(true);
      setTimeout(() => setShowReplied(false), 3000);
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId) => {
      return base44.entities.Message.delete(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childMessages'] });
      setSelectedMessage(null);
    },
  });

  const handleOpenMessage = (message) => {
    setSelectedMessage(message);
    if (!message.is_read && message.child_email === user?.email) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    sendReplyMutation.mutate({
      messageId: selectedMessage.id,
      replyText: replyText,
      parentEmail: selectedMessage.parent_email,
    });
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Messages from Parents
              </h1>
              <p className="text-gray-600">
                Read messages and reply to your parents
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white text-lg px-4 py-2 animate-pulse">
              <Mail className="w-5 h-5 mr-2" />
              {unreadCount} New
            </Badge>
          )}
        </div>
      </div>

      {showReplied && (
        <Alert className="mb-6 bg-green-50 border-green-300">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Reply sent!</strong> Your parent will see your message.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-bold text-lg mb-4">Inbox ({messages.length})</h2>
          
          {messages.length === 0 ? (
            <Card className="border-2 border-gray-200">
              <CardContent className="p-8 text-center">
                <MailOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-600">No messages yet</p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => {
              const Icon = messageIcons[message.message_type] || MessageSquare;
              const gradient = messageColors[message.message_type] || "from-gray-400 to-gray-500";
              const isUnread = message.child_email === user?.email && !message.is_read;
              const isSelected = selectedMessage?.id === message.id;
              const isFromParent = message.parent_email !== user?.email;

              return (
                <Card
                  key={message.id}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? "border-purple-500 ring-2 ring-purple-200 shadow-lg" 
                      : isUnread
                      ? "border-blue-400 bg-blue-50 hover:shadow-md"
                      : "border-gray-200 hover:shadow-md"
                  }`}
                  onClick={() => handleOpenMessage(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {isUnread && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              NEW
                            </Badge>
                          )}
                          {!isFromParent && (
                            <Badge className="bg-purple-500 text-white text-xs">
                              <Reply className="w-3 h-3 mr-1" />
                              Your Reply
                            </Badge>
                          )}
                        </div>
                        <h4 className={`font-bold text-sm truncate ${isUnread ? 'text-blue-900' : 'text-gray-900'}`}>
                          {message.subject}
                        </h4>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {message.message_text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(message.created_date), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader className={`bg-gradient-to-br ${messageColors[selectedMessage.message_type]} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {React.createElement(messageIcons[selectedMessage.message_type] || MessageSquare, { 
                      className: "w-8 h-8" 
                    })}
                    <div>
                      <CardTitle className="text-xl">{selectedMessage.subject}</CardTitle>
                      <p className="text-sm opacity-90 mt-1">
                        From: {selectedMessage.parent_email === user?.email ? 'You' : 'Your Parent'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20">
                    {selectedMessage.message_type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-gray-600">
                      {format(new Date(selectedMessage.created_date), "MMMM d, yyyy 'at' h:mm a")}
                    </Badge>
                    {selectedMessage.priority !== 'normal' && (
                      <Badge variant="outline" className={priorityColors[selectedMessage.priority]}>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {selectedMessage.priority} priority
                      </Badge>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <p className="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">
                      {selectedMessage.message_text}
                    </p>
                  </div>
                </div>

                {/* Reply Section (only for messages from parent) */}
                {selectedMessage.parent_email !== user?.email && (
                  <div className="space-y-3 border-t pt-6">
                    <h4 className="font-bold flex items-center gap-2">
                      <Reply className="w-5 h-5 text-purple-500" />
                      Send a Reply
                    </h4>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || sendReplyMutation.isPending}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {sendReplyMutation.isPending ? "Sending..." : "Send Reply"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (confirm('Delete this message?')) {
                            deleteMessageMutation.mutate(selectedMessage.id);
                          }
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}

                {/* If it's user's own reply */}
                {selectedMessage.parent_email === user?.email && (
                  <div className="border-t pt-4">
                    <Alert className="bg-purple-50 border-purple-200">
                      <Info className="w-5 h-5 text-purple-600" />
                      <AlertDescription className="text-purple-800">
                        This is your reply. Your parent will see this message.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-gray-200 h-full">
              <CardContent className="p-12 text-center flex flex-col items-center justify-center h-full">
                <MessageSquare className="w-20 h-20 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">
                  Select a message to read
                </h3>
                <p className="text-gray-500">
                  Click on a message from the list to view and reply
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Unread Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-blue-600">{unreadCount}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-purple-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-purple-600">{messages.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-600" />
              Encouragement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-green-600">
              {messages.filter(m => m.message_type === 'encouragement').length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}