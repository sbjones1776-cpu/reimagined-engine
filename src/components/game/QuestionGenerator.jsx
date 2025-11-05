// Question Generator for all math concepts
// Comprehensive K-8 Math Curriculum

export const generateQuestion = (operation, level) => {
  const generators = {
    // Basics (K-4)
    counting: generateCounting,
    number_comparison: generateNumberComparison,
    place_value: generatePlaceValue,
    patterns: generatePatterns,
    rounding: generateRounding,
    
    // Core Operations
    addition: generateAddition,
    subtraction: generateSubtraction,
    multiplication: generateMultiplication,
    division: generateDivision,
    
    // Advanced (4-8)
    factors_multiples: generateFactorsMultiples,
    prime_composite: generatePrimeComposite,
    fractions: generateFractions,
    decimals: generateDecimals,
    percentages: generatePercentages,
    ratios: generateRatios,
    order_operations: generateOrderOperations,
    integers: generateIntegers,
    exponents: generateExponents,
    
    // Applied Math
    word_problems: generateWordProblem,
    money: generateMoney,
    time: generateTime,
    measurement: generateMeasurement,
    geometry: generateGeometry,
    area_perimeter: generateAreaPerimeter,
    angles: generateAngles,
    coordinates: generateCoordinates,
    data_graphs: generateDataGraphs,
    probability: generateProbability,
    
    // Algebra
    basic_algebra: generateBasicAlgebra,
    equations: generateEquations,
    
    // Challenge
    mixed: generateMixed,
    mental_math: generateMentalMath,
  };

  const generator = generators[operation] || generateAddition;
  return generator(level);
};

// BASICS (K-4)

function generateCounting(level) {
  const ranges = {
    easy: { min: 1, max: 10 },
    medium: { min: 10, max: 50 },
    hard: { min: 50, max: 100 },
  };
  
  const range = ranges[level] || ranges.easy;
  const start = Math.floor(Math.random() * (range.max - 5)) + range.min;
  const answer = start + Math.floor(Math.random() * 5) + 1;
  
  return {
    question: `Count: ${start}, ${start + 1}, ?, ${start + 3}`,
    answer,
    options: generateOptions(answer),
    explanation: `The pattern increases by 1 each time. After ${start + 1} comes ${answer}.`,
  };
}

function generateNumberComparison(level) {
  const ranges = {
    easy: { min: 1, max: 20 },
    medium: { min: 10, max: 100 },
    hard: { min: 100, max: 1000 },
  };
  
  const range = ranges[level] || ranges.easy;
  const num1 = Math.floor(Math.random() * (range.max - range.min)) + range.min;
  const num2 = Math.floor(Math.random() * (range.max - range.min)) + range.min;
  
  const symbols = ['>', '<', '='];
  const correctSymbol = num1 > num2 ? '>' : num1 < num2 ? '<' : '=';
  
  // Return numeric answer for option selection
  const answer = symbols.indexOf(correctSymbol);
  
  return {
    question: `${num1} ___ ${num2}. Which symbol?`,
    answer,
    options: [0, 1, 2],
    optionsDisplay: ['>', '<', '='],
    explanation: `${num1} ${correctSymbol} ${num2}. ${num1} is ${num1 > num2 ? 'greater than' : num1 < num2 ? 'less than' : 'equal to'} ${num2}.`,
  };
}

