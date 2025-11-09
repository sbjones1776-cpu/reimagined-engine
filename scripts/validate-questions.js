/**
 * Simple validation script to exercise question generators
 * Runs multiple samples per operation/level and reports anomalies:
 *  - Missing answer in options
 *  - NaN answers
 *  - Duplicate options
 *  - Option count not 2-6
 */
import { generateQuestion } from '../src/components/game/QuestionGenerator.js';

const operations = [
  'addition','subtraction','multiplication','division','counting','number_comparison','place_value','patterns','rounding',
  'factors_multiples','prime_composite','fractions','decimals','percentages','ratios','order_operations','integers','exponents',
  'word_problems','money','time','measurement','geometry','area_perimeter','angles','coordinates','data_graphs','probability',
  'basic_algebra','equations','mixed','mental_math'
];

const levels = ['easy','medium','hard'];

function validate() {
  const issues = [];
  for (const op of operations) {
    for (const level of levels) {
      for (let i = 0; i < 15; i++) { // sample size per level
        let q;
        try {
          q = generateQuestion(op, level);
        } catch (e) {
          issues.push({ op, level, type: 'exception', message: e.message });
          continue;
        }
        if (!q) {
          issues.push({ op, level, type: 'null', message: 'Generator returned null/undefined' });
          continue;
        }
        const { question, answer, options } = q;
        if (typeof question !== 'string' || question.trim().length === 0) {
          issues.push({ op, level, type: 'bad-question', question });
        }
        if (answer === undefined || Number.isNaN(answer)) {
          issues.push({ op, level, type: 'bad-answer', question, answer });
        }
        if (!Array.isArray(options)) {
          issues.push({ op, level, type: 'no-options', question });
        } else {
          if (options.length < 2 || options.length > 6) {
            issues.push({ op, level, type: 'option-count', count: options.length, question });
          }
          const dupes = options.filter((v, idx) => options.indexOf(v) !== idx);
          if (dupes.length) {
            issues.push({ op, level, type: 'duplicate-options', dupes, question });
          }
          // Some generators use index-based answers (number_comparison etc.)
          if (!options.includes(answer) && typeof answer === 'number' && !q.optionsDisplay) {
            issues.push({ op, level, type: 'missing-answer', answer, options, question });
          }
        }
      }
    }
  }
  return issues;
}

const issues = validate();
if (issues.length === 0) {
  console.log('✅ No issues detected in sampled questions.');
} else {
  console.log(`⚠️ Detected ${issues.length} potential issues:`);
  for (const issue of issues.slice(0, 50)) { // cap output
    console.log(issue);
  }
  if (issues.length > 50) console.log(`... and ${issues.length - 50} more.`);
  process.exitCode = 1;
}