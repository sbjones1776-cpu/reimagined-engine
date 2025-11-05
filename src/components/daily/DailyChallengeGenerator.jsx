// Daily Challenge Generator with varied objectives
import { generateQuestion } from "../game/QuestionGenerator";

export const generateDailyChallenge = (challengeDate, challengeType = "standard_mixed") => {
  const seed = new Date(challengeDate).getTime();
  
  // Seeded random function
  const seededRandom = (min, max, offset = 0) => {
    const x = Math.sin(seed + min + max + offset) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const challengeGenerators = {
    standard_mixed: generateStandardMixed,
    speed_round: generateSpeedRound,
    accuracy_focus: generateAccuracyFocus,
    concept_mastery: generateConceptMastery,
    word_problem_day: generateWordProblemDay,
    brain_teaser: generateBrainTeaser,
    grade_level_challenge: generateGradeLevelChallenge,
    streak_builder: generateStreakBuilder,
  };

  const generator = challengeGenerators[challengeType] || generateStandardMixed;
  return generator(seededRandom, seed);
};

function generateStandardMixed(seededRandom, seed) {
  const operations = ["addition", "subtraction", "multiplication", "division"];
  const questions = [];
  
  for (let i = 0; i < 15; i++) {
    const operation = operations[seededRandom(0, operations.length - 1, i)];
    const level = i < 5 ? "easy" : i < 10 ? "medium" : "hard";
    questions.push(generateQuestion(operation, level));
  }
  
  return {
    questions,
    objective: "Complete 15 mixed math problems across different difficulties",
    bonusTarget: { accuracy: 90, time: 180 },
    totalQuestions: 15,
    challengeType: "standard_mixed",
    concepts: operations,
    description: "Test your skills across all four operations with increasing difficulty!",
  };
}

function generateSpeedRound(seededRandom, seed) {
  const operations = ["addition", "multiplication"];
  const questions = [];
  
  for (let i = 0; i < 20; i++) {
    const operation = operations[seededRandom(0, 1, i)];
    questions.push(generateQuestion(operation, "easy"));
  }
  
  return {
    questions,
    objective: "Answer 20 quick-fire questions as fast as possible!",
    bonusTarget: { accuracy: 85, time: 120 },
    totalQuestions: 20,
    challengeType: "speed_round",
    concepts: operations,
    description: "Race against the clock! Can you finish in under 2 minutes?",
    timeLimit: 120,
  };
}

function generateAccuracyFocus(seededRandom, seed) {
  const operations = ["multiplication", "division", "fractions"];
  const questions = [];
  
  for (let i = 0; i < 12; i++) {
    const operation = operations[seededRandom(0, operations.length - 1, i)];
    const level = i < 4 ? "medium" : i < 8 ? "hard" : "expert";
    questions.push(generateQuestion(operation, level));
  }
  
  return {
    questions,
    objective: "Achieve perfect or near-perfect accuracy on challenging problems",
    bonusTarget: { accuracy: 95, time: 300 },
    totalQuestions: 12,
    challengeType: "accuracy_focus",
    concepts: operations,
    description: "Take your time and aim for perfection! Accuracy is key today.",
  };
}

function generateConceptMastery(seededRandom, seed) {
  // Pick one concept for the day
  const concepts = ["fractions", "decimals", "percentages", "word_problems", "geometry"];
  const todayConcept = concepts[seededRandom(0, concepts.length - 1, 0)];
  const questions = [];
  
  for (let i = 0; i < 15; i++) {
    const level = i < 5 ? "easy" : i < 10 ? "medium" : "hard";
    questions.push(generateQuestion(todayConcept, level));
  }
  
  return {
    questions,
    objective: `Master ${todayConcept} today!`,
    bonusTarget: { accuracy: 88, time: 240 },
    totalQuestions: 15,
    challengeType: "concept_mastery",
    concepts: [todayConcept],
    description: `Deep dive into ${todayConcept}! Build your expertise with focused practice.`,
    focusConcept: todayConcept,
  };
}

function generateWordProblemDay(seededRandom, seed) {
  const questions = [];
  
  for (let i = 0; i < 10; i++) {
    const level = i < 3 ? "easy" : i < 7 ? "medium" : "hard";
    questions.push(generateQuestion("word_problems", level));
  }
  
  return {
    questions,
    objective: "Solve real-world math problems",
    bonusTarget: { accuracy: 85, time: 300 },
    totalQuestions: 10,
    challengeType: "word_problem_day",
    concepts: ["word_problems"],
    description: "Apply math to real life! Read carefully and solve each scenario.",
  };
}

function generateBrainTeaser(seededRandom, seed) {
  const questions = [];
  
  // Mix of challenging concepts
  const concepts = ["fractions", "decimals", "percentages", "geometry", "mixed"];
  
  for (let i = 0; i < 12; i++) {
    const concept = concepts[seededRandom(0, concepts.length - 1, i)];
    questions.push(generateQuestion(concept, "hard"));
  }
  
  return {
    questions,
    objective: "Crack today's brain teasers!",
    bonusTarget: { accuracy: 80, time: 360 },
    totalQuestions: 12,
    challengeType: "brain_teaser",
    concepts: concepts,
    description: "Think outside the box! These tricky problems will challenge your mind.",
  };
}

function generateGradeLevelChallenge(seededRandom, seed) {
  // Rotate through grades
  const grades = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const todayGrade = grades[seededRandom(0, grades.length - 1, 0)];
  
  // Grade-appropriate operations
  const gradeOperations = {
    "1": ["addition", "subtraction"],
    "2": ["addition", "subtraction", "time", "money"],
    "3": ["multiplication", "division", "fractions"],
    "4": ["multiplication", "division", "fractions", "decimals"],
    "5": ["decimals", "fractions", "percentages"],
    "6": ["percentages", "fractions", "decimals", "geometry"],
    "7": ["percentages", "geometry", "mixed"],
    "8": ["mixed", "geometry", "percentages"],
  };
  
  const operations = gradeOperations[todayGrade] || ["addition", "subtraction"];
  const questions = [];
  
  for (let i = 0; i < 15; i++) {
    const operation = operations[seededRandom(0, operations.length - 1, i)];
    const level = i < 5 ? "easy" : i < 10 ? "medium" : "hard";
    questions.push(generateQuestion(operation, level));
  }
  
  return {
    questions,
    objective: `Complete Grade ${todayGrade} Challenge`,
    bonusTarget: { accuracy: 87, time: 240 },
    totalQuestions: 15,
    challengeType: "grade_level_challenge",
    concepts: operations,
    description: `Master Grade ${todayGrade} math skills! Perfect for students at this level.`,
    gradeLevel: todayGrade,
  };
}

function generateStreakBuilder(seededRandom, seed) {
  // Easier problems to encourage streaks
  const operations = ["addition", "subtraction", "multiplication"];
  const questions = [];
  
  for (let i = 0; i < 18; i++) {
    const operation = operations[seededRandom(0, operations.length - 1, i)];
    const level = i < 6 ? "easy" : i < 12 ? "easy" : "medium";
    questions.push(generateQuestion(operation, level));
  }
  
  return {
    questions,
    objective: "Build your daily streak! Complete for bonus rewards.",
    bonusTarget: { accuracy: 85, time: 200 },
    totalQuestions: 18,
    challengeType: "streak_builder",
    concepts: operations,
    description: "Keep your streak alive! Designed to be completable for all skill levels.",
    streakFocus: true,
  };
}

// Helper to determine rewards based on performance
export const calculateDailyChallengeRewards = (challengeData, accuracy, timeTaken, hasStreak) => {
  const { bonusTarget, challengeType } = challengeData;
  
  let bonusStars = 0;
  let bonusCoins = 0;
  let perfectScoreBonus = false;
  let speedBonus = false;
  
  // Base rewards for accuracy
  if (accuracy >= 95) {
    bonusStars = 3;
    perfectScoreBonus = true;
  } else if (accuracy >= 85) {
    bonusStars = 2;
  } else if (accuracy >= 70) {
    bonusStars = 1;
  }
  
  // Speed bonuses
  if (bonusTarget && timeTaken <= bonusTarget.time) {
    bonusStars += 1;
    bonusCoins += 20;
    speedBonus = true;
  }
  
  // Streak bonuses
  if (hasStreak && hasStreak >= 3) {
    bonusStars += 1;
    bonusCoins += 10 * Math.min(hasStreak, 10); // Max 100 coins for 10+ day streak
  }
  
  // Challenge-specific bonuses
  if (challengeType === "speed_round" && speedBonus) {
    bonusCoins += 30; // Extra reward for speed challenges
  }
  
  if (challengeType === "accuracy_focus" && perfectScoreBonus) {
    bonusCoins += 40; // Extra reward for perfect accuracy
  }
  
  if (challengeType === "brain_teaser" && accuracy >= 80) {
    bonusStars += 1; // Extra star for brain teasers
    bonusCoins += 25;
  }
  
  return {
    bonusStars: Math.min(bonusStars, 5), // Cap at 5 stars
    bonusCoins,
    perfectScoreBonus,
    speedBonus,
  };
};