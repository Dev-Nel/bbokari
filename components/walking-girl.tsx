"use client"

import { useEffect, useState } from "react"

interface WalkingGirlProps {
  isPlaying: boolean
}

export default function WalkingGirl({ isPlaying }: WalkingGirlProps) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4)
    }, 200)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Animation offsets for walking motion
  const legOffset = [0, -3, 0, 3][frame]
  const armOffset = [3, 0, -3, 0][frame]
  const bodyBob = [0, -2, 0, -2][frame]
  const hairSway = [2, 0, -2, 0][frame]

  return (
    <div className="absolute inset-0 flex items-end justify-center">
      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#8B7355] to-[#A0826D]">
        {/* Road markings */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-around">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-1 bg-[#EFE9AE] rounded"
              style={{
                animationName: isPlaying ? "roadMove" : "none",
                animationDuration: "1s",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Trees in background */}
      <div className="absolute bottom-14 left-4">
        <div className="w-12 h-20 bg-[#7CB342] rounded-full" />
        <div className="w-3 h-8 bg-[#5D4037] mx-auto -mt-2" />
      </div>
      <div className="absolute bottom-14 right-8">
        <div className="w-16 h-24 bg-[#8BC34A] rounded-full" />
        <div className="w-4 h-10 bg-[#5D4037] mx-auto -mt-2" />
      </div>

      {/* Clouds */}
      <div className="absolute top-4 left-8 w-16 h-8 bg-white/60 rounded-full" />
      <div className="absolute top-8 right-12 w-20 h-10 bg-white/50 rounded-full" />

      {/* Sun */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-[#FFAC81] rounded-full shadow-lg">
        <div className="absolute inset-1 bg-[#EFE9AE] rounded-full" />
      </div>

      {/* Walking Girl SVG */}
      <svg
        width="100"
        height="140"
        viewBox="0 0 100 140"
        className="mb-4 z-10"
        style={{ transform: `translateY(${bodyBob}px)` }}
      >
        {/* Long flowing hair */}
        <g style={{ transform: `translateX(${hairSway}px)` }}>
          {/* Hair back layer */}
          <ellipse cx="50" cy="35" rx="22" ry="28" fill="#4A3728" />
          {/* Long hair strands going down the back */}
          <path d="M30 35 Q25 70 28 110" stroke="#4A3728" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M35 38 Q32 75 35 115" stroke="#5D4037" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M70 35 Q75 70 72 110" stroke="#4A3728" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M65 38 Q68 75 65 115" stroke="#5D4037" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
        {/* Head */}
        <circle cx="50" cy="28" r="18" fill="#FFDAB9" />
        {/* Hair front */}
        <ellipse cx="50" cy="18" rx="18" ry="12" fill="#4A3728" />
        <path d="M33 22 Q30 28 33 35" stroke="#4A3728" strokeWidth="3" fill="none" />
        <path d="M67 22 Q70 28 67 35" stroke="#4A3728" strokeWidth="3" fill="none" />
        {/* Face */}
        <circle cx="44" cy="26" r="2" fill="#5D4037" /> {/* Left eye */}
        <circle cx="56" cy="26" r="2" fill="#5D4037" /> {/* Right eye */}
        <ellipse cx="44" cy="24" rx="1" ry="0.5" fill="white" /> {/* Eye shine */}
        <ellipse cx="56" cy="24" rx="1" ry="0.5" fill="white" />
        <path d="M47 32 Q50 35 53 32" stroke="#E57373" strokeWidth="2" fill="none" /> {/* Smile */}
        <circle cx="40" cy="30" r="3" fill="#FFCDD2" opacity="0.5" /> {/* Blush */}
        <circle cx="60" cy="30" r="3" fill="#FFCDD2" opacity="0.5" />
        {/* Headphones */}
        <path d="M32 22 Q32 10 50 10 Q68 10 68 22" stroke="#FF928B" strokeWidth="4" fill="none" />
        <circle cx="32" cy="24" r="6" fill="#FF928B" />
        <circle cx="68" cy="24" r="6" fill="#FF928B" />
        <circle cx="32" cy="24" r="4" fill="#FFAC81" />
        <circle cx="68" cy="24" r="4" fill="#FFAC81" />
        {/* Dress/Body */}
        <path d="M38 45 L35 95 L50 95 L65 95 L62 45 Q50 48 38 45" fill="#FF928B" />
        <ellipse cx="50" cy="50" rx="14" ry="8" fill="#FF928B" />
        {/* Dress pattern - cute polka dots */}
        <circle cx="42" cy="60" r="2" fill="#FFAC81" />
        <circle cx="54" cy="65" r="2" fill="#FFAC81" />
        <circle cx="46" cy="75" r="2" fill="#FFAC81" />
        <circle cx="58" cy="80" r="2" fill="#FFAC81" />
        {/* Arms */}
        <g style={{ transform: `rotate(${armOffset}deg)`, transformOrigin: "38px 50px" }}>
          <path d="M38 50 L28 70" stroke="#FFDAB9" strokeWidth="6" strokeLinecap="round" />
        </g>
        <g style={{ transform: `rotate(${-armOffset}deg)`, transformOrigin: "62px 50px" }}>
          <path d="M62 50 L72 70" stroke="#FFDAB9" strokeWidth="6" strokeLinecap="round" />
        </g>
        {/* Phone in hand */}
        <rect
          x="24"
          y="68"
          width="8"
          height="14"
          rx="2"
          fill="#333"
          style={{ transform: `rotate(${armOffset}deg)`, transformOrigin: "28px 75px" }}
        />
        {/* Legs */}
        <g style={{ transform: `translateY(${legOffset}px)` }}>
          <path d="M42 95 L40 125" stroke="#FFDAB9" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="40" cy="128" rx="6" ry="4" fill="#CDEAC0" /> {/* Shoe */}
        </g>
        <g style={{ transform: `translateY(${-legOffset}px)` }}>
          <path d="M58 95 L60 125" stroke="#FFDAB9" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="60" cy="128" rx="6" ry="4" fill="#CDEAC0" /> {/* Shoe */}
        </g>
        {/* Music notes floating */}
        {isPlaying && (
          <>
            <text
              x="75"
              y="15"
              fontSize="14"
              fill="#FF928B"
              style={{
                animationName: "float",
                animationDuration: "1s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
              }}
            >
              ♪
            </text>
            <text
              x="80"
              y="30"
              fontSize="12"
              fill="#FFAC81"
              style={{
                animationName: "float",
                animationDuration: "1.2s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: "0.3s",
              }}
            >
              ♫
            </text>
            <text
              x="20"
              y="20"
              fontSize="10"
              fill="#EFE9AE"
              style={{
                animationName: "float",
                animationDuration: "1.4s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: "0.6s",
              }}
            >
              ♪
            </text>
          </>
        )}
      </svg>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-10px); opacity: 0.7; }
        }
        @keyframes roadMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-20px); }
        }
      `}</style>
    </div>
  )
}
