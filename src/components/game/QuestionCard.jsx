import React, { useState } from "react";
import TextToSpeech from "@/components/ui/TextToSpeech";
import { mathToSpeech } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuestionCard({ question, onAnswer, questionNumber }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const displayOptions = Array.isArray(question.optionsDisplay) && question.optionsDisplay.length === question.options.length
    ? question.optionsDisplay
    : question.options;

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
              <TextToSpeech text={mathToSpeech(question.question)} style="icon" label="Read question" />
            </h2>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => {
              const label = displayOptions[index];
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
                      {label}
                      <TextToSpeech text={mathToSpeech(String(label))} style="icon" label={`Read answer option ${index + 1}`} />
                    </span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {/* Question summary TTS */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => {
            const text = mathToSpeech(`Question ${questionNumber}: ${question.question}. Possible answers are: ${displayOptions.join(', ')}.`);
            if (!("speechSynthesis" in window)) {
              alert("Text-to-speech is not supported in this browser.");
              return;
            }
            window.speechSynthesis.cancel();
            
            const speakWithFemaleVoice = () => {
              const utterance = new window.SpeechSynthesisUtterance(text);
              try {
                const langPref = localStorage.getItem('tts.lang') === 'es' ? 'es' : 'en';
                utterance.lang = langPref === 'es' ? 'es-ES' : 'en-US';
                const savedRate = parseFloat(localStorage.getItem('tts.rate'));
                utterance.rate = isNaN(savedRate) ? 1.0 : Math.min(2, Math.max(0.1, savedRate));
                utterance.pitch = 1.2; // Higher pitch for more feminine sound
                
                // Get all available voices
                const voices = window.speechSynthesis.getVoices();
                console.log('Available voices:', voices.map(v => v.name));
                
                const langVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith(langPref));
                const femaleNames = ['emma', 'female', 'woman', 'girl', 'zira', 'jenny', 'olivia', 'sonia', 'ana', 'isabella', 'sara', 'sofia', 'monica', 'paulina', 'samantha', 'victoria', 'heera', 'veena'];
                const maleNames = ['david', 'male', 'man', 'boy', 'mark', 'james', 'richard', 'thomas', 'daniel', 'george', 'michael'];
                
                // Priority 1: Try to find Emma
                let voice = langVoices.find(v => v.name.toLowerCase().includes('emma'));
                console.log('Emma voice:', voice?.name);
                
                // Priority 2: Find any explicitly female voice
                if (!voice) {
                  voice = langVoices.find(v => femaleNames.some(n => v.name.toLowerCase().includes(n)));
                  console.log('Female voice found:', voice?.name);
                }
                
                // Priority 3: Filter out ALL male voices
                if (!voice) {
                  const nonMaleVoices = langVoices.filter(v => !maleNames.some(m => v.name.toLowerCase().includes(m)));
                  voice = nonMaleVoices[0];
                  console.log('Non-male voice:', voice?.name);
                }
                
                // Priority 4: Search ALL system voices (not just lang-filtered) for female
                if (!voice) {
                  voice = voices.find(v => femaleNames.some(n => v.name.toLowerCase().includes(n)));
                  console.log('Any female voice:', voice?.name);
                }
                
                if (voice) {
                  utterance.voice = voice;
                  console.log('Selected voice:', voice.name);
                } else {
                  console.warn('No female voice found, will use default');
                }
              } catch (e) {
                console.error('Voice selection error:', e);
                utterance.lang = 'en-US';
                utterance.rate = 1.0;
                utterance.pitch = 1.2;
              }
              window.speechSynthesis.speak(utterance);
            };
            
            // Ensure voices are loaded before speaking
            const voices = window.speechSynthesis.getVoices();
            if (voices.length === 0) {
              window.speechSynthesis.addEventListener('voiceschanged', speakWithFemaleVoice, { once: true });
            } else {
              speakWithFemaleVoice();
            }
          }}
          className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-4 border-green-300"
        >
          🔊 Read it to Me
        </button>
      </div>
    </motion.div>
  );
}