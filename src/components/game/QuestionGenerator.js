// Question Generator for all math concepts
// Comprehensive K-8 Math Curriculum (corrected types and options)

/**
 * Question Schema:
 * {
 *   id: string,                  // Unique identifier (timestamp + random)
 *   operation: string,            // Operation name (e.g., 'addition', 'fractions')
 *   level: string,                // Difficulty level ('easy', 'medium', 'hard', 'expert')
 *   question: string,             // Display text for the question
 *   answer: number | string,      // Correct answer
 *   options: Array<number|string>,// Multiple choice options (including answer)
 *   explanation: string,          // Solution explanation
 *   tags: Array<string>,          // Metadata tags (e.g., ['arithmetic', 'K-2', 'number-sense'])
 *   difficulty: number,           // Numeric difficulty (1-10, optional)
 *   gradeLevel: Array<string>,    // Suggested grade levels (e.g., ['2', '3'])
 * }
 */

// Operation metadata map - All 115 operations
const OPERATION_METADATA = {
  // BASICS & NUMBER SENSE (K-2nd) - 20 concepts
  counting: { category: 'basics', grades: ['K', '1', '2'], tags: ['number-sense', 'counting'] },
  skip_counting_2s: { category: 'basics', grades: ['1', '2'], tags: ['skip-counting', 'patterns'] },
  skip_counting_5s: { category: 'basics', grades: ['1', '2'], tags: ['skip-counting', 'patterns'] },
  skip_counting_10s: { category: 'basics', grades: ['1', '2'], tags: ['skip-counting', 'patterns'] },
  even_odd: { category: 'basics', grades: ['1', '2'], tags: ['number-sense', 'parity'] },
  number_comparison: { category: 'basics', grades: ['K', '1', '2'], tags: ['number-sense', 'comparison'] },
  ordering_numbers: { category: 'basics', grades: ['K', '1', '2', '3'], tags: ['number-sense', 'ordering'] },
  place_value: { category: 'basics', grades: ['1', '2', '3', '4'], tags: ['number-sense', 'place-value'] },
  place_value_thousands: { category: 'basics', grades: ['3', '4'], tags: ['number-sense', 'place-value'] },
  number_bonds: { category: 'basics', grades: ['K', '1', '2'], tags: ['number-sense', 'addition'] },
  fact_families: { category: 'basics', grades: ['1', '2', '3'], tags: ['arithmetic', 'relationships'] },
  patterns: { category: 'basics', grades: ['1', '2', '3', '4'], tags: ['patterns', 'sequences'] },
  rounding: { category: 'basics', grades: ['2', '3', '4', '5'], tags: ['number-sense', 'estimation'] },
  estimation: { category: 'basics', grades: ['2', '3', '4', '5'], tags: ['number-sense', 'estimation'] },
  roman_numerals: { category: 'basics', grades: ['3', '4', '5'], tags: ['number-systems', 'history'] },
  expanded_form: { category: 'basics', grades: ['2', '3', '4'], tags: ['place-value', 'number-sense'] },
  standard_form: { category: 'basics', grades: ['2', '3', '4'], tags: ['place-value', 'number-sense'] },
  word_form: { category: 'basics', grades: ['2', '3', '4'], tags: ['place-value', 'reading-numbers'] },
  greater_less_symbols: { category: 'basics', grades: ['K', '1', '2'], tags: ['comparison', 'symbols'] },
  number_lines: { category: 'basics', grades: ['1', '2', '3', '4'], tags: ['number-sense', 'visualization'] },
  
  // CORE OPERATIONS (K-5th) - 28 concepts
  addition: { category: 'core', grades: ['K', '1', '2', '3', '4'], tags: ['arithmetic', 'addition'] },
  addition_single_digit: { category: 'core', grades: ['K', '1'], tags: ['arithmetic', 'addition', 'basic-facts'] },
  addition_double_digit: { category: 'core', grades: ['2', '3'], tags: ['arithmetic', 'addition'] },
  addition_triple_digit: { category: 'core', grades: ['3', '4'], tags: ['arithmetic', 'addition'] },
  addition_regrouping: { category: 'core', grades: ['2', '3'], tags: ['arithmetic', 'addition', 'regrouping'] },
  missing_addends: { category: 'core', grades: ['1', '2', '3'], tags: ['arithmetic', 'addition', 'algebra'] },
  subtraction: { category: 'core', grades: ['K', '1', '2', '3', '4'], tags: ['arithmetic', 'subtraction'] },
  subtraction_single_digit: { category: 'core', grades: ['K', '1'], tags: ['arithmetic', 'subtraction', 'basic-facts'] },
  subtraction_double_digit: { category: 'core', grades: ['2', '3'], tags: ['arithmetic', 'subtraction'] },
  subtraction_regrouping: { category: 'core', grades: ['2', '3'], tags: ['arithmetic', 'subtraction', 'borrowing'] },
  multiplication: { category: 'core', grades: ['2', '3', '4', '5'], tags: ['arithmetic', 'multiplication'] },
  multiplication_tables_2_5: { category: 'core', grades: ['2', '3'], tags: ['multiplication', 'times-tables'] },
  multiplication_tables_3_4: { category: 'core', grades: ['3', '4'], tags: ['multiplication', 'times-tables'] },
  multiplication_tables_7_9: { category: 'core', grades: ['3', '4'], tags: ['multiplication', 'times-tables'] },
  multiplication_double_digit: { category: 'core', grades: ['4', '5'], tags: ['multiplication', 'multi-digit'] },
  missing_factors: { category: 'core', grades: ['3', '4'], tags: ['multiplication', 'division', 'algebra'] },
  division: { category: 'core', grades: ['3', '4', '5', '6'], tags: ['arithmetic', 'division'] },
  division_basic: { category: 'core', grades: ['3', '4'], tags: ['division', 'basic-facts'] },
  division_remainders: { category: 'core', grades: ['4', '5'], tags: ['division', 'remainders'] },
  division_long: { category: 'core', grades: ['4', '5', '6'], tags: ['division', 'long-division'] },
  order_operations: { category: 'core', grades: ['5', '6', '7', '8'], tags: ['arithmetic', 'order-of-operations'] },
  properties_addition: { category: 'core', grades: ['2', '3', '4'], tags: ['properties', 'addition'] },
  properties_multiplication: { category: 'core', grades: ['3', '4', '5'], tags: ['properties', 'multiplication'] },
  distributive_property: { category: 'core', grades: ['3', '4', '5'], tags: ['properties', 'distributive'] },
  mental_math_strategies: { category: 'core', grades: ['2', '3', '4', '5'], tags: ['mental-math', 'strategies'] },
  powers_of_10: { category: 'core', grades: ['4', '5', '6'], tags: ['place-value', 'multiplication'] },
  multiples: { category: 'core', grades: ['3', '4', '5'], tags: ['number-theory', 'multiples'] },
  divisibility_rules: { category: 'core', grades: ['4', '5', '6'], tags: ['number-theory', 'division'] },
  
  // ADVANCED CONCEPTS (4-8th) - 24 concepts
  factors_multiples: { category: 'advanced', grades: ['4', '5', '6'], tags: ['number-theory', 'factors'] },
  gcf: { category: 'advanced', grades: ['5', '6'], tags: ['number-theory', 'factors', 'gcf'] },
  lcm: { category: 'advanced', grades: ['5', '6'], tags: ['number-theory', 'multiples', 'lcm'] },
  prime_composite: { category: 'advanced', grades: ['4', '5', '6'], tags: ['number-theory', 'primes'] },
  prime_factorization: { category: 'advanced', grades: ['5', '6'], tags: ['number-theory', 'primes', 'factoring'] },
  fractions: { category: 'advanced', grades: ['3', '4', '5', '6'], tags: ['fractions', 'rational-numbers'] },
  fractions_equivalent: { category: 'advanced', grades: ['3', '4', '5'], tags: ['fractions', 'equivalence'] },
  fractions_simplify: { category: 'advanced', grades: ['4', '5', '6'], tags: ['fractions', 'simplification'] },
  fractions_compare: { category: 'advanced', grades: ['3', '4', '5'], tags: ['fractions', 'comparison'] },
  fractions_add_subtract: { category: 'advanced', grades: ['4', '5', '6'], tags: ['fractions', 'operations'] },
  fractions_multiply_divide: { category: 'advanced', grades: ['5', '6'], tags: ['fractions', 'operations'] },
  mixed_numbers: { category: 'advanced', grades: ['4', '5', '6'], tags: ['fractions', 'mixed-numbers'] },
  decimals: { category: 'advanced', grades: ['4', '5', '6', '7'], tags: ['decimals', 'rational-numbers'] },
  decimals_place_value: { category: 'advanced', grades: ['4', '5'], tags: ['decimals', 'place-value'] },
  decimals_compare: { category: 'advanced', grades: ['4', '5'], tags: ['decimals', 'comparison'] },
  decimals_operations: { category: 'advanced', grades: ['5', '6', '7'], tags: ['decimals', 'operations'] },
  percentages: { category: 'advanced', grades: ['5', '6', '7', '8'], tags: ['percentages', 'rational-numbers'] },
  percent_of_number: { category: 'advanced', grades: ['6', '7'], tags: ['percentages', 'calculations'] },
  percent_increase_decrease: { category: 'advanced', grades: ['6', '7', '8'], tags: ['percentages', 'change'] },
  ratios: { category: 'advanced', grades: ['6', '7', '8'], tags: ['ratios', 'proportions'] },
  integers: { category: 'advanced', grades: ['6', '7', '8'], tags: ['integers', 'negative-numbers'] },
  absolute_value: { category: 'advanced', grades: ['6', '7', '8'], tags: ['integers', 'absolute-value'] },
  exponents: { category: 'advanced', grades: ['6', '7', '8'], tags: ['exponents', 'powers'] },
  scientific_notation: { category: 'advanced', grades: ['7', '8'], tags: ['scientific-notation', 'exponents'] },
  
  // APPLIED MATH (2-8th) - 30 concepts
  word_problems: { category: 'applied', grades: ['2', '3', '4', '5', '6'], tags: ['word-problems', 'real-world'] },
  word_problems_addition: { category: 'applied', grades: ['1', '2', '3'], tags: ['word-problems', 'addition'] },
  word_problems_subtraction: { category: 'applied', grades: ['1', '2', '3'], tags: ['word-problems', 'subtraction'] },
  word_problems_multiplication: { category: 'applied', grades: ['3', '4', '5'], tags: ['word-problems', 'multiplication'] },
  word_problems_multi_step: { category: 'applied', grades: ['4', '5', '6', '7'], tags: ['word-problems', 'multi-step'] },
  money: { category: 'applied', grades: ['1', '2', '3', '4', '5'], tags: ['money', 'real-world'] },
  money_counting: { category: 'applied', grades: ['1', '2', '3'], tags: ['money', 'counting'] },
  money_change: { category: 'applied', grades: ['2', '3', '4'], tags: ['money', 'subtraction'] },
  money_decimals: { category: 'applied', grades: ['3', '4', '5'], tags: ['money', 'decimals'] },
  time: { category: 'applied', grades: ['1', '2', '3', '4'], tags: ['time', 'measurement'] },
  time_telling: { category: 'applied', grades: ['1', '2', '3'], tags: ['time', 'clocks'] },
  time_elapsed: { category: 'applied', grades: ['3', '4', '5'], tags: ['time', 'elapsed'] },
  time_calendar: { category: 'applied', grades: ['2', '3', '4'], tags: ['time', 'calendar'] },
  measurement: { category: 'applied', grades: ['2', '3', '4', '5', '6'], tags: ['measurement', 'units'] },
  measurement_length: { category: 'applied', grades: ['2', '3', '4'], tags: ['measurement', 'length'] },
  measurement_metric: { category: 'applied', grades: ['3', '4', '5'], tags: ['measurement', 'metric'] },
  measurement_conversions: { category: 'applied', grades: ['4', '5', '6'], tags: ['measurement', 'conversions'] },
  temperature: { category: 'applied', grades: ['3', '4', '5'], tags: ['measurement', 'temperature'] },
  geometry: { category: 'applied', grades: ['3', '4', '5', '6', '7'], tags: ['geometry', 'shapes'] },
  geometry_shapes: { category: 'applied', grades: ['K', '1', '2', '3'], tags: ['geometry', '2d-shapes'] },
  geometry_3d: { category: 'applied', grades: ['2', '3', '4', '5'], tags: ['geometry', '3d-shapes'] },
  area_perimeter: { category: 'applied', grades: ['3', '4', '5', '6'], tags: ['geometry', 'area', 'perimeter'] },
  volume: { category: 'applied', grades: ['5', '6', '7'], tags: ['geometry', 'volume'] },
  surface_area: { category: 'applied', grades: ['6', '7', '8'], tags: ['geometry', 'surface-area'] },
  angles: { category: 'applied', grades: ['4', '5', '6', '7'], tags: ['geometry', 'angles'] },
  circles: { category: 'applied', grades: ['5', '6', '7'], tags: ['geometry', 'circles'] },
  pythagorean: { category: 'applied', grades: ['7', '8'], tags: ['geometry', 'pythagorean-theorem'] },
  coordinates: { category: 'applied', grades: ['5', '6', '7', '8'], tags: ['geometry', 'coordinate-plane'] },
  data_graphs: { category: 'applied', grades: ['3', '4', '5', '6', '7'], tags: ['data', 'graphs', 'statistics'] },
  probability: { category: 'applied', grades: ['5', '6', '7', '8'], tags: ['probability', 'statistics'] },
  
  // ALGEBRA (5-8th) - 8 concepts
  basic_algebra: { category: 'algebra', grades: ['6', '7', '8'], tags: ['algebra', 'equations'] },
  equations: { category: 'algebra', grades: ['6', '7', '8'], tags: ['algebra', 'linear-equations'] },
  inequalities: { category: 'algebra', grades: ['6', '7', '8'], tags: ['algebra', 'inequalities'] },
  expressions: { category: 'algebra', grades: ['6', '7', '8'], tags: ['algebra', 'expressions'] },
  systems_equations: { category: 'algebra', grades: ['7', '8'], tags: ['algebra', 'systems'] },
  polynomials: { category: 'algebra', grades: ['7', '8'], tags: ['algebra', 'polynomials'] },
  factoring: { category: 'algebra', grades: ['7', '8'], tags: ['algebra', 'factoring'] },
  quadratic: { category: 'algebra', grades: ['8'], tags: ['algebra', 'quadratic'] },
  
  // CHALLENGE MODE (3-8th) - 5 concepts
  mixed: { category: 'challenge', grades: ['3', '4', '5', '6', '7', '8'], tags: ['mixed', 'challenge'] },
  mental_math: { category: 'challenge', grades: ['2', '3', '4', '5', '6'], tags: ['mental-math', 'fluency'] },
  speed_challenge: { category: 'challenge', grades: ['3', '4', '5', '6', '7'], tags: ['speed', 'fluency'] },
  logic_puzzles: { category: 'challenge', grades: ['4', '5', '6', '7', '8'], tags: ['logic', 'reasoning'] },
  competition_math: { category: 'challenge', grades: ['5', '6', '7', '8'], tags: ['competition', 'advanced'] },
};

