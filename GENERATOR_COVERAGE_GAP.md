# Question Generator Coverage Gap Analysis

## Summary
- **Total Math Concepts in UI (Home.jsx):** 115
- **Implemented Generators (QuestionGenerator.js):** 34
- **Missing Generators:** 81 (70.4% gap)

## Implemented Generators (34)

### Basics (5/20)
- ✅ counting
- ✅ number_comparison
- ✅ place_value
- ✅ patterns
- ✅ rounding

### Core Operations (4/28)
- ✅ addition
- ✅ subtraction
- ✅ multiplication
- ✅ division

### Advanced (9/24)
- ✅ factors_multiples
- ✅ prime_composite
- ✅ fractions
- ✅ decimals
- ✅ percentages
- ✅ ratios
- ✅ order_operations
- ✅ integers
- ✅ exponents

### Applied Math (10/30)
- ✅ word_problems
- ✅ money
- ✅ time
- ✅ measurement
- ✅ geometry
- ✅ area_perimeter
- ✅ angles
- ✅ coordinates
- ✅ data_graphs
- ✅ probability

### Algebra (2/8)
- ✅ basic_algebra
- ✅ equations

### Challenge (2/5)
- ✅ mixed
- ✅ mental_math

---

## Missing Generators (81)

### Basics & Number Sense (15 missing)
- ❌ skip_counting_2s
- ❌ skip_counting_5s
- ❌ skip_counting_10s
- ❌ even_odd
- ❌ ordering_numbers
- ❌ place_value_thousands
- ❌ number_bonds
- ❌ fact_families
- ❌ estimation
- ❌ roman_numerals
- ❌ expanded_form
- ❌ standard_form
- ❌ word_form
- ❌ greater_less_symbols
- ❌ number_lines

### Core Operations (24 missing)
- ❌ addition_single_digit
- ❌ addition_double_digit
- ❌ addition_triple_digit
- ❌ addition_regrouping
- ❌ missing_addends
- ❌ subtraction_single_digit
- ❌ subtraction_double_digit
- ❌ subtraction_regrouping
- ❌ multiplication_tables_2_5
- ❌ multiplication_tables_3_4
- ❌ multiplication_tables_7_9
- ❌ multiplication_double_digit
- ❌ missing_factors
- ❌ division_basic
- ❌ division_remainders
- ❌ division_long
- ❌ properties_addition
- ❌ properties_multiplication
- ❌ distributive_property
- ❌ mental_math_strategies
- ❌ powers_of_10
- ❌ multiples
- ❌ divisibility_rules

### Advanced Concepts (15 missing)
- ❌ gcf (Greatest Common Factor)
- ❌ lcm (Least Common Multiple)
- ❌ prime_factorization
- ❌ fractions_equivalent
- ❌ fractions_simplify
- ❌ fractions_compare
- ❌ fractions_add_subtract
- ❌ fractions_multiply_divide
- ❌ mixed_numbers
- ❌ decimals_place_value
- ❌ decimals_compare
- ❌ decimals_operations
- ❌ percent_of_number
- ❌ percent_increase_decrease
- ❌ absolute_value
- ❌ scientific_notation

### Applied Math (20 missing)
- ❌ word_problems_addition
- ❌ word_problems_subtraction
- ❌ word_problems_multiplication
- ❌ word_problems_multi_step
- ❌ money_counting
- ❌ money_change
- ❌ money_decimals
- ❌ time_telling
- ❌ time_elapsed
- ❌ time_calendar
- ❌ measurement_length
- ❌ measurement_metric
- ❌ measurement_conversions
- ❌ temperature
- ❌ geometry_shapes
- ❌ geometry_3d
- ❌ volume
- ❌ surface_area
- ❌ circles
- ❌ pythagorean

### Algebra (6 missing)
- ❌ inequalities
- ❌ expressions
- ❌ systems_equations
- ❌ polynomials
- ❌ factoring
- ❌ quadratic

