
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Palette,
  ArrowLeft,
  CheckCircle,
  RotateCcw,
  Star,
  Info,
  Trophy,
  Shuffle,
  Plus,
  Minus,
  X,
  Divide,
  Sparkles,
  PaintBucket,
  Eraser,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Brush,
  Share2,
  Download,
  Facebook,
  Twitter,
  Instagram,
  Link2,
  Camera
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Grid-based pixel art templates
const templates = {
  // EASY TEMPLATES (K-2nd Grade)
  heart: {
    name: "Heart",
    emoji: "❤️",
    difficulty: "easy",
    grades: ["K", "1", "2"],
    gridSize: 12,
    pattern: [
      [0,0,1,1,0,0,0,1,1,0,0,0],
      [0,1,2,2,1,0,1,2,2,1,0,0],
      [1,2,2,2,2,1,2,2,2,2,1,0],
      [1,2,2,2,2,2,2,2,2,2,1,0],
      [1,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,2,2,2,2,2,2,2,1,0,0],
      [0,0,1,2,2,2,2,2,1,0,0,0],
      [0,0,0,1,2,2,2,1,0,0,0,0],
      [0,0,0,0,1,2,1,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  star: {
    name: "Star",
    emoji: "⭐",
    difficulty: "easy",
    grades: ["K", "1", "2"],
    gridSize: 12,
    pattern: [
      [0,0,0,0,0,1,1,0,0,0,0,0],
      [0,0,0,0,1,3,3,1,0,0,0,0],
      [0,0,0,1,3,3,3,3,1,0,0,0],
      [0,0,0,0,1,3,3,1,0,0,0,0],
      [0,0,1,3,3,3,3,3,3,1,0,0],
      [0,1,3,3,3,3,3,3,3,3,1,0],
      [1,3,3,3,1,3,3,1,3,3,3,1],
      [0,1,1,1,0,1,1,0,1,1,1,0],
      [0,1,3,3,1,0,0,1,3,3,1,0],
      [1,3,3,3,3,1,1,3,3,3,3,1],
      [0,1,1,1,1,0,0,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  fish: {
    name: "Fish",
    emoji: "🐟",
    difficulty: "easy",
    grades: ["K", "1", "2"],
    gridSize: 14,
    pattern: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,1,4,4,4,4,4,1,1,0,0,0],
      [0,0,1,4,4,4,4,4,4,4,4,1,0,0],
      [0,1,4,4,5,5,4,4,4,4,4,4,1,1],
      [0,1,4,4,5,5,4,4,4,4,4,4,1,2],
      [0,1,4,4,4,4,4,4,4,4,4,4,1,2],
      [0,1,4,4,4,4,4,4,4,4,4,4,1,1],
      [0,0,1,4,4,4,4,4,4,1,1,0,0,0],
      [0,0,0,1,4,4,4,4,4,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,2,2,2,2,2,2,2,2,2,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  smiley: {
    name: "Smiley Face",
    emoji: "😊",
    difficulty: "easy",
    grades: ["K", "1", "2"],
    gridSize: 12,
    pattern: [
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,1,3,3,3,3,3,3,1,0,0],
      [0,1,3,3,3,3,3,3,3,3,1,0],
      [1,3,3,1,1,3,3,1,1,3,3,1],
      [1,3,3,1,5,3,3,1,5,3,3,1],
      [1,3,3,1,1,3,3,1,1,3,3,1],
      [1,3,3,3,3,3,3,3,3,3,3,1],
      [1,3,1,3,3,3,3,3,3,1,3,1],
      [0,1,3,1,2,2,2,2,1,3,1,0],
      [0,1,3,3,1,1,1,1,3,3,1,0],
      [0,0,1,3,3,3,3,3,3,1,0,0],
      [0,0,0,1,1,1,1,1,1,0,0,0],
    ]
  },

  sun: {
    name: "Sun",
    emoji: "☀️",
    difficulty: "easy",
    grades: ["K", "1", "2"],
    gridSize: 12,
    pattern: [
      [0,0,0,0,0,4,4,0,0,0,0,0],
      [0,0,0,0,0,4,4,0,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [4,0,1,3,3,3,3,3,3,1,0,4],
      [4,0,1,3,3,3,3,3,3,1,0,4],
      [0,1,3,3,3,3,3,3,3,3,1,0],
      [0,1,3,3,3,3,3,3,3,3,1,0],
      [4,0,1,3,3,3,3,3,3,1,0,4],
      [4,0,1,3,3,3,3,3,3,1,0,4],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,0,0,4,4,0,0,0,0,0],
      [0,0,0,0,0,4,4,0,0,0,0,0],
    ]
  },

  apple: {
    name: "Apple",
    emoji: "🍎",
    difficulty: "easy",
    grades: ["K", "1", "2"],
    gridSize: 12,
    pattern: [
      [0,0,0,0,0,5,5,0,0,0,0,0],
      [0,0,0,0,0,5,6,6,0,0,0,0],
      [0,0,1,1,1,1,6,1,1,1,0,0],
      [0,1,2,2,2,2,1,2,2,2,1,0],
      [1,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,1],
      [0,1,2,2,2,2,2,2,2,2,1,0],
      [0,0,1,2,2,2,2,2,2,1,0,0],
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  balloon: {
    name: "Balloon",
    emoji: "🎈",
    difficulty: "easy",
    grades: ["K", "1", "2"],
    gridSize: 12,
    pattern: [
      [0,0,0,0,1,1,1,1,0,0,0,0],
      [0,0,0,1,2,2,2,2,1,0,0,0],
      [0,0,1,2,2,2,2,2,2,1,0,0],
      [0,1,2,2,2,2,2,2,2,2,1,0],
      [1,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,1],
      [0,1,2,2,2,2,2,2,2,2,1,0],
      [0,0,1,2,2,2,2,2,2,1,0,0],
      [0,0,0,1,2,2,2,2,1,0,0,0],
      [0,0,0,0,1,3,3,1,0,0,0,0],
      [0,0,0,0,0,1,1,0,0,0,0,0],
    ]
  },

  car: {
    name: "Car",
    emoji: "🚗",
    difficulty: "easy",
    grades: ["K", "1", "2"],
    gridSize: 14,
    pattern: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,1,5,5,1,5,5,1,0,0,0,0],
      [0,0,1,5,5,5,5,5,5,5,1,0,0,0],
      [0,1,2,2,2,2,2,2,2,2,2,1,0,0],
      [1,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [1,2,2,1,1,2,2,2,1,1,2,2,1,0],
      [1,2,2,1,1,2,2,2,1,1,2,2,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,6,6,6,1,0,0,1,6,6,6,1,0],
      [0,1,6,6,6,1,0,0,1,6,6,6,1,0],
      [0,0,1,1,1,0,0,0,0,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  // MEDIUM TEMPLATES (3-5th Grade)
  flower: {
    name: "Flower",
    emoji: "🌸",
    difficulty: "medium",
    grades: ["2", "3", "4"],
    gridSize: 14,
    pattern: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,1,1,1,0,0,1,1,1,0,0,0],
      [0,0,1,6,6,6,1,1,6,6,6,1,0,0],
      [0,0,1,6,6,6,6,6,6,6,6,1,0,0],
      [0,0,0,1,6,6,6,6,6,6,1,0,0,0],
      [0,0,0,0,1,3,3,3,3,1,0,0,0,0],
      [1,1,1,0,1,3,3,3,3,1,0,1,1,1],
      [1,6,6,1,1,3,3,3,3,1,1,6,6,1],
      [1,6,6,6,1,3,3,3,3,1,6,6,6,1],
      [0,1,6,6,6,1,1,1,1,6,6,6,1,0],
      [0,0,1,1,1,5,5,5,5,1,1,1,0,0],
      [0,0,0,0,0,1,5,5,1,0,0,0,0,0],
      [0,0,0,0,0,1,5,5,1,0,0,0,0,0],
      [0,0,0,2,2,2,2,2,2,2,2,0,0,0],
    ]
  },

  butterfly: {
    name: "Butterfly",
    emoji: "🦋",
    difficulty: "medium",
    grades: ["3", "4", "5"],
    gridSize: 16,
    pattern: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0],
      [0,1,5,5,5,1,0,0,0,0,1,5,5,5,1,0],
      [0,1,5,5,5,5,1,0,0,1,5,5,5,5,1,0],
      [1,5,5,4,5,5,5,1,1,5,5,5,4,5,5,1],
      [1,5,5,5,5,5,5,1,1,5,5,5,5,5,5,1],
      [0,1,5,5,5,5,1,1,1,1,5,5,5,5,1,0],
      [0,0,1,1,1,1,1,2,2,1,1,1,1,1,0,0],
      [0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0],
      [0,0,1,1,1,1,2,2,2,2,1,1,1,1,0,0],
      [0,1,6,6,6,6,1,2,2,1,6,6,6,6,1,0],
      [1,6,6,6,6,6,6,1,1,6,6,6,6,6,6,1],
      [1,6,6,4,6,6,1,0,0,1,6,6,4,6,6,1],
      [0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  rocket: {
    name: "Rocket",
    emoji: "🚀",
    difficulty: "medium",
    grades: ["3", "4", "5"],
    gridSize: 14,
    pattern: [
      [0,0,0,0,0,0,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,2,2,1,0,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,1,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,1,0,0,0,0],
      [0,0,0,0,1,2,4,4,2,1,0,0,0,0],
      [0,0,0,0,1,2,4,4,2,1,0,0,0,0],
      [0,0,0,1,1,2,2,2,2,1,1,0,0,0],
      [0,0,1,3,1,2,2,2,2,1,3,1,0,0],
      [0,1,3,3,1,2,2,2,2,1,3,3,1,0],
      [1,3,3,3,1,2,2,2,2,1,3,3,3,1],
      [1,3,3,1,1,1,1,1,1,1,1,3,3,1],
      [0,1,1,0,1,5,5,5,5,1,0,1,1,0],
      [0,0,0,0,1,5,5,5,5,1,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,0,0,0,0,0],
    ]
  },

  dinosaur: {
    name: "Dinosaur",
    emoji: "🦕",
    difficulty: "medium",
    grades: ["3", "4", "5"],
    gridSize: 16,
    pattern: [
      [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,3,3,3,1,0,0,0,0,0,0],
      [0,0,0,0,1,3,3,3,3,3,1,0,0,0,0,0],
      [0,0,0,0,1,3,5,3,3,3,1,0,0,0,0,0],
      [0,0,0,0,1,3,3,3,3,3,1,0,0,0,0,0],
      [0,0,0,1,1,3,3,3,3,3,1,1,0,0,0,0],
      [0,0,1,3,3,3,3,3,3,3,3,3,1,0,0,0],
      [0,1,3,3,3,3,3,3,3,3,3,3,3,1,0,0],
      [1,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [1,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [1,3,3,3,3,1,1,3,3,1,1,3,3,3,1,0],
      [0,1,3,3,3,1,1,3,3,1,1,3,3,1,0,0],
      [0,0,1,1,1,0,0,1,1,0,0,1,1,0,0,0],
      [0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  owl: {
    name: "Owl",
    emoji: "🦉",
    difficulty: "medium",
    grades: ["3", "4", "5"],
    gridSize: 14,
    pattern: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,4,4,4,4,4,4,1,0,0,0],
      [0,0,1,4,4,4,4,4,4,4,4,1,0,0],
      [0,1,4,4,1,1,4,4,1,1,4,4,1,0],
      [0,1,4,1,5,5,1,1,5,5,1,4,1,0],
      [0,1,4,1,5,5,1,1,5,5,1,4,1,0],
      [0,1,4,4,1,1,4,4,1,1,4,4,1,0],
      [0,1,4,4,4,4,4,4,4,4,4,4,1,0],
      [0,1,4,4,4,1,3,3,1,4,4,4,1,0],
      [0,0,1,4,4,1,3,3,1,4,4,1,0,0],
      [0,0,1,4,4,4,1,1,4,4,4,1,0,0],
      [0,0,0,1,1,1,0,0,1,1,1,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  robot: {
    name: "Robot",
    emoji: "🤖",
    difficulty: "medium",
    grades: ["3", "4", "5"],
    gridSize: 14,
    pattern: [
      [0,0,0,0,0,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,1,6,6,6,6,1,0,0,0,0],
      [0,0,0,1,2,2,2,2,2,2,1,0,0,0],
      [0,0,1,2,2,1,2,2,1,2,2,1,0,0],
      [0,0,1,2,2,4,2,2,4,2,2,1,0,0],
      [0,0,1,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,1,2,1,1,1,1,1,1,2,1,0,0],
      [0,1,1,2,2,2,2,2,2,2,2,1,1,0],
      [1,3,1,2,2,2,2,2,2,2,2,1,3,1],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,0,1,5,5,1,1,5,5,1,0,0,0],
      [0,0,0,1,5,5,1,1,5,5,1,0,0,0],
      [0,0,0,1,1,1,0,0,1,1,1,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  icecream: {
    name: "Ice Cream",
    emoji: "🍦",
    difficulty: "medium",
    grades: ["3", "4", "5"],
    gridSize: 14,
    pattern: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,6,6,6,6,6,6,1,0,0,0],
      [0,0,1,6,6,6,6,6,6,6,6,1,0,0],
      [0,1,6,6,2,2,6,6,2,2,6,6,1,0],
      [0,1,6,6,2,2,6,6,2,2,6,6,1,0],
      [0,1,6,6,6,6,6,6,6,6,6,6,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,0,1,4,4,4,4,4,4,1,0,0,0],
      [0,0,0,0,1,4,4,4,4,1,0,0,0,0],
      [0,0,0,0,0,1,4,4,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  sailboat: {
    name: "Sailboat",
    emoji: "⛵",
    difficulty: "medium",
    grades: ["3", "4", "5"],
    gridSize: 14,
    pattern: [
      [0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,5,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,5,5,1,0,0,0,0],
      [0,0,0,0,0,0,1,5,5,5,1,0,0,0],
      [0,0,0,0,0,0,1,5,5,5,5,1,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,1],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,1],
      [0,1,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,3,3,3,3,3,3,3,3,3,3,3,0],
      [0,0,3,3,3,3,3,3,3,3,3,3,3,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  // HARD TEMPLATES (5-8th Grade)
  rainbow: {
    name: "Rainbow",
    emoji: "🌈",
    difficulty: "hard",
    grades: ["4", "5", "6"],
    gridSize: 16,
    pattern: [
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [1,1,2,3,3,3,3,3,3,3,3,3,3,2,1,1],
      [1,2,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
      [1,2,3,4,4,4,4,4,4,4,4,4,4,3,2,1],
      [1,2,3,4,5,5,5,5,5,5,5,5,4,3,2,1],
      [1,2,3,4,5,6,6,6,6,6,6,5,4,3,2,1],
      [1,2,3,4,5,6,0,0,0,0,6,5,4,3,2,1],
      [1,2,3,4,5,0,0,0,0,0,0,5,4,3,2,1],
      [1,2,3,4,0,0,0,0,0,0,0,0,4,3,2,1],
      [0,1,2,0,0,0,0,0,0,0,0,0,0,2,1,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  house: {
    name: "House",
    emoji: "🏠",
    difficulty: "hard",
    grades: ["4", "5", "6"],
    gridSize: 16,
    pattern: [
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,3,3,3,3,3,1,4,4,1,3,3,3,3,3,1],
      [1,3,3,3,3,3,1,4,4,1,3,3,3,3,3,1],
      [1,3,3,5,5,3,1,4,4,1,3,3,5,5,3,1],
      [1,3,3,5,5,3,1,4,4,1,3,3,5,5,3,1],
      [1,3,3,3,3,3,1,4,4,1,3,3,3,3,3,1],
      [1,3,3,3,3,3,1,4,4,1,3,3,3,3,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0],
    ]
  },

  dragon: {
    name: "Dragon",
    emoji: "🐉",
    difficulty: "hard",
    grades: ["5", "6", "7"],
    gridSize: 18,
    pattern: [
      [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,3,3,3,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,3,3,3,3,3,1,0,0,0,0,0],
      [0,0,0,0,0,1,3,3,5,3,3,3,3,1,0,0,0,0],
      [0,0,0,0,1,3,3,3,3,3,3,3,3,3,1,0,0,0],
      [0,0,0,1,3,3,3,3,3,3,3,3,3,3,3,1,0,0],
      [0,0,1,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [0,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [1,3,3,3,3,1,1,3,3,3,1,1,3,3,3,1,0,0],
      [1,3,3,3,3,1,1,3,3,3,1,1,3,3,1,0,0,0],
      [0,1,3,3,3,3,3,3,3,3,3,3,3,1,0,0,0,0],
      [0,0,1,1,3,3,3,3,3,3,3,3,1,0,0,0,0,0],
      [0,0,0,0,1,1,3,3,3,3,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0],
      [0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  castle: {
    name: "Castle",
    emoji: "🏰",
    difficulty: "hard",
    grades: ["5", "6", "7"],
    gridSize: 18,
    pattern: [
      [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
      [0,1,2,1,0,0,0,0,0,0,0,0,0,0,1,2,1,0],
      [0,1,2,1,0,0,0,1,1,1,1,0,0,0,1,2,1,0],
      [0,1,2,1,0,0,1,4,4,4,4,1,0,0,1,2,1,0],
      [0,1,2,1,1,1,4,4,4,4,4,4,1,1,1,2,1,0],
      [0,1,2,2,2,2,4,4,4,4,4,4,2,2,2,2,1,0],
      [0,1,2,2,2,2,4,4,4,4,4,4,2,2,2,2,1,0],
      [0,1,2,5,5,2,4,4,4,4,4,4,2,5,5,2,1,0],
      [0,1,2,5,5,2,4,4,4,4,4,4,2,5,5,2,1,0],
      [0,1,2,2,2,2,4,4,4,4,4,4,2,2,2,2,1,0],
      [0,1,2,2,2,2,4,4,1,1,4,4,2,2,2,2,1,0],
      [0,1,2,2,2,2,4,4,1,1,4,4,2,2,2,2,1,0],
      [0,1,2,2,2,2,4,4,1,1,4,4,2,2,2,2,1,0],
      [0,1,2,2,2,2,4,4,4,4,4,4,2,2,2,2,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0],
      [0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  unicorn: {
    name: "Unicorn",
    emoji: "🦄",
    difficulty: "hard",
    grades: ["5", "6", "7"],
    gridSize: 16,
    pattern: [
      [0,0,0,0,0,0,0,6,6,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,6,6,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,5,1,1,5,1,0,0,0,0,0],
      [0,0,0,0,1,5,5,5,5,5,5,1,0,0,0,0],
      [0,0,0,1,5,5,5,5,5,5,5,5,1,0,0,0],
      [0,0,1,3,3,5,5,5,5,5,5,3,3,1,0,0],
      [0,1,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [0,1,3,1,1,3,3,3,3,3,3,1,1,3,1,0],
      [0,1,3,1,4,3,3,3,3,3,3,1,4,3,1,0],
      [0,1,3,1,1,3,3,3,3,3,3,1,1,3,1,0],
      [0,1,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [0,0,1,3,3,3,3,3,3,3,3,3,3,1,0,0],
      [0,0,0,1,3,3,3,1,1,3,3,3,1,0,0,0],
      [0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0],
      [0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  spaceship: {
    name: "Spaceship",
    emoji: "🛸",
    difficulty: "hard",
    grades: ["5", "6", "7"],
    gridSize: 16,
    pattern: [
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,5,5,5,1,5,5,5,5,5,5,1,5,5,5,1],
      [1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1],
      [0,1,5,5,5,5,5,5,5,5,5,5,5,5,1,0],
      [0,0,1,1,5,5,5,5,5,5,5,5,1,1,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
      [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },

  elephant: {
    name: "Elephant",
    emoji: "🐘",
    difficulty: "hard",
    grades: ["5", "6", "7"],
    gridSize: 18,
    pattern: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,1,3,3,3,3,3,3,3,3,1,0,0,0,0],
      [0,0,0,1,3,3,3,3,3,3,3,3,3,3,1,0,0,0],
      [0,0,1,3,3,3,3,3,3,3,3,3,3,3,3,1,0,0],
      [0,1,3,3,1,1,3,3,3,3,3,3,1,1,3,3,1,0],
      [0,1,3,3,1,5,3,3,3,3,3,3,1,5,3,3,1,0],
      [0,1,3,3,1,1,3,3,3,3,3,3,1,1,3,3,1,0],
      [0,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [0,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
      [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
      [1,3,3,3,3,1,1,3,3,3,3,1,1,3,3,3,3,1],
      [0,1,1,3,3,1,1,3,3,3,3,1,1,3,3,1,1,0],
      [0,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,0],
      [0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  },
};

export default function ColorByNumbers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const initialOperation = urlParams.get("operation") || "addition";
  const initialLevel = urlParams.get("level") || "easy";
  const templateParam = urlParams.get("template");

  const [operation, setOperation] = useState(initialOperation);
  const [level, setLevel] = useState(initialLevel);
  const [coloredCells, setColoredCells] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showTemplateSelect, setShowTemplateSelect] = useState(!templateParam);
  const [selectedTemplate, setSelectedTemplate] = useState(templateParam || null);
  const [isPainting, setIsPainting] = useState(false);
  const [currentTool, setCurrentTool] = useState("brush");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [artworkImageUrl, setArtworkImageUrl] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const getOrganizedTemplates = () => {
    const easy = [];
    const medium = [];
    const hard = [];

    Object.entries(templates).forEach(([key, template]) => {
      if (template.difficulty === "easy") easy.push([key, template]);
      else if (template.difficulty === "medium") medium.push([key, template]);
      else if (template.difficulty === "hard") hard.push([key, template]);
    });

    return { easy, medium, hard };
  };

  const organizedTemplates = getOrganizedTemplates();

  const generateProblems = () => {
    const ranges = {
      easy: { min: 0, max: 5, answers: [1, 2, 3, 4, 5, 6] },
      medium: { min: 0, max: 10, answers: [2, 4, 6, 8, 10, 12] },
      hard: { min: 5, max: 15, answers: [5, 10, 15, 20, 25, 30] },
    };

    const range = ranges[level] || ranges.easy;
    const problems = [];
    const targetAnswers = range.answers;

    targetAnswers.forEach(answer => {
      let question = "";
      if (operation === "addition") {
        const num1 = Math.floor(Math.random() * Math.min(answer, range.max));
        const num2 = answer - num1;
        question = `${num1}+${num2}`;
      } else if (operation === "subtraction") {
        const num1 = answer + Math.floor(Math.random() * range.max) + range.min;
        const num2 = num1 - answer;
        question = `${num1}-${num2}`;
      } else if (operation === "multiplication") {
        const num1 = Math.max(1, Math.floor(Math.random() * 5));
        const num2 = Math.floor(answer / num1);
        if (num1 * num2 === answer) {
          question = `${num1}×${num2}`;
        } else {
          question = `${answer}×1`;
        }
      } else if (operation === "division") {
        const num2 = Math.max(1, Math.floor(Math.random() * 5));
        const num1 = answer * num2;
        question = `${num1}÷${num2}`;
      }

      problems.push({
        question,
        answer: answer,
        color: getColorForAnswer(answer, targetAnswers)
      });
    });

    return problems;
  };

  const getColorForAnswer = (answer, answers) => {
    const colors = [
      { name: "Red", hex: "#EF4444", answer: answers[0] },
      { name: "Blue", hex: "#3B82F6", answer: answers[1] },
      { name: "Green", hex: "#10B981", answer: answers[2] },
      { name: "Yellow", hex: "#F59E0B", answer: answers[3] },
      { name: "Purple", hex: "#A855F7", answer: answers[4] },
      { name: "Pink", hex: "#EC4899", answer: answers[5] },
    ];

    const colorIndex = answers.indexOf(answer);
    return colors[colorIndex] || colors[0];
  };

  const [problems, setProblems] = useState(() => generateProblems());

  useEffect(() => {
    setProblems(generateProblems());
    setColoredCells({});
    setIsComplete(false);
    setSelectedColor(null);
  }, [operation, level]);

  const colorKey = [...new Set(problems.map(p => p.color))];

  const template = selectedTemplate ? templates[selectedTemplate] : null;

  const saveProgressMutation = useMutation({
    mutationFn: (progressData) => base44.entities.GameProgress.create(progressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameProgress'] });

      const coins = 25;
      const newTotalCoins = (user?.coins || 0) + coins;
      base44.auth.updateMe({ coins: newTotalCoins });
    },
  });

  const saveProgress = () => {
    let totalCells = 0;
    template.pattern.forEach(row => {
      row.forEach(cell => {
        if (cell !== 0) totalCells++;
      });
    });

    saveProgressMutation.mutate({
      level,
      operation,
      score: 100,
      correct_answers: totalCells,
      total_questions: totalCells,
      time_taken: 0,
      stars_earned: 3,
      coins_earned: 25,
      learning_objective: `Pixel art color by numbers - ${template?.name} - practicing ${operation}`,
    });
  };

  // Capture completed artwork as image
  const captureArtwork = async () => {
    if (!template) return null;

    setIsCapturing(true);

    try {
      // Create a canvas to draw the completed artwork
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const cellSize = 40; // Consistent with the rendering cellSize
      const gridSize = template.gridSize;

      canvas.width = gridSize * cellSize;
      canvas.height = gridSize * cellSize;

      // Draw the grid
      template.pattern.forEach((row, rowIndex) => {
        row.forEach((cellValue, colIndex) => {
          const cellKey = `${rowIndex}-${colIndex}`;
          const x = colIndex * cellSize;
          const y = rowIndex * cellSize;

          // Fill cell
          if (cellValue === 0) {
            ctx.fillStyle = '#F3F4F6'; // Background color for empty cells
          } else {
            ctx.fillStyle = coloredCells[cellKey] || '#FFFFFF'; // Colored or default white
          }
          ctx.fillRect(x, y, cellSize, cellSize);

          // Draw border
          ctx.strokeStyle = '#9CA3AF'; // Border color for cells
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellSize, cellSize);
        });
      });

      // Convert to blob and create URL
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const url = URL.createObjectURL(blob);

      setArtworkImageUrl(url);
      setIsCapturing(false);
      return url;
    } catch (error) {
      console.error('Error capturing artwork:', error);
      setIsCapturing(false);
      return null;
    }
  };

  // Handle completion
  useEffect(() => {
    if (!template) return;

    let totalCells = 0;
    let coloredCount = 0;
    let correctCount = 0;

    template.pattern.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        if (cellValue !== 0) {
          totalCells++;
          const cellKey = `${rowIndex}-${colIndex}`;
          const problem = problems[cellValue - 1];

          if (coloredCells[cellKey]) {
            coloredCount++;
            if (coloredCells[cellKey] === problem?.color.hex) {
              correctCount++;
            }
          }
        }
      });
    });

    if (totalCells > 0 && coloredCount === totalCells && correctCount === totalCells && !isComplete) {
      setIsComplete(true);
      saveProgress();
      captureArtwork();
    }
  }, [coloredCells, template, isComplete, problems]); // Added dependencies to useEffect

  // Download artwork
  const handleDownload = () => {
    if (!artworkImageUrl) return;

    const a = document.createElement('a');
    a.href = artworkImageUrl;
    a.download = `math-adventure-${template?.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Share on Facebook
  const handleShareFacebook = () => {
    const shareText = `🎨 I just completed a ${template?.name} pixel art in Math Adventure! Check out my awesome creation! 🌟`;
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  // Share on Twitter
  const handleShareTwitter = () => {
    const shareText = `🎨 I just completed a ${template?.name} pixel art in Math Adventure while practicing ${operation}! 🌟 #MathAdventure #PixelArt #Learning`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  // Copy link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const floodFill = (startRow, startCol, targetNumber, fillColor) => {
    if (!template) return;

    const visited = new Set();
    const stack = [[startRow, startCol]];
    const cellsToFill = [];

    while (stack.length > 0) {
      const [row, col] = stack.pop();
      const key = `${row}-${col}`;

      if (row < 0 || row >= template.gridSize || col < 0 || col >= template.gridSize || visited.has(key)) {
        continue;
      }

      visited.add(key);

      const cellValue = template.pattern[row][col];
      if (cellValue !== targetNumber) {
        continue;
      }

      cellsToFill.push(key);

      stack.push([row + 1, col]);
      stack.push([row - 1, col]);
      stack.push([row, col + 1]);
      stack.push([row, col - 1]);
    }

    return cellsToFill;
  };

  const handleCellClick = (rowIndex, colIndex, cellValue) => {
    if (isComplete || cellValue === 0) return;

    const cellKey = `${rowIndex}-${colIndex}`;

    if (currentTool === "brush") {
      if (!selectedColor) return;
      setColoredCells(prev => ({
        ...prev,
        [cellKey]: selectedColor
      }));
    } else if (currentTool === "fill") {
      if (!selectedColor) return;
      const cellsToFill = floodFill(rowIndex, colIndex, cellValue, selectedColor);
      if (cellsToFill && cellsToFill.length > 0) {
        setColoredCells(prev => {
          const newCells = { ...prev };
          cellsToFill.forEach(key => {
            newCells[key] = selectedColor;
          });
          return newCells;
        });
      }
    } else if (currentTool === "eraser") {
      setColoredCells(prev => {
        const newCells = { ...prev };
        delete newCells[cellKey];
        return newCells;
      });
    }
  };

  const handleCellMouseDown = (rowIndex, colIndex, cellValue) => {
    if (!selectedColor || isComplete || cellValue === 0 || currentTool !== "brush") return;

    setIsPainting(true);
    const cellKey = `${rowIndex}-${colIndex}`;
    setColoredCells(prev => ({
      ...prev,
      [cellKey]: selectedColor
    }));
  };

  const handleCellMouseEnter = (rowIndex, colIndex, cellValue) => {
    if (!isPainting || !selectedColor || isComplete || cellValue === 0 || currentTool !== "brush") return;

    const cellKey = `${rowIndex}-${colIndex}`;
    setColoredCells(prev => ({
      ...prev,
      [cellKey]: selectedColor
    }));
  };

  const handleMouseUp = () => {
    setIsPainting(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsPainting(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  const handleReset = () => {
    setColoredCells({});
    setIsComplete(false);
    setSelectedColor(null);
    setZoomLevel(1);
    setArtworkImageUrl(null); // Reset image URL on reset
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    setShowTemplateSelect(false);
    setColoredCells({});
    setIsComplete(false);
    setSelectedColor(null);
    setZoomLevel(1);
    setArtworkImageUrl(null); // Reset image URL on template change

    const newUrl = `${window.location.pathname}?operation=${operation}&level=${level}&template=${templateKey}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleOperationChange = (newOperation) => {
    setOperation(newOperation);
    const newUrl = template
      ? `${window.location.pathname}?operation=${newOperation}&level=${level}&template=${selectedTemplate}`
      : `${window.location.pathname}?operation=${newOperation}&level=${level}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    const newUrl = template
      ? `${window.location.pathname}?operation=${operation}&level=${newLevel}&template=${selectedTemplate}`
      : `${window.location.pathname}?operation=${operation}&level=${newLevel}`;
    window.history.replaceState({}, '', newUrl);
  };

  if (showTemplateSelect) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("Home"))}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2 mb-2">
              <Palette className="w-8 h-8 text-purple-500" />
              Choose Your Pixel Art
            </h1>
            <p className="text-gray-600 mb-4">Pick a fun design to color!</p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-50">
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Math Operation</label>
                <Select value={operation} onValueChange={handleOperationChange}>
                  <SelectTrigger className="w-full sm:w-52 h-12 text-base">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="addition">
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Addition
                      </div>
                    </SelectItem>
                    <SelectItem value="subtraction">
                      <div className="flex items-center gap-2">
                        <Minus className="w-4 h-4" />
                        Subtraction
                      </div>
                    </SelectItem>
                    <SelectItem value="multiplication">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4" />
                        Multiplication
                      </div>
                    </SelectItem>
                    <SelectItem value="division">
                      <div className="flex items-center gap-2">
                        <Divide className="w-4 h-4" />
                        Division
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <Select value={level} onValueChange={handleLevelChange}>
                  <SelectTrigger className="w-full sm:w-52 h-12 text-base">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="easy">Easy (K-2nd Grade)</SelectItem>
                    <SelectItem value="medium">Medium (3-5th Grade)</SelectItem>
                    <SelectItem value="hard">Hard (6-8th Grade)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Badge className="bg-green-500 text-white text-lg px-4 py-2">Easy</Badge>
            <span className="text-gray-600 text-lg">Perfect for K-2nd Grade</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizedTemplates.easy.map(([key, template]) => (
              <Card
                key={key}
                className="border-4 border-green-200 hover:border-green-500 cursor-pointer transition-all hover:shadow-xl"
                onClick={() => handleTemplateSelect(key)}
              >
                <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
                  <CardTitle className="text-center">
                    <div className="text-6xl mb-2">{template.emoji}</div>
                    <div className="text-xl">{template.name}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      {template.gridSize}×{template.gridSize} grid
                    </p>
                    <p className="text-xs text-gray-500">
                      Grades: {template.grades.join(', ')}
                    </p>
                    <Badge className="bg-blue-500 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Pixel Art Style
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">Medium</Badge>
            <span className="text-gray-600 text-lg">Great for 3-5th Grade</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizedTemplates.medium.map(([key, template]) => (
              <Card
                key={key}
                className="border-4 border-yellow-200 hover:border-yellow-500 cursor-pointer transition-all hover:shadow-xl"
                onClick={() => handleTemplateSelect(key)}
              >
                <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100">
                  <CardTitle className="text-center">
                    <div className="text-6xl mb-2">{template.emoji}</div>
                    <div className="text-xl">{template.name}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      {template.gridSize}×{template.gridSize} grid
                    </p>
                    <p className="text-xs text-gray-500">
                      Grades: {template.grades.join(', ')}
                    </p>
                    <Badge className="bg-blue-500 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Pixel Art Style
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Badge className="bg-red-500 text-white text-lg px-4 py-2">Hard</Badge>
            <span className="text-gray-600 text-lg">Challenge for 5-8th Grade</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizedTemplates.hard.map(([key, template]) => (
              <Card
                key={key}
                className="border-4 border-red-200 hover:border-red-500 cursor-pointer transition-all hover:shadow-xl"
                onClick={() => handleTemplateSelect(key)}
              >
                <CardHeader className="bg-gradient-to-r from-red-100 to-pink-100">
                  <CardTitle className="text-center">
                    <div className="text-6xl mb-2">{template.emoji}</div>
                    <div className="text-xl">{template.name}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      {template.gridSize}×{template.gridSize} grid
                    </p>
                    <p className="text-xs text-gray-500">
                      Grades: {template.grades.join(', ')}
                    </p>
                    <Badge className="bg-blue-500 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Pixel Art Style
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p>Loading template...</p>
      </div>
    );
  }

  const cellSize = 40;

  let totalCells = 0;
  let coloredCount = 0;
  template.pattern.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      if (cellValue !== 0) {
        totalCells++;
        const cellKey = `${rowIndex}-${colIndex}`;
        if (coloredCells[cellKey]) coloredCount++;
      }
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => setShowTemplateSelect(true)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Picture
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={operation} onValueChange={handleOperationChange}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="addition">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Addition
                  </div>
                </SelectItem>
                <SelectItem value="subtraction">
                  <div className="flex items-center gap-2">
                    <Minus className="w-4 h-4" />
                    Subtraction
                  </div>
                </SelectItem>
                <SelectItem value="multiplication">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Multiplication
                  </div>
                </SelectItem>
                <SelectItem value="division">
                  <div className="flex items-center gap-2">
                    <Divide className="w-4 h-4" />
                    Division
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={level} onValueChange={handleLevelChange}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy (K-2)</SelectItem>
                <SelectItem value="medium">Medium (3-5)</SelectItem>
                <SelectItem value="hard">Hard (6-8)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowHints(!showHints)}
              className="gap-2"
            >
              <Info className="w-4 h-4" />
              {showHints ? "Hide" : "Show"} Hints
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl">{template.emoji}</span>
            {template.name} Pixel Art
          </h1>
          <p className="text-gray-600">Solve the math problems and color the picture!</p>
          <Badge className="mt-2 text-lg px-4 py-1">
            {operation.charAt(0).toUpperCase() + operation.slice(1)} - {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
        </div>
      </div>

      {isComplete && (
        <Alert className="mb-6 bg-green-50 border-green-300">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <strong>🎉 Pixel Art Complete!</strong>
                <p className="text-sm mt-1">You've colored all cells correctly! +25 coins & 3 stars!</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowShareModal(true)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={() => setShowTemplateSelect(true)}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  New Picture
                </Button>
                <Button
                  onClick={() => navigate(createPageUrl("Home"))}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Done
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={() => setShowShareModal(false)}>
          <Card className="max-w-2xl w-full border-4 border-purple-300 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-6 h-6" />
                  Share Your Masterpiece!
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowShareModal(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Preview */}
              {artworkImageUrl && (
                <div className="mb-6">
                  <div className="bg-gray-100 rounded-xl p-4 border-2 border-gray-300">
                    <img
                      src={artworkImageUrl}
                      alt="Completed artwork"
                      className="max-w-full mx-auto"
                      style={{ maxHeight: '300px', imageRendering: 'pixelated' }}
                    />
                  </div>
                  <p className="text-center mt-3 text-gray-600">
                    <span className="text-2xl">{template?.emoji}</span> {template?.name} - {operation.charAt(0).toUpperCase() + operation.slice(1)}
                  </p>
                </div>
              )}

              {/* Share Buttons */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-3">Share on Social Media</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handleShareFacebook}
                    className="h-14 bg-[#1877F2] hover:bg-[#166FE5] text-white gap-2 text-base"
                  >
                    <Facebook className="w-5 h-5" />
                    Share on Facebook
                  </Button>

                  <Button
                    onClick={handleShareTwitter}
                    className="h-14 bg-[#1DA1F2] hover:bg-[#1A94DA] text-white gap-2 text-base"
                  >
                    <Twitter className="w-5 h-5" />
                    Share on Twitter
                  </Button>
                </div>

                <Alert className="bg-purple-50 border-purple-200">
                  <Instagram className="w-4 h-4 text-purple-600" />
                  <AlertDescription className="text-purple-800 text-sm">
                    <strong>Instagram Tip:</strong> Download your artwork below and share it as a post or story!
                  </AlertDescription>
                </Alert>

                <div className="pt-4 border-t space-y-3">
                  <h3 className="font-bold text-lg">Download & More</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="h-12 gap-2 border-2 border-purple-300 hover:bg-purple-50"
                    >
                      <Download className="w-5 h-5" />
                      Download Image
                    </Button>

                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="h-12 gap-2 border-2 border-blue-300 hover:bg-blue-50"
                    >
                      <Link2 className="w-5 h-5" />
                      Copy Link
                    </Button>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="w-4 h-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <strong>Pro Tip:</strong> Download your artwork and share it anywhere! Perfect for showing off your math skills to friends and family.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-4 border-blue-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Brush className="w-6 h-6" />
                Drawing Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button
                  variant={currentTool === "brush" ? "default" : "outline"}
                  onClick={() => setCurrentTool("brush")}
                  className={`flex flex-col items-center gap-1 h-auto py-3 ${
                    currentTool === "brush" ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  <Brush className="w-5 h-5" />
                  <span className="text-xs">Brush</span>
                </Button>
                <Button
                  variant={currentTool === "fill" ? "default" : "outline"}
                  onClick={() => setCurrentTool("fill")}
                  className={`flex flex-col items-center gap-1 h-auto py-3 ${
                    currentTool === "fill" ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  <PaintBucket className="w-5 h-5" />
                  <span className="text-xs">Fill</span>
                </Button>
                <Button
                  variant={currentTool === "eraser" ? "default" : "outline"}
                  onClick={() => setCurrentTool("eraser")}
                  className={`flex flex-col items-center gap-1 h-auto py-3 ${
                    currentTool === "eraser" ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  <Eraser className="w-5 h-5" />
                  <span className="text-xs">Eraser</span>
                </Button>
              </div>

              <div className="border-t pt-4">
                <label className="text-sm font-medium mb-2 block">Zoom Controls</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.5}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <Badge variant="outline" className="text-sm">
                      {Math.round(zoomLevel * 100)}%
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 2}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomReset}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200 mt-4">
                <Info className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-xs">
                  {currentTool === "brush" && (
                    <>
                      <strong>Brush:</strong> Click & drag to paint cells
                    </>
                  )}
                  {currentTool === "fill" && (
                    <>
                      <strong>Fill:</strong> Click to fill all connected cells with the same number
                    </>
                  )}
                  {currentTool === "eraser" && (
                    <>
                      <strong>Eraser:</strong> Click to remove color from cells
                    </>
                  )}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="border-4 border-purple-300 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-6 h-6" />
                Color Key
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {colorKey.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(color.hex)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border-4 ${
                    selectedColor === color.hex
                      ? "border-purple-500 scale-105 shadow-lg"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-white drop-shadow-lg">
                      <div className="font-bold text-2xl">{color.answer}</div>
                      <div className="text-sm">{problems[index]?.question}</div>
                    </div>
                    {selectedColor === color.hex && (
                      <CheckCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
              ))}

              {!selectedColor && currentTool !== "eraser" && (
                <Alert className="bg-yellow-50 border-yellow-300">
                  <Info className="w-4 h-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 text-sm">
                    Select a color to start coloring!
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-4 border-blue-300 shadow-xl">
            <CardHeader className="bg-blue-50">
              <CardTitle>🎨 Your Pixel Art</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white rounded-xl border-4 border-gray-300 p-4 overflow-auto max-h-[600px]">
                <div
                  className="inline-block border-4 border-black select-none"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${template.gridSize}, ${cellSize}px)`,
                    gap: '0',
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top left'
                  }}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {template.pattern.map((row, rowIndex) => (
                    row.map((cellValue, colIndex) => {
                      const cellKey = `${rowIndex}-${colIndex}`;
                      const problem = problems[cellValue - 1];
                      const isColored = !!coloredCells[cellKey];
                      const fillColor = coloredCells[cellKey] || (cellValue === 0 ? '#F3F4F6' : '#FFFFFF');
                      const isCorrect = isColored && coloredCells[cellKey] === problem?.color.hex;

                      return (
                        <div
                          key={cellKey}
                          onMouseDown={() => currentTool === "brush" && handleCellMouseDown(rowIndex, colIndex, cellValue)}
                          onMouseEnter={() => currentTool === "brush" && handleCellMouseEnter(rowIndex, colIndex, cellValue)}
                          onClick={() => handleCellClick(rowIndex, colIndex, cellValue)}
                          onTouchStart={() => handleCellClick(rowIndex, colIndex, cellValue)}
                          className={`border border-gray-400 flex items-center justify-center font-bold transition-all ${
                            cellValue !== 0 && !isColored ? 'hover:bg-gray-100' : ''
                          } ${
                            currentTool === "brush" && isPainting ? 'cursor-crosshair' :
                            'cursor-pointer'
                          }`}
                          style={{
                            width: `${cellSize}px`,
                            height: `${cellSize}px`,
                            backgroundColor: fillColor,
                          }}
                        >
                          {cellValue !== 0 && !isColored && (
                            <span className="text-black text-xl select-none pointer-events-none">
                              {problem?.answer}
                            </span>
                          )}
                          {isColored && isCorrect && (
                            <span className="text-white text-2xl drop-shadow-lg pointer-events-none">✓</span>
                          )}
                          {isColored && !isCorrect && (
                            <span className="text-white text-xl drop-shadow-lg pointer-events-none">✗</span>
                          )}
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Progress: {coloredCount} / {totalCells} cells colored
                  {isPainting && <span className="ml-2 text-purple-600 font-bold">🎨 Painting...</span>}
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-6 h-6 ${
                        isComplete ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6 border-2 border-purple-200">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-4xl mb-2">🖌️</div>
              <h3 className="font-bold mb-1">Brush Tool</h3>
              <p className="text-sm text-gray-600">Click & drag to paint multiple cells</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🪣</div>
              <h3 className="font-bold mb-1">Fill Tool</h3>
              <p className="text-sm text-gray-600">Fill all connected same numbers at once</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🧹</div>
              <h3 className="font-bold mb-1">Eraser</h3>
              <p className="text-sm text-gray-600">Remove colors to fix mistakes</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="font-bold mb-1">Zoom</h3>
              <p className="text-sm text-gray-600">Zoom in for detailed work on large grids</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
