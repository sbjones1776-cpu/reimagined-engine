import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Award } from "lucide-react";

export default function AdaptiveDifficulty({ adjustment, onClose }) {
  const configs = {
    easier: {
      icon: TrendingDown,
      color: "from-blue-400 to-cyan-400",
      title: "Let's Try Something Easier!",
      message: "Don't worry! I'm adjusting the difficulty to help you build confidence. You've got this! 💙",
      emoji: "🎯"
    },
    harder: {
      icon: TrendingUp,
      color: "from-purple-400 to-pink-400",
      title: "Level Up Challenge!",
      message: "Wow! You're doing amazing! Let's try some harder problems to keep you challenged! 🚀",
      emoji: "⭐"
    },
    perfect: {
      icon: Award,
      color: "from-yellow-400 to-orange-400",
      title: "Perfect Match!",
      message: "The difficulty is just right for you! Keep up the excellent work! 🎉",
      emoji: "🏆"
    }
  };

  const config = configs[adjustment] || configs.perfect;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className={`max-w-md border-4 shadow-2xl bg-gradient-to-br ${config.color}`}>
          <CardContent className="p-8 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-7xl mb-4"
            >
              {config.emoji}
            </motion.div>
            
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon className="w-6 h-6" />
              <h3 className="text-2xl font-bold">{config.title}</h3>
            </div>
            
            <p className="text-lg opacity-95 mb-6">
              {config.message}
            </p>

            <Badge className="bg-white/20 text-white text-sm px-4 py-2">
              <Icon className="w-4 h-4 mr-2" />
              AI Adaptive Learning
            </Badge>

            <p className="text-xs mt-4 opacity-75">
              Click anywhere to continue
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}