// Difficulty scale by level
const DIFFICULTY_SCALE = {
  easy: 2,
  medium: 5,
  hard: 7,
  expert: 9,
};

function generateQuestionId() {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function enrichQuestion(rawQuestion, operation, level) {
  const metadata = OPERATION_METADATA[operation] || { category: 'core', grades: ['3'], tags: [] };
  const difficulty = DIFFICULTY_SCALE[level] || 5;
  
  return {
    id: generateQuestionId(),
    operation,
    level,
    ...rawQuestion,
    tags: [metadata.category, ...metadata.tags, level],
    difficulty,
    gradeLevel: metadata.grades,
  };
}

export const generateQuestion = (operation, level) => {
  const generators = {
    // BASICS & NUMBER SENSE (20)
    counting: generateCounting,
    skip_counting_2s: generateSkipCounting2s,
    skip_counting_5s: generateSkipCounting5s,
    skip_counting_10s: generateSkipCounting10s,
    even_odd: generateEvenOdd,
    number_comparison: generateNumberComparison,
    ordering_numbers: generateOrderingNumbers,
    place_value: generatePlaceValue,
    place_value_thousands: generatePlaceValueThousands,
    number_bonds: generateNumberBonds,
    fact_families: generateFactFamilies,
    patterns: generatePatterns,
    rounding: generateRounding,
    estimation: generateEstimation,
    roman_numerals: generateRomanNumerals,
    expanded_form: generateExpandedForm,
    standard_form: generateStandardForm,
    word_form: generateWordForm,
    greater_less_symbols: generateGreaterLessSymbols,
    number_lines: generateNumberLines,
    
    // CORE OPERATIONS (28)
    addition: generateAddition,
    addition_single_digit: generateAdditionSingleDigit,
    addition_double_digit: generateAdditionDoubleDigit,
    addition_triple_digit: generateAdditionTripleDigit,
    addition_regrouping: generateAdditionRegrouping,
    missing_addends: generateMissingAddends,
    subtraction: generateSubtraction,
    subtraction_single_digit: generateSubtractionSingleDigit,
    subtraction_double_digit: generateSubtractionDoubleDigit,
    subtraction_regrouping: generateSubtractionRegrouping,
    multiplication: generateMultiplication,
    multiplication_tables_2_5: generateMultiplicationTables2_5,
    multiplication_tables_3_4: generateMultiplicationTables3_4,
    multiplication_tables_7_9: generateMultiplicationTables7_9,
    multiplication_double_digit: generateMultiplicationDoubleDigit,
    missing_factors: generateMissingFactors,
    division: generateDivision,
    division_basic: generateDivisionBasic,
    division_remainders: generateDivisionRemainders,
    division_long: generateDivisionLong,
    order_operations: generateOrderOperations,
    properties_addition: generatePropertiesAddition,
    properties_multiplication: generatePropertiesMultiplication,
    distributive_property: generateDistributiveProperty,
    mental_math_strategies: generateMentalMathStrategies,
    powers_of_10: generatePowersOf10,
    multiples: generateMultiples,
    divisibility_rules: generateDivisibilityRules,
    
    // ADVANCED CONCEPTS (24)
    factors_multiples: generateFactorsMultiples,
    gcf: generateGCF,
    lcm: generateLCM,
    prime_composite: generatePrimeComposite,
    prime_factorization: generatePrimeFactorization,
    fractions: generateFractions,
    fractions_equivalent: generateFractionsEquivalent,
    fractions_simplify: generateFractionsSimplify,
    fractions_compare: generateFractionsCompare,
    fractions_add_subtract: generateFractionsAddSubtract,
    fractions_multiply_divide: generateFractionsMultiplyDivide,
    mixed_numbers: generateMixedNumbers,
    decimals: generateDecimals,
    decimals_place_value: generateDecimalsPlaceValue,
    decimals_compare: generateDecimalsCompare,
    decimals_operations: generateDecimalsOperations,
    percentages: generatePercentages,
    percent_of_number: generatePercentOfNumber,
    percent_increase_decrease: generatePercentIncreaseDecrease,
    ratios: generateRatios,
    integers: generateIntegers,
    absolute_value: generateAbsoluteValue,
    exponents: generateExponents,
    scientific_notation: generateScientificNotation,
    
    // APPLIED MATH (30)
    word_problems: generateWordProblem,
    word_problems_addition: generateWordProblemsAddition,
    word_problems_subtraction: generateWordProblemsSubtraction,
    word_problems_multiplication: generateWordProblemsMultiplication,
    word_problems_multi_step: generateWordProblemsMultiStep,
    money: generateMoney,
    money_counting: generateMoneyCounting,
    money_change: generateMoneyChange,
    money_decimals: generateMoneyDecimals,
    time: generateTime,
    time_telling: generateTimeTelling,
    time_elapsed: generateTimeElapsed,
    time_calendar: generateTimeCalendar,
    measurement: generateMeasurement,
    measurement_length: generateMeasurementLength,
    measurement_metric: generateMeasurementMetric,
    measurement_conversions: generateMeasurementConversions,
    temperature: generateTemperature,
    geometry: generateGeometry,
    geometry_shapes: generateGeometryShapes,
    geometry_3d: generateGeometry3D,
    area_perimeter: generateAreaPerimeter,
    volume: generateVolume,
    surface_area: generateSurfaceArea,
    angles: generateAngles,
    circles: generateCircles,
    pythagorean: generatePythagorean,
    coordinates: generateCoordinates,
    data_graphs: generateDataGraphs,
    probability: generateProbability,
    
    // ALGEBRA (8)
    basic_algebra: generateBasicAlgebra,
    equations: generateEquations,
    inequalities: generateInequalities,
    expressions: generateExpressions,
    systems_equations: generateSystemsEquations,
    polynomials: generatePolynomials,
    factoring: generateFactoring,
    quadratic: generateQuadratic,
    
    // CHALLENGE (5)
    mixed: generateMixed,
    mental_math: generateMentalMath,
    speed_challenge: generateSpeedChallenge,
    logic_puzzles: generateLogicPuzzles,
    competition_math: generateCompetitionMath,
  };

  const generator = generators[operation] || generateAddition;
  const rawQuestion = generator(level);
  return enrichQuestion(rawQuestion, operation, level);
};

// BASICS (K-4)

function generateCounting(level) {
  const ranges = {
    easy: { min: 1, max: 10 },
    medium: { min: 10, max: 50 },
    hard: { min: 50, max: 100 },
  };
  
  const range = ranges[level] || ranges.easy;
  // Pick a valid starting point with enough headroom for +3
  const start = Math.floor(Math.random() * (range.max - range.min - 3)) + range.min;
  // For a simple counting sequence (increase by 1), the missing value is start + 2
  const answer = start + 2;
  
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
  
  return {
    question: `${num1} ___ ${num2}. Which symbol?`,
    answer: correctSymbol,
    options: symbols,
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

// CORE OPERATIONS

function generateAddition(level) {
  const ranges = {
    easy: { min: 1, max: 10 },
    medium: { min: 10, max: 50 },
    hard: { min: 50, max: 200 },
    expert: { min: 100, max: 1000 },
  };
  
  const range = ranges[level] || ranges.easy;
  const num1 = randInt(range.min, range.max);
  const num2 = randInt(range.min, range.max);
  const answer = num1 + num2;
  
  return {
    question: `${num1} + ${num2}`,
    answer,
    options: generateOptions(answer),
    explanation: generateStepByStepExplanation({ operation: 'addition', operands: [num1, num2], correct: answer }),
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
  const num1 = randInt(range.min, range.max);
  const num2 = randInt(1, num1);
  const answer = num1 - num2;
  
  return {
    question: `${num1} - ${num2}`,
    answer,
    options: generateOptions(answer),
    explanation: generateStepByStepExplanation({ operation: 'subtraction', operands: [num1, num2], correct: answer }),
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
  const num1 = randInt(range.min, range.max);
  const num2 = randInt(range.min, range.max);
  const answer = num1 * num2;
  
  return {
    question: `${num1} × ${num2}`,
    answer,
    options: generateOptions(answer),
    explanation: generateStepByStepExplanation({ operation: 'multiplication', operands: [num1, num2], correct: answer }),
  };
}

function generateDivision(level) {
  const ranges = {
    easy: { divisor: { min: 2, max: 5 }, quotient: { min: 1, max: 10 } },
    medium: { divisor: { min: 2, max: 12 }, quotient: { min: 1, max: 20 } },
    hard: { divisor: { min: 5, max: 25 }, quotient: { min: 2, max: 50 } },
    expert: { divisor: { min: 10, max: 50 }, quotient: { min: 5, max: 100 } },
  };
  
  const range = ranges[level] || ranges.easy;
  const divisor = randInt(range.divisor.min, range.divisor.max);
  const quotient = randInt(range.quotient.min, range.quotient.max);
  const dividend = divisor * quotient;
  
  return {
    question: `${dividend} ÷ ${divisor}`,
    answer: quotient,
    options: generateOptions(quotient),
    explanation: generateStepByStepExplanation({ operation: 'division', operands: [dividend, divisor], correct: quotient }),
  };
}

// ADVANCED CONCEPTS

function generateFactorsMultiples(level) {
  const problems = {
    easy: [
      { q: "How many factors does 12 have?", a: 6, opts: [4, 5, 6, 7], exp: "12 has 6 factors: 1, 2, 3, 4, 6, 12." },
      { q: "Which is a multiple of 5?", a: 25, opts: [22, 24, 25, 27], exp: "25 = 5 × 5, so 25 is a multiple of 5." },
      { q: "Is 15 a multiple of 3?", a: 'Yes', opts: ['No', 'Yes'], exp: "Yes! 15 = 3 × 5." },
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
      answer: 'Yes',
      options: ['No', 'Yes'],
      explanation: `Yes! ${num} is prime. It can only be divided by 1 and ${num}.`,
    };
  } else {
    const num = composites[Math.floor(Math.random() * composites.length)];
    return {
      question: `Is ${num} a prime number?`,
      answer: 'No',
      options: ['No', 'Yes'],
      explanation: `No! ${num} is composite. It has factors other than 1 and itself.`,
    };
  }
}

function generateRatios(level) {
  const problems = {
    easy: [
      { q: "Simplify the ratio 4:8", a: '1:2', opts: ['1:2', '1:1', '2:1', '4:1'], exp: "Divide both by 4: 4÷4 = 1, 8÷4 = 2. Answer: 1:2" },
      { q: "If 2 apples cost $4, what do 4 apples cost?", a: 8, opts: [6, 7, 8, 10], exp: "2 apples = $4, so 4 apples = $4 × 2 = $8." },
    ],
    medium: [
      { q: "In a class of 30, the ratio of boys to girls is 2:3. How many girls?", a: 18, opts: [12, 15, 18, 20], exp: "2+3=5 parts. 30÷5=6 per part. Girls = 3×6 = 18." },
      { q: "Simplify 12:18", a: '2:3', opts: ['1:2', '2:3', '3:4', '3:5'], exp: "Divide both by 6: 12÷6 = 2, 18÷6 = 3." },
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
    explanation: generateStepByStepExplanation({ operation: 'orderOfOperations', operands: [], correct: problem.a }),
  };
}

function generateIntegers(level) {
  const ranges = {
    easy: { min: -10, max: 10 },
    medium: { min: -50, max: 50 },
    hard: { min: -100, max: 100 },
  };
  
  const range = ranges[level] || ranges.easy;
  const num1 = randInt(range.min, range.max);
  const num2 = randInt(range.min, range.max);
  const answer = num1 + num2;
  
  return {
    question: `${num1} + (${num2})`,
    answer,
    options: generateOptions(answer),
    explanation: generateStepByStepExplanation({ operation: 'integer', operands: [num1, num2], correct: answer }),
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
    explanation: generateStepByStepExplanation({ operation: 'exponent', operands: [], correct: problem.a }),
  };
}

function generateFractions(level) {
  // Keep consistent decimals to 2 places for options; explanatory text mentions fractions
  const problems = {
    easy: [
      { q: "What is 1/2 + 1/2?", a: 1, opts: [0, 1, 2, 3], exp: "1/2 + 1/2 = 2/2 = 1 whole." },
      { q: "What is 1/4 + 1/4?", a: 0.5, opts: [0.25, 0.5, 0.75, 1], exp: "1/4 + 1/4 = 2/4 = 1/2." },
    ],
    medium: [
      { q: "What is 1/2 + 1/4?", a: 0.75, opts: [0.5, 0.67, 0.75, 1], exp: "1/2 = 2/4. Then 2/4 + 1/4 = 3/4." },
      { q: "What is 2/3 + 1/6?", a: 0.83, opts: [0.67, 0.75, 0.83, 1], exp: "2/3 = 4/6. Then 4/6 + 1/6 = 5/6 (≈ 0.83)." },
    ],
    hard: [
      { q: "What is 2/3 + 3/4?", a: 1.42, opts: [1.25, 1.33, 1.42, 1.5], exp: "Common denominator 12: 8/12 + 9/12 = 17/12 = 1 5/12 (≈ 1.42)." },
      { q: "What is 3/4 × 2?", a: 1.5, opts: [1, 1.5, 2, 2.5], exp: "(3 × 2)/4 = 6/4 = 1 1/2 = 1.5." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: generateStepByStepExplanation({ operation: 'fraction', operands: [], correct: problem.a }),
  };
}

function generateDecimals(level) {
  const ranges = {
    easy: { min: 0.1, max: 9.9, decimals: 1 },
    medium: { min: 0.01, max: 99.9, decimals: 2 },
    hard: { min: 0.01, max: 999.9, decimals: 2 },
  };
  
  const range = ranges[level] || ranges.easy;
  const num1 = toFixedRandom(range.min, range.max, range.decimals);
  const num2 = toFixedRandom(range.min, range.max, range.decimals);
  const operation = Math.random() > 0.5 ? "+" : "-";
  const [a, b] = operation === "+" ? [num1, num2] : [Math.max(num1, num2), Math.min(num1, num2)];
  const answer = parseFloat((a + (operation === "+" ? b : -b)).toFixed(range.decimals));
  
  return {
    question: operation === "+" ? `${num1} + ${num2}` : `${a} - ${b}`,
    answer,
    options: generateOptions(answer, range.decimals),
    explanation: generateStepByStepExplanation({ operation: operation === "+" ? 'addition' : 'subtraction', operands: [a, b], correct: answer }),
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
    explanation: generateStepByStepExplanation({ operation: 'percentages', operands: [], correct: problem.a }),
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
  
  const n1 = randInt(template.range[0], template.range[1]);
  const n2 = randInt(template.range[0], template.range[1]);
  
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
    explanation: generateStepByStepExplanation({ operation: template.operation, operands: [n1, n2], correct: answer }),
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
    explanation: generateStepByStepExplanation({ operation: 'money', operands: [], correct: problem.a }),
  };
}

function generateTime(level) {
  const toTime = (h, m) => `${h}:${m.toString().padStart(2, '0')}`;
  const problems = {
    easy: [
      { q: "How many minutes in 1 hour?", a: 60, opts: [30, 60, 90, 120], exp: "1 hour = 60 minutes." },
      { q: "30 minutes after 2:00 = ?", a: toTime(2,30), opts: [toTime(2,0), toTime(2,30), toTime(3,0), toTime(3,30)], exp: "2:00 + 30 min = 2:30." },
    ],
    medium: [
      { q: "If it's 3:45, what time in 25 min?", a: toTime(4,10), opts: [toTime(4,0), toTime(4,10), toTime(4,30), toTime(5,0)], exp: "3:45 + 25 min = 4:10." },
      { q: "How many seconds in 5 minutes?", a: 300, opts: [250, 300, 350, 400], exp: "60 × 5 = 300 seconds." },
    ],
  };
  
  const levelProblems = problems[level] || problems.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: generateStepByStepExplanation({ operation: 'time', operands: [], correct: problem.a }),
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
    explanation: generateStepByStepExplanation({ operation: 'measurement', operands: [], correct: problem.a }),
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
  const x = randInt(-5, 4);
  const y = randInt(-5, 4);
  
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
      { q: "Bar chart: A=5, B=3, C=7. Which is tallest?", a: 'C', opts: ['A','B','C'], exp: "C has value 7, which is highest." },
      { q: "Line plot: Mon=10, Tue=15, Wed=12. Which day had most?", a: 'Tue', opts: ['Mon','Tue','Wed'], exp: "Tuesday had 15, the highest value." },
    ],
    medium: [
      { q: "Pie chart: 50% red, 30% blue, 20% green. Largest?", a: 'Red', opts: ['Red','Blue','Green'], exp: "Red at 50% is largest." },
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

function generateProbability(level) {
  const problems = {
    easy: [
      { q: "Flip a coin. Probability of heads?", a: '1/2', opts: ['1/4','1/2','3/4','1'], exp: "2 outcomes, 1 is heads. P = 1/2." },
      { q: "Roll a die. Probability of rolling 6?", a: '1/6', opts: ['1/6','1/3','1/2','2/3'], exp: "6 outcomes, 1 is six. P = 1/6." },
    ],
    medium: [
      { q: "Bag: 3 red, 2 blue. Probability of red?", a: '3/5', opts: ['1/5','2/5','3/5','4/5'], exp: "5 total, 3 red. P = 3/5 = 0.6." },
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
  return generateBasicAlgebra(level);
}

// CHALLENGE MODES

function generateMixed(level) {
  const operations = ['addition', 'subtraction', 'multiplication', 'division'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  return generateQuestion(operation, level);
}

function generateMentalMath(level) {
  const ranges = {
    easy: { min: 1, max: 20 },
    medium: { min: 10, max: 50 },
    hard: { min: 20, max: 100 },
  };
  
  const range = ranges[level] || ranges.easy;
  const num1 = randInt(range.min, range.max);
  const num2 = randInt(range.min, range.max);
  
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

// ============================================================================
// MISSING BASICS GENERATORS (15 functions)
// ============================================================================

function generateSkipCounting2s(level) {
  const ranges = { easy: { max: 20 }, medium: { max: 50 }, hard: { max: 100 } };
  const range = ranges[level] || ranges.easy;
  const start = randInt(0, range.max - 10) * 2;
  const answer = start + 6; // third number in sequence: start, start+2, start+4, ?
  
  return {
    question: `Skip count by 2s: ${start}, ${start + 2}, ${start + 4}, ?`,
    answer,
    options: generateOptions(answer),
    explanation: `Counting by 2s: ${start} + 2 = ${start + 2}, + 2 = ${start + 4}, + 2 = ${answer}.`,
  };
}

function generateSkipCounting5s(level) {
  const ranges = { easy: { max: 50 }, medium: { max: 100 }, hard: { max: 200 } };
  const range = ranges[level] || ranges.easy;
  const start = randInt(0, Math.floor(range.max / 5) - 4) * 5;
  const answer = start + 15;
  
  return {
    question: `Skip count by 5s: ${start}, ${start + 5}, ${start + 10}, ?`,
    answer,
    options: generateOptions(answer),
    explanation: `Counting by 5s: ${start} + 5 = ${start + 5}, + 5 = ${start + 10}, + 5 = ${answer}.`,
  };
}

function generateSkipCounting10s(level) {
  const ranges = { easy: { max: 100 }, medium: { max: 200 }, hard: { max: 500 } };
  const range = ranges[level] || ranges.easy;
  const start = randInt(0, Math.floor(range.max / 10) - 4) * 10;
  const answer = start + 30;
  
  return {
    question: `Skip count by 10s: ${start}, ${start + 10}, ${start + 20}, ?`,
    answer,
    options: generateOptions(answer),
    explanation: `Counting by 10s: ${start} + 10 = ${start + 10}, + 10 = ${start + 20}, + 10 = ${answer}.`,
  };
}

function generateEvenOdd(level) {
  const ranges = { easy: { max: 20 }, medium: { max: 50 }, hard: { max: 100 } };
  const range = ranges[level] || ranges.easy;
  const num = randInt(1, range.max);
  const isEven = num % 2 === 0;
  const answer = isEven ? 'Even' : 'Odd';
  
  return {
    question: `Is ${num} even or odd?`,
    answer,
    options: ['Even', 'Odd'],
    explanation: `${num} is ${answer.toLowerCase()} because it ${isEven ? 'can' : 'cannot'} be divided evenly by 2.`,
  };
}

function generateOrderingNumbers(level) {
  const ranges = { easy: { max: 20 }, medium: { max: 100 }, hard: { max: 1000 } };
  const range = ranges[level] || ranges.easy;
  const nums = Array.from({ length: 4 }, () => randInt(1, range.max));
  const sorted = [...nums].sort((a, b) => a - b);
  const answer = sorted.join(', ');
  
  return {
    question: `Order from smallest to largest: ${nums.join(', ')}`,
    answer,
    options: [answer, [...nums].reverse().join(', '), shuffle([...nums]).join(', ')].slice(0, 3),
    explanation: `Smallest to largest: ${answer}.`,
  };
}

function generatePlaceValueThousands(level) {
  const num = randInt(1000, 9999);
  const digits = num.toString().split('').map(Number);
  const questions = [
    { q: `What is the thousands digit in ${num}?`, a: digits[0], exp: `In ${num}, ${digits[0]} is in the thousands place.` },
    { q: `What is the hundreds digit in ${num}?`, a: digits[1], exp: `In ${num}, ${digits[1]} is in the hundreds place.` },
    { q: `What is the tens digit in ${num}?`, a: digits[2], exp: `In ${num}, ${digits[2]} is in the tens place.` },
    { q: `What is the ones digit in ${num}?`, a: digits[3], exp: `In ${num}, ${digits[3]} is in the ones place.` },
  ];
  const problem = questions[Math.floor(Math.random() * questions.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: generateOptions(problem.a),
    explanation: problem.exp,
  };
}

function generateNumberBonds(level) {
  const ranges = { easy: { max: 10 }, medium: { max: 20 }, hard: { max: 50 } };
  const range = ranges[level] || ranges.easy;
  const total = randInt(5, range.max);
  const part1 = randInt(1, total - 1);
  const answer = total - part1;
  
  return {
    question: `Number bonds: ${part1} + ? = ${total}`,
    answer,
    options: generateOptions(answer),
    explanation: `${total} - ${part1} = ${answer}. So ${part1} + ${answer} = ${total}.`,
  };
}

function generateFactFamilies(level) {
  const ranges = { easy: { max: 10 }, medium: { max: 20 }, hard: { max: 50 } };
  const range = ranges[level] || ranges.easy;
  const a = randInt(2, range.max);
  const b = randInt(2, range.max);
  const sum = a + b;
  
  const questions = [
    { q: `If ${a} + ${b} = ${sum}, then ${b} + ${a} = ?`, a: sum, exp: `Addition is commutative: ${a} + ${b} = ${b} + ${a} = ${sum}.` },
    { q: `If ${a} + ${b} = ${sum}, then ${sum} - ${a} = ?`, a: b, exp: `Inverse operation: ${sum} - ${a} = ${b}.` },
    { q: `If ${a} + ${b} = ${sum}, then ${sum} - ${b} = ?`, a: a, exp: `Inverse operation: ${sum} - ${b} = ${a}.` },
  ];
  const problem = questions[Math.floor(Math.random() * questions.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: generateOptions(problem.a),
    explanation: problem.exp,
  };
}

function generateEstimation(level) {
  const ranges = { easy: { max: 50 }, medium: { max: 500 }, hard: { max: 5000 } };
  const range = ranges[level] || ranges.easy;
  const num = randInt(10, range.max);
  const roundTo = level === 'easy' ? 10 : level === 'medium' ? 100 : 1000;
  const answer = Math.round(num / roundTo) * roundTo;
  
  return {
    question: `Round ${num} to the nearest ${roundTo}`,
    answer,
    options: generateOptions(answer),
    explanation: `${num} rounds to ${answer} (nearest ${roundTo}).`,
  };
}

function generateRomanNumerals(level) {
  const numerals = {
    easy: [
      { q: 'What is I in numbers?', a: 1, opts: [1, 5, 10, 50] },
      { q: 'What is V in numbers?', a: 5, opts: [1, 5, 10, 50] },
      { q: 'What is X in numbers?', a: 10, opts: [1, 5, 10, 50] },
      { q: 'What is III in numbers?', a: 3, opts: [2, 3, 4, 5] },
    ],
    medium: [
      { q: 'What is XV in numbers?', a: 15, opts: [10, 15, 20, 25] },
      { q: 'What is XX in numbers?', a: 20, opts: [10, 15, 20, 25] },
      { q: 'What is L in numbers?', a: 50, opts: [5, 10, 50, 100] },
    ],
    hard: [
      { q: 'What is XC in numbers?', a: 90, opts: [40, 50, 90, 110] },
      { q: 'What is C in numbers?', a: 100, opts: [50, 100, 500, 1000] },
    ],
  };
  
  const levelProblems = numerals[level] || numerals.easy;
  const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: `Roman numeral ${problem.q.split(' ')[2]} = ${problem.a}.`,
  };
}

function generateExpandedForm(level) {
  const ranges = { easy: { max: 99 }, medium: { max: 999 }, hard: { max: 9999 } };
  const range = ranges[level] || ranges.easy;
  const num = randInt(10, range.max);
  const digits = num.toString().split('').map(Number);
  const placeValues = digits.map((d, i) => d * Math.pow(10, digits.length - 1 - i)).filter(v => v > 0);
  const answer = placeValues.join(' + ');
  
  return {
    question: `Write ${num} in expanded form`,
    answer,
    options: [answer, placeValues.reverse().join(' + '), placeValues.join(' × ')].slice(0, 3),
    explanation: `${num} = ${answer}.`,
  };
}

function generateStandardForm(level) {
  const ranges = { easy: { max: 99 }, medium: { max: 999 }, hard: { max: 9999 } };
  const range = ranges[level] || ranges.easy;
  const num = randInt(10, range.max);
  const answer = num;
  
  const digits = num.toString().split('').map(Number);
  const placeValues = digits.map((d, i) => d * Math.pow(10, digits.length - 1 - i)).filter(v => v > 0);
  const expanded = placeValues.join(' + ');
  
  return {
    question: `Write in standard form: ${expanded}`,
    answer,
    options: generateOptions(answer),
    explanation: `${expanded} = ${answer}.`,
  };
}

function generateWordForm(level) {
  const numbers = {
    easy: [
      { num: 12, word: 'twelve' },
      { num: 15, word: 'fifteen' },
      { num: 20, word: 'twenty' },
    ],
    medium: [
      { num: 45, word: 'forty-five' },
      { num: 73, word: 'seventy-three' },
      { num: 100, word: 'one hundred' },
    ],
    hard: [
      { num: 235, word: 'two hundred thirty-five' },
      { num: 1000, word: 'one thousand' },
    ],
  };
  
  const levelNums = numbers[level] || numbers.easy;
  const item = levelNums[Math.floor(Math.random() * levelNums.length)];
  const answer = item.num;
  
  return {
    question: `What number is "${item.word}"?`,
    answer,
    options: generateOptions(answer),
    explanation: `"${item.word}" = ${item.num}.`,
  };
}

function generateGreaterLessSymbols(level) {
  const ranges = { easy: { max: 20 }, medium: { max: 100 }, hard: { max: 1000 } };
  const range = ranges[level] || ranges.easy;
  const num1 = randInt(1, range.max);
  const num2 = randInt(1, range.max);
  const answer = num1 > num2 ? '>' : num1 < num2 ? '<' : '=';
  
  return {
    question: `${num1} ___ ${num2}. Which symbol?`,
    answer,
    options: ['>', '<', '='],
    explanation: `${num1} ${answer} ${num2}.`,
  };
}

function generateNumberLines(level) {
  const ranges = { easy: { max: 20 }, medium: { max: 100 }, hard: { max: 1000 } };
  const range = ranges[level] || ranges.easy;
  const start = randInt(0, range.max - 10);
  const answer = start + 5;
  
  return {
    question: `On a number line from ${start} to ${start + 10}, what number is in the middle?`,
    answer,
    options: generateOptions(answer),
    explanation: `Halfway between ${start} and ${start + 10} is ${answer}.`,
  };
}

// ============================================================================
// MISSING CORE OPERATIONS GENERATORS (24 functions)
// ============================================================================

function generateAdditionSingleDigit(level) {
  const num1 = randInt(0, 9);
  const num2 = randInt(0, 9);
  const answer = num1 + num2;
  
  return {
    question: `${num1} + ${num2} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${num1} + ${num2} = ${answer}.`,
  };
}

function generateAdditionDoubleDigit(level) {
  const ranges = { easy: { max: 50 }, medium: { max: 99 }, hard: { max: 99 } };
  const range = ranges[level] || ranges.medium;
  const num1 = randInt(10, range.max);
  const num2 = randInt(10, range.max);
  const answer = num1 + num2;
  
  return {
    question: `${num1} + ${num2} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${num1} + ${num2} = ${answer}.`,
  };
}

function generateAdditionTripleDigit(level) {
  const ranges = { easy: { max: 500 }, medium: { max: 999 }, hard: { max: 999 } };
  const range = ranges[level] || ranges.medium;
  const num1 = randInt(100, range.max);
  const num2 = randInt(100, range.max);
  const answer = num1 + num2;
  
  return {
    question: `${num1} + ${num2} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${num1} + ${num2} = ${answer}.`,
  };
}

function generateAdditionRegrouping(level) {
  // Generate problems that require regrouping (carrying)
  const ones1 = randInt(5, 9);
  const ones2 = randInt(5, 9); // Ensures sum > 10
  const tens1 = randInt(1, 8);
  const tens2 = randInt(1, 8);
  const num1 = tens1 * 10 + ones1;
  const num2 = tens2 * 10 + ones2;
  const answer = num1 + num2;
  
  return {
    question: `${num1} + ${num2} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${num1} + ${num2} = ${answer}. (Regroup: ${ones1} + ${ones2} = ${ones1 + ones2})`,
  };
}

function generateMissingAddends(level) {
  const ranges = { easy: { max: 20 }, medium: { max: 50 }, hard: { max: 100 } };
  const range = ranges[level] || ranges.easy;
  const sum = randInt(5, range.max);
  const addend = randInt(1, sum - 1);
  const answer = sum - addend;
  
  return {
    question: `${addend} + ? = ${sum}`,
    answer,
    options: generateOptions(answer),
    explanation: `${sum} - ${addend} = ${answer}. So ${addend} + ${answer} = ${sum}.`,
  };
}

function generateSubtractionSingleDigit(level) {
  const num1 = randInt(0, 9);
  const num2 = randInt(0, num1);
  const answer = num1 - num2;
  
  return {
    question: `${num1} - ${num2} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${num1} - ${num2} = ${answer}.`,
  };
}

function generateSubtractionDoubleDigit(level) {
  const ranges = { easy: { max: 50 }, medium: { max: 99 }, hard: { max: 99 } };
  const range = ranges[level] || ranges.medium;
  const num1 = randInt(20, range.max);
  const num2 = randInt(10, num1);
  const answer = num1 - num2;
  
  return {
    question: `${num1} - ${num2} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${num1} - ${num2} = ${answer}.`,
  };
}

function generateSubtractionRegrouping(level) {
  // Generate problems requiring borrowing
  const tens1 = randInt(3, 9);
  const ones1 = randInt(0, 4); // Smaller ones digit
  const tens2 = randInt(1, tens1 - 1);
  const ones2 = randInt(5, 9); // Larger ones digit forces borrowing
  const num1 = tens1 * 10 + ones1;
  const num2 = tens2 * 10 + ones2;
  const answer = num1 - num2;
  
  return {
    question: `${num1} - ${num2} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${num1} - ${num2} = ${answer}. (Borrow from tens place)`,
  };
}

function generateMultiplicationTables2_5(level) {
  const tables = [2, 5];
  const base = tables[Math.floor(Math.random() * tables.length)];
  const multiplier = randInt(1, 12);
  const answer = base * multiplier;
  
  return {
    question: `${base} × ${multiplier} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${base} × ${multiplier} = ${answer}.`,
  };
}

function generateMultiplicationTables3_4(level) {
  const tables = [3, 4];
  const base = tables[Math.floor(Math.random() * tables.length)];
  const multiplier = randInt(1, 12);
  const answer = base * multiplier;
  
  return {
    question: `${base} × ${multiplier} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${base} × ${multiplier} = ${answer}.`,
  };
}

function generateMultiplicationTables7_9(level) {
  const tables = [7, 8, 9];
  const base = tables[Math.floor(Math.random() * tables.length)];
  const multiplier = randInt(1, 12);
  const answer = base * multiplier;
  
  return {
    question: `${base} × ${multiplier} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${base} × ${multiplier} = ${answer}.`,
  };
}

function generateMultiplicationDoubleDigit(level) {
  const ranges = { easy: { max: 20 }, medium: { max: 50 }, hard: { max: 99 } };
  const range = ranges[level] || ranges.medium;
  const num1 = randInt(10, range.max);
  const num2 = randInt(2, 12);
  const answer = num1 * num2;
  
  return {
    question: `${num1} × ${num2} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${num1} × ${num2} = ${answer}.`,
  };
}

function generateMissingFactors(level) {
  const ranges = { easy: { max: 50 }, medium: { max: 100 }, hard: { max: 144 } };
  const range = ranges[level] || ranges.easy;
  const factor = randInt(2, 12);
  const answer = randInt(2, 12);
  const product = factor * answer;
  
  return {
    question: `${factor} × ? = ${product}`,
    answer,
    options: generateOptions(answer),
    explanation: `${product} ÷ ${factor} = ${answer}. So ${factor} × ${answer} = ${product}.`,
  };
}

function generateDivisionBasic(level) {
  const divisor = randInt(2, 10);
  const quotient = randInt(1, 10);
  const dividend = divisor * quotient;
  const answer = quotient;
  
  return {
    question: `${dividend} ÷ ${divisor} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${dividend} ÷ ${divisor} = ${answer}.`,
  };
}

function generateDivisionRemainders(level) {
  const divisor = randInt(2, 10);
  const quotient = randInt(2, 12);
  const remainder = randInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;
  const answer = `${quotient} R${remainder}`;
  
  return {
    question: `${dividend} ÷ ${divisor} = ? (with remainder)`,
    answer,
    options: [answer, `${quotient} R${remainder + 1}`, `${quotient - 1} R${remainder}`, `${quotient + 1}`],
    explanation: `${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}.`,
  };
}

function generateDivisionLong(level) {
  const divisor = randInt(10, 25);
  const quotient = randInt(10, 99);
  const dividend = divisor * quotient;
  const answer = quotient;
  
  return {
    question: `${dividend} ÷ ${divisor} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${dividend} ÷ ${divisor} = ${answer}.`,
  };
}

function generatePropertiesAddition(level) {
  const num1 = randInt(5, 50);
  const num2 = randInt(5, 50);
  
  const properties = [
    { q: `Commutative: ${num1} + ${num2} = ${num2} + ?`, a: num1, exp: `Addition is commutative: ${num1} + ${num2} = ${num2} + ${num1}.` },
    { q: `Identity: ${num1} + ? = ${num1}`, a: 0, exp: `Identity property: Adding 0 doesn't change the number.` },
    { q: `Associative: (${num1} + ${num2}) + 5 = ${num1} + (${num2} + ?)`, a: 5, exp: `Associative property: Grouping doesn't matter.` },
  ];
  
  const problem = properties[Math.floor(Math.random() * properties.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: generateOptions(problem.a),
    explanation: problem.exp,
  };
}

function generatePropertiesMultiplication(level) {
  const num1 = randInt(2, 12);
  const num2 = randInt(2, 12);
  
  const properties = [
    { q: `Commutative: ${num1} × ${num2} = ${num2} × ?`, a: num1, exp: `Multiplication is commutative: ${num1} × ${num2} = ${num2} × ${num1}.` },
    { q: `Identity: ${num1} × ? = ${num1}`, a: 1, exp: `Identity property: Multiplying by 1 doesn't change the number.` },
    { q: `Zero property: ${num1} × ? = 0`, a: 0, exp: `Zero property: Any number times 0 equals 0.` },
  ];
  
  const problem = properties[Math.floor(Math.random() * properties.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: generateOptions(problem.a),
    explanation: problem.exp,
  };
}

function generateDistributiveProperty(level) {
  const a = randInt(2, 10);
  const b = randInt(2, 10);
  const c = randInt(2, 10);
  const answer = a * (b + c);
  
  return {
    question: `Distributive: ${a} × (${b} + ${c}) = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ${c} = ${a * b} + ${a * c} = ${answer}.`,
  };
}

function generateMentalMathStrategies(level) {
  const strategies = [
    { q: 'Add 99 to 250', a: 349, exp: 'Add 100, then subtract 1: 250 + 100 - 1 = 349.' },
    { q: 'Double 35', a: 70, exp: 'Double means multiply by 2: 35 × 2 = 70.' },
    { q: '25 × 4', a: 100, exp: '25 × 4 = 100 (quarter times 4 = 1 dollar).' },
  ];
  
  const problem = strategies[Math.floor(Math.random() * strategies.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: generateOptions(problem.a),
    explanation: problem.exp,
  };
}

function generatePowersOf10(level) {
  const ranges = { easy: { max: 100 }, medium: { max: 1000 }, hard: { max: 10000 } };
  const range = ranges[level] || ranges.easy;
  const num = randInt(1, range.max);
  const power = [10, 100, 1000][Math.floor(Math.random() * 3)];
  const answer = num * power;
  
  return {
    question: `${num} × ${power} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${num} × ${power} = ${answer}. (Move decimal point ${Math.log10(power)} places right)`,
  };
}

function generateMultiples(level) {
  const base = randInt(2, 12);
  const count = randInt(5, 10);
  const answer = base * count;
  
  return {
    question: `What is the ${count}th multiple of ${base}?`,
    answer,
    options: generateOptions(answer),
    explanation: `${base} × ${count} = ${answer}.`,
  };
}

function generateDivisibilityRules(level) {
  const rules = [
    { num: randInt(2, 50) * 2, div: 2, rule: 'even number' },
    { num: randInt(1, 33) * 3, div: 3, rule: 'digits sum to multiple of 3' },
    { num: randInt(1, 20) * 5, div: 5, rule: 'ends in 0 or 5' },
  ];
  
  const problem = rules[Math.floor(Math.random() * rules.length)];
  const answer = 'Yes';
  
  return {
    question: `Is ${problem.num} divisible by ${problem.div}?`,
    answer,
    options: ['Yes', 'No'],
    explanation: `Yes, ${problem.num} is divisible by ${problem.div} (${problem.rule}).`,
  };
}

// ============================================================================
// MISSING ADVANCED GENERATORS (15 functions)
// ============================================================================

function generateGCF(level) {
  const num1 = randInt(4, 24);
  const num2 = randInt(4, 24);
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const answer = gcd(num1, num2);
  
  return {
    question: `What is the GCF (Greatest Common Factor) of ${num1} and ${num2}?`,
    answer,
    options: generateOptions(answer),
    explanation: `GCF of ${num1} and ${num2} is ${answer}.`,
  };
}

function generateLCM(level) {
  const num1 = randInt(2, 12);
  const num2 = randInt(2, 12);
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const answer = (num1 * num2) / gcd(num1, num2);
  
  return {
    question: `What is the LCM (Least Common Multiple) of ${num1} and ${num2}?`,
    answer,
    options: generateOptions(answer),
    explanation: `LCM of ${num1} and ${num2} is ${answer}.`,
  };
}

function generatePrimeFactorization(level) {
  const composites = [12, 18, 20, 24, 30, 36, 40, 48];
  const num = composites[Math.floor(Math.random() * composites.length)];
  
  const factorizations = {
    12: '2 × 2 × 3',
    18: '2 × 3 × 3',
    20: '2 × 2 × 5',
    24: '2 × 2 × 2 × 3',
    30: '2 × 3 × 5',
    36: '2 × 2 × 3 × 3',
    40: '2 × 2 × 2 × 5',
    48: '2 × 2 × 2 × 2 × 3',
  };
  
  const answer = factorizations[num];
  
  return {
    question: `Prime factorization of ${num}:`,
    answer,
    options: [answer, '2 × 5', '3 × 3', '2 × 3 × 4'],
    explanation: `${num} = ${answer}.`,
  };
}

function generateFractionsEquivalent(level) {
  const denominator = randInt(2, 12);
  const numerator = randInt(1, denominator - 1);
  const multiplier = randInt(2, 4);
  const answer = `${numerator * multiplier}/${denominator * multiplier}`;
  
  return {
    question: `What fraction is equivalent to ${numerator}/${denominator}?`,
    answer,
    options: [answer, `${numerator + 1}/${denominator + 1}`, `${numerator * 2}/${denominator * 3}`, `${numerator}/${denominator * 2}`],
    explanation: generateStepByStepExplanation({ operation: 'fractionEquivalent', operands: [numerator, denominator, multiplier], correct: answer }),
  };
}

function generateFractionsSimplify(level) {
  const denominator = randInt(4, 20);
  const numerator = randInt(2, denominator - 1);
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(numerator, denominator);
  const answer = divisor > 1 ? `${numerator / divisor}/${denominator / divisor}` : `${numerator}/${denominator}`;
  
  return {
    question: `Simplify ${numerator}/${denominator}:`,
    answer,
    options: [answer, `${numerator - 1}/${denominator - 1}`, `${numerator}/${denominator + 1}`, '1/2'],
    explanation: generateStepByStepExplanation({ operation: 'fractionSimplify', operands: [numerator, denominator, divisor], correct: answer }),
  };
}

function generateFractionsCompare(level) {
  const denom1 = randInt(2, 10);
  const denom2 = randInt(2, 10);
  const num1 = randInt(1, denom1 - 1);
  const num2 = randInt(1, denom2 - 1);
  const val1 = num1 / denom1;
  const val2 = num2 / denom2;
  const answer = val1 > val2 ? '>' : val1 < val2 ? '<' : '=';
  
  return {
    question: `${num1}/${denom1} ___ ${num2}/${denom2}. Which symbol?`,
    answer,
    options: ['>', '<', '='],
    explanation: generateStepByStepExplanation({ operation: 'fractionCompare', operands: [num1, denom1, num2, denom2], correct: answer }),
  };
}

function generateFractionsAddSubtract(level) {
  const denominator = randInt(2, 12);
  const num1 = randInt(1, denominator - 1);
  const num2 = randInt(1, denominator - num1);
  const operation = Math.random() < 0.5 ? '+' : '-';
  const answer = operation === '+' ? `${num1 + num2}/${denominator}` : `${num1 - num2}/${denominator}`;
  
  return {
    question: `${num1}/${denominator} ${operation} ${num2}/${denominator} = ?`,
    answer,
    options: [answer, `${num1}/${num2}`, `${num1 + num2}/${denominator * 2}`, `1/${denominator}`],
    explanation: generateStepByStepExplanation({ operation: 'fractionAddSubtract', operands: [num1, num2, denominator, operation], correct: answer }),
  };
}

function generateFractionsMultiplyDivide(level) {
  const num1 = randInt(1, 5);
  const denom1 = randInt(2, 8);
  const num2 = randInt(1, 5);
  const denom2 = randInt(2, 8);
  const operation = Math.random() < 0.5 ? '×' : '÷';
  const answer = operation === '×' 
    ? `${num1 * num2}/${denom1 * denom2}`
    : `${num1 * denom2}/${denom1 * num2}`;
  
  return {
    question: `${num1}/${denom1} ${operation} ${num2}/${denom2} = ?`,
    answer,
    options: [answer, `${num1}/${denom1}`, `${num2}/${denom2}`, '1/2'],
    explanation: generateStepByStepExplanation({ operation: 'fractionMultiplyDivide', operands: [num1, denom1, num2, denom2, operation], correct: answer }),
  };
}

function generateMixedNumbers(level) {
  const whole = randInt(1, 5);
  const numerator = randInt(1, 7);
  const denominator = randInt(numerator + 1, 12);
  const improper = whole * denominator + numerator;
  const answer = `${improper}/${denominator}`;
  
  return {
    question: `Convert mixed number ${whole} ${numerator}/${denominator} to improper fraction:`,
    answer,
    options: [answer, `${whole + numerator}/${denominator}`, `${numerator}/${denominator}`, `${improper}/${whole}`],
    explanation: `${whole} × ${denominator} + ${numerator} = ${improper}. Answer: ${answer}.`,
  };
}

function generateDecimalsPlaceValue(level) {
  const decimal = toFixedRandom(1, 99, 2);
  const parts = decimal.toString().split('.');
  const tenths = parts[1] ? parseInt(parts[1][0]) : 0;
  const hundredths = parts[1] && parts[1][1] ? parseInt(parts[1][1]) : 0;
  
  const questions = [
    { q: `In ${decimal}, what is the tenths digit?`, a: tenths },
    { q: `In ${decimal}, what is the hundredths digit?`, a: hundredths },
  ];
  
  const problem = questions[Math.floor(Math.random() * questions.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: generateOptions(problem.a),
    explanation: `In ${decimal}, tenths = ${tenths}, hundredths = ${hundredths}.`,
  };
}

function generateDecimalsCompare(level) {
  const num1 = toFixedRandom(1, 100, 2);
  const num2 = toFixedRandom(1, 100, 2);
  const answer = num1 > num2 ? '>' : num1 < num2 ? '<' : '=';
  
  return {
    question: `${num1} ___ ${num2}. Which symbol?`,
    answer,
    options: ['>', '<', '='],
    explanation: `${num1} ${answer} ${num2}.`,
  };
}

function generateDecimalsOperations(level) {
  const num1 = toFixedRandom(1, 50, 1);
  const num2 = toFixedRandom(1, 50, 1);
  const operations = ['+', '-', '×', '÷'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  
  let answer;
  if (op === '+') answer = toFixedRandom(num1 + num2, num1 + num2, 1);
  else if (op === '-') answer = toFixedRandom(Math.abs(num1 - num2), Math.abs(num1 - num2), 1);
  else if (op === '×') answer = toFixedRandom(num1 * num2, num1 * num2, 1);
  else answer = toFixedRandom(num1 / num2, num1 / num2, 2);
  
  return {
    question: `${num1} ${op} ${num2} = ?`,
    answer,
    options: generateOptions(answer, 1),
    explanation: `${num1} ${op} ${num2} = ${answer}.`,
  };
}

function generatePercentOfNumber(level) {
  const percent = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)];
  const num = randInt(20, 200);
  const answer = Math.round(num * (percent / 100));
  
  return {
    question: `What is ${percent}% of ${num}?`,
    answer,
    options: generateOptions(answer),
    explanation: `${percent}% of ${num} = ${num} × ${percent / 100} = ${answer}.`,
  };
}

function generatePercentIncreaseDecrease(level) {
  const original = randInt(50, 200);
  const percent = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
  const type = Math.random() < 0.5 ? 'increase' : 'decrease';
  const change = Math.round(original * (percent / 100));
  const answer = type === 'increase' ? original + change : original - change;
  
  return {
    question: `${original} ${type}d by ${percent}% = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${type === 'increase' ? 'Add' : 'Subtract'} ${change}: ${answer}.`,
  };
}

function generateAbsoluteValue(level) {
  const num = randInt(-50, 50);
  const answer = Math.abs(num);
  
  return {
    question: `|${num}| = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `Absolute value of ${num} is ${answer}.`,
  };
}

function generateScientificNotation(level) {
  const coefficient = toFixedRandom(1, 9.99, 2);
  const exponent = randInt(2, 6);
  const answer = coefficient * Math.pow(10, exponent);
  
  return {
    question: `${coefficient} × 10^${exponent} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `${coefficient} × 10^${exponent} = ${answer}.`,
  };
}

// ============================================================================
// MISSING APPLIED MATH GENERATORS (20 functions)
// ============================================================================

function generateWordProblemsAddition(level) {
  const num1 = randInt(5, 50);
  const num2 = randInt(5, 50);
  const answer = num1 + num2;
  
  const stories = [
    `Sarah has ${num1} apples. Her friend gives her ${num2} more. How many apples does Sarah have now?`,
    `There are ${num1} students in Class A and ${num2} students in Class B. How many students in total?`,
  ];
  
  return {
    question: stories[Math.floor(Math.random() * stories.length)],
    answer,
    options: generateOptions(answer),
    explanation: `${num1} + ${num2} = ${answer}.`,
  };
}

function generateWordProblemsSubtraction(level) {
  const num1 = randInt(20, 100);
  const num2 = randInt(5, num1);
  const answer = num1 - num2;
  
  const stories = [
    `John had ${num1} candies. He gave away ${num2}. How many does he have left?`,
    `A library had ${num1} books. ${num2} were checked out. How many remain?`,
  ];
  
  return {
    question: stories[Math.floor(Math.random() * stories.length)],
    answer,
    options: generateOptions(answer),
    explanation: `${num1} - ${num2} = ${answer}.`,
  };
}

function generateWordProblemsMultiplication(level) {
  const num1 = randInt(3, 12);
  const num2 = randInt(3, 12);
  const answer = num1 * num2;
  
  const stories = [
    `Each box contains ${num1} toys. If you have ${num2} boxes, how many toys in total?`,
    `A classroom has ${num2} rows with ${num1} desks in each row. How many desks total?`,
  ];
  
  return {
    question: stories[Math.floor(Math.random() * stories.length)],
    answer,
    options: generateOptions(answer),
    explanation: `${num1} × ${num2} = ${answer}.`,
  };
}

function generateWordProblemsMultiStep(level) {
  const price = randInt(5, 15);
  const quantity = randInt(3, 8);
  const payment = (price * quantity) + randInt(10, 50);
  const change = payment - (price * quantity);
  
  return {
    question: `Books cost $${price} each. You buy ${quantity} books and pay with $${payment}. How much change do you get?`,
    answer: change,
    options: generateOptions(change),
    explanation: `Cost: ${price} × ${quantity} = $${price * quantity}. Change: ${payment} - ${price * quantity} = $${change}.`,
  };
}

function generateMoneyCounting(level) {
  const quarters = randInt(0, 4);
  const dimes = randInt(0, 5);
  const nickels = randInt(0, 4);
  const pennies = randInt(0, 4);
  const answer = quarters * 25 + dimes * 10 + nickels * 5 + pennies;
  
  return {
    question: `${quarters} quarters, ${dimes} dimes, ${nickels} nickels, ${pennies} pennies = ? cents`,
    answer,
    options: generateOptions(answer),
    explanation: `${quarters}×25 + ${dimes}×10 + ${nickels}×5 + ${pennies}×1 = ${answer} cents.`,
  };
}

function generateMoneyChange(level) {
  const cost = randInt(50, 400);
  const paid = [100, 500, 1000][Math.floor(Math.random() * 3)];
  const answer = paid - cost;
  
  return {
    question: `Item costs $${(cost / 100).toFixed(2)}. You pay $${(paid / 100).toFixed(2)}. Change?`,
    answer: answer / 100,
    options: generateOptions(answer / 100, 2),
    explanation: `$${(paid / 100).toFixed(2)} - $${(cost / 100).toFixed(2)} = $${(answer / 100).toFixed(2)}.`,
  };
}

function generateMoneyDecimals(level) {
  const dollars = randInt(1, 50);
  const cents = randInt(0, 99);
  const price = dollars + cents / 100;
  const quantity = randInt(2, 5);
  const answer = toFixedRandom(price * quantity, price * quantity, 2);
  
  return {
    question: `Each item costs $${price.toFixed(2)}. Cost of ${quantity} items?`,
    answer,
    options: generateOptions(answer, 2),
    explanation: `$${price.toFixed(2)} × ${quantity} = $${answer}.`,
  };
}

function generateTimeTelling(level) {
  const hour = randInt(1, 12);
  const minute = randInt(0, 59);
  const minuteStr = minute < 10 ? `0${minute}` : `${minute}`;
  const answer = `${hour}:${minuteStr}`;
  
  return {
    question: `What time is shown: ${hour}:${minuteStr}?`,
    answer,
    options: [answer, `${hour}:${minute + 5}`, `${hour + 1}:${minute}`, '12:00'],
    explanation: `The time is ${answer}.`,
  };
}

function generateTimeElapsed(level) {
  const startHour = randInt(1, 11);
  const duration = randInt(1, 5);
  const endHour = startHour + duration;
  const answer = duration;
  
  return {
    question: `Event starts at ${startHour}:00 and ends at ${endHour}:00. How many hours elapsed?`,
    answer,
    options: generateOptions(answer),
    explanation: `${endHour} - ${startHour} = ${answer} hours.`,
  };
}

function generateTimeCalendar(level) {
  const problems = [
    { q: 'How many days in a week?', a: 7, opts: [5, 6, 7, 8] },
    { q: 'How many months in a year?', a: 12, opts: [10, 11, 12, 13] },
    { q: 'How many days in April?', a: 30, opts: [28, 29, 30, 31] },
  ];
  
  const problem = problems[Math.floor(Math.random() * problems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: `Answer: ${problem.a}.`,
  };
}

function generateMeasurementLength(level) {
  const feet = randInt(1, 10);
  const inches = feet * 12;
  
  const questions = [
    { q: `How many inches in ${feet} feet?`, a: inches, exp: `${feet} feet × 12 = ${inches} inches.` },
    { q: `${inches} inches = ? feet`, a: feet, exp: `${inches} ÷ 12 = ${feet} feet.` },
  ];
  
  const problem = questions[Math.floor(Math.random() * questions.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: generateOptions(problem.a),
    explanation: problem.exp,
  };
}

function generateMeasurementMetric(level) {
  const meters = randInt(1, 10);
  const centimeters = meters * 100;
  
  const questions = [
    { q: `How many centimeters in ${meters} meters?`, a: centimeters, exp: `${meters} m × 100 = ${centimeters} cm.` },
    { q: `${centimeters} cm = ? meters`, a: meters, exp: `${centimeters} ÷ 100 = ${meters} m.` },
  ];
  
  const problem = questions[Math.floor(Math.random() * questions.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: generateOptions(problem.a),
    explanation: problem.exp,
  };
}

function generateMeasurementConversions(level) {
  const conversions = [
    { q: '1 gallon = ? quarts', a: 4, opts: [2, 3, 4, 5] },
    { q: '1 pound = ? ounces', a: 16, opts: [12, 14, 16, 18] },
    { q: '1 mile = ? feet', a: 5280, opts: [5000, 5280, 5500, 6000] },
  ];
  
  const problem = conversions[Math.floor(Math.random() * conversions.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: `Answer: ${problem.a}.`,
  };
}

function generateTemperature(level) {
  const fahrenheit = randInt(32, 100);
  const celsius = Math.round((fahrenheit - 32) * 5 / 9);
  
  const questions = [
    { q: `${fahrenheit}°F = ? °C (rounded)`, a: celsius, exp: `(${fahrenheit} - 32) × 5/9 = ${celsius}°C.` },
    { q: 'Water freezes at ? °F', a: 32, opts: [0, 32, 100, 212], exp: 'Water freezes at 32°F.' },
  ];
  
  const problem = questions[Math.floor(Math.random() * questions.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts || generateOptions(problem.a),
    explanation: problem.exp,
  };
}

function generateGeometryShapes(level) {
  const shapes = [
    { q: 'How many sides does a triangle have?', a: 3, opts: [2, 3, 4, 5] },
    { q: 'How many sides does a square have?', a: 4, opts: [3, 4, 5, 6] },
    { q: 'How many sides does a hexagon have?', a: 6, opts: [4, 5, 6, 8] },
  ];
  
  const problem = shapes[Math.floor(Math.random() * shapes.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: `Answer: ${problem.a} sides.`,
  };
}

function generateGeometry3D(level) {
  const shapes = [
    { q: 'How many faces does a cube have?', a: 6, opts: [4, 6, 8, 12] },
    { q: 'How many edges does a cube have?', a: 12, opts: [6, 8, 10, 12] },
    { q: 'A sphere has how many flat faces?', a: 0, opts: [0, 1, 2, 3] },
  ];
  
  const problem = shapes[Math.floor(Math.random() * shapes.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: `Answer: ${problem.a}.`,
  };
}

function generateVolume(level) {
  const length = randInt(2, 10);
  const width = randInt(2, 10);
  const height = randInt(2, 10);
  const answer = length * width * height;
  
  return {
    question: `Volume of box: ${length}×${width}×${height} = ?`,
    answer,
    options: generateOptions(answer),
    explanation: `V = l × w × h = ${length} × ${width} × ${height} = ${answer}.`,
  };
}

function generateSurfaceArea(level) {
  const side = randInt(2, 10);
  const answer = 6 * side * side;
  
  return {
    question: `Surface area of cube with side ${side}?`,
    answer,
    options: generateOptions(answer),
    explanation: `SA = 6 × s² = 6 × ${side}² = ${answer}.`,
  };
}

function generateCircles(level) {
  const radius = randInt(3, 15);
  const diameter = radius * 2;
  const circumference = toFixedRandom(2 * Math.PI * radius, 2 * Math.PI * radius, 2);
  
  const questions = [
    { q: `Circle radius ${radius}. Diameter?`, a: diameter, exp: `d = 2r = 2 × ${radius} = ${diameter}.` },
    { q: `Circle radius ${radius}. Circumference? (use π ≈ 3.14)`, a: circumference, exp: `C = 2πr ≈ ${circumference}.` },
  ];
  
  const problem = questions[Math.floor(Math.random() * questions.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: generateOptions(problem.a, typeof problem.a === 'number' && problem.a !== diameter ? 2 : 0),
    explanation: problem.exp,
  };
}

function generatePythagorean(level) {
  const a = randInt(3, 12);
  const b = randInt(3, 12);
  const c = Math.sqrt(a * a + b * b);
  const answer = toFixedRandom(c, c, 1);
  
  return {
    question: `Right triangle: a = ${a}, b = ${b}. Find c (hypotenuse):`,
    answer,
    options: generateOptions(answer, 1),
    explanation: `c² = a² + b² = ${a}² + ${b}² = ${a * a + b * b}. c = ${answer}.`,
  };
}

// ============================================================================
// MISSING ALGEBRA GENERATORS (6 functions)
// ============================================================================

function generateInequalities(level) {
  const x = randInt(5, 50);
  const offset = randInt(1, 10);
  const boundary = x + offset;
  const answer = `x < ${boundary}`;
  
  return {
    question: `Solve: x + ${offset} < ${boundary}`,
    answer,
    options: [answer, `x > ${boundary}`, `x = ${boundary}`, `x < ${offset}`],
    explanation: `Subtract ${offset} from both sides: x < ${boundary - offset}. So ${answer}.`,
  };
}

function generateExpressions(level) {
  const x = randInt(2, 10);
  const coefficient = randInt(2, 5);
  const constant = randInt(1, 20);
  const answer = coefficient * x + constant;
  
  return {
    question: `Evaluate ${coefficient}x + ${constant} when x = ${x}`,
    answer,
    options: generateOptions(answer),
    explanation: `${coefficient}(${x}) + ${constant} = ${coefficient * x} + ${constant} = ${answer}.`,
  };
}

function generateSystemsEquations(level) {
  // Simple system: x + y = sum, x - y = diff
  const x = randInt(5, 20);
  const y = randInt(2, 15);
  const sum = x + y;
  const diff = x - y;
  
  return {
    question: `Solve system: x + y = ${sum}, x - y = ${diff}. Find x:`,
    answer: x,
    options: generateOptions(x),
    explanation: `Add equations: 2x = ${sum + diff}, x = ${x}. Then y = ${y}.`,
  };
}

function generatePolynomials(level) {
  const a = randInt(2, 5);
  const b = randInt(2, 5);
  const c = randInt(1, 10);
  const answer = `${a + b}x + ${c}`;
  
  return {
    question: `Simplify: ${a}x + ${b}x + ${c}`,
    answer,
    options: [answer, `${a * b}x + ${c}`, `${a}x + ${c}`, `${a + b + c}x`],
    explanation: `Combine like terms: (${a} + ${b})x + ${c} = ${answer}.`,
  };
}

function generateFactoring(level) {
  const a = randInt(2, 6);
  const b = randInt(2, 6);
  const product = a * b;
  const sum = a + b;
  const answer = `(x + ${a})(x + ${b})`;
  
  return {
    question: `Factor: x² + ${sum}x + ${product}`,
    answer,
    options: [answer, `(x + ${a})²`, `(x + ${product})(x + 1)`, `x(x + ${sum})`],
    explanation: `Find factors of ${product} that add to ${sum}: ${a} and ${b}. ${answer}.`,
  };
}

function generateQuadratic(level) {
  const a = randInt(1, 3);
  const b = randInt(-10, 10);
  const c = randInt(-10, 10);
  const discriminant = b * b - 4 * a * c;
  const x1 = (-b + Math.sqrt(Math.abs(discriminant))) / (2 * a);
  const answer = toFixedRandom(x1, x1, 2);
  
  return {
    question: `Solve ${a}x² + ${b}x + ${c} = 0 (one solution):`,
    answer,
    options: generateOptions(answer, 2),
    explanation: `Use quadratic formula: x ≈ ${answer}.`,
  };
}

// ============================================================================
// MISSING CHALLENGE GENERATORS (3 functions)
// ============================================================================

function generateSpeedChallenge(level) {
  // Reuse existing fast mental math generator
  return generateMentalMath(level);
}

function generateLogicPuzzles(level) {
  const puzzles = [
    { q: 'If all cats are animals and some animals are pets, are all cats pets?', a: 'No', opts: ['Yes', 'No', 'Maybe'], exp: 'Not all animals are pets, so not all cats are pets.' },
    { q: 'Pattern: 2, 4, 8, 16, ?', a: 32, opts: [24, 28, 32, 36], exp: 'Each doubles: 16 × 2 = 32.' },
    { q: 'If A > B and B > C, then:', a: 'A > C', opts: ['A < C', 'A = C', 'A > C'], exp: 'Transitive property: A > C.' },
  ];
  
  const problem = puzzles[Math.floor(Math.random() * puzzles.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

function generateCompetitionMath(level) {
  const problems = [
    { q: 'Sum of first 10 positive integers?', a: 55, opts: [45, 50, 55, 60], exp: '1+2+3+...+10 = 55.' },
    { q: 'Product of 25 × 24?', a: 600, opts: [500, 550, 600, 650], exp: '25 × 24 = 600.' },
    { q: 'If n² = 144, n = ?', a: 12, opts: [10, 11, 12, 13], exp: '√144 = 12.' },
  ];
  
  const problem = problems[Math.floor(Math.random() * problems.length)];
  
  return {
    question: problem.q,
    answer: problem.a,
    options: problem.opts,
    explanation: problem.exp,
  };
}

// Helpers
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toFixedRandom(min, max, decimals) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateOptions(correctAnswer, decimals = 0) {
  const options = [correctAnswer];
  const magnitude = Math.max(Math.abs(Number(correctAnswer)) || 1, 5);
  const range = magnitude * 0.3;
  
  let guard = 0;
  while (options.length < 4 && guard < 200) {
    guard++;
    const offset = (Math.random() * range * 2 - range);
    let wrongAnswer;
    if (typeof correctAnswer === 'number') {
      wrongAnswer = correctAnswer + offset;
      wrongAnswer = decimals > 0 ? parseFloat(wrongAnswer.toFixed(decimals)) : Math.round(wrongAnswer);
    } else {
      // For non-numeric answers, generate simple numeric distractors around length or fallback
      wrongAnswer = Math.round(Math.random() * magnitude);
    }
    if (!options.includes(wrongAnswer) && wrongAnswer !== correctAnswer) {
      options.push(wrongAnswer);
    }
  }
  
  return shuffle(options);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
