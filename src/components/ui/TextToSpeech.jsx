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
    genderOverride,   // 'any' | 'female' | 'male'
    voiceURIOverride,
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
  let effectiveGender = 'any';
  let effectiveURI = '';
  let effectiveName = '';
  try {
    if (useSavedPrefs) {
      effectiveLangPref = (localStorage.getItem('tts.lang') === 'es') ? 'es' : 'en';
      effectiveGender = localStorage.getItem('tts.gender') || 'any';
      effectiveURI = localStorage.getItem('tts.voiceURI') || '';
      effectiveName = localStorage.getItem('tts.voiceName') || '';
    } else {
      effectiveLangPref = (langPrefOverride === 'es') ? 'es' : 'en';
      effectiveGender = genderOverride || 'any';
      effectiveURI = voiceURIOverride || '';
      effectiveName = voiceNameOverride || '';
    }
  } catch {
    // ignore and keep defaults
  }

  const cacheMode = useSavedPrefs ? 'saved' : 'override';
  const cacheKey = `${cacheMode}:${effectiveLangPref}:${effectiveGender}:${effectiveURI}:${effectiveName}`;
  if (voicesCache[cacheKey]) return voicesCache[cacheKey];

  if (voices && voices.length) {
    // 1) Exact voice by URI
    if (effectiveURI) {
      const v = voices.find(v => v.voiceURI === effectiveURI);
      if (v) {
        voicesCache[cacheKey] = v;
        return v;
      }
    }
    // 2) Exact voice by name
    if (effectiveName) {
      const v = voices.find(v => v.name === effectiveName);
      if (v) {
        voicesCache[cacheKey] = v;
        return v;
      }
    }
    // 3) Filter by language and gender
    let candidates = voices.filter(v => (v.lang || '').toLowerCase().startsWith(effectiveLangPref));
    if (effectiveGender === 'female') {
      candidates = candidates.filter(v => detectGender(v.name) === 'female');
    } else if (effectiveGender === 'male') {
      candidates = candidates.filter(v => detectGender(v.name) === 'male');
    }
    const preferred = candidates.find(v => v.default) || candidates[0];
    if (preferred) {
      voicesCache[cacheKey] = preferred;
      return preferred;
    }
  }

  // Fallback to original behavior using lang
  let voice = voices.find(v => v.lang === lang && (!preferChild || v.name.toLowerCase().includes("child")));
  if (!voice) voice = voices.find(v => v.lang === lang);
  return voice;
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
  overrideGender,   // 'any' | 'female' | 'male'
  overrideVoiceURI,
  overrideVoiceName,
}) {
  const utterRef = useRef(null);

  const speak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
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
      genderOverride: overrideGender,
      voiceURIOverride: overrideVoiceURI,
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
