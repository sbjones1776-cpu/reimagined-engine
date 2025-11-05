import React from "react";
import { motion } from "framer-motion";

export default function CelebrationAnimation() {
  const emojis = ["🎉", "✨", "⭐", "🌟", "💫", "🎊"];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -50,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 50,
            rotate: 360,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: "linear",
          }}
          className="absolute text-4xl"
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </motion.div>
      ))}
    </div>
  );
}