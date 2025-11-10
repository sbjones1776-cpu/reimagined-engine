import { describe, it, expect } from 'vitest';
import { generateQuestion } from '../QuestionGenerator.js';

// Core operations & selected advanced sets to verify
const OPERATIONS = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
  'fractions',
  'percentages'
];

const LEVELS = ['easy','medium','hard'];

function isNumeric(x) {
  return typeof x === 'number' && !Number.isNaN(x);
}

function runBasicAssertions(op, level, q) {
  expect(q).toBeTruthy();
  expect(typeof q.question).toBe('string');
  expect(q.question.length).toBeGreaterThan(2);
  expect(Array.isArray(q.options)).toBe(true);
  expect(q.options.length).toBeGreaterThanOrEqual(2);
  expect(q.options.length).toBeLessThanOrEqual(6);
  // Check duplicates
  const dupes = q.options.filter((v,i,a) => a.indexOf(v) !== i);
  expect(dupes.length).toBe(0);
  // Answer presence (for non-string fractional displays we still expect presence)
  if (typeof q.answer !== 'object') { // avoid future complex answers
    if (typeof q.answer === 'number' || typeof q.answer === 'string') {
      expect(q.options).toContainEqual(q.answer);
    }
  }
  expect(typeof q.explanation).toBe('string');
}

function rangeAssertions(op, level, q) {
  // Operation-specific numeric bounds (approximate): ensures level scaling direction
  if (op === 'addition' || op === 'subtraction') {
    if (level === 'easy') expect(Math.abs(q.answer)).toBeLessThanOrEqual(30);
    // For subtraction, depending on operands we can legitimately get small positives; keep only for addition
    if (op === 'addition' && level === 'hard') {
      expect(Math.abs(q.answer)).toBeGreaterThanOrEqual(10);
    }
  }
  if (op === 'multiplication') {
    if (level === 'easy') expect(q.answer).toBeLessThanOrEqual(100);
    if (level === 'hard') expect(q.answer).toBeGreaterThanOrEqual(36); // 6*6 minimum
  }
  if (op === 'division') {
    // Division answers should be positive integers in our current design
    expect(Number.isInteger(q.answer)).toBe(true);
    expect(q.answer).toBeGreaterThan(0);
  }
  if (op === 'fractions') {
    // Fraction answers can be numeric decimals; ensure not negative
    if (isNumeric(q.answer)) {
      expect(q.answer).toBeGreaterThanOrEqual(0);
    }
  }
  if (op === 'percentages') {
    // Percentages answers should be >=0 and plausible upper bound
    expect(q.answer).toBeGreaterThanOrEqual(0);
  }
}

describe('Question Generators - Core Correctness', () => {
  for (const op of OPERATIONS) {
    for (const level of LEVELS) {
      it(`generates valid ${op} question (${level})`, () => {
        const q = generateQuestion(op, level);
        runBasicAssertions(op, level, q);
        rangeAssertions(op, level, q);
      });
    }
  }
});

describe('Question Schema - Metadata Fields', () => {
  it('includes id, operation, level, tags, difficulty, gradeLevel', () => {
    const q = generateQuestion('addition', 'medium');
    expect(typeof q.id).toBe('string');
    expect(q.id).toMatch(/^q_\d+_[a-z0-9]+$/);
    expect(q.operation).toBe('addition');
    expect(q.level).toBe('medium');
    expect(Array.isArray(q.tags)).toBe(true);
    expect(q.tags.length).toBeGreaterThan(0);
    expect(typeof q.difficulty).toBe('number');
    expect(q.difficulty).toBeGreaterThanOrEqual(1);
    expect(q.difficulty).toBeLessThanOrEqual(10);
    expect(Array.isArray(q.gradeLevel)).toBe(true);
    expect(q.gradeLevel.length).toBeGreaterThan(0);
  });

  it('assigns correct difficulty scale', () => {
    const easy = generateQuestion('subtraction', 'easy');
    const hard = generateQuestion('subtraction', 'hard');
    expect(easy.difficulty).toBeLessThan(hard.difficulty);
  });

  it('tags include category and level', () => {
    const q = generateQuestion('fractions', 'medium');
    expect(q.tags).toContain('advanced');
    expect(q.tags).toContain('medium');
    expect(q.tags).toContain('fractions');
  });
});

describe('Question Generators - Sample Uniqueness', () => {
  it('produces varied addition questions', () => {
    const samples = new Set();
    for (let i = 0; i < 15; i++) {
      samples.add(generateQuestion('addition','easy').question);
    }
    expect(samples.size).toBeGreaterThan(5);
  });
});

describe('Question Generators - Division edge cases', () => {
  it('never produces division by zero', () => {
    for (let i = 0; i < 25; i++) {
      const q = generateQuestion('division','medium');
      expect(q.question.includes(' ÷ 0')).toBe(false);
    }
  });
});

describe('Question Generators - Options contain answer', () => {
  it('answer always inside options for sampled operations', () => {
    for (const op of OPERATIONS) {
      for (let i = 0; i < 10; i++) {
        const q = generateQuestion(op,'easy');
        expect(q.options).toContainEqual(q.answer);
      }
    }
  });
});

