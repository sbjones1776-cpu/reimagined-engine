import React, { useRef } from "react";

const voicesCache = {};

function getVoice(lang = "en-US", preferChild = true) {
  if (voicesCache[lang]) return voicesCache[lang];
  const voices = window.speechSynthesis.getVoices();
  let voice = voices.find(v => v.lang === lang && (!preferChild || v.name.toLowerCase().includes("child")));
  if (!voice) voice = voices.find(v => v.lang === lang);
  voicesCache[lang] = voice;
  return voice;
}

export default function TextToSpeech({ text, lang = "en-US", style = "button", label = "🔊 Listen", pitch = 1.1, rate = 0.9 }) {
  const utterRef = useRef(null);

  const speak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.pitch = pitch;
    utter.rate = rate;
    utter.voice = getVoice(lang);
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
  };

  let display;
  if (style === "badge") {
    display = (
      <span onClick={speak} onDoubleClick={stop} className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded cursor-pointer select-none" title="Click to read aloud, double-click to stop">{label}</span>
    );
  } else if (style === "icon") {
    display = (
      <span onClick={speak} onDoubleClick={stop} className="cursor-pointer" title="Click to read aloud, double-click to stop" role="img" aria-label="Read aloud">🔊</span>
    );
  } else {
    display = (
      <button type="button" onClick={speak} onDoubleClick={stop} aria-label="Read aloud" className="px-3 py-2 rounded bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold">
        {label}
      </button>
    );
  }

  return display;
}