function generatePlaceValue(level) {
  const problems = {
    easy: [
      { q: "What is the tens digit in 47?", a: 4, opts: [4, 7, 47, 0], exp: "In 47, the 4 is in the tens place and the 7 is in the ones place." },
      { q: "What is the ones digit in 53?", a: 3, opts: [5, 3, 53, 0], exp: "In 53, the 3 is in the ones place." },
      { q: "What number has 3 tens and 5 ones?", a: 35, opts: [53, 35, 305, 8], exp: "3 tens = 30, plus 5 ones = 35." },
    ],
    medium: [
      { q: "What is the hundreds digit in 527?", a: 5, opts: [5, 2, 7, 527], exp: "In 527: 5 is hundreds, 2 is tens, 7 is ones." },
      { q: "What is 400 + 50 + 3?", a: 453, opts: [345, 453, 534, 4053], exp: "Add the place values: 400 + 50 + 3 = 453." },
      { q: "Which digit is in the tens place in 684?", a: 8, opts: [6, 8, 4, 68], exp: "In 684: 6 is hundreds, 8 is tens, 4 is ones." },
    ],
    hard: [
      { q: "What is 3000 + 200 + 40 + 5?", a: 3245, opts: [3245, 32405, 3254, 2345], exp: "Adding place values: 3000 + 200 + 40 + 5 = 3245." },
      { q: "What is the thousands digit in 7,842?", a: 7, opts: [7, 8, 4, 2], exp: "In 7,842: 7 is thousands place." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generatePatterns(level) {
  const patterns = {
    easy: [
      { q: "2, 4, 6, 8, ?", a: 10, opts: [9, 10, 11, 12], exp: "Pattern: +2 each time. 8 + 2 = 10." },
      { q: "5, 10, 15, 20, ?", a: 25, opts: [22, 24, 25, 30], exp: "Pattern: +5 each time. 20 + 5 = 25." },
      { q: "10, 9, 8, 7, ?", a: 6, opts: [6, 5, 9, 8], exp: "Pattern: -1 each time. 7 - 1 = 6." },
    ],
    medium: [
      { q: "3, 6, 9, 12, ?", a: 15, opts: [13, 14, 15, 16], exp: "Pattern: +3 each time (multiples of 3). 12 + 3 = 15." },
      { q: "1, 4, 7, 10, ?", a: 13, opts: [11, 12, 13, 14], exp: "Pattern: +3 each time. 10 + 3 = 13." },
      { q: "50, 45, 40, 35, ?", a: 30, opts: [30, 32, 25, 28], exp: "Pattern: -5 each time. 35 - 5 = 30." },
    ],
    hard: [
      { q: "2, 4, 8, 16, ?", a: 32, opts: [20, 24, 32, 28], exp: "Pattern: ×2 each time (doubling). 16 × 2 = 32." },
      { q: "100, 50, 25, ?", a: 12.5, opts: [12.5, 12, 15, 10], exp: "Pattern: ÷2 each time (halving). 25 ÷ 2 = 12.5." },
    ],
  };
  
  const levelPatterns = patterns[level] || patterns.easy;
  const problem = levelPatterns[Math.floor(Math.random() * levelPatterns.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generateRounding(level) {
  const problems = {
    easy: [
      { q: "Round 14 to the nearest 10", a: 10, opts: [10, 15, 20, 14], exp: "14 is closer to 10 than 20, so round down to 10." },
      { q: "Round 27 to the nearest 10", a: 30, opts: [20, 25, 27, 30], exp: "27 is closer to 30 than 20, so round up to 30." },
      { q: "Round 45 to the nearest 10", a: 50, opts: [40, 45, 50, 55], exp: "45 is exactly halfway, so round up to 50." },
    ],
    medium: [
      { q: "Round 247 to the nearest 100", a: 200, opts: [200, 250, 300, 240], exp: "247 is closer to 200 than 300." },
      { q: "Round 682 to the nearest 100", a: 700, opts: [600, 680, 700, 800], exp: "682 is closer to 700 than 600." },
    ],
    hard: [
      { q: "Round 4,567 to the nearest 1,000", a: 5000, opts: [4000, 4500, 5000, 6000], exp: "4,567 is closer to 5,000 than 4,000." },
      { q: "Round 12,345 to the nearest 10,000", a: 10000, opts: [10000, 12000, 13000, 20000], exp: "12,345 is closer to 10,000 than 20,000." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

// CORE OPERATIONS (keeping existing implementations)

function generateAddition(level) {
  const ranges = {
    easy: { min: 1, max: 10 },
    medium: { min: 10, max: 50 },
    hard: { min: 50, max: 200 },
    expert: { min: 100, max: 1000 },
  };
  
  const range = ranges[level] || ranges.easy;
  const num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const answer = num1 + num2;
  
  return {
    question: `${num1} + ${num2}`,
    answer,
    options: generateOptions(answer),
    explanation: `To add ${num1} + ${num2}, combine the two numbers. The answer is ${answer}.`,
  };
}

function generateSubtraction(level) {
  const ranges = {
    easy: { min: 5, max: 20 },
    medium: { min: 20, max: 100 },
    hard: { min: 100, max: 500 },
    expert: { min: 500, max: 2000 },
  };
  
  const range = ranges[level] || ranges.easy;
  const num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const num2 = Math.floor(Math.random() * num1) + 1;
  const answer = num1 - num2;
  
  return {
    question: `${num1} - ${num2}`,
    answer,
    options: generateOptions(answer),
    explanation: `To subtract ${num2} from ${num1}, the answer is ${answer}.`,
  };
}

function generateMultiplication(level) {
  const ranges = {
    easy: { min: 1, max: 10 },
    medium: { min: 2, max: 12 },
    hard: { min: 6, max: 20 },
    expert: { min: 11, max: 50 },
  };
  
  const range = ranges[level] || ranges.easy;
  const num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const answer = num1 * num2;
  
  return {
    question: `${num1} × ${num2}`,
    answer,
    options: generateOptions(answer),
    explanation: `${num1} times ${num2} equals ${answer}.`,
  };
}

function generateDivision(level) {
  const ranges = {
    easy: { divisor: [2, 3, 4, 5], quotient: [1, 10] },
    medium: { divisor: [2, 12], quotient: [1, 20] },
    hard: { divisor: [5, 25], quotient: [2, 50] },
    expert: { divisor: [10, 50], quotient: [5, 100] },
  };
  
  const range = ranges[level] || ranges.easy;
  const divisor = Math.floor(Math.random() * (range.divisor[1] - range.divisor[0] + 1)) + range.divisor[0];
  const quotient = Math.floor(Math.random() * (range.quotient[1] - range.quotient[0] + 1)) + range.quotient[0];
  const dividend = divisor * quotient;
  
  return {
    question: `${dividend} ÷ ${divisor}`,
    answer: quotient,
    options: generateOptions(quotient),
    explanation: `${dividend} divided by ${divisor} equals ${quotient}.`,
  };
}

// ADVANCED CONCEPTS

function generateFactorsMultiples(level) {
  const problems = {
    easy: [
      { q: "What are the factors of 12?", a: 6, opts: [4, 5, 6, 7], exp: "12 has 6 factors: 1, 2, 3, 4, 6, 12." },
      { q: "What is a multiple of 5?", a: 25, opts: [22, 24, 25, 27], exp: "25 = 5 × 5, so 25 is a multiple of 5." },
      { q: "Is 15 a multiple of 3?", a: 1, opts: [0, 1], optionsDisplay: ["No", "Yes"], exp: "Yes! 15 = 3 × 5." },
    ],
    medium: [
      { q: "What is the GCF of 12 and 18?", a: 6, opts: [3, 4, 6, 9], exp: "Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. Greatest common is 6." },
      { q: "What is the LCM of 4 and 6?", a: 12, opts: [10, 12, 18, 24], exp: "Multiples of 4: 4,8,12... Multiples of 6: 6,12... Least common is 12." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    optionsDisplay: problem.optionsDisplay,
    explanation: problem.exp,
  };
}

function generatePrimeComposite(level) {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21];
  
  const isPrimeQuestion = Math.random() > 0.5;
  
  if (isPrimeQuestion) {
    const num = primes[Math.floor(Math.random() * primes.length)];
    return {
      question: `Is ${num} a prime number?`,
      answer: 1,
      options: [0, 1],
      optionsDisplay: ["No", "Yes"],
      explanation: `Yes! ${num} is prime. It can only be divided by 1 and ${num}.`,
    };
  } else {
    const num = composites[Math.floor(Math.random() * composites.length)];
    return {
      question: `Is ${num} a prime number?`,
      answer: 0,
      options: [0, 1],
      optionsDisplay: ["No", "Yes"],
      explanation: `No! ${num} is composite. It has factors other than 1 and itself.`,
    };
  }
}

function generateRatios(level) {
  const problems = {
    easy: [
      { q: "Simplify the ratio 4:8", a: 0.5, opts: [0.5, 1, 2, 4], display: "1:2", exp: "Divide both by 4: 4÷4 = 1, 8÷4 = 2. Answer: 1:2" },
      { q: "If 2 apples cost $4, what do 4 apples cost?", a: 8, opts: [6, 7, 8, 10], exp: "2 apples = $4, so 4 apples = $4 × 2 = $8." },
    ],
    medium: [
      { q: "In a class of 30, the ratio of boys to girls is 2:3. How many girls?", a: 18, opts: [12, 15, 18, 20], exp: "2+3=5 parts. 30÷5=6 per part. Girls = 3×6 = 18." },
      { q: "Simplify 12:18", a: 2, opts: [1, 2, 3, 4], display: "2:3", exp: "Divide both by 6: 12÷6 = 2, 18÷6 = 3." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generateOrderOperations(level) {
  const problems = {
    easy: [
      { q: "3 + 2 × 4 = ?", a: 11, opts: [9, 10, 11, 20], exp: "Order: Multiply first (2×4=8), then add (3+8=11)." },
      { q: "10 - 2 × 3 = ?", a: 4, opts: [4, 6, 24, 8], exp: "Order: Multiply first (2×3=6), then subtract (10-6=4)." },
    ],
    medium: [
      { q: "(3 + 2) × 4 = ?", a: 20, opts: [11, 14, 20, 24], exp: "Parentheses first: (3+2=5), then multiply (5×4=20)." },
      { q: "12 ÷ 3 + 2 = ?", a: 6, opts: [2, 4, 6, 8], exp: "Division first: 12÷3=4, then add: 4+2=6." },
    ],
    hard: [
      { q: "2 + 3 × (4 + 5) = ?", a: 29, opts: [20, 27, 29, 45], exp: "Parentheses: (4+5=9). Multiply: 3×9=27. Add: 2+27=29." },
      { q: "20 - 12 ÷ 3 + 2 = ?", a: 18, opts: [10, 14, 18, 22], exp: "Divide: 12÷3=4. Then left to right: 20-4+2 = 18." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generateIntegers(level) {
  const ranges = {
    easy: { min: -10, max: 10 },
    medium: { min: -50, max: 50 },
    hard: { min: -100, max: 100 },
  };
  
  const range = ranges[level] || ranges.easy;
  const num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const answer = num1 + num2;
  
  return {
    question: `${num1} + (${num2})`,
    answer,
    options: generateOptions(answer),
    explanation: `Adding integers: ${num1} + ${num2} = ${answer}.`,
  };
}

function generateExponents(level) {
  const problems = {
    easy: [
      { q: "What is 2²?", a: 4, opts: [2, 3, 4, 8], exp: "2² means 2 × 2 = 4." },
      { q: "What is 3²?", a: 9, opts: [6, 8, 9, 12], exp: "3² means 3 × 3 = 9." },
      { q: "What is 5²?", a: 25, opts: [10, 20, 25, 30], exp: "5² means 5 × 5 = 25." },
    ],
    medium: [
      { q: "What is 2³?", a: 8, opts: [6, 7, 8, 9], exp: "2³ means 2 × 2 × 2 = 8." },
      { q: "What is 4²?", a: 16, opts: [8, 12, 14, 16], exp: "4² means 4 × 4 = 16." },
      { q: "What is √25?", a: 5, opts: [4, 5, 6, 7], exp: "√25 = 5 because 5 × 5 = 25." },
    ],
    hard: [
      { q: "What is 3³?", a: 27, opts: [9, 18, 27, 36], exp: "3³ means 3 × 3 × 3 = 27." },
      { q: "What is √64?", a: 8, opts: [6, 7, 8, 9], exp: "√64 = 8 because 8 × 8 = 64." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

// Keep existing implementations for: fractions, decimals, percentages, word_problems, money, time, geometry

function generateFractions(level) {
  const problems = {
    easy: [
      { q: "What is 1/2 + 1/2?", a: 1, opts: [0, 1, 2, 3], exp: "1/2 + 1/2 = 2/2 = 1 whole." },
      { q: "What is 1/4 + 1/4?", a: 0.5, opts: [0.25, 0.5, 0.75, 1], exp: "1/4 + 1/4 = 2/4 = 1/2." },
    ],
    medium: [
      { q: "What is 1/2 + 1/4?", a: 0.75, opts: [0.5, 0.67, 0.75, 1], exp: "1/2 = 2/4. Then 2/4 + 1/4 = 3/4." },
      { q: "What is 2/3 + 1/6?", a: 0.83, opts: [0.67, 0.75, 0.83, 1], exp: "2/3 = 4/6. Then 4/6 + 1/6 = 5/6." },
    ],
    hard: [
      { q: "What is 2/3 + 3/4?", a: 1.42, opts: [1.25, 1.33, 1.42, 1.5], exp: "Common denominator 12: 8/12 + 9/12 = 17/12 = 1 5/12." },
      { q: "What is 3/4 × 2?", a: 1.5, opts: [1, 1.5, 2, 2.5], exp: "(3 × 2)/4 = 6/4 = 1 1/2." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generateDecimals(level) {
  const ranges = {
    easy: { min: 0.1, max: 9.9, decimals: 1 },
    medium: { min: 0.01, max: 99.9, decimals: 2 },
    hard: { min: 0.01, max: 999.9, decimals: 2 },
  };
  
  const range = ranges[level] || ranges.easy;
  const num1 = parseFloat((Math.random() * (range.max - range.min) + range.min).toFixed(range.decimals));
  const num2 = parseFloat((Math.random() * (range.max - range.min) + range.min).toFixed(range.decimals));
  const operation = Math.random() > 0.5 ? "+" : "-";
  const answer = operation === "+" 
    ? parseFloat((num1 + num2).toFixed(range.decimals))
    : parseFloat((Math.max(num1, num2) - Math.min(num1, num2)).toFixed(range.decimals));
  
  return {
    question: operation === "+" ? `${num1} + ${num2}` : `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`,
    answer,
    options: generateOptions(answer, range.decimals),
    explanation: `Line up decimal points and calculate.`,
  };
}

function generatePercentages(level) {
  const problems = {
    easy: [
      { q: "What is 50% of 100?", a: 50, opts: [25, 50, 75, 100], exp: "50% = half. 100 ÷ 2 = 50." },
      { q: "What is 25% of 100?", a: 25, opts: [20, 25, 30, 50], exp: "25% = 1/4. 100 ÷ 4 = 25." },
    ],
    medium: [
      { q: "What is 20% of 80?", a: 16, opts: [12, 16, 20, 24], exp: "20% = 0.20. 80 × 0.20 = 16." },
      { q: "What is 30% of 200?", a: 60, opts: [50, 60, 70, 80], exp: "30% = 0.30. 200 × 0.30 = 60." },
    ],
    hard: [
      { q: "What is 15% of 250?", a: 37.5, opts: [35, 37.5, 40, 42.5], exp: "15% = 0.15. 250 × 0.15 = 37.5." },
      { q: "What is 65% of 180?", a: 117, opts: [110, 117, 125, 130], exp: "65% = 0.65. 180 × 0.65 = 117." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generateWordProblem(level) {
  const templates = {
    easy: [
      { template: "Sarah has {n1} apples. She buys {n2} more. How many now?", operation: "add", range: [1, 10] },
      { template: "Tom has {n1} cookies. He eats {n2}. How many left?", operation: "subtract", range: [5, 15] },
    ],
    medium: [
      { template: "A box has {n1} items. Each costs ${n2}. Total cost?", operation: "multiply", range: [5, 12] },
      { template: "{n1} students, groups of {n2}. How many groups?", operation: "divide", range: [4, 12] },
    ],
  };
  
  const levelTemplates = templates[level] || templates.easy;
  const template = levelTemplates[Math.floor(Math.random() * levelTemplates.length)];
  
  const n1 = Math.floor(Math.random() * template.range[1]) + template.range[0];
  const n2 = Math.floor(Math.random() * template.range[1]) + template.range[0];
  
  let answer;
  let question = template.template.replace("{n1}", n1).replace("{n2}", n2);
  
  if (template.operation === "add") answer = n1 + n2;
  else if (template.operation === "subtract") answer = n1 - n2;
  else if (template.operation === "multiply") answer = n1 * n2;
  else answer = Math.floor(n1 / n2);
  
  return {
    question,
    answer,
    options: generateOptions(answer),
    explanation: `Solve step by step to find the answer.`,
  };
}

function generateMoney(level) {
  const problems = {
    easy: [
      { q: "How many cents in $1?", a: 100, opts: [50, 75, 100, 125], exp: "$1 = 100 cents." },
      { q: "2 quarters = ? cents", a: 50, opts: [25, 50, 75, 100], exp: "Each quarter = 25¢. 2 × 25 = 50¢." },
    ],
    medium: [
      { q: "Buy toy for $12.50, pay $20. Change?", a: 7.5, opts: [6.5, 7.5, 8.5, 9.5], exp: "$20.00 - $12.50 = $7.50." },
      { q: "Save $15/week. 4 weeks = ?", a: 60, opts: [50, 60, 70, 80], exp: "$15 × 4 = $60." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generateTime(level) {
  const problems = {
    easy: [
      { q: "How many minutes in 1 hour?", a: 60, opts: [30, 60, 90, 120], exp: "1 hour = 60 minutes." },
      { q: "30 minutes after 2:00 = ?", a: 2.5, opts: [2, 2.5, 3, 3.5], display: "2:30", exp: "2:00 + 30 min = 2:30." },
    ],
    medium: [
      { q: "If it's 3:45, what time in 25 min?", a: 4.17, opts: [4, 4.17, 4.5, 5], display: "4:10", exp: "3:45 + 25 min = 4:10." },
      { q: "How many seconds in 5 minutes?", a: 300, opts: [250, 300, 350, 400], exp: "60 × 5 = 300 seconds." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generateMeasurement(level) {
  const problems = {
    easy: [
      { q: "How many inches in 1 foot?", a: 12, opts: [10, 12, 16, 20], exp: "1 foot = 12 inches." },
      { q: "1000 grams = ? kilograms", a: 1, opts: [0.1, 1, 10, 100], exp: "1000g = 1kg." },
    ],
    medium: [
      { q: "How many cm in 2 meters?", a: 200, opts: [20, 100, 200, 2000], exp: "1m = 100cm. 2m = 200cm." },
      { q: "1 liter = ? milliliters", a: 1000, opts: [10, 100, 1000, 10000], exp: "1L = 1000mL." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generateGeometry(level) {
  const problems = {
    easy: [
      { q: "How many sides in a triangle?", a: 3, opts: [2, 3, 4, 5], exp: "Triangle has 3 sides." },
      { q: "How many corners in a square?", a: 4, opts: [3, 4, 5, 6], exp: "Square has 4 corners." },
    ],
    medium: [
      { q: "Area of rectangle 6×4?", a: 24, opts: [20, 24, 28, 32], exp: "Area = length × width = 6 × 4 = 24." },
      { q: "Circle radius 5, diameter?", a: 10, opts: [8, 10, 12, 15], exp: "Diameter = 2 × radius = 2 × 5 = 10." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

// NEW APPLIED MATH FUNCTIONS

function generateAreaPerimeter(level) {
  const problems = {
    easy: [
      { q: "Perimeter of square, side 5?", a: 20, opts: [15, 20, 25, 30], exp: "Perimeter = 4 × 5 = 20." },
      { q: "Area of square, side 4?", a: 16, opts: [8, 12, 16, 20], exp: "Area = 4 × 4 = 16." },
    ],
    medium: [
      { q: "Perimeter of rectangle 8×5?", a: 26, opts: [24, 26, 28, 30], exp: "Perimeter = 2(8+5) = 26." },
      { q: "Area of triangle, base 10, height 6?", a: 30, opts: [25, 30, 35, 40], exp: "Area = (10×6)÷2 = 30." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generateAngles(level) {
  const problems = {
    easy: [
      { q: "How many degrees in a right angle?", a: 90, opts: [45, 90, 180, 360], exp: "Right angle = 90°." },
      { q: "How many degrees in a straight line?", a: 180, opts: [90, 180, 270, 360], exp: "Straight line = 180°." },
    ],
    medium: [
      { q: "If one angle is 60°, complementary angle?", a: 30, opts: [30, 60, 90, 120], exp: "Complementary angles sum to 90°. 90 - 60 = 30." },
      { q: "If one angle is 120°, supplementary angle?", a: 60, opts: [30, 60, 90, 120], exp: "Supplementary angles sum to 180°. 180 - 120 = 60." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generateCoordinates(level) {
  const x = Math.floor(Math.random() * 10) - 5;
  const y = Math.floor(Math.random() * 10) - 5;
  
  const questions = [
    { q: `Point (${x}, ${y}): What is the x-coordinate?`, a: x, exp: `In (${x}, ${y}), x = ${x}.` },
    { q: `Point (${x}, ${y}): What is the y-coordinate?`, a: y, exp: `In (${x}, ${y}), y = ${y}.` },
  ];
  
  const problem = questions[Math.floor(Math.random() * questions.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: generateOptions(problem.a),
    explanation: problem.exp,
  };
}

function generateDataGraphs(level) {
  const problems = {
    easy: [
      { q: "Bar chart: A=5, B=3, C=7. Which is tallest?", a: 2, opts: [0, 1, 2], optionsDisplay: ["A", "B", "C"], exp: "C has value 7, which is highest." },
      { q: "Line plot: Mon=10, Tue=15, Wed=12. Which day had most?", a: 1, opts: [0, 1, 2], optionsDisplay: ["Mon", "Tue", "Wed"], exp: "Tuesday had 15, the highest value." },
    ],
    medium: [
      { q: "Pie chart: 50% red, 30% blue, 20% green. Largest?", a: 0, opts: [0, 1, 2], optionsDisplay: ["Red", "Blue", "Green"], exp: "Red at 50% is largest." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    optionsDisplay: problem.optionsDisplay,
    explanation: problem.exp,
  };
}

function generateProbability(level) {
  const problems = {
    easy: [
      { q: "Flip a coin. Probability of heads?", a: 0.5, opts: [0.25, 0.5, 0.75, 1], display: "1/2", exp: "2 outcomes, 1 is heads. P = 1/2." },
      { q: "Roll a die. Probability of rolling 6?", a: 0.17, opts: [0.17, 0.33, 0.5, 0.67], display: "1/6", exp: "6 outcomes, 1 is six. P = 1/6." },
    ],
    medium: [
      { q: "Bag: 3 red, 2 blue. Probability of red?", a: 0.6, opts: [0.2, 0.4, 0.6, 0.8], display: "3/5", exp: "5 total, 3 red. P = 3/5 = 0.6." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

// ALGEBRA

function generateBasicAlgebra(level) {
  const problems = {
    easy: [
      { q: "Solve: x + 5 = 12", a: 7, opts: [5, 6, 7, 8], exp: "Subtract 5 from both sides: x = 12 - 5 = 7." },
      { q: "Solve: x - 3 = 10", a: 13, opts: [7, 10, 13, 16], exp: "Add 3 to both sides: x = 10 + 3 = 13." },
    ],
    medium: [
      { q: "Solve: 2x = 16", a: 8, opts: [6, 7, 8, 9], exp: "Divide both sides by 2: x = 16 ÷ 2 = 8." },
      { q: "Solve: x/3 = 5", a: 15, opts: [2, 8, 15, 18], exp: "Multiply both sides by 3: x = 5 × 3 = 15." },
    ],
    hard: [
      { q: "Solve: 3x + 5 = 20", a: 5, opts: [3, 4, 5, 6], exp: "Subtract 5: 3x = 15. Divide by 3: x = 5." },
      { q: "Solve: 2x - 7 = 11", a: 9, opts: [4, 7, 9, 11], exp: "Add 7: 2x = 18. Divide by 2: x = 9." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generateEquations(level) {
  // Similar to basic_algebra but more complex
  return generateBasicAlgebra(level);
}

// CHALLENGE MODES

function generateMixed(level) {
  const operations = ['addition', 'subtraction', 'multiplication', 'division'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  return generateQuestion(operation, level);
}

function generateMentalMath(level) {
  // Fast calculation problems
  const ranges = {
    easy: { min: 1, max: 20 },
    medium: { min: 10, max: 50 },
    hard: { min: 20, max: 100 },
  };
  
  const range = ranges[level] || ranges.easy;
  const num1 = Math.floor(Math.random() * (range.max - range.min)) + range.min;
  const num2 = Math.floor(Math.random() * (range.max - range.min)) + range.min;
  
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  
  let answer;
  if (op === '+') answer = num1 + num2;
  else if (op === '-') answer = Math.abs(num1 - num2);
  else answer = num1 * num2;
  
  return {
    question: `${num1} ${op} ${num2}`,
    answer,
    options: generateOptions(answer),
    explanation: `Quick calculation: ${answer}`,
  };
}

// Helper function
function generateOptions(correctAnswer, decimals = 0) {
  const options = [correctAnswer];
  const range = Math.max(Math.abs(correctAnswer) * 0.3, 5);
  
  while (options.length < 4) {
    const offset = (Math.random() * range * 2 - range);
    let wrongAnswer = correctAnswer + offset;
    
    if (decimals > 0) {
      wrongAnswer = parseFloat(wrongAnswer.toFixed(decimals));
    } else {
      wrongAnswer = Math.round(wrongAnswer);
    }
    
    if (wrongAnswer > 0 && !options.includes(wrongAnswer) && wrongAnswer !== correctAnswer) {
      options.push(wrongAnswer);
    }
  }
  
  return options.sort(() => Math.random() - 0.5);
}