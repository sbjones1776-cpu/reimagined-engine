import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TextToSpeech from "@/components/ui/TextToSpeech";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, BookOpen, Sparkles, ChevronRight, Brain, AlertCircle, XCircle, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AITutor({ 
  question, 
  correctAnswer, 
  userAnswer, 
  operation,
  level,
  onContinue 
}) {
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hint, setHint] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateHint = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🤖 Generating hint for:', question);
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert elementary school math tutor who loves making math fun and easy to understand!

A student is working on: ${question}
- Their answer: ${userAnswer}
- Correct answer: ${correctAnswer}
- Math operation: ${operation}
- Difficulty level: ${level}

Create a friendly, encouraging hint (2-3 sentences) that:
- Guides them toward the RIGHT way to think about the problem
- Does NOT give away the answer directly
- Uses simple, clear language for kids
- Includes one emoji to make it friendly
- Focuses on the strategy or method, not the solution

Be encouraging and make them feel confident they can solve it!`,
      });
      
      console.log('📥 Hint result received:', result);
      console.log('📥 Result type:', typeof result);
      
      let hintText = '';
      
      if (typeof result === 'string') {
        hintText = result;
      } else if (result && typeof result === 'object') {
        hintText = result.output || result.response || result.text || result.content || JSON.stringify(result);
      }
      
      console.log('✅ Extracted hint text:', hintText);
      
      if (!hintText || hintText.trim() === '') {
        throw new Error('No hint text received from AI');
      }
      
      setHint(hintText);
      setShowHint(true);
      
      try {
        await base44.entities.TutorSession.create({
          question,
          correct_answer: correctAnswer,
          user_answer: userAnswer,
          operation,
          level,
          hint_requested: true,
          hint_text: hintText,
        });
      } catch (saveError) {
        console.error('Error saving tutor session:', saveError);
      }
      
    } catch (error) {
      console.error('❌ Error generating hint:', error);
      setError(error.message);
      
      const fallbackHint = `Let's think about ${question} together! Try breaking it down into smaller steps. ${
        operation === 'addition' ? 'Add the ones first, then the tens.' :
        operation === 'subtraction' ? 'Remember to borrow if you need to!' :
        operation === 'multiplication' ? 'Think about groups of the same number.' :
        'Think about dividing into equal groups!'
      } You can do this! 💪`;
      
      setHint(fallbackHint);
      setShowHint(true);
    }
    
    setLoading(false);
  };

  const generateExplanation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🤖 Generating explanation for:', question);
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert elementary school math tutor creating a detailed, step-by-step explanation!

PROBLEM: ${question}
STUDENT'S ANSWER: ${userAnswer}
CORRECT ANSWER: ${correctAnswer}
OPERATION: ${operation}
LEVEL: ${level}

Create a comprehensive, engaging explanation with these sections:

**📍 WHERE DID I GO WRONG?**
Explain in 1-2 sentences what mistake they likely made and why they got ${userAnswer} instead of ${correctAnswer}. Be kind and understanding - everyone makes mistakes!

**✨ LET'S SOLVE IT STEP-BY-STEP!**
Break down the solution into clear, numbered steps:
${operation === 'addition' ? `
1. Write the numbers one above the other, lining up the place values
2. Add the ones place first
3. If the sum is 10 or more, carry the 1 to the tens place
4. Add the tens place (including any carried number)
5. Write your final answer` : 
  operation === 'subtraction' ? `
1. Write the larger number on top, smaller on bottom
2. Start with the ones place
3. If the top number is smaller, borrow from the tens place
4. Subtract the ones place
5. Move to the tens place and subtract
6. Write your final answer` :
  operation === 'multiplication' ? `
1. Understand what ${question} means (groups of numbers)
2. Break down the problem if needed (like 12 = 10 + 2)
3. Multiply each part
4. Add the results together
5. Double-check your answer` :
  `1. Set up the division: ${question}
2. How many times does the divisor go into the dividend?
3. Multiply to check
4. Subtract to find remainder
5. Write your answer`}

**🎯 THE RIGHT ANSWER**
Show clearly that ${question} = ${correctAnswer}

**💡 QUICK TIP TO REMEMBER**
One practical tip or trick to help solve similar problems in the future.

**🏃 PRACTICE HELPS!**
One encouraging sentence about practicing this type of problem.

Use emojis throughout to make it fun and engaging! Keep language simple and encouraging for kids ages 7-12.`,
      });
      
      console.log('📥 Explanation result received:', result);
      console.log('📥 Result type:', typeof result);
      
      let explanationText = '';
      
      if (typeof result === 'string') {
        explanationText = result;
      } else if (result && typeof result === 'object') {
        explanationText = result.output || result.response || result.text || result.content || JSON.stringify(result);
      }
      
      console.log('✅ Extracted explanation text:', explanationText);
      
      if (!explanationText || explanationText.trim() === '') {
        throw new Error('No explanation text received from AI');
      }
      
      setExplanation(explanationText);
      setShowExplanation(true);
      
      try {
        await base44.entities.TutorSession.create({
          question,
          correct_answer: correctAnswer,
          user_answer: userAnswer,
          operation,
          level,
          explanation_viewed: true,
          explanation_text: explanationText,
        });
      } catch (saveError) {
        console.error('Error saving tutor session:', saveError);
      }
      
    } catch (error) {
      console.error('❌ Error generating explanation:', error);
      setError(error.message);
      
      // Enhanced fallback explanation
      const fallbackExplanation = generateFallbackExplanation(question, correctAnswer, userAnswer, operation);
      setExplanation(fallbackExplanation);
      setShowExplanation(true);
    }
    
    setLoading(false);
  };

  const generateFallbackExplanation = (q, correct, wrong, op) => {
    const parts = q.split(/[\+\-\×÷]/);
    const num1 = parseInt(parts[0]?.trim() || 0);
    const num2 = parseInt(parts[1]?.trim() || 0);

    let explanation = `**📍 WHERE DID I GO WRONG?**\n`;
    explanation += `You got ${wrong}, but the correct answer is ${correct}. Let's figure out why and learn from it!\n\n`;
    
    explanation += `**✨ LET'S SOLVE IT STEP-BY-STEP!**\n\n`;
    
    if (op === 'addition') {
      explanation += `1️⃣ Set up the problem: ${num1} + ${num2}\n`;
      explanation += `2️⃣ Add the ones place: ${num1 % 10} + ${num2 % 10} = ${(num1 % 10) + (num2 % 10)}\n`;
      if ((num1 % 10) + (num2 % 10) >= 10) {
        explanation += `3️⃣ That's ${(num1 % 10) + (num2 % 10)}, so we carry the 1!\n`;
      }
      explanation += `4️⃣ Add the tens place: ${Math.floor(num1 / 10)} + ${Math.floor(num2 / 10)} ${(num1 % 10) + (num2 % 10) >= 10 ? '+ 1 (carried)' : ''}\n`;
      explanation += `5️⃣ Final answer: **${correct}** ✓\n\n`;
    } else if (op === 'subtraction') {
      explanation += `1️⃣ Set up the problem: ${num1} - ${num2}\n`;
      explanation += `2️⃣ Start with the ones place\n`;
      if (num1 % 10 < num2 % 10) {
        explanation += `3️⃣ We need to borrow from the tens place!\n`;
      }
      explanation += `4️⃣ Subtract: ${num1} - ${num2}\n`;
      explanation += `5️⃣ Final answer: **${correct}** ✓\n\n`;
    } else if (op === 'multiplication') {
      explanation += `1️⃣ Think: ${num1} groups of ${num2}\n`;
      explanation += `2️⃣ Or: ${num1} × ${num2}\n`;
      if (num1 > 10 || num2 > 10) {
        explanation += `3️⃣ Break it down: (${Math.floor(num1 / 10) * 10} + ${num1 % 10}) × ${num2}\n`;
      }
      explanation += `4️⃣ Calculate: ${num1} × ${num2} = ${correct}\n`;
      explanation += `5️⃣ Final answer: **${correct}** ✓\n\n`;
    } else if (op === 'division') {
      explanation += `1️⃣ How many ${num2}s fit into ${num1}?\n`;
      explanation += `2️⃣ Count by ${num2}s until you reach ${num1}\n`;
      explanation += `3️⃣ Check: ${correct} × ${num2} = ${num1}\n`;
      explanation += `4️⃣ Final answer: **${correct}** ✓\n\n`;
    }
    
    explanation += `**🎯 THE RIGHT ANSWER**\n`;
    explanation += `${q} = **${correct}** 🎉\n\n`;
    
    explanation += `**💡 QUICK TIP TO REMEMBER**\n`;
    if (op === 'addition') {
      explanation += `Always start with the ones place and work your way left. Don't forget to carry!\n\n`;
    } else if (op === 'subtraction') {
      explanation += `If the top number is smaller, remember to borrow from the next column!\n\n`;
    } else if (op === 'multiplication') {
      explanation += `Break big numbers into smaller parts to make multiplication easier!\n\n`;
    } else {
      explanation += `Division is the opposite of multiplication - think about groups!\n\n`;
    }
    
    explanation += `**🏃 PRACTICE HELPS!**\n`;
    explanation += `The more you practice ${op}, the easier it gets. You're doing great! Keep going! 💪`;
    
    return explanation;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="max-w-2xl w-full border-4 border-blue-300 shadow-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>AI Math Tutor</span>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Powered by AI
                </Badge>
              </div>
              <p className="text-sm opacity-90 font-normal mt-1">
                Let's learn from this mistake together! 🌟
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Problem Overview */}
          <Alert className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200">
            <AlertDescription>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Question:</span>
                  <span className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {question}
                    <TextToSpeech text={question} style="icon" label="Read question" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Your answer:
                  </span>
                  <Badge variant="outline" className="bg-red-100 border-red-300 text-red-700 text-lg flex items-center gap-2">
                    {userAnswer}
                    <TextToSpeech text={userAnswer?.toString()} style="icon" label="Read your answer" />
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Correct answer:
                  </span>
                  <Badge className="bg-green-500 text-white text-lg flex items-center gap-2">
                    {correctAnswer}
                    <TextToSpeech text={correctAnswer?.toString()} style="icon" label="Read correct answer" />
                  </Badge>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Error Display */}
          {error && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Note:</strong> Using fallback explanation. {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Hint Section */}
          <div>
            {!showHint ? (
              <Button
                onClick={generateHint}
                disabled={loading}
                className="w-full h-16 text-lg bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full mr-2" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-6 h-6 mr-2" />
                    Get a Hint
                  </>
                )}
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      Hint
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {hint}
                      <TextToSpeech text={hint} style="icon" label="Read hint" />
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Explanation Section */}
          {showHint && (
            <div>
              {!showExplanation ? (
                <Button
                  onClick={generateExplanation}
                  disabled={loading}
                  className="w-full h-16 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Generating Explanation...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-6 h-6 mr-2" />
                      Show Step-by-Step Solution
                    </>
                  )}
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        Complete Solution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed space-y-3">
                          {explanation.split('\n\n').map((section, index) => (
                            <div key={index} className="mb-4">
                              <TextToSpeech text={section.replace(/\*\*/g, '')} style="button" label="Read solution section" />
                              {section.split('\n').map((line, lineIndex) => {
                                // Bold headers
                                if (line.startsWith('**') && line.endsWith('**')) {
                                  return (
                                    <h4 key={lineIndex} className="font-bold text-lg mb-2 text-purple-700">
                                      {line.replace(/\*\*/g, '')}
                                    </h4>
                                  );
                                }
                                // Numbered steps
                                if (/^\d+️⃣/.test(line)) {
                                  return (
                                    <div key={lineIndex} className="flex gap-3 mb-2 bg-white p-2 rounded-lg">
                                      <span className="text-blue-600 font-bold">{line}</span>
                                    </div>
                                  );
                                }
                                return line ? <p key={lineIndex} className="mb-2">{line}</p> : null;
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          )}

          {/* Encouragement Message */}
          <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <AlertDescription className="text-center">
              <div className="text-3xl mb-2">💪</div>
              <p className="font-medium text-gray-800">
                Mistakes help us learn! Keep practicing and you'll get better every day!
              </p>
            </AlertDescription>
          </Alert>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            I Understand! Continue
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}