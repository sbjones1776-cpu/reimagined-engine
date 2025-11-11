
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { 
  getUserGameProgress, 
  getUserTeamChallenges,
  subscribeUserGameProgress 
} from "@/api/firebaseService";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from '@/hooks/UserProvider.jsx';
import { Plus, Minus, X, Divide, Star, Lock, Play, Trophy, Award, Brain, Sparkles, Users, AlertCircle, Crown, CreditCard, Calendar, Percent, DollarSign, Clock, Shapes, BookOpen, TrendingUp, Grid3x3, Zap, Target, Binary, Calculator, BarChart3, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DailyChallengeWidget from "../components/daily/DailyChallengeWidget";
import SimpleAuth from "../components/SimpleAuth";
import Logo from "@/components/Logo";
import UpgradeButton from "@/components/UpgradeButton";
import AppTrialPromo from "@/components/AppTrialPromo";
import { format } from "date-fns";

const mathConcepts = [
  // BASICS & NUMBER SENSE (K-2nd) - 20 concepts
  { 
    id: "counting", 
    name: "Counting", 
    icon: Grid3x3, 
    color: "from-green-400 to-emerald-500", 
    emoji: "🔢",
    grades: ["K", "1"],
    description: "Count and recognize numbers",
    category: "basics"
  },
  { 
    id: "skip_counting_2s", 
    name: "Skip Count by 2s", 
    icon: Zap, 
    color: "from-blue-400 to-cyan-500", 
    emoji: "⚡",
    grades: ["K", "1", "2"],
    description: "Count by twos",
    category: "basics"
  },
  { 
    id: "skip_counting_5s", 
    name: "Skip Count by 5s", 
    icon: Zap, 
    color: "from-green-400 to-teal-500", 
    emoji: "🔥",
    grades: ["K", "1", "2"],
    description: "Count by fives",
    category: "basics"
  },
  { 
    id: "skip_counting_10s", 
    name: "Skip Count by 10s", 
    icon: Zap, 
    color: "from-purple-400 to-pink-500", 
    emoji: "⚡",
    grades: ["K", "1", "2"],
    description: "Count by tens",
    category: "basics"
  },
  { 
    id: "even_odd", 
    name: "Even & Odd Numbers", 
    icon: Binary, 
    color: "from-indigo-400 to-blue-500", 
    emoji: "🔢",
    grades: ["1", "2", "3"],
    description: "Identify even and odd",
    category: "basics"
  },
  { 
    id: "number_comparison", 
    name: "Comparing Numbers", 
    icon: TrendingUp, 
    color: "from-blue-400 to-cyan-500", 
    emoji: "⚖️",
    grades: ["K", "1", "2"],
    description: "Greater than, less than, equal to",
    category: "basics"
  },
  { 
    id: "ordering_numbers", 
    name: "Ordering Numbers", 
    icon: TrendingUp, 
    color: "from-cyan-400 to-blue-500", 
    emoji: "🔢",
    grades: ["1", "2", "3"],
    description: "Put numbers in order",
    category: "basics"
  },
  { 
    id: "place_value", 
    name: "Place Value", 
    icon: Grid3x3, 
    color: "from-purple-400 to-indigo-500", 
    emoji: "💯",
    grades: ["1", "2", "3", "4"],
    description: "Ones, tens, hundreds",
    category: "basics"
  },
  { 
    id: "place_value_thousands", 
    name: "Place Value (Thousands)", 
    icon: Grid3x3, 
    color: "from-indigo-400 to-purple-500", 
    emoji: "🔢",
    grades: ["3", "4", "5"],
    description: "Up to thousands place",
    category: "basics"
  },
  { 
    id: "number_bonds", 
    name: "Number Bonds", 
    icon: Zap, 
    color: "from-pink-400 to-rose-500", 
    emoji: "🔗",
    grades: ["K", "1", "2"],
    description: "Part-part-whole relationships",
    category: "basics"
  },
  { 
    id: "fact_families", 
    name: "Fact Families", 
    icon: Users, 
    color: "from-orange-400 to-red-500", 
    emoji: "👨‍👩‍👧‍👦",
    grades: ["1", "2", "3"],
    description: "Related addition & subtraction",
    category: "basics"
  },
  { 
    id: "patterns", 
    name: "Patterns & Sequences", 
    icon: Zap, 
    color: "from-yellow-400 to-orange-500", 
    emoji: "🔄",
    grades: ["1", "2", "3", "4"],
    description: "Identify and complete patterns",
    category: "basics"
  },
  { 
    id: "rounding", 
    name: "Rounding", 
    icon: Target, 
    color: "from-red-400 to-pink-500", 
    emoji: "🎯",
    grades: ["2", "3", "4", "5"],
    description: "Round to nearest 10, 100, 1000",
    category: "basics"
  },
  { 
    id: "estimation", 
    name: "Estimation", 
    icon: Target, 
    color: "from-amber-400 to-orange-500", 
    emoji: "📊",
    grades: ["2", "3", "4", "5"],
    description: "Estimate sums and products",
    category: "basics"
  },
  { 
    id: "roman_numerals", 
    name: "Roman Numerals", 
    icon: BookOpen, 
    color: "from-purple-400 to-indigo-500", 
    emoji: "Ⅰ",
    grades: ["3", "4", "5"],
    description: "Read and write Roman numerals",
    category: "basics"
  },
  { 
    id: "expanded_form", 
    name: "Expanded Form", 
    icon: Grid3x3, 
    color: "from-teal-400 to-cyan-500", 
    emoji: "📐",
    grades: ["2", "3", "4"],
    description: "Write numbers in expanded form",
    category: "basics"
  },
  { 
    id: "standard_form", 
    name: "Standard Form", 
    icon: Grid3x3, 
    color: "from-blue-400 to-indigo-500", 
    emoji: "✍️",
    grades: ["2", "3", "4"],
    description: "Write numbers in standard form",
    category: "basics"
  },
  { 
    id: "word_form", 
    name: "Word Form Numbers", 
    icon: BookOpen, 
    color: "from-green-400 to-emerald-500", 
    emoji: "📝",
    grades: ["2", "3", "4"],
    description: "Write numbers as words",
    category: "basics"
  },
  { 
    id: "greater_less_symbols", 
    name: "Greater/Less Symbols", 
    icon: TrendingUp, 
    color: "from-cyan-400 to-blue-500", 
    emoji: "〉",
    grades: ["K", "1", "2"],
    description: "Use >, <, = symbols",
    category: "basics"
  },
  { 
    id: "number_lines", 
    name: "Number Lines", 
    icon: TrendingUp, 
    color: "from-purple-400 to-pink-500", 
    emoji: "📏",
    grades: ["1", "2", "3"],
    description: "Use and interpret number lines",
    category: "basics"
  },

  // CORE OPERATIONS (K-5th) - 28 concepts
  { 
    id: "addition", 
    name: "Addition", 
    icon: Plus, 
    color: "from-green-400 to-emerald-500", 
    emoji: "➕",
    grades: ["K", "1", "2", "3", "4"],
    description: "Learn to add numbers",
    category: "core"
  },
  { 
    id: "addition_single_digit", 
    name: "Single-Digit Addition", 
    icon: Plus, 
    color: "from-green-300 to-emerald-400", 
    emoji: "➕",
    grades: ["K", "1"],
    description: "Add numbers 0-10",
    category: "core"
  },
  { 
    id: "addition_double_digit", 
    name: "Two-Digit Addition", 
    icon: Plus, 
    color: "from-green-400 to-teal-500", 
    emoji: "➕",
    grades: ["1", "2", "3"],
    description: "Add two-digit numbers",
    category: "core"
  },
  { 
    id: "addition_triple_digit", 
    name: "Three-Digit Addition", 
    icon: Plus, 
    color: "from-green-500 to-emerald-600", 
    emoji: "➕",
    grades: ["2", "3", "4"],
    description: "Add three-digit numbers",
    category: "core"
  },
  { 
    id: "addition_regrouping", 
    name: "Addition with Regrouping", 
    icon: Plus, 
    color: "from-teal-400 to-cyan-500", 
    emoji: "➕",
    grades: ["2", "3", "4"],
    description: "Add with carrying",
    category: "core"
  },
  { 
    id: "missing_addends", 
    name: "Missing Addends", 
    icon: Plus, 
    color: "from-cyan-400 to-blue-500", 
    emoji: "❓",
    grades: ["1", "2", "3"],
    description: "Find the missing number",
    category: "core"
  },
  { 
    id: "subtraction", 
    name: "Subtraction", 
    icon: Minus, 
    color: "from-blue-400 to-cyan-500", 
    emoji: "➖",
    grades: ["K", "1", "2", "3", "4"],
    description: "Practice subtraction",
    category: "core"
  },
  { 
    id: "subtraction_single_digit", 
    name: "Single-Digit Subtraction", 
    icon: Minus, 
    color: "from-blue-300 to-cyan-400", 
    emoji: "➖",
    grades: ["K", "1"],
    description: "Subtract numbers 0-10",
    category: "core"
  },
  { 
    id: "subtraction_double_digit", 
    name: "Two-Digit Subtraction", 
    icon: Minus, 
    color: "from-blue-400 to-indigo-500", 
    emoji: "➖",
    grades: ["1", "2", "3"],
    description: "Subtract two-digit numbers",
    category: "core"
  },
  { 
    id: "subtraction_regrouping", 
    name: "Subtraction with Regrouping", 
    icon: Minus, 
    color: "from-indigo-400 to-purple-500", 
    emoji: "➖",
    grades: ["2", "3", "4"],
    description: "Subtract with borrowing",
    category: "core"
  },
  { 
    id: "multiplication", 
    name: "Multiplication", 
    icon: X, 
    color: "from-purple-400 to-pink-500", 
    emoji: "✖️",
    grades: ["2", "3", "4", "5"],
    description: "Master times tables",
    category: "core"
  },
  { 
    id: "multiplication_tables_2_5", 
    name: "Times Tables (2, 5, 10)", 
    icon: X, 
    color: "from-purple-300 to-pink-400", 
    emoji: "✖️",
    grades: ["2", "3"],
    description: "Learn easy times tables",
    category: "core"
  },
  { 
    id: "multiplication_tables_3_4", 
    name: "Times Tables (3, 4, 6)", 
    icon: X, 
    color: "from-pink-400 to-rose-500", 
    emoji: "✖️",
    grades: ["3", "4"],
    description: "Medium difficulty tables",
    category: "core"
  },
  { 
    id: "multiplication_tables_7_9", 
    name: "Times Tables (7, 8, 9)", 
    icon: X, 
    color: "from-rose-400 to-red-500", 
    emoji: "✖️",
    grades: ["3", "4", "5"],
    description: "Challenging times tables",
    category: "core"
  },
  { 
    id: "multiplication_double_digit", 
    name: "Two-Digit Multiplication", 
    icon: X, 
    color: "from-purple-500 to-indigo-600", 
    emoji: "✖️",
    grades: ["4", "5", "6"],
    description: "Multiply larger numbers",
    category: "core"
  },
  { 
    id: "missing_factors", 
    name: "Missing Factors", 
    icon: X, 
    color: "from-indigo-400 to-purple-500", 
    emoji: "❓",
    grades: ["3", "4", "5"],
    description: "Find the missing factor",
    category: "core"
  },
  { 
    id: "division", 
    name: "Division", 
    icon: Divide, 
    color: "from-orange-400 to-red-500", 
    emoji: "➗",
    grades: ["3", "4", "5", "6"],
    description: "Divide and conquer",
    category: "core"
  },
  { 
    id: "division_basic", 
    name: "Basic Division", 
    icon: Divide, 
    color: "from-orange-300 to-red-400", 
    emoji: "➗",
    grades: ["3", "4"],
    description: "Simple division facts",
    category: "core"
  },
  { 
    id: "division_remainders", 
    name: "Division with Remainders", 
    icon: Divide, 
    color: "from-red-400 to-pink-500", 
    emoji: "➗",
    grades: ["4", "5", "6"],
    description: "Division with leftovers",
    category: "core"
  },
  { 
    id: "division_long", 
    name: "Long Division", 
    icon: Divide, 
    color: "from-red-500 to-orange-600", 
    emoji: "➗",
    grades: ["4", "5", "6"],
    description: "Multi-digit division",
    category: "core"
  },
  { 
    id: "order_operations", 
    name: "Order of Operations", 
    icon: Calculator, 
    color: "from-blue-400 to-indigo-500", 
    emoji: "🧮",
    grades: ["5", "6", "7", "8"],
    description: "PEMDAS / BODMAS",
    category: "core"
  },
  { 
    id: "properties_addition", 
    name: "Properties of Addition", 
    icon: Plus, 
    color: "from-teal-400 to-cyan-500", 
    emoji: "📐",
    grades: ["2", "3", "4"],
    description: "Commutative, associative",
    category: "core"
  },
  { 
    id: "properties_multiplication", 
    name: "Properties of Multiplication", 
    icon: X, 
    color: "from-purple-400 to-pink-500", 
    emoji: "📐",
    grades: ["3", "4", "5"],
    description: "Commutative, associative, distributive",
    category: "core"
  },
  { 
    id: "distributive_property", 
    name: "Distributive Property", 
    icon: Grid3x3, 
    color: "from-indigo-400 to-purple-500", 
    emoji: "🔢",
    grades: ["4", "5", "6"],
    description: "Break apart multiplication",
    category: "core"
  },
  { 
    id: "mental_math_strategies", 
    name: "Mental Math Strategies", 
    icon: Brain, 
    color: "from-yellow-400 to-orange-500", 
    emoji: "🧠",
    grades: ["2", "3", "4", "5"],
    description: "Quick calculation tricks",
    category: "core"
  },
  { 
    id: "powers_of_10", 
    name: "Powers of 10", 
    icon: Zap, 
    color: "from-blue-400 to-purple-500", 
    emoji: "⚡",
    grades: ["4", "5", "6"],
    description: "Multiply and divide by 10, 100, 1000",
    category: "core"
  },
  { 
    id: "multiples", 
    name: "Multiples", 
    icon: Grid3x3, 
    color: "from-green-400 to-teal-500", 
    emoji: "🔢",
    grades: ["3", "4", "5"],
    description: "Identify multiples of numbers",
    category: "core"
  },
  { 
    id: "divisibility_rules", 
    name: "Divisibility Rules", 
    icon: Divide, 
    color: "from-orange-400 to-red-500", 
    emoji: "📏",
    grades: ["4", "5", "6"],
    description: "Quick divisibility checks",
    category: "core"
  },

  // ADVANCED CONCEPTS (4-8th) - 24 concepts
  { 
    id: "factors_multiples", 
    name: "Factors & Multiples", 
    icon: Grid3x3, 
    color: "from-indigo-400 to-purple-500", 
    emoji: "🔢",
    grades: ["4", "5", "6"],
    description: "Find factors and multiples",
    category: "advanced"
  },
  { 
    id: "gcf", 
    name: "Greatest Common Factor", 
    icon: Grid3x3, 
    color: "from-purple-400 to-indigo-500", 
    emoji: "🔢",
    grades: ["5", "6", "7"],
    description: "Find GCF of numbers",
    category: "advanced"
  },
  { 
    id: "lcm", 
    name: "Least Common Multiple", 
    icon: Grid3x3, 
    color: "from-indigo-400 to-blue-500", 
    emoji: "🔢",
    grades: ["5", "6", "7"],
    description: "Find LCM of numbers",
    category: "advanced"
  },
  { 
    id: "prime_composite", 
    name: "Prime & Composite", 
    icon: Star, 
    color: "from-green-400 to-teal-500", 
    emoji: "⭐",
    grades: ["4", "5", "6"],
    description: "Identify prime numbers",
    category: "advanced"
  },
  { 
    id: "prime_factorization", 
    name: "Prime Factorization", 
    icon: Star, 
    color: "from-teal-400 to-cyan-500", 
    emoji: "🌟",
    grades: ["5", "6", "7"],
    description: "Break numbers into prime factors",
    category: "advanced"
  },
  { 
    id: "fractions", 
    name: "Fractions", 
    icon: Percent, 
    color: "from-pink-400 to-rose-500", 
    emoji: "½",
    grades: ["3", "4", "5", "6"],
    description: "Work with fractions",
    category: "advanced"
  },
  { 
    id: "fractions_equivalent", 
    name: "Equivalent Fractions", 
    icon: Percent, 
    color: "from-rose-400 to-pink-500", 
    emoji: "½",
    grades: ["3", "4", "5"],
    description: "Find equivalent fractions",
    category: "advanced"
  },
  { 
    id: "fractions_simplify", 
    name: "Simplifying Fractions", 
    icon: Percent, 
    color: "from-pink-400 to-purple-500", 
    emoji: "½",
    grades: ["4", "5", "6"],
    description: "Reduce fractions to lowest terms",
    category: "advanced"
  },
  { 
    id: "fractions_compare", 
    name: "Comparing Fractions", 
    icon: TrendingUp, 
    color: "from-purple-400 to-pink-500", 
    emoji: "⚖️",
    grades: ["3", "4", "5"],
    description: "Compare and order fractions",
    category: "advanced"
  },
  { 
    id: "fractions_add_subtract", 
    name: "Adding/Subtracting Fractions", 
    icon: Plus, 
    color: "from-pink-400 to-rose-500", 
    emoji: "➕",
    grades: ["4", "5", "6"],
    description: "Add and subtract fractions",
    category: "advanced"
  },
  { 
    id: "fractions_multiply_divide", 
    name: "Multiplying/Dividing Fractions", 
    icon: X, 
    color: "from-rose-400 to-red-500", 
    emoji: "✖️",
    grades: ["5", "6", "7"],
    description: "Multiply and divide fractions",
    category: "advanced"
  },
  { 
    id: "mixed_numbers", 
    name: "Mixed Numbers", 
    icon: Percent, 
    color: "from-purple-400 to-indigo-500", 
    emoji: "🔢",
    grades: ["4", "5", "6"],
    description: "Work with mixed numbers",
    category: "advanced"
  },
  { 
    id: "decimals", 
    name: "Decimals", 
    icon: DollarSign,
    color: "from-teal-400 to-cyan-500", 
    emoji: "0.5",
    grades: ["4", "5", "6", "7"],
    description: "Understand decimals",
    category: "advanced"
  },
  { 
    id: "decimals_place_value", 
    name: "Decimal Place Value", 
    icon: Grid3x3,
    color: "from-cyan-400 to-blue-500", 
    emoji: "📐",
    grades: ["4", "5"],
    description: "Tenths, hundredths, thousandths",
    category: "advanced"
  },
  { 
    id: "decimals_compare", 
    name: "Comparing Decimals", 
    icon: TrendingUp,
    color: "from-blue-400 to-indigo-500", 
    emoji: "⚖️",
    grades: ["4", "5", "6"],
    description: "Compare and order decimals",
    category: "advanced"
  },
  { 
    id: "decimals_operations", 
    name: "Decimal Operations", 
    icon: Calculator,
    color: "from-teal-500 to-cyan-600", 
    emoji: "🧮",
    grades: ["5", "6", "7"],
    description: "Add, subtract, multiply, divide",
    category: "advanced"
  },
  { 
    id: "percentages", 
    name: "Percentages", 
    icon: Percent, 
    color: "from-indigo-400 to-purple-500", 
    emoji: "%",
    grades: ["5", "6", "7", "8"],
    description: "Calculate percentages",
    category: "advanced"
  },
  { 
    id: "percent_of_number", 
    name: "Percent of a Number", 
    icon: Percent, 
    color: "from-purple-400 to-pink-500", 
    emoji: "%",
    grades: ["6", "7", "8"],
    description: "Find percentage of numbers",
    category: "advanced"
  },
  { 
    id: "percent_increase_decrease", 
    name: "Percent Change", 
    icon: TrendingUp, 
    color: "from-pink-400 to-rose-500", 
    emoji: "📈",
    grades: ["6", "7", "8"],
    description: "Calculate percent increase/decrease",
    category: "advanced"
  },
  { 
    id: "ratios", 
    name: "Ratios & Proportions", 
    icon: TrendingUp, 
    color: "from-orange-400 to-red-500", 
    emoji: "⚖️",
    grades: ["6", "7", "8"],
    description: "Compare quantities",
    category: "advanced"
  },
  { 
    id: "integers", 
    name: "Integers", 
    icon: Binary, 
    color: "from-gray-400 to-slate-500", 
    emoji: "➖➕",
    grades: ["6", "7", "8"],
    description: "Positive & negative numbers",
    category: "advanced"
  },
  { 
    id: "absolute_value", 
    name: "Absolute Value", 
    icon: Binary, 
    color: "from-slate-400 to-gray-500", 
    emoji: "||",
    grades: ["6", "7", "8"],
    description: "Distance from zero",
    category: "advanced"
  },
  { 
    id: "exponents", 
    name: "Exponents", 
    icon: TrendingUp, 
    color: "from-purple-400 to-pink-500", 
    emoji: "²",
    grades: ["6", "7", "8"],
    description: "Powers and square roots",
    category: "advanced"
  },
  { 
    id: "scientific_notation", 
    name: "Scientific Notation", 
    icon: Zap, 
    color: "from-blue-400 to-indigo-500", 
    emoji: "🔬",
    grades: ["7", "8"],
    description: "Express very large/small numbers",
    category: "advanced"
  },

  // APPLIED MATH (2-8th) - 30 concepts
  { 
    id: "word_problems", 
    name: "Word Problems", 
    icon: BookOpen, 
    color: "from-amber-400 to-yellow-500", 
    emoji: "📖",
    grades: ["2", "3", "4", "5", "6"],
    description: "Solve real-world problems",
    category: "applied"
  },
  { 
    id: "word_problems_addition", 
    name: "Addition Word Problems", 
    icon: Plus, 
    color: "from-green-400 to-teal-500", 
    emoji: "📚",
    grades: ["1", "2", "3"],
    description: "Story problems with addition",
    category: "applied"
  },
  { 
    id: "word_problems_subtraction", 
    name: "Subtraction Word Problems", 
    icon: Minus, 
    color: "from-blue-400 to-cyan-500", 
    emoji: "📚",
    grades: ["1", "2", "3"],
    description: "Story problems with subtraction",
    category: "applied"
  },
  { 
    id: "word_problems_multiplication", 
    name: "Multiplication Word Problems", 
    icon: X, 
    color: "from-purple-400 to-pink-500", 
    emoji: "📚",
    grades: ["3", "4", "5"],
    description: "Story problems with multiplication",
    category: "applied"
  },
  { 
    id: "word_problems_multi_step", 
    name: "Multi-Step Word Problems", 
    icon: BookOpen, 
    color: "from-orange-400 to-red-500", 
    emoji: "📖",
    grades: ["4", "5", "6", "7"],
    description: "Complex story problems",
    category: "applied"
  },
  { 
    id: "money", 
    name: "Money Math", 
    icon: DollarSign, 
    color: "from-green-500 to-emerald-600", 
    emoji: "💰",
    grades: ["1", "2", "3", "4", "5"],
    description: "Count coins and bills",
    category: "applied"
  },
  { 
    id: "money_counting", 
    name: "Counting Money", 
    icon: DollarSign, 
    color: "from-emerald-400 to-green-500", 
    emoji: "💵",
    grades: ["1", "2", "3"],
    description: "Count and compare money",
    category: "applied"
  },
  { 
    id: "money_change", 
    name: "Making Change", 
    icon: DollarSign, 
    color: "from-green-500 to-teal-600", 
    emoji: "💸",
    grades: ["2", "3", "4"],
    description: "Calculate change from purchases",
    category: "applied"
  },
  { 
    id: "money_decimals", 
    name: "Money with Decimals", 
    icon: DollarSign, 
    color: "from-teal-400 to-cyan-500", 
    emoji: "💲",
    grades: ["3", "4", "5"],
    description: "Work with dollars and cents",
    category: "applied"
  },
  { 
    id: "time", 
    name: "Time", 
    icon: Clock, 
    color: "from-sky-400 to-blue-500", 
    emoji: "⏰",
    grades: ["1", "2", "3", "4"],
    description: "Read clocks and calendars",
    category: "applied"
  },
  { 
    id: "time_telling", 
    name: "Telling Time", 
    icon: Clock, 
    color: "from-blue-400 to-indigo-500", 
    emoji: "🕐",
    grades: ["1", "2", "3"],
    description: "Read analog and digital clocks",
    category: "applied"
  },
  { 
    id: "time_elapsed", 
    name: "Elapsed Time", 
    icon: Clock, 
    color: "from-indigo-400 to-purple-500", 
    emoji: "⏱️",
    grades: ["3", "4", "5"],
    description: "Calculate time intervals",
    category: "applied"
  },
  { 
    id: "time_calendar", 
    name: "Calendar Math", 
    icon: Calendar, 
    color: "from-purple-400 to-pink-500", 
    emoji: "📅",
    grades: ["2", "3", "4"],
    description: "Days, weeks, months, years",
    category: "applied"
  },
  { 
    id: "measurement", 
    name: "Measurement", 
    icon: TrendingUp, 
    color: "from-lime-400 to-green-500", 
    emoji: "📏",
    grades: ["2", "3", "4", "5", "6"],
    description: "Length, weight, volume",
    category: "applied"
  },
  { 
    id: "measurement_length", 
    name: "Measuring Length", 
    icon: TrendingUp, 
    color: "from-green-400 to-teal-500", 
    emoji: "📏",
    grades: ["2", "3", "4"],
    description: "Inches, feet, yards, miles",
    category: "applied"
  },
  { 
    id: "measurement_metric", 
    name: "Metric Measurement", 
    icon: TrendingUp, 
    color: "from-teal-400 to-cyan-500", 
    emoji: "📐",
    grades: ["3", "4", "5"],
    description: "Meters, liters, grams",
    category: "applied"
  },
  { 
    id: "measurement_conversions", 
    name: "Unit Conversions", 
    icon: TrendingUp, 
    color: "from-cyan-400 to-blue-500", 
    emoji: "🔄",
    grades: ["4", "5", "6"],
    description: "Convert between units",
    category: "applied"
  },
  { 
    id: "temperature", 
    name: "Temperature", 
    icon: TrendingUp, 
    color: "from-red-400 to-orange-500", 
    emoji: "🌡️",
    grades: ["3", "4", "5"],
    description: "Fahrenheit and Celsius",
    category: "applied"
  },
  { 
    id: "geometry", 
    name: "Geometry", 
    icon: Shapes, 
    color: "from-violet-400 to-purple-500", 
    emoji: "🔷",
    grades: ["3", "4", "5", "6", "7"],
    description: "Shapes and measurements",
    category: "applied"
  },
  { 
    id: "geometry_shapes", 
    name: "2D Shapes", 
    icon: Shapes, 
    color: "from-purple-400 to-indigo-500", 
    emoji: "🔺",
    grades: ["K", "1", "2", "3"],
    description: "Identify and classify shapes",
    category: "applied"
  },
  { 
    id: "geometry_3d", 
    name: "3D Shapes", 
    icon: Shapes, 
    color: "from-indigo-400 to-blue-500", 
    emoji: "🔷",
    grades: ["2", "3", "4", "5"],
    description: "Cubes, spheres, pyramids",
    category: "applied"
  },
  { 
    id: "area_perimeter", 
    name: "Area & Perimeter", 
    icon: Grid3x3, 
    color: "from-cyan-400 to-blue-500", 
    emoji: "📐",
    grades: ["3", "4", "5", "6"],
    description: "Calculate area & perimeter",
    category: "applied"
  },
  { 
    id: "volume", 
    name: "Volume", 
    icon: Shapes, 
    color: "from-blue-400 to-indigo-500", 
    emoji: "🧊",
    grades: ["5", "6", "7"],
    description: "Calculate volume of 3D shapes",
    category: "applied"
  },
  { 
    id: "surface_area", 
    name: "Surface Area", 
    icon: Shapes, 
    color: "from-indigo-400 to-purple-500", 
    emoji: "📦",
    grades: ["6", "7", "8"],
    description: "Calculate surface area",
    category: "applied"
  },
  { 
    id: "angles", 
    name: "Angles", 
    icon: Shapes, 
    color: "from-pink-400 to-rose-500", 
    emoji: "📐",
    grades: ["4", "5", "6", "7"],
    description: "Measure and identify angles",
    category: "applied"
  },
  { 
    id: "circles", 
    name: "Circles", 
    icon: Shapes, 
    color: "from-rose-400 to-pink-500", 
    emoji: "⭕",
    grades: ["5", "6", "7"],
    description: "Radius, diameter, circumference",
    category: "applied"
  },
  { 
    id: "pythagorean", 
    name: "Pythagorean Theorem", 
    icon: Shapes, 
    color: "from-purple-400 to-indigo-500", 
    emoji: "📐",
    grades: ["7", "8"],
    description: "Right triangle calculations",
    category: "applied"
  },
  { 
    id: "coordinates", 
    name: "Coordinate Plane", 
    icon: Grid3x3, 
    color: "from-blue-400 to-purple-500", 
    emoji: "📍",
    grades: ["5", "6", "7", "8"],
    description: "Plot points on graphs",
    category: "applied"
  },
  { 
    id: "data_graphs", 
    name: "Data & Graphs", 
    icon: BarChart3, 
    color: "from-green-400 to-teal-500", 
    emoji: "📊",
    grades: ["3", "4", "5", "6", "7"],
    description: "Read and create charts",
    category: "applied"
  },
  { 
    id: "probability", 
    name: "Probability", 
    icon: Target, 
    color: "from-red-400 to-orange-500", 
    emoji: "🎲",
    grades: ["5", "6", "7", "8"],
    description: "Predict outcomes and chances",
    category: "applied"
  },

  // ALGEBRA (5-8th) - 8 concepts
  { 
    id: "basic_algebra", 
    name: "Basic Algebra", 
    icon: Calculator, 
    color: "from-indigo-400 to-blue-500", 
    emoji: "🔤",
    grades: ["6", "7", "8"],
    description: "Solve for x, variables",
    category: "algebra"
  },
  { 
    id: "equations", 
    name: "Linear Equations", 
    icon: Calculator, 
    color: "from-purple-400 to-indigo-500", 
    emoji: "🟰",
    grades: ["6", "7", "8"],
    description: "Solve linear equations",
    category: "algebra"
  },
  { 
    id: "inequalities", 
    name: "Inequalities", 
    icon: TrendingUp, 
    color: "from-blue-400 to-cyan-500", 
    emoji: "≥",
    grades: ["6", "7", "8"],
    description: "Solve and graph inequalities",
    category: "algebra"
  },
  { 
    id: "expressions", 
    name: "Algebraic Expressions", 
    icon: Calculator, 
    color: "from-cyan-400 to-blue-500", 
    emoji: "🔢",
    grades: ["6", "7", "8"],
    description: "Simplify and evaluate expressions",
    category: "algebra"
  },
  { 
    id: "systems_equations", 
    name: "Systems of Equations", 
    icon: Grid3x3, 
    color: "from-purple-400 to-pink-500", 
    emoji: "🔢",
    grades: ["7", "8"],
    description: "Solve systems with two variables",
    category: "algebra"
  },
  { 
    id: "polynomials", 
    name: "Polynomials", 
    icon: Calculator, 
    color: "from-indigo-400 to-purple-500", 
    emoji: "🔤",
    grades: ["7", "8"],
    description: "Add, subtract, multiply polynomials",
    category: "algebra"
  },
  { 
    id: "factoring", 
    name: "Factoring", 
    icon: Grid3x3, 
    color: "from-purple-400 to-indigo-500", 
    emoji: "🔢",
    grades: ["7", "8"],
    description: "Factor polynomials",
    category: "algebra"
  },
  { 
    id: "quadratic", 
    name: "Quadratic Equations", 
    icon: Calculator, 
    color: "from-pink-400 to-purple-500", 
    emoji: "²",
    grades: ["8"],
    description: "Solve quadratic equations",
    category: "algebra"
  },

  // CHALLENGE MODE (3-8th) - 5 concepts
  { 
    id: "mixed", 
    name: "Mixed Practice", 
    icon: Brain, 
    color: "from-fuchsia-400 to-pink-500", 
    emoji: "🧩",
    grades: ["3", "4", "5", "6", "7", "8"],
    description: "Combine multiple skills",
    category: "challenge"
  },
  { 
    id: "mental_math", 
    name: "Mental Math", 
    icon: Brain, 
    color: "from-yellow-400 to-orange-500", 
    emoji: "🧠",
    grades: ["2", "3", "4", "5", "6"],
    description: "Fast calculations",
    category: "challenge"
  },
  { 
    id: "speed_challenge", 
    name: "Speed Challenge", 
    icon: Zap, 
    color: "from-red-400 to-orange-500", 
    emoji: "⚡",
    grades: ["3", "4", "5", "6", "7"],
    description: "Race against the clock",
    category: "challenge"
  },
  { 
    id: "logic_puzzles", 
    name: "Logic Puzzles", 
    icon: Brain, 
    color: "from-purple-400 to-indigo-500", 
    emoji: "🧩",
    grades: ["4", "5", "6", "7", "8"],
    description: "Mathematical reasoning",
    category: "challenge"
  },
  { 
    id: "competition_math", 
    name: "Competition Math", 
    icon: Trophy, 
    color: "from-yellow-400 to-orange-500", 
    emoji: "🏆",
    grades: ["5", "6", "7", "8"],
    description: "Advanced problem solving",
    category: "challenge"
  },
];

const levels = [
  { id: "easy", name: "Easy", color: "bg-green-500", description: "Perfect for beginners!", grades: ["K", "1", "2"] },
  { id: "medium", name: "Medium", color: "bg-yellow-500", description: "Getting challenging!", grades: ["3", "4", "5"] },
  { id: "hard", name: "Hard", color: "bg-red-500", description: "For math champions!", grades: ["5", "6", "7"] },
  { id: "expert", name: "Expert", color: "bg-purple-500", description: "Master level!", grades: ["7", "8"] },
];

const Label = ({ children, className = "" }) => (
  <label className={`text-sm font-medium ${className}`}>{children}</label>
);

export default function Home() {
  const queryClient = useQueryClient();
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user, loading: authLoading } = useUser();

  const { data: progress = [] } = useQuery({
    queryKey: ['gameProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await getUserGameProgress(user.email);
    },
    initialData: [],
    enabled: !!user?.email,
  });

  // Realtime subscription to keep progress in sync without manual refresh
  useEffect(() => {
    if (!user?.email) return;
    const unsub = subscribeUserGameProgress(user.email, (data) => {
      queryClient.setQueryData(['gameProgress', user.email], data);
    });
    return () => unsub();
  }, [user?.email, queryClient]);

  const { data: myTeamChallenges = [] } = useQuery({
    queryKey: ['myTeamChallenges', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const challenges = await getUserTeamChallenges(user.email);
      return challenges.filter(tc => !tc.is_completed);
    },
    initialData: [],
    enabled: !!user?.email,
  });

  const getTotalStars = () => {
    return progress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
  };

  const getStarsForConcept = (conceptId, levelId) => {
    const record = progress.find(p => p.operation === conceptId && p.level === levelId);
    return record?.stars_earned || 0;
  };

  const isLevelUnlocked = (levelId) => {
    if (levelId === "easy") return true;
    if (levelId === "medium") {
      return progress.some(p => p.level === "easy" && p.stars_earned >= 2);
    }
    if (levelId === "hard") {
      return progress.some(p => p.level === "medium" && p.stars_earned >= 2);
    }
    if (levelId === "expert") {
      return progress.some(p => p.level === "hard" && p.stars_earned >= 3);
    }
    return false;
  };

  // Unified premium access: includes paid subscription, active trial, and grace day
  const isPremium = user?.hasPremiumAccess || user?.entitlements?.premium || false;
  const subscriptionStatus = user?.subscription?.status;
  const subscriptionExpires = user?.subscription?.chargedThroughDate 
    ? new Date(user.subscription.chargedThroughDate) 
    : null;
  // Unify naming used later in the JSX (older code referenced isSubscribed/currentTier without defining them)
  const subscriptionTier = user?.subscription_tier || (isPremium ? 'premium_player' : 'free');
  const premiumActive = !!isPremium; // includes trial/grace via hasPremiumAccess
  const currentTier = subscriptionTier;
  const daysUntilRenewal = subscriptionExpires 
    ? Math.ceil((subscriptionExpires - new Date()) / (1000 * 60 * 60 * 24)) 
    : 0;

  // Free tier limitations: only basic concepts and Easy level
  const freeTierConcepts = [
    "addition", "subtraction", "multiplication", "division",
    "addition_single_digit", "subtraction_single_digit",
    "counting", "number_comparison"
  ];
  const freeTierLevels = ["easy"];

  // Check parental controls (or apply free tier limits)
  const parentalControls = user?.parental_controls || {};
  const allowedOperations = isPremium 
    ? (parentalControls.allowed_operations || mathConcepts.map(c => c.id))
    : freeTierConcepts;
  const allowedLevels = isPremium
    ? (parentalControls.allowed_levels || ["easy", "medium", "hard", "expert"])
    : freeTierLevels;
  const focusOperations = parentalControls.focus_operations || [];

  const isConceptAllowed = (conceptId) => allowedOperations.includes(conceptId);
  const isLevelAllowed = (levelId) => allowedLevels.includes(levelId);

  // Filter concepts
  const filteredConcepts = mathConcepts.filter(concept => {
    if (selectedGrade !== "all" && !concept.grades.includes(selectedGrade)) return false;
    if (selectedCategory !== "all" && concept.category !== selectedCategory) return false;
    return true;
  });

  const grades = ["K", "1", "2", "3", "4", "5", "6", "7", "8"];
  
  // Show auth gate if not logged in
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <Logo size="xl" variant="circle" className="mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-2xl">Math Adventure</h1>
            <p className="text-xl md:text-2xl text-white mb-2 drop-shadow-lg">Make Learning Math Fun & Engaging!</p>
            <p className="text-lg text-white/90 drop-shadow-lg">🎮 80+ Math Games • 🏆 Earn Rewards • 🤖 AI Tutor • 📊 Track Progress</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
            {/* Auth Form */}
            <div className="order-2 lg:order-1">
              <SimpleAuth />
              
              {/* Features List */}
              <Card className="mt-6 bg-white/95 backdrop-blur">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">✨ What You'll Get:</h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span><strong>80+ Math Concepts</strong> - Addition, subtraction, fractions, geometry & more!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span><strong>AI Math Tutor</strong> - Get instant help with step-by-step explanations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span><strong>Daily Challenges</strong> - New problems every day with bonus rewards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span><strong>Progress Tracking</strong> - See improvement with detailed analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span><strong>Earn Stars & Rewards</strong> - Unlock pets, avatars, and power-ups!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">👑</span>
                      <span><strong>Free Tier</strong> - Start with 8 basic concepts on Easy level</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* App Screenshots Preview */}
            <div className="order-1 lg:order-2 space-y-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
                <h3 className="text-white font-bold text-xl mb-4 text-center">📸 See It In Action</h3>
                
                {/* Screenshot 1 - Game Selection */}
                <div className="bg-white rounded-xl overflow-hidden shadow-2xl mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 text-white text-sm font-bold">
                    🎯 Choose Your Math Game
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                      <span className="text-3xl">➕</span>
                      <div className="flex-1">
                        <div className="font-bold text-sm">Addition</div>
                        <div className="text-xs text-gray-600">Learn to add numbers</div>
                      </div>
                      <div className="flex gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-yellow-400">⭐</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg opacity-60">
                      <span className="text-3xl">✖️</span>
                      <div className="flex-1">
                        <div className="font-bold text-sm">Multiplication</div>
                        <div className="text-xs text-gray-600">Times tables & more</div>
                      </div>
                      <span className="text-xs bg-yellow-100 px-2 py-1 rounded">👑 Premium</span>
                    </div>
                  </div>
                </div>

                {/* Screenshot 2 - Playing Game */}
                <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-white text-sm font-bold">
                    🧮 Solve Problems & Earn Stars
                  </div>
                  <div className="p-6 text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-3">5 + 3 = ?</div>
                    <div className="grid grid-cols-2 gap-2 max-w-[200px] mx-auto">
                      <button className="bg-purple-100 hover:bg-purple-200 p-3 rounded-lg font-bold text-purple-700">6</button>
                      <button className="bg-green-500 text-white p-3 rounded-lg font-bold">8</button>
                      <button className="bg-purple-100 hover:bg-purple-200 p-3 rounded-lg font-bold text-purple-700">7</button>
                      <button className="bg-purple-100 hover:bg-purple-200 p-3 rounded-lg font-bold text-purple-700">9</button>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">⏱️ 1:23 • ⭐ Score: 90%</div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔒</span>
                  <span>Safe & Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👨‍👩‍👧</span>
                  <span>Parent Controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📱</span>
                  <span>Works Everywhere</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-block mb-6 animate-bounce">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-5xl">🎯</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Welcome to Math Adventure!
        </h1>
        <p className="text-xl text-gray-600 mb-4">Choose your challenge and start learning!</p>
        
        {/* Total Stars */}
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          <span className="text-2xl font-bold text-gray-800">{getTotalStars()}</span>
          <span className="text-gray-600">Total Stars</span>
        </div>
      </div>

  {/* Subscription Status / Upgrade Widget */}
      {premiumActive ? (
        <Card className="mb-8 border-4 border-green-400 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      {currentTier === "premium_parent" ? "Premium Parent" : 
                       currentTier === "premium_player" ? "Premium Player" : 
                       "Family/Teacher"} Active
                    </h3>
                    <Badge className="bg-green-500 text-white">
                      Premium
                    </Badge>
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {subscriptionExpires && `Renews ${format(subscriptionExpires, 'MMM d, yyyy')} • ${daysUntilRenewal} days left`}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => window.location.assign(createPageUrl("Subscription"))}
                className="h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 border-4 border-yellow-400 shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Free Tier - Limited Access
                  </h3>
                  <p className="text-gray-700 font-medium">
                    📚 Only 8 basic math concepts • 🎯 Easy level only
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Upgrade to unlock 80+ concepts, all difficulty levels, and premium features!
                  </p>
                </div>
              </div>
              {/* Use unified UpgradeButton component which handles Play Billing vs fallback */}
              <div className="h-12">
                <UpgradeButton />
              </div>
            </div>
            <div className="mt-4">
              <AppTrialPromo compact />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parent-Set Focus Alert */}
      {focusOperations.length > 0 && (
        <Alert className="mb-8 bg-purple-50 border-purple-300">
          <AlertCircle className="w-4 h-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>Practice Recommendation:</strong> Your parent suggests focusing on{" "}
            {focusOperations.map((op, i) => (
              <span key={op}>
                <strong>{mathConcepts.find(c => c.id === op)?.name || op}</strong>
                {i < focusOperations.length - 1 && (i === focusOperations.length - 2 ? " and " : ", ")}
              </span>
            ))}
            . Try playing those games more!
          </AlertDescription>
        </Alert>
      )}

      {/* Daily Challenge Widget */}
      <div className="mb-12">
        <DailyChallengeWidget />
      </div>

      {/* Team Challenge Banner */}
      {myTeamChallenges.length > 0 && (
        <Card className="mb-12 border-4 border-green-300 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Users className="w-12 h-12 text-green-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Active Team Challenges!</h3>
                  <p className="text-gray-600">Work together with friends and family</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                  {myTeamChallenges.length} Active
                </Badge>
                <Link to={createPageUrl("TeamChallenges")}>
                  <Button className="h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                    <Users className="w-5 h-5 mr-2" />
                    View Team Challenges
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tournament Banner */}
      <Card className="mb-12 border-4 border-orange-300 shadow-xl bg-gradient-to-r from-orange-50 to-red-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Trophy className="w-12 h-12 text-orange-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Weekly Tournament Active!</h3>
                <p className="text-gray-600">Compete for 50 bonus stars and exclusive badges</p>
              </div>
            </div>
            <Link to={createPageUrl("Leaderboards")}>
              <Button className="h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Award className="w-5 h-5 mr-2" />
                View Leaderboards
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* AI Tutor Feature Banner */}
      <Card className="mb-8 border-4 border-blue-300 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-800">AI Math Tutor</h3>
                  <Badge className="bg-blue-500 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    New!
                  </Badge>
                </div>
                <p className="text-gray-600">Get instant help with step-by-step explanations when you need it!</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border-2 border-blue-200 text-center">
              <div className="text-2xl font-bold text-blue-600">✨</div>
              <div className="text-sm text-gray-600 mt-1">Adaptive Learning</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color by Numbers Feature Banner */}
      <Card className="mb-8 border-4 border-purple-300 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-800">Color by Numbers</h3>
                  <Badge className="bg-purple-500 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    New Game!
                  </Badge>
                </div>
                <p className="text-gray-600">Solve math problems while creating colorful artwork!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={createPageUrl("ColorByNumbers?operation=addition&level=easy")}>
                <Button className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Palette className="w-5 h-5 mr-2" />
                  Try It Now!
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade & Category Filters */}
      <Card className="mb-8 border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-gray-700" />
            Browse by Grade Level & Category ({filteredConcepts.length} Games)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-3 block font-bold text-gray-700">Grade Level</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedGrade === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGrade("all")}
                  className={selectedGrade === "all" ? "bg-purple-500 text-white hover:bg-purple-600" : ""}
                >
                  All Grades
                </Button>
                {grades.map(grade => (
                  <Button
                    key={grade}
                    variant={selectedGrade === grade ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedGrade(grade)}
                    className={selectedGrade === grade ? "bg-purple-500 text-white hover:bg-purple-600" : ""}
                  >
                    Grade {grade}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block font-bold text-gray-700">Category</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className={selectedCategory === "all" ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                >
                  All
                </Button>
                <Button
                  variant={selectedCategory === "basics" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("basics")}
                  className={selectedCategory === "basics" ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                >
                  Basics
                </Button>
                <Button
                  variant={selectedCategory === "core" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("core")}
                  className={selectedCategory === "core" ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                >
                  Core Operations
                </Button>
                <Button
                  variant={selectedCategory === "advanced" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("advanced")}
                  className={selectedCategory === "advanced" ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                >
                  Advanced
                </Button>
                <Button
                  variant={selectedCategory === "applied" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("applied")}
                  className={selectedCategory === "applied" ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                >
                  Applied
                </Button>
                <Button
                  variant={selectedCategory === "algebra" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("algebra")}
                  className={selectedCategory === "algebra" ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                >
                  Algebra
                </Button>
                <Button
                  variant={selectedCategory === "challenge" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("challenge")}
                  className={selectedCategory === "challenge" ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                >
                  Challenge
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Math Concepts Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Math Games ({filteredConcepts.length})
        </h2>
        
        {filteredConcepts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-gray-600">No games match your filters</p>
            <Button
              onClick={() => {
                setSelectedGrade("all");
                setSelectedCategory("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredConcepts.map((concept) => {
              const conceptAllowed = isConceptAllowed(concept.id);
              const isFocused = focusOperations.includes(concept.id);

              return (
                <Card 
                  key={concept.id} 
                  className={`overflow-hidden transition-all duration-300 border-2 ${
                    !conceptAllowed 
                      ? "opacity-50 cursor-not-allowed" 
                      : isFocused
                      ? "border-purple-400 ring-2 ring-purple-200 hover:shadow-xl"
                      : "hover:shadow-xl hover:border-purple-300"
                  }`}
                >
                  <div className={`h-32 bg-gradient-to-br ${concept.color} flex items-center justify-center relative`}>
                    <span className="text-6xl">{concept.emoji}</span>
                    {isFocused && (
                      <Badge className="absolute top-2 right-2 bg-purple-500 text-white">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        Focus
                      </Badge>
                    )}
                        {!conceptAllowed && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                        <Lock className="w-12 h-12 text-white" />
                            {!premiumActive && (
                          <Badge className="bg-yellow-500 text-white">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{concept.name}</span>
                        {!conceptAllowed && !premiumActive && (
                          <Badge variant="outline" className="bg-yellow-50 border-yellow-400 text-yellow-700 text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {!conceptAllowed && premiumActive && (
                          <Badge variant="outline" className="bg-red-50 border-red-300 text-red-700 text-xs">
                            Restricted
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 font-normal">{concept.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {concept.grades.map(g => (
                          <Badge key={g} variant="outline" className="text-xs">
                            Grade {g}
                          </Badge>
                        ))}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {levels.slice(0, 3).map((level) => {
                        const unlocked = isLevelUnlocked(level.id);
                        const levelAllowed = isLevelAllowed(level.id);
                        const canPlay = conceptAllowed && levelAllowed && unlocked;
                        const stars = getStarsForConcept(concept.id, level.id);
                        
                        return (
                          <Link
                            key={level.id}
                            to={canPlay ? createPageUrl(`Game?operation=${concept.id}&level=${level.id}`) : "#"}
                            className={`block ${!canPlay && "pointer-events-none"}`}
                          >
                            <Button
                              variant="outline"
                              className={`w-full justify-between text-sm ${!canPlay && "opacity-50"}`}
                              disabled={!canPlay}
                              size="sm"
                            >
                              <span className="flex items-center gap-2">
                                <Badge className={`${level.color} text-xs`}>{level.name}</Badge>
                                {!unlocked && <Lock className="w-3 h-3" />}
                                {!levelAllowed && conceptAllowed && !premiumActive && (
                                  <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-400 text-yellow-700">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                                {!levelAllowed && conceptAllowed && premiumActive && (
                                  <Badge variant="outline" className="text-xs">Restricted</Badge>
                                )}
                              </span>
                              <div className="flex gap-1">
                                {[1, 2, 3].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      stars >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            How to Play
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="text-4xl mb-2">1️⃣</div>
            <h3 className="font-bold mb-1">Choose Your Challenge</h3>
            <p className="text-sm text-gray-600">Pick from 30+ math games and difficulty level</p>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl mb-2">2️⃣</div>
            <h3 className="font-bold mb-1">Solve Problems</h3>
            <p className="text-sm text-gray-600">Answer 10 questions as fast as you can</p>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl mb-2">3️⃣</div>
            <h3 className="font-bold mb-1">Earn Stars</h3>
            <p className="text-sm text-gray-600">Get stars based on your performance!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
