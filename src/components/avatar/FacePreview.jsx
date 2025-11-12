import React from "react";

// Mini-SVG preview component for face customization options
export default function FacePreview({ type, value, size = 32 }) {
  const renderEyes = (eyeType) => {
    const scale = size / 64;
    
    if (eyeType === 'wink') {
      return (
        <g transform={`scale(${scale})`}>
          <circle cx="20" cy="24" r="7" fill="#111827" />
          <circle cx="20" cy="23" r="3" fill="#ffffff" />
          <circle cx="21" cy="22" r="1.5" fill="#ffffff" opacity="0.6" />
          <path d="M38 24 Q 44 24 50 24" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    }
    if (eyeType === 'sleepy') {
      return (
        <g transform={`scale(${scale})`}>
          <path d="M14 24 Q 20 30 26 24" stroke="#111827" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M38 24 Q 44 30 50 24" stroke="#111827" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      );
    }
    // Round eyes (default)
    return (
      <g transform={`scale(${scale})`}>
        <circle cx="20" cy="24" r="7" fill="#111827" />
        <circle cx="20" cy="23" r="3" fill="#ffffff" />
        <circle cx="21" cy="22" r="1.5" fill="#ffffff" opacity="0.6" />
        <circle cx="44" cy="24" r="7" fill="#111827" />
        <circle cx="44" cy="23" r="3" fill="#ffffff" />
        <circle cx="45" cy="22" r="1.5" fill="#ffffff" opacity="0.6" />
      </g>
    );
  };

  const renderMouth = (mouthType) => {
    const scale = size / 64;
    
    if (mouthType === 'big_smile') {
      return (
        <g transform={`scale(${scale})`}>
          <path d="M18 42 Q 32 56 46 42" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M22 42 Q 32 52 42 42" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    }
    if (mouthType === 'open_smile') {
      return (
        <g transform={`scale(${scale})`}>
          <path d="M20 40 Q 32 56 44 40 Q 32 48 20 40 Z" fill="#ef4444" stroke="#111827" strokeWidth="2.5" />
        </g>
      );
    }
    if (mouthType === 'grin') {
      return (
        <g transform={`scale(${scale})`}>
          <path d="M18 44 Q 32 52 46 44" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M28 44 L 28 47" stroke="#111827" strokeWidth="1.5" />
          <path d="M36 44 L 36 47" stroke="#111827" strokeWidth="1.5" />
        </g>
      );
    }
    if (mouthType === 'tongue_out') {
      return (
        <g transform={`scale(${scale})`}>
          <path d="M20 42 Q 32 50 44 42" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M28 42 Q 32 52 36 42" fill="#f87171" stroke="#111827" strokeWidth="1.5" />
        </g>
      );
    }
    if (mouthType === 'neutral') {
      return (
        <g transform={`scale(${scale})`}>
          <path d="M22 44 L 42 44" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    }
    // Smile (default)
    return (
      <g transform={`scale(${scale})`}>
        <path d="M20 42 Q 32 50 44 42" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    );
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="inline-block">
      <circle cx={size/2} cy={size/2} r={size/2 - 1} fill="#FFE0BD" stroke="#e5e7eb" strokeWidth="1" />
      {type === 'eyes' ? renderEyes(value) : null}
      {type === 'mouth' ? renderMouth(value) : null}
      {type === 'face' ? (
        <>
          {renderEyes('normal')}
          {renderMouth(value)}
        </>
      ) : null}
    </svg>
  );
}