### Challenge Mode (3 missing)
- ❌ speed_challenge
- ❌ logic_puzzles
- ❌ competition_math

---

## Impact Analysis

### Current Behavior
All missing operations fall back to the `generateAddition` function:
```javascript
const generator = generators[operation] || generateAddition;
```

This means:
- 81 out of 115 math games (70.4%) show **addition problems** regardless of what game is selected
- Users selecting "Skip Counting by 2s" get addition problems
- Users selecting "Fractions - Equivalent" get addition problems
- Users selecting "Geometry 3D" get addition problems
- **This explains why "a bunch [of questions] are not correct"** - they're literally the wrong type

### User Experience Issues
1. **Misleading UI**: Home.jsx advertises 115 distinct math games
2. **Broken Promise**: Most games don't deliver the promised content
3. **Confusion**: Students select geometry but get arithmetic
4. **Invalid Progress Tracking**: Stars earned for addition when playing geometry

### Priority Recommendations

#### Phase 1: Core Variants (HIGH PRIORITY)
These are commonly used and extend existing generators:
- addition_single_digit, addition_double_digit, addition_triple_digit, addition_regrouping
- subtraction_single_digit, subtraction_double_digit, subtraction_regrouping
- multiplication_tables_2_5, multiplication_tables_3_4, multiplication_tables_7_9
- division_basic, division_remainders, division_long
- missing_addends, missing_factors

#### Phase 2: Basics Completion (MEDIUM PRIORITY)
Fill out foundational concepts for younger students:
- skip_counting_2s, skip_counting_5s, skip_counting_10s
- even_odd, ordering_numbers
- number_bonds, fact_families
- greater_less_symbols, number_lines

#### Phase 3: Advanced Math Specialization (MEDIUM PRIORITY)
Implement specialized fraction, decimal, geometry variants:
- fractions_equivalent, fractions_simplify, fractions_compare, fractions_add_subtract, fractions_multiply_divide
- decimals_place_value, decimals_compare, decimals_operations
- geometry_shapes, geometry_3d, volume, surface_area, circles, pythagorean

#### Phase 4: Applied & Algebra (LOWER PRIORITY)
Can leverage existing generators with context wrappers:
- word_problems_* (add story context to existing math)
- money_*, time_*, measurement_* (add units/context)
- Algebra operations (inequalities, expressions, systems, polynomials, factoring, quadratic)

---

## Validation Notes

### Schema Already Applied
All 34 implemented generators return questions with the new schema:
- ✅ id (unique timestamp + random)
- ✅ operation (enriched by wrapper)
- ✅ level (enriched by wrapper)
- ✅ tags (from OPERATION_METADATA)
- ✅ difficulty (1-10 scale)
- ✅ gradeLevel (from metadata)

### Testing Status
- 26 Vitest tests passing for implemented generators
- Validation script passes (0 issues in sampled questions)
- Missing generators need tests added after implementation

---

## Next Steps

1. **Prioritize Implementation**: Start with Phase 1 (core variants)
2. **Expand OPERATION_METADATA**: Add entries for all 81 missing operations
3. **Implement Generator Functions**: Create 81 new generator functions following established patterns
4. **Update `generators` Map**: Add all new functions to the lookup object
5. **Expand Test Coverage**: Add tests for each new generator
6. **Remove Fallback**: Once complete, change fallback behavior to throw error instead of defaulting to addition

---

## Metadata Requirement

Each new operation needs an entry in `OPERATION_METADATA`:

```javascript
operation_id: {
  category: "basics|core|advanced|applied|algebra|challenge",
  grades: ["K", "1", "2", ...],
  tags: ["counting", "arithmetic", "geometry", ...]
}
```

Currently only 48 operations have metadata entries. Need to add 67 more.

---

## Conclusion

Your instinct was correct - there are indeed 115 total math games advertised, but only 34 (29.6%) have actual implementations. The remaining 70.4% are falling back to basic addition, which explains the "not correct" feedback.

To fully "rebuild all questions throughout the math game," we need to implement the missing 81 generator functions.
