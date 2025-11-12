
import React from "react";

export default function AvatarDisplay({ avatarData, size = "medium", showPet = false, petData = null }) {
  const sizes = {
    small: "w-16 h-16",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  const sizeClass = sizes[size] || sizes.medium;
  
  // Background gradients
  const backgrounds = {
    plain: "from-gray-100 to-gray-200",
    stars: "from-indigo-500 via-purple-500 to-pink-500",
    rainbow: "from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400",
    clouds: "from-sky-300 to-blue-400",
    space: "from-slate-900 via-purple-900 to-indigo-900",
    underwater: "from-cyan-500 to-blue-600",
    forest: "from-green-600 to-emerald-700",
    city: "from-gray-700 to-slate-800",
    beach: "from-yellow-300 to-orange-400",
  };

  // Skin tone colors
  const skinTones = {
    light: "#FFE0BD",
    medium: "#F4C89A",
    tan: "#D4A574",
    dark: "#8D5524",
  };

  // Hair color mapping
  const hairColors = {
    black: "#000000",
    brown: "#8B4513",
    blonde: "#FFD700",
    red: "#DC143C",
    blue: "#4169E1",
    pink: "#FF69B4",
    purple: "#9370DB",
    green: "#32CD32",
    orange: "#FF8C00",
    white: "#F5F5F5",
    rainbow: "linear-gradient(90deg, red, orange, yellow, green, blue, purple)",
  };

  // Clothing colors (varied for visual appeal)
  const shirtColors = {
    t_shirt_basic: "#6366f1",
    t_shirt_stripe: "#ef4444",
    polo: "#10b981",
    hoodie: "#8b5cf6",
    tank_top: "#f59e0b",
    sweater: "#ec4899",
    jersey: "#3b82f6",
    button_up: "#ffffff",
    graphic_tee: "#f97316",
  };

  const pantsColors = {
    jeans: "#1e40af",
    shorts: "#78716c",
    skirt: "#ec4899",
    dress_pants: "#374151",
    joggers: "#6b7280",
    overalls: "#3b82f6",
    leggings: "#0f172a",
    cargo_pants: "#854d0e",
  };

  const shoesColors = {
    sneakers: "#ffffff",
    boots: "#78350f",
    sandals: "#f59e0b",
    dress_shoes: "#000000",
    high_tops: "#ef4444",
    cleats: "#10b981",
    slippers: "#ec4899",
    bare_feet: skinTones[avatarData.avatar_skin_tone] || skinTones.medium,
  };

  // Map legacy eye/face ids to new kid-friendly drawing variants
  const mapEyes = (eye) => {
    switch (eye) {
      case 'normal':
      case 'happy':
        return 'round';
      case 'wink':
        return 'wink';
      case 'sleepy':
        return 'sleepy';
      // Less kid-friendly options map to round
      case 'cool':
      case 'angry':
      case 'surprised':
      case 'star':
      case 'heart':
      default:
        return 'round';
    }
  };

  const mapMouth = (face) => {
    switch (face) {
      case 'big_smile':
        return 'big_smile';
      case 'tongue_out':
        return 'tongue_out';
      case 'neutral':
        return 'neutral';
      case 'grin':
        return 'grin';
      case 'open_smile':
        return 'open_smile';
      // Legacy mapping
      case 'laughing':
        return 'big_smile';
      case 'determined':
        return 'smile';
      case 'smile':
      default:
        return 'smile';
    }
  };

  const getHairEmoji = (style) => {
    const styles = {
      short: "💇",
      long: "💁",
      curly: "🦱",
      spiky: "⚡",
      bald: "🧑‍🦲",
      ponytail: "🎀",
      braids: "🧵",
      afro: "🌀",
      mohawk: "🔥",
      bun: "🍔",
    };
    return styles[style] || styles.short;
  };

  const getHatEmoji = (hat) => {
    const hats = {
      none: "",
      baseball_cap: "🧢",
      beanie: "🎩",
      sun_hat: "🎩",
      wizard_hat: "🧙",
      party_hat: "🎉",
      graduation_cap: "🎓",
      crown: "👑",
      top_hat: "🎩",
      cowboy_hat: "🤠",
    };
    return hats[hat] || "";
  };

  const getGlassesEmoji = (glasses) => {
    const types = {
      none: "",
      regular: "👓",
      sunglasses: "😎",
      reading: "🤓",
      safety_goggles: "🥽",
      "3d_glasses": "🕶️",
      heart_shaped: "😍",
      star_shaped: "🤩",
    };
    return types[glasses] || "";
  };

  const getAccessoryEmoji = (accessory) => {
    const accessories = {
      none: "",
      backpack: "🎒",
      cape: "🦸",
      scarf: "🧣",
      bow_tie: "🎀",
      necklace: "📿",
      watch: "⌚",
      headphones: "🎧",
      earrings: "💎",
      bracelet: "📿",
    };
    return accessories[accessory] || "";
  };

  const bgGradient = backgrounds[avatarData.avatar_background] || backgrounds.plain;
  const skinColor = skinTones[avatarData.avatar_skin_tone] || skinTones.medium;
  const hairColor = hairColors[avatarData.avatar_hair_color] || hairColors.brown;
  const shirtColor = shirtColors[avatarData.avatar_shirt] || shirtColors.t_shirt_basic;
  const pantsColor = pantsColors[avatarData.avatar_pants] || pantsColors.jeans;
  const shoesColor = shoesColors[avatarData.avatar_shoes] || shoesColors.sneakers;

  return (
    <div className="relative inline-block">
      {/* Background */}
      <div className={`${sizeClass} rounded-full bg-gradient-to-br ${bgGradient} flex flex-col items-center justify-center overflow-hidden shadow-xl border-4 border-white relative`}>
        {/* Hat (if any) */}
        {avatarData.avatar_hat && avatarData.avatar_hat !== "none" && (
          <div className="absolute top-0 text-2xl">
            {getHatEmoji(avatarData.avatar_hat)}
          </div>
        )}

        {/* Hair */}
        <div 
          className="text-3xl mb-1" 
          style={avatarData.avatar_hair_color === "rainbow" ? 
            { background: hairColor, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } : 
            { color: hairColor }}
        >
          {getHairEmoji(avatarData.avatar_hair_style)}
        </div>

        {/* Face/Head with skin tone */}
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center relative"
          style={{ backgroundColor: skinColor }}
        >
          {/* Draw kid-friendly eyes + mouth with SVG for a cuter look (CHIBI style - bigger eyes!) */}
          <svg width="64" height="64" viewBox="0 0 64 64" className="absolute">
            {/* EYES - Enlarged for chibi look */}
            {(() => {
              const t = mapEyes(avatarData.avatar_eyes);
              if (t === 'wink') {
                return (
                  <g>
                    {/* left round eye - bigger */}
                    <circle cx="20" cy="24" r="7" fill="#111827" />
                    <circle cx="20" cy="23" r="3" fill="#ffffff" />
                    <circle cx="21" cy="22" r="1.5" fill="#ffffff" opacity="0.6" />
                    {/* right wink line */}
                    <path d="M38 24 Q 44 24 50 24" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
                  </g>
                );
              }
              if (t === 'sleepy') {
                return (
                  <g>
                    <path d="M14 24 Q 20 30 26 24" stroke="#111827" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M38 24 Q 44 30 50 24" stroke="#111827" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </g>
                );
              }
              // default round eyes - BIGGER for chibi
              return (
                <g>
                  <circle cx="20" cy="24" r="7" fill="#111827" />
                  <circle cx="20" cy="23" r="3" fill="#ffffff" />
                  <circle cx="21" cy="22" r="1.5" fill="#ffffff" opacity="0.6" />
                  <circle cx="44" cy="24" r="7" fill="#111827" />
                  <circle cx="44" cy="23" r="3" fill="#ffffff" />
                  <circle cx="45" cy="22" r="1.5" fill="#ffffff" opacity="0.6" />
                </g>
              );
            })()}
            {/* MOUTH - Enlarged and more expressive */}
            {(() => {
              const m = mapMouth(avatarData.avatar_face);
              if (m === 'big_smile') {
                return (
                  <>
                    <path d="M18 42 Q 32 56 46 42" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M22 42 Q 32 52 42 42" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </>
                );
              }
              if (m === 'open_smile') {
                return (
                  <path d="M20 40 Q 32 56 44 40 Q 32 48 20 40 Z" fill="#ef4444" stroke="#111827" strokeWidth="2.5" />
                );
              }
              if (m === 'grin') {
                return (
                  <>
                    <path d="M18 44 Q 32 52 46 44" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
                    {/* teeth lines */}
                    <path d="M28 44 L 28 47" stroke="#111827" strokeWidth="1.5" />
                    <path d="M36 44 L 36 47" stroke="#111827" strokeWidth="1.5" />
                  </>
                );
              }
              if (m === 'tongue_out') {
                return (
                  <>
                    <path d="M20 42 Q 32 50 44 42" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M28 42 Q 32 52 36 42" fill="#f87171" stroke="#111827" strokeWidth="1.5" />
                  </>
                );
              }
              if (m === 'neutral') {
                return (
                  <path d="M22 44 L 42 44" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
                );
              }
              // default soft smile - bigger curve
              return (
                <path d="M20 42 Q 32 50 44 42" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
              );
            })()}
          </svg>

          {/* Glasses overlay (optional) */}
          {avatarData.avatar_glasses && avatarData.avatar_glasses !== "none" && (
            <div className="absolute text-xl">
              {getGlassesEmoji(avatarData.avatar_glasses)}
            </div>
          )}
        </div>

        {/* Body - Shirt */}
        <div 
          className="w-20 h-8 rounded-t-lg mt-1"
          style={{ backgroundColor: shirtColor }}
        />

        {/* Pants */}
        <div 
          className="w-16 h-6"
          style={{ backgroundColor: pantsColor }}
        />

        {/* Shoes */}
        <div 
          className="w-12 h-3 rounded-b-lg"
          style={{ backgroundColor: shoesColor }}
        />

        {/* Accessory overlay */}
        {avatarData.avatar_accessory && avatarData.avatar_accessory !== "none" && (
          <div className="absolute bottom-2 right-2 text-xl">
            {getAccessoryEmoji(avatarData.avatar_accessory)}
          </div>
        )}
      </div>

      {/* Pet display */}
      {showPet && petData && (
        <div className="absolute -bottom-2 -right-2 scale-75">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${petData.gradient} flex items-center justify-center border-2 border-white shadow-lg`}>
            <span className="text-xl">{petData.emoji}</span>
            {/* Pet hat */}
            {avatarData.pet_hat && avatarData.pet_hat !== "none" && (
              <span className="absolute -top-1 text-xs">
                {avatarData.pet_hat === "tiny_cap" && "🧢"}
                {avatarData.pet_hat === "bow" && "🎀"}
                {avatarData.pet_hat === "crown" && "👑"}
                {avatarData.pet_hat === "santa_hat" && "🎅"}
                {avatarData.pet_hat === "party_hat" && "🎉"}
              </span>
            )}
            {/* Pet accessory */}
            {avatarData.pet_accessory && avatarData.pet_accessory !== "none" && (
              <span className="absolute -bottom-1 text-xs">
                {avatarData.pet_accessory === "collar" && "📿"}
                {avatarData.pet_accessory === "bow_tie" && "🎀"}
                {avatarData.pet_accessory === "bandana" && "🧣"}
                {avatarData.pet_accessory === "scarf" && "🧣"}
                {avatarData.pet_accessory === "wings" && "🪽"}
                {avatarData.pet_accessory === "cape" && "🦸"}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
