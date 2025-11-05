import React, { useState } from "react";
import TextToSpeech from "@/components/ui/TextToSpeech";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuestionCard({ question, onAnswer, questionNumber }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (answer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    setTimeout(() => {
      onAnswer(answer);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-4 border-purple-200 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="text-center">
            <p className="text-sm mb-2 opacity-90">Question {questionNumber}</p>
            <h2 className="text-5xl md:text-6xl font-bold flex items-center gap-2">
              {question.question}
              <TextToSpeech text={question.question} style="icon" label="Read question" />
            </h2>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => {
              const isCorrect = option === question.answer;
              const isSelected = selectedAnswer === option;
              let buttonClass = "text-2xl font-bold h-24 transition-all transform hover:scale-105";
              if (isAnswered && isSelected) {
                buttonClass += isCorrect 
                  ? " bg-green-500 text-white hover:bg-green-500 scale-110" 
                  : " bg-red-500 text-white hover:bg-red-500 shake";
              }
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className={buttonClass}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                  >
                    <span className="flex items-center gap-2">
                      {option}
                      <TextToSpeech text={option} style="icon" label={`Read answer option ${index + 1}`} />
                    </span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {/* Question summary TTS */}
      <div className="mt-4 flex items-center gap-2">
        <TextToSpeech text={`Question ${questionNumber}: ${question.question}. Possible answers are: ${question.options.join(', ')}.`} style="button" label="Read question summary" />
      </div>
    </motion.div>
  );
}