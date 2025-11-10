import React, { useRef } from "react";

let voicesCache = {};
let cacheVersion = null;

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

function getVoice(lang = "en-US", preferChild = true, options = {}) {
  const {
    useSavedPrefs = true,
    langPrefOverride, // 'en' | 'es'
    voiceNameOverride,
  } = options;

  // Bust cache if preferences changed (only relevant when using saved preferences)
  try {
    const v = localStorage.getItem('tts.cacheBuster');
    if (useSavedPrefs && v && v !== cacheVersion) {
      voicesCache = {};
      cacheVersion = v;
    }
  } catch {}

  const voices = window.speechSynthesis.getVoices();

  // Resolve effective preferences
  let effectiveLangPref = 'en';
  let effectiveName = 'David';
  try {
    if (useSavedPrefs) {
      effectiveLangPref = (localStorage.getItem('tts.lang') === 'es') ? 'es' : 'en';
      effectiveName = localStorage.getItem('tts.voiceName') || 'David';
    } else {
      effectiveLangPref = (langPrefOverride === 'es') ? 'es' : 'en';
      effectiveName = voiceNameOverride || 'David';
    }
  } catch {
    // ignore and keep defaults
  }

  const cacheMode = useSavedPrefs ? 'saved' : 'override';
  const cacheKey = `${cacheMode}:${effectiveLangPref}:${effectiveName}`;
  if (voicesCache[cacheKey]) return voicesCache[cacheKey];

  if (voices && voices.length) {
    // Filter by language first
    let candidates = voices.filter(v => (v.lang || '').toLowerCase().startsWith(effectiveLangPref));
    
    // Look for the requested voice name (David or Emma)
    // Search by partial name match (case-insensitive) to handle variants like "Microsoft David Desktop", "Google UK English Male", etc.
    const nameLower = effectiveName.toLowerCase();
    let voice = candidates.find(v => v.name.toLowerCase().includes(nameLower));
    
    if (voice) {
      voicesCache[cacheKey] = voice;
      return voice;
    }

    // If David not found, try common male voice names
    if (nameLower === 'david') {
      const maleNames = ['david', 'male', 'guy', 'man', 'diego', 'juan', 'george', 'mark'];
      voice = candidates.find(v => maleNames.some(n => v.name.toLowerCase().includes(n)));
      if (voice) {
        voicesCache[cacheKey] = voice;
        return voice;
      }
    }

    // If Emma not found, try common female voice names
    if (nameLower === 'emma') {
      const femaleNames = ['emma', 'female', 'woman', 'girl', 'zira', 'jenny', 'olivia', 'sonia', 'ana', 'isabella', 'sara', 'sofia', 'monica', 'paulina'];
      voice = candidates.find(v => femaleNames.some(n => v.name.toLowerCase().includes(n)));
      if (voice) {
        voicesCache[cacheKey] = voice;
        return voice;
      }
    }

    // Fallback: pick first available voice in the language
    if (candidates[0]) {
      voicesCache[cacheKey] = candidates[0];
      return candidates[0];
    }
  }

  // Ultimate fallback: system default
  return voices.find(v => v.default) || voices[0];
}

export default function TextToSpeech({
  text,
  lang = "en-US",
  style = "button",
  label = "🔊 Listen",
  pitch = 1.1,
  rate = 0.9,
  // New: control whether to use saved prefs or on-the-fly overrides (useful for Settings preview)
  useSavedPrefs = true,
  overrideLangPref, // 'en' | 'es'
  overrideVoiceName, // 'David' | 'Emma'
}) {
  const utterRef = useRef(null);

  const speak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();

    // Force voices to load if not yet loaded (Chrome/Edge workaround)
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      // Voices not loaded yet; trigger load and retry
      window.speechSynthesis.getVoices();
      setTimeout(() => speak(), 100);
      return;
    }

    const utter = new window.SpeechSynthesisUtterance(text);
    // Resolve language preference (English default, Spanish optional)
    try {
      const langPref = useSavedPrefs
        ? ((localStorage.getItem('tts.lang') === 'es') ? 'es' : 'en')
        : ((overrideLangPref === 'es') ? 'es' : 'en');
      utter.lang = (langPref === 'es') ? 'es-ES' : 'en-US';
    } catch {
      utter.lang = lang;
    }
    // Apply pitch and rate
    try {
      if (useSavedPrefs) {
        const savedPitch = parseFloat(localStorage.getItem('tts.pitch'));
        const savedRate = parseFloat(localStorage.getItem('tts.rate'));
        utter.pitch = Number.isNaN(savedPitch) ? pitch : Math.min(2, Math.max(0, savedPitch));
        utter.rate = Number.isNaN(savedRate) ? rate : Math.min(2, Math.max(0.1, savedRate));
      } else {
        utter.pitch = Math.min(2, Math.max(0, pitch));
        utter.rate = Math.min(2, Math.max(0.1, rate));
      }
    } catch {
      utter.pitch = Math.min(2, Math.max(0, pitch));
      utter.rate = Math.min(2, Math.max(0.1, rate));
    }
    // Resolve voice selection with ability to override from the caller
    utter.voice = getVoice(utter.lang, true, {
      useSavedPrefs,
      langPrefOverride: overrideLangPref,
      voiceNameOverride: overrideVoiceName,
    });
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
