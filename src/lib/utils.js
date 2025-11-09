import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 

/**
 * Converts mathematical text to speech-friendly text
 * Replaces math symbols with their spoken equivalents
 * @param {string} text - The text containing math symbols
 * @returns {string} - Text with symbols replaced for proper speech synthesis
 */
export function mathToSpeech(text) {
  if (!text || typeof text !== 'string') return text;
  
  // Create a copy to work with
  let speechText = text;
  
  // Replace math symbols with spoken words
  // Order matters - replace longer patterns first
  const replacements = [
    // Division symbols
    { pattern: /\s*÷\s*/g, spoken: ' divided by ' },
    { pattern: /\s*\/\s*/g, spoken: ' divided by ' },
    
    // Multiplication symbols
    { pattern: /\s*×\s*/g, spoken: ' times ' },
    { pattern: /\s*⋅\s*/g, spoken: ' times ' },
    { pattern: /\s*·\s*/g, spoken: ' times ' },
    { pattern: /\s*\*\s*/g, spoken: ' times ' },
    
    // Addition
    { pattern: /\s*\+\s*/g, spoken: ' plus ' },
    
    // Subtraction (be careful not to confuse with negative numbers or ranges)
    // Only replace minus signs that have spaces or digits on both sides
    { pattern: /(\d+)\s*-\s*(\d+)/g, spoken: '$1 minus $2' },
    
    // Equals
    { pattern: /\s*=\s*/g, spoken: ' equals ' },
    
    // Greater than / Less than
    { pattern: /\s*>\s*/g, spoken: ' is greater than ' },
    { pattern: /\s*<\s*/g, spoken: ' is less than ' },
    { pattern: /\s*≥\s*/g, spoken: ' is greater than or equal to ' },
    { pattern: /\s*≤\s*/g, spoken: ' is less than or equal to ' },
    
    // Fractions (basic pattern like "1/2" spoken as "1 half" or "one over two")
    { pattern: /(\d+)\/(\d+)/g, spoken: '$1 over $2' },
    
    // Percentage
    { pattern: /%/g, spoken: ' percent' },
    
    // Exponents (if using ^ notation)
    { pattern: /\^(\d+)/g, spoken: ' to the power of $1' },
    
    // Square root (if using √)
    { pattern: /√(\d+)/g, spoken: 'square root of $1' },
  ];
  
  // Apply all replacements
  replacements.forEach(({ pattern, spoken }) => {
    speechText = speechText.replace(pattern, spoken);
  });
  
  // Clean up multiple spaces
  speechText = speechText.replace(/\s+/g, ' ').trim();
  
  return speechText;
}