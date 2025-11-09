import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TextToSpeech from "@/components/ui/TextToSpeech";
import { mathToSpeech } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, BookOpen, Sparkles, ChevronRight, Brain, AlertCircle, XCircle, CheckCircle } from "lucide-react";
// import { base44 } from "@/api/base44Client";

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
      
      // TODO: Implement Firebase LLM integration
      console.log('🤖 AI hints are currently being migrated to Firebase.');
      
      // Use fallback hint immediately
      const fallbackHint = `Let's think about ${question} together! Try breaking it down into smaller steps. ${
        operation === 'addition' ? 'Add the ones first, then the tens.' :
        operation === 'subtraction' ? 'Remember to borrow if you need to!' :
        operation === 'multiplication' ? 'Think about groups of the same number.' :
        'Think about dividing into equal groups!'
      } You can do this! 💪`;
      
      setHint(fallbackHint);
      setShowHint(true);
      
      // TODO: Save tutor session to Firebase
      console.log('Tutor session (placeholder):', {
        question,
        correct_answer: correctAnswer,
        user_answer: userAnswer,
        operation,
        level,
        hint_requested: true,
        hint_text: fallbackHint,
      });
      
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
      
      // TODO: Implement Firebase LLM integration
      console.log('🤖 AI explanations are currently being migrated to Firebase.');
      
      // Use fallback explanation immediately
      const fallbackExplanation = generateFallbackExplanation(question, correctAnswer, userAnswer, operation);
      setExplanation(fallbackExplanation);
      setShowExplanation(true);
      
      // TODO: Save tutor session to Firebase
      console.log('Tutor session (placeholder):', {
        question,
        correct_answer: correctAnswer,
        user_answer: userAnswer,
        operation,
        level,
        explanation_viewed: true,
        explanation_text: fallbackExplanation,
      });
      
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
                    <TextToSpeech text={mathToSpeech(question)} style="icon" label="Read question" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Your answer:
                  </span>
                  <Badge variant="outline" className="bg-red-100 border-red-300 text-red-700 text-lg flex items-center gap-2">
                    {userAnswer}
                    <TextToSpeech text={mathToSpeech(userAnswer?.toString())} style="icon" label="Read your answer" />
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Correct answer:
                  </span>
                  <Badge className="bg-green-500 text-white text-lg flex items-center gap-2">
                    {correctAnswer}
                    <TextToSpeech text={mathToSpeech(correctAnswer?.toString())} style="icon" label="Read correct answer" />
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
                      <TextToSpeech text={mathToSpeech(hint)} style="icon" label="Read hint" />
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
                              <TextToSpeech text={mathToSpeech(section.replace(/\*\*/g, ''))} style="button" label="Read solution section" />
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
