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
// Minimal number-to-words (0-999) for EN/ES
function numToWordsEn(n) {
  const ones = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? '-' + ones[n%10] : '');
  if (n < 1000) {
    const rest = n % 100;
    const head = ones[Math.floor(n/100)] + ' hundred';
    if (!rest) return head;
    return head + ' ' + numToWordsEn(rest);
  }
  return String(n);
}

function numToWordsEs(n) {
  const ones = ['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve'];
  const tens = ['','','veinte','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];
  if (n < 20) return ones[n];
  if (n < 30) return (n === 20) ? 'veinte' : 'veinti' + ones[n-20];
  if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' y ' + ones[n%10] : '');
  if (n < 200) return 'ciento' + (n%100 ? ' ' + numToWordsEs(n%100) : '');
  if (n < 1000) {
    const centenas = ['cero','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];
    const head = centenas[Math.floor(n/100)];
    const rest = n % 100;
    return head + (rest ? ' ' + numToWordsEs(rest) : '');
  }
  return String(n);
}

export function mathToSpeech(text, options = {}) {
  if (!text || typeof text !== 'string') return text;
  const {
    numberToWords = 'auto', // 'none' | 'auto' | 'all'
    language: optLang,      // 'en' | 'es'
    pauseOperators = true,
  } = options;
  let langPref = 'en';
  try {
    langPref = (optLang || (localStorage.getItem('tts.lang') === 'es' ? 'es' : 'en')) || 'en';
  } catch {}
  
  // Create a copy to work with
  let speechText = text;
  
  // Normalize some unicode math symbols first
  speechText = speechText
    .replace(/−/g, '-') // unicode minus to hyphen-minus
    .replace(/·|⋅/g, '×'); // normalize dot multiplication to × for later handling

  // Replace math symbols with spoken words
  // Order matters - replace longer patterns first
  const fractionWordsEn = {
    '2': 'half',
    '3': 'third',
    '4': 'fourth',
    '5': 'fifth',
    '6': 'sixth',
    '7': 'seventh',
    '8': 'eighth',
    '9': 'ninth',
    '10': 'tenth',
    '12': 'twelfth',
  };
  const fractionWordsEs = {
    '2': 'medios',
    '3': 'tercios',
    '4': 'cuartos',
    '5': 'quintos',
    '6': 'sextos',
    '7': 'séptimos',
    '8': 'octavos',
    '9': 'novenos',
    '10': 'décimos',
    '12': 'duodécimos',
  };
  const replacements = [
    // Division symbols
    { pattern: /\s*÷\s*/g, spoken: langPref === 'es' ? ' dividido entre ' : ' divided by ' },
    { pattern: /\s*\/\s*/g, spoken: langPref === 'es' ? ' dividido entre ' : ' divided by ' },
    
    // Multiplication symbols
    { pattern: /\s*×\s*/g, spoken: langPref === 'es' ? ' por ' : ' times ' },
    { pattern: /\s*\*\s*/g, spoken: ' times ' },
    // Letter 'x' used as multiply between numbers
    { pattern: /(\d+)\s*[xX]\s*(\d+)/g, spoken: langPref === 'es' ? '$1 por $2' : '$1 times $2' },
    
    // Addition
    { pattern: /\s*\+\s*/g, spoken: langPref === 'es' ? ' más ' : ' plus ' },
    
    // Subtraction (be careful not to confuse with negative numbers or ranges)
    // Only replace minus signs that have spaces or digits on both sides
    { pattern: /(\d+)\s*-\s*(\d+)/g, spoken: langPref === 'es' ? '$1 menos $2' : '$1 minus $2' },
    
    // Equals
    { pattern: /\s*=\s*/g, spoken: langPref === 'es' ? ' igual a ' : ' equals ' },
    
    // Greater than / Less than
    { pattern: /\s*>\s*/g, spoken: langPref === 'es' ? ' es mayor que ' : ' is greater than ' },
    { pattern: /\s*<\s*/g, spoken: langPref === 'es' ? ' es menor que ' : ' is less than ' },
    { pattern: /\s*≥\s*/g, spoken: langPref === 'es' ? ' es mayor o igual que ' : ' is greater than or equal to ' },
    { pattern: /\s*≤\s*/g, spoken: langPref === 'es' ? ' es menor o igual que ' : ' is less than or equal to ' },
    
    // Fractions (replace with natural language if possible)
    { pattern: /(\d+)\/(\d+)/g, spoken: (m, num, denom) => {
      if (langPref === 'es') {
        return `${num} ${fractionWordsEs[denom] || 'sobre ' + denom}`;
      } else {
        // Plural for numerator > 1
        if (fractionWordsEn[denom]) {
          return `${num === '1' ? 'one' : numToWordsEn(Number(num))} ${fractionWordsEn[denom]}${num !== '1' ? 's' : ''}`;
        }
        return `${num} over ${denom}`;
      }
    } },
    
    // Percentage
    { pattern: /%/g, spoken: langPref === 'es' ? ' por ciento' : ' percent' },
    
    // Exponents (if using ^ notation)
    { pattern: /\^(\d+)/g, spoken: langPref === 'es' ? ' a la potencia de $1' : ' to the power of $1' },
    
    // Square root (if using √)
    { pattern: /√(\d+)/g, spoken: langPref === 'es' ? 'raíz cuadrada de $1' : 'square root of $1' },
  ];
  
  // Apply all replacements
  replacements.forEach(({ pattern, spoken }) => {
    speechText = speechText.replace(pattern, spoken);
  });

  // Decimals: read "." between digits as "point" / "coma"
  speechText = speechText.replace(/(\d)\.(\d)/g, langPref === 'es' ? '$1 coma $2' : '$1 point $2');

  // Skip placeholders like '?' or '_' while keeping list structure clean
  // Example: "3, 4, ?, 6" -> "3, 4, 6"  |  "5 + _ = 9" -> "5 plus equals 9"
  speechText = speechText.replace(/\s*(,)?\s*(\?+|_+)\s*(,)?\s*/g, (_m, leftComma, _tok, rightComma) => {
    if (leftComma && rightComma) return ', ';
    return ' ';
  });

  // If the text ends with a question mark (typical for math prompts), drop it
  speechText = speechText.replace(/\?\s*$/g, '');

  // Optional: add light pauses after operators using commas
  if (pauseOperators) {
    const opComma = langPref === 'es'
      ? [ ' más ', ' menos ', ' por ', ' dividido entre ', ' igual a ' ]
      : [ ' plus ', ' minus ', ' times ', ' divided by ', ' equals ' ];
    opComma.forEach(op => {
      const re = new RegExp(op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?!,)', 'g');
      speechText = speechText.replace(re, op + ', ');
    });
  }

  // Number-to-words
  if (numberToWords !== 'none') {
    const toWords = langPref === 'es' ? numToWordsEs : numToWordsEn;
    // Replace standalone integers (avoid parts of words)
    speechText = speechText.replace(/\b\d+\b/g, (m, offset) => {
      const n = parseInt(m, 10);
      if (!Number.isFinite(n)) return m;
      if (numberToWords === 'all') return toWords(n);
      // auto: convert small numbers or items in comma lists
      const small = n <= 20;
      const prev = speechText[offset - 1] || '';
      const next = speechText[offset + m.length] || '';
      const inList = prev === ',' || next === ',';
      return (small || inList) ? toWords(n) : m;
    });
  }
  
  // Clean up multiple spaces
  speechText = speechText
    .replace(/\s+,/g, ',')
    .replace(/,\s*,/g, ', ')
    .replace(/\s+/g, ' ')
    .replace(/\s+,\s*$/g, '')
    .trim();
  
  return speechText;
}