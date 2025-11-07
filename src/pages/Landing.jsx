import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
// // import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Trophy,
  Users,
  Brain,
  Sparkles,
  Crown,
  Shield,
  Gamepad2,
  Heart,
  CheckCircle,
  ArrowRight,
  Rocket,
  PartyPopper,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  const { data: isAuthenticated, isLoading } = useQuery({
    queryKey: ['isAuthenticated'],
    queryFn: async () => {
      try {
  // TODO: Replace with new authentication check
        return true;
      } catch {
        return false;
      }
    },
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(createPageUrl("Home"));
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleGetStarted = () => {
  // TODO: Replace with new login redirect logic (if needed)
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-white">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Gamepad2,
      title: "12 Math Concepts",
      description: "Addition, subtraction, multiplication, division, fractions, decimals, percentages, geometry & more!",
      gradient: "from-blue-400 to-cyan-500",
      emoji: "🎯"
    },
    {
      icon: Brain,
      title: "AI Math Tutor",
      description: "Stuck on a problem? Get instant help with step-by-step explanations!",
      gradient: "from-purple-400 to-pink-500",
      emoji: "🤖"
    },
    {
      icon: Trophy,
      title: "Daily Challenges",
      description: "New challenges every day! Compete for bonus stars and climb the leaderboard!",
      gradient: "from-yellow-400 to-orange-500",
      emoji: "🏆"
    },
    {
      icon: Star,
      title: "Earn Rewards",
      description: "Collect stars and coins to unlock cool avatar items, pets, badges, and power-ups!",
      gradient: "from-green-400 to-emerald-500",
      emoji: "⭐"
    },
    {
      icon: Users,
      title: "Team Challenges",
      description: "Team up with friends and family to complete challenges together!",
      gradient: "from-indigo-400 to-purple-500",
      emoji: "👥"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Advanced parental controls, time limits, and content filtering for peace of mind",
      gradient: "from-red-400 to-pink-500",
      emoji: "🛡️"
    },
  ];

  const mathConcepts = [
    { emoji: "➕", name: "Addition", grade: "K-4" },
    { emoji: "➖", name: "Subtraction", grade: "K-4" },
    { emoji: "✖️", name: "Multiplication", grade: "2-5" },
    { emoji: "➗", name: "Division", grade: "3-6" },
    { emoji: "½", name: "Fractions", grade: "3-6" },
    { emoji: "0.5", name: "Decimals", grade: "4-7" },
    { emoji: "%", name: "Percentages", grade: "5-8" },
    { emoji: "📖", name: "Word Problems", grade: "2-6" },
    { emoji: "💰", name: "Money Math", grade: "1-5" },
    { emoji: "⏰", name: "Time", grade: "1-4" },
    { emoji: "🔷", name: "Geometry", grade: "3-7" },
    { emoji: "🧩", name: "Mixed", grade: "3-8" },
  ];

  const testimonials = [
    {
      text: "My kids actually BEG to practice math now! They love earning stars and unlocking new pets. Best $1 we've ever spent!",
      author: "Sarah M.",
      role: "Parent of 2 (Ages 7 & 9)",
      rating: 5,
      emoji: "😍"
    },
    {
      text: "The AI tutor is incredible! It explains things in a way my students actually understand. My whole class is hooked!",
      author: "Mr. Johnson",
      role: "3rd Grade Teacher",
      rating: 5,
      emoji: "🎓"
    },
    {
      text: "I used to hate math but now it's FUN! I got the dragon pet and I'm on a 12-day streak! 🔥",
      author: "Emma, Age 9",
      role: "Student & Math Champion",
      rating: 5,
      emoji: "🐉"
    },
  ];

  const stats = [
    { icon: Trophy, value: "10,000+", label: "Games Played Daily", color: "text-yellow-600" },
    { icon: Star, value: "50,000+", label: "Stars Earned", color: "text-purple-600" },
    { icon: Users, value: "1,000+", label: "Happy Learners", color: "text-blue-600" },
    { icon: Heart, value: "100%", label: "Fun Guaranteed", color: "text-pink-600" },
  ];

  const rewardsPreview = [
    { emoji: "🐉", name: "Dragon Pet", desc: "Levels up with you!" },
    { emoji: "👑", name: "Crown", desc: "Show you're a champion!" },
    { emoji: "🎨", name: "Custom Avatar", desc: "100+ items to unlock!" },
    { emoji: "⚡", name: "Power-Ups", desc: "Time freeze, hints & more!" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 text-6xl opacity-20"
        >
          ➕
        </motion.div>
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 right-20 text-7xl opacity-20"
        >
          ✖️
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-40 text-5xl opacity-20"
        >
          ⭐
        </motion.div>
        <motion.div
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-10 text-6xl opacity-20"
        >
          🏆
        </motion.div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center">
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-2xl transform rotate-12 animate-pulse">
                <span className="text-7xl md:text-8xl transform -rotate-12">🎮</span>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 text-4xl"
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-2 -left-2 text-4xl"
              >
                🌟
              </motion.div>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-white drop-shadow-2xl"
          >
            Math is FUN Now! 🎉
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl text-white mb-4 max-w-3xl mx-auto font-bold drop-shadow-lg"
          >
            Learn • Play • Earn Rewards • Level Up!
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            <Badge className="bg-white text-purple-600 px-6 py-3 text-lg font-bold shadow-xl border-0">
              <CheckCircle className="w-5 h-5 mr-2" />
              100% FREE to Start
            </Badge>
            <Badge className="bg-white text-pink-600 px-6 py-3 text-lg font-bold shadow-xl border-0">
              <Heart className="w-5 h-5 mr-2" />
              Kids LOVE It!
            </Badge>
            <Badge className="bg-white text-blue-600 px-6 py-3 text-lg font-bold shadow-xl border-0">
              <Sparkles className="w-5 h-5 mr-2" />
              AI-Powered
            </Badge>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              onClick={handleGetStarted}
              className="h-20 px-12 text-2xl font-black bg-white text-purple-600 hover:bg-yellow-300 hover:text-purple-700 shadow-2xl transform hover:scale-105 transition-all"
            >
              <Rocket className="w-8 h-8 mr-3" />
              START FREE NOW! 🚀
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="h-20 px-10 text-xl font-bold border-4 border-white text-white hover:bg-white hover:text-purple-600 shadow-xl"
            >
              See What's Inside
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border-4 border-yellow-300"
                >
                  <Icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-black text-gray-800">{stat.value}</div>
                  <div className="text-sm font-bold text-gray-600 mt-1">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* What You'll Get Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              What's Inside? Everything! 🎁
            </h2>
            <p className="text-2xl text-gray-700 font-bold">
              Your kids will love these amazing features!
            </p>
          </div>

          {/* Rewards Preview Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {rewardsPreview.map((reward, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 text-center border-4 border-purple-300 shadow-xl"
              >
                <div className="text-7xl mb-4">{reward.emoji}</div>
                <h3 className="font-black text-xl mb-2 text-purple-800">{reward.name}</h3>
                <p className="text-gray-700 font-semibold">{reward.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Math Concepts */}
          <div className="mb-16">
            <h3 className="text-3xl md:text-4xl font-black text-center mb-8 text-gray-800">
              12 Math Skills to Master! 📚
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mathConcepts.map((concept, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 text-center border-3 border-blue-200 shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="text-5xl mb-3">{concept.emoji}</div>
                  <div className="font-bold text-sm text-gray-800">{concept.name}</div>
                  <Badge className="mt-2 bg-purple-500 text-white text-xs">{concept.grade}</Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gradient-to-br from-yellow-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-gray-800">
              Why Kids Are OBSESSED! 🤩
            </h2>
            <p className="text-2xl text-gray-700 font-bold">
              Learning has never been this fun!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-300"
                >
                  <div className={`h-32 bg-gradient-to-br ${feature.gradient} flex items-center justify-center relative`}>
                    <div className="text-7xl">{feature.emoji}</div>
                    <div className="absolute top-3 right-3">
                      <Icon className="w-10 h-10 text-white opacity-50" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-black mb-3 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 font-semibold text-lg">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              So Easy, Even Parents Can Do It! 😄
            </h2>
            <p className="text-2xl text-gray-700 font-bold">
              Three simple steps to math mastery
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-8 text-white shadow-2xl border-4 border-green-600">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-5xl font-black text-green-500">1</span>
              </div>
              <h3 className="text-3xl font-black mb-4 text-center">Pick & Play! 🎯</h3>
              <p className="text-xl font-bold text-center">
                Choose a math topic and difficulty. Start playing in seconds!
              </p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl p-8 text-white shadow-2xl border-4 border-blue-600">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-5xl font-black text-blue-500">2</span>
              </div>
              <h3 className="text-3xl font-black mb-4 text-center">Learn & Win! 🧠</h3>
              <p className="text-xl font-bold text-center">
                Solve problems, get AI help when stuck, earn stars & coins!
              </p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl p-8 text-white shadow-2xl border-4 border-purple-600">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-5xl font-black text-purple-500">3</span>
              </div>
              <h3 className="text-3xl font-black mb-4 text-center">Unlock Rewards! 🎁</h3>
              <p className="text-xl font-bold text-center">
                Buy avatars, pets, badges, power-ups and MORE!
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-gray-800">
              Parents & Kids LOVE Us! 💜
            </h2>
            <p className="text-2xl text-gray-700 font-bold">
              Don't just take our word for it...
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-6xl mb-4">{testimonial.emoji}</div>
                <p className="text-gray-700 mb-6 italic font-semibold text-lg">"{testimonial.text}"</p>
                <div>
                  <p className="font-black text-lg text-gray-800">{testimonial.author}</p>
                  <p className="text-sm text-gray-600 font-bold">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-8"
          >
            🎉
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-white drop-shadow-2xl">
            Ready for Math Adventure?
          </h2>
          <p className="text-3xl text-white mb-12 font-bold drop-shadow-lg">
            Join 1,000+ kids having FUN with math!
          </p>
          <Button
            onClick={handleGetStarted}
            className="h-24 px-16 text-3xl font-black bg-white text-purple-600 hover:bg-yellow-300 hover:text-purple-700 shadow-2xl transform hover:scale-110 transition-all animate-pulse"
          >
            <PartyPopper className="w-10 h-10 mr-4" />
            LET'S GO! IT'S FREE! 🚀
          </Button>
          <p className="text-white mt-6 text-lg font-bold drop-shadow">
            ✅ No credit card • ✅ Start in 30 seconds • ✅ 100% kid-safe
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🎮</div>
          <h3 className="text-3xl font-black mb-2">Math Adventure</h3>
          <p className="text-gray-400 mb-4 text-lg">Making math fun, one game at a time! 🌟</p>
          <p className="text-sm text-gray-500">
            © 2025 Math Adventure. Built with ❤️ for learners everywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