// NEW: Tests for newly implemented generators
describe('New Basics Generators', () => {
  it('counting generator places the correct missing number', () => {
    const q = generateQuestion('counting', 'easy');
    // Expect pattern: Count: a, a+1, ?, a+3
    const m = q.question.match(/Count:\s*(\d+),\s*(\d+),\s*\?,\s*(\d+)/);
    expect(m).not.toBeNull();
    const a = parseInt(m[1], 10);
    const a1 = parseInt(m[2], 10);
    const a3 = parseInt(m[3], 10);
    expect(a1).toBe(a + 1);
    expect(a3).toBe(a + 3);
    expect(q.answer).toBe(a + 2);
    expect(q.options).toContain(a + 2);
  });
  it('skip_counting_2s generates valid questions', () => {
    const q = generateQuestion('skip_counting_2s', 'easy');
    expect(q.question).toContain('Skip count by 2s');
    expect(typeof q.answer).toBe('number');
    expect(q.answer % 2).toBe(0);
  });

  it('even_odd generates valid questions', () => {
    const q = generateQuestion('even_odd', 'easy');
    expect(['Even', 'Odd']).toContain(q.answer);
    expect(q.options).toContain('Even');
    expect(q.options).toContain('Odd');
  });

  it('number_bonds generates valid questions', () => {
    const q = generateQuestion('number_bonds', 'easy');
    expect(q.question).toContain('+');
    expect(q.question).toContain('?');
    expect(typeof q.answer).toBe('number');
  });

  it('roman_numerals generates valid questions', () => {
    const q = generateQuestion('roman_numerals', 'easy');
    expect(typeof q.answer).toBe('number');
    expect(q.answer).toBeGreaterThan(0);
  });
});

describe('New Core Operations Generators', () => {
  it('addition_single_digit generates single digit problems', () => {
    for (let i = 0; i < 10; i++) {
      const q = generateQuestion('addition_single_digit', 'easy');
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThanOrEqual(18);
    }
  });

  it('multiplication_tables_2_5 generates 2s and 5s times tables', () => {
    const q = generateQuestion('multiplication_tables_2_5', 'easy');
    expect(q.question).toMatch(/[25] × \d+/);
  });

  it('division_remainders generates problems with remainders', () => {
    const q = generateQuestion('division_remainders', 'easy');
    expect(q.question).toContain('remainder');
    expect(typeof q.answer).toBe('string');
    expect(q.answer).toMatch(/\d+ R\d+/);
  });

  it('missing_addends generates missing addend problems', () => {
    const q = generateQuestion('missing_addends', 'easy');
    expect(q.question).toContain('?');
    expect(typeof q.answer).toBe('number');
  });
});

describe('New Advanced Generators', () => {
  it('gcf generates valid GCF problems', () => {
    const q = generateQuestion('gcf', 'easy');
    expect(q.question).toContain('GCF');
    expect(typeof q.answer).toBe('number');
    expect(q.answer).toBeGreaterThan(0);
  });

  it('fractions_equivalent generates equivalent fractions', () => {
    const q = generateQuestion('fractions_equivalent', 'easy');
    expect(q.question).toContain('equivalent');
    expect(typeof q.answer).toBe('string');
    expect(q.answer).toMatch(/\d+\/\d+/);
  });

  it('decimals_compare generates comparison questions', () => {
    const q = generateQuestion('decimals_compare', 'easy');
    expect(['>', '<', '=']).toContain(q.answer);
  });

  it('percent_of_number generates percentage calculations', () => {
    const q = generateQuestion('percent_of_number', 'easy');
    expect(q.question).toContain('%');
    expect(typeof q.answer).toBe('number');
  });

  it('absolute_value generates valid absolute value questions', () => {
    const q = generateQuestion('absolute_value', 'easy');
    expect(q.question).toContain('|');
    expect(q.answer).toBeGreaterThanOrEqual(0);
  });
});

describe('New Applied Math Generators', () => {
  it('word_problems_addition generates story problems', () => {
    const q = generateQuestion('word_problems_addition', 'easy');
    expect(q.question.length).toBeGreaterThan(20);
    expect(typeof q.answer).toBe('number');
  });

  it('money_counting generates coin counting problems', () => {
    const q = generateQuestion('money_counting', 'easy');
    expect(q.question).toMatch(/quarter|dime|nickel|penn/i);
    expect(typeof q.answer).toBe('number');
  });

  it('time_telling generates time reading questions', () => {
    const q = generateQuestion('time_telling', 'easy');
    expect(q.question).toContain('time');
    expect(typeof q.answer).toBe('string');
  });

  it('geometry_shapes generates shape questions', () => {
    const q = generateQuestion('geometry_shapes', 'easy');
    expect(q.question.length).toBeGreaterThan(5);
    expect(typeof q.answer).toBe('number');
  });

  it('volume generates volume calculations', () => {
    const q = generateQuestion('volume', 'easy');
    expect(q.question).toContain('Volume');
    expect(typeof q.answer).toBe('number');
  });
});

describe('New Algebra Generators', () => {
  it('inequalities generates inequality problems', () => {
    const q = generateQuestion('inequalities', 'easy');
    expect(q.question).toContain('<');
    expect(typeof q.answer).toBe('string');
    expect(q.answer).toMatch(/x [<>=]/);
  });

  it('expressions generates expression evaluation', () => {
    const q = generateQuestion('expressions', 'easy');
    expect(q.question).toContain('x');
    expect(typeof q.answer).toBe('number');
  });

  it('polynomials generates polynomial simplification', () => {
    const q = generateQuestion('polynomials', 'easy');
    expect(q.question).toContain('x');
    expect(typeof q.answer).toBe('string');
  });
});

describe('New Challenge Generators', () => {
  it('logic_puzzles generates logic questions', () => {
    const q = generateQuestion('logic_puzzles', 'easy');
    expect(q.question.length).toBeGreaterThan(10);
    expect(q.options.length).toBeGreaterThanOrEqual(2);
  });

  it('competition_math generates advanced problems', () => {
    const q = generateQuestion('competition_math', 'hard');
    expect(typeof q.answer).toBe('number');
    expect(q.difficulty).toBeGreaterThanOrEqual(5);
  });
});
