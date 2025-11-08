import React, { useRef } from "react";

const voicesCache = {};

function detectGender(name = "") {
  const n = name.toLowerCase();
  const femaleKeys = [
    'female','woman','girl','aria','zira','jenny','jessa','olivia','emma','sonia','ana','isabella','libby','mia','sara','sofia','sofia','sofia', 'francesca'
  ];
  const maleKeys = [
    'male','man','boy','guy','david','mark','ryan','tony','diego','francisco','sebastian','pablo','miguel','matthew','mike','george'
  ];
  if (femaleKeys.some(k => n.includes(k))) return 'female';
  if (maleKeys.some(k => n.includes(k))) return 'male';
  return 'any';
}

function getVoice(lang = "en-US", preferChild = true) {
  if (voicesCache[lang]) return voicesCache[lang];
  const voices = window.speechSynthesis.getVoices();
  // Try user-selected voice first
  try {
    const savedURI = localStorage.getItem('tts.voiceURI');
    const savedName = localStorage.getItem('tts.voiceName');
    const savedLangPref = localStorage.getItem('tts.lang'); // 'en' | 'es'
    const savedGenderPref = localStorage.getItem('tts.gender'); // 'any' | 'female' | 'male'
    if (voices && voices.length) {
      if (savedURI) {
        const v = voices.find(v => v.voiceURI === savedURI);
        if (v) {
          voicesCache[lang] = v;
          return v;
        }
      }
      if (savedName) {
        const v = voices.find(v => v.name === savedName);
        if (v) {
          voicesCache[lang] = v;
          return v;
        }
      }
      // If no specific voice saved or found, choose based on language and gender preference
      const langPrefix = (savedLangPref === 'es') ? 'es' : 'en';
      let candidates = voices.filter(v => (v.lang || '').toLowerCase().startsWith(langPrefix));
      if (savedGenderPref === 'female') {
        candidates = candidates.filter(v => detectGender(v.name) === 'female');
      } else if (savedGenderPref === 'male') {
        candidates = candidates.filter(v => detectGender(v.name) === 'male');
      }
      const preferred = candidates.find(v => v.default) || candidates[0];
      if (preferred) {
        voicesCache[lang] = preferred;
        return preferred;
      }
    }
  } catch {}
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
    // Apply saved language override (English default, Spanish optional)
    try {
      const savedLangPref = localStorage.getItem('tts.lang'); // 'en' | 'es'
      if (savedLangPref === 'es') utter.lang = 'es-ES';
      else utter.lang = 'en-US';
    } catch {
      utter.lang = lang;
    }
    // Apply saved user preferences if available
    try {
      const savedPitch = parseFloat(localStorage.getItem('tts.pitch'));
      const savedRate = parseFloat(localStorage.getItem('tts.rate'));
      if (!Number.isNaN(savedPitch)) utter.pitch = savedPitch; else utter.pitch = pitch;
      if (!Number.isNaN(savedRate)) utter.rate = savedRate; else utter.rate = rate;
    } catch {
      utter.pitch = pitch;
      utter.rate = rate;
    }
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
