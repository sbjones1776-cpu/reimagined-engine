// Centralized step-by-step explanation generator for all math games
// Usage: generateStepByStepExplanation({ operation, operands, correct, user })

export function generateStepByStepExplanation({ operation, operands, correct, user }) {
  const [num1, num2] = operands;
  let explanation = `**📍 WHERE DID I GO WRONG?**\n`;
  if (user !== undefined) {
    explanation += `You got ${user}, but the correct answer is ${correct}. Let's figure out why and learn from it!\n\n`;
  }
  explanation += `**✨ LET'S SOLVE IT STEP-BY-STEP!**\n\n`;
  if (operation === 'addition') {
    explanation += `1️⃣ Set up the problem: ${num1} + ${num2}\n`;
    explanation += `2️⃣ Add the ones place: ${num1 % 10} + ${num2 % 10} = ${(num1 % 10) + (num2 % 10)}\n`;
    if ((num1 % 10) + (num2 % 10) >= 10) {
      explanation += `3️⃣ That's ${(num1 % 10) + (num2 % 10)}, so we carry the 1!\n`;
    }
    explanation += `4️⃣ Add the tens place: ${Math.floor(num1 / 10)} + ${Math.floor(num2 / 10)} ${(num1 % 10) + (num2 % 10) >= 10 ? '+ 1 (carried)' : ''}\n`;
    explanation += `5️⃣ Final answer: **${correct}** ✓\n\n`;
  } else if (operation === 'subtraction') {
    explanation += `1️⃣ Set up the problem: ${num1} - ${num2}\n`;
    explanation += `2️⃣ Start with the ones place\n`;
    if (num1 % 10 < num2 % 10) {
      explanation += `3️⃣ We need to borrow from the tens place!\n`;
    }
    explanation += `4️⃣ Subtract: ${num1} - ${num2}\n`;
    explanation += `5️⃣ Final answer: **${correct}** ✓\n\n`;
  } else if (operation === 'multiplication') {
    explanation += `1️⃣ Think: ${num1} groups of ${num2}\n`;
    explanation += `2️⃣ Or: ${num1} × ${num2}\n`;
    if (num1 > 10 || num2 > 10) {
      explanation += `3️⃣ Break it down: (${Math.floor(num1 / 10) * 10} + ${num1 % 10}) × ${num2}\n`;
    }
    explanation += `4️⃣ Calculate: ${num1} × ${num2} = ${correct}\n`;
    explanation += `5️⃣ Final answer: **${correct}** ✓\n\n`;
  } else if (operation === 'division') {
    explanation += `1️⃣ How many ${num2}s fit into ${num1}?\n`;
    explanation += `2️⃣ Count by ${num2}s until you reach ${num1}\n`;
    explanation += `3️⃣ Check: ${correct} × ${num2} = ${num1}\n`;
    explanation += `4️⃣ Final answer: **${correct}** ✓\n\n`;
  } else {
    explanation += `Solve step by step to find the answer.\n`;
  }
  explanation += `**🎯 THE RIGHT ANSWER**\n`;
  explanation += `${num1} ${operationSymbol(operation)} ${num2} = **${correct}** 🎉\n\n`;
  explanation += `**💡 QUICK TIP TO REMEMBER**\n`;
  if (operation === 'addition') {
    explanation += `Always start with the ones place and work your way left. Don't forget to carry!\n\n`;
  } else if (operation === 'subtraction') {
    explanation += `If the top number is smaller, remember to borrow from the next column!\n\n`;
  } else if (operation === 'multiplication') {
    explanation += `Break big numbers into smaller parts to make multiplication easier!\n\n`;
  } else if (operation === 'division') {
    explanation += `Division is the opposite of multiplication - think about groups!\n\n`;
  } else {
    explanation += `Practice helps you get better every time!\n\n`;
  }
  explanation += `**🏃 PRACTICE HELPS!**\n`;
  explanation += `The more you practice ${operation}, the easier it gets. You're doing great! Keep going! 💪`;
  return explanation;
}

function operationSymbol(op) {
  if (op === 'addition') return '+';
  if (op === 'subtraction') return '-';
  if (op === 'multiplication') return '×';
  if (op === 'division') return '÷';
  return '';
}
