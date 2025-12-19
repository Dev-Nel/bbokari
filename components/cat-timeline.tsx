"use client"

import type React from "react"

interface CatTimelineProps {
  progress: number
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void
  currentTime: string
  duration: string
}

export default function CatTimeline({ progress, onSeek, currentTime, duration }: CatTimelineProps) {
  return (
    <div className="mt-4">
      {/* Time labels */}
      <div className="flex justify-between text-sm text-[#7a5d4b] mb-2">
        <span>{currentTime}</span>
        <span>{duration}</span>
      </div>

      {/* Timeline bar with cat */}
      <div className="relative h-6 bg-[#EFE9AE] rounded-full cursor-pointer overflow-visible" onClick={onSeek}>
        {/* Progress fill */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FF928B] to-[#FFAC81] rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />

        {/* Cat face indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-100 z-10"
          style={{ left: `${progress}%` }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" className="drop-shadow-md">
            {/* Cat head */}
            <ellipse cx="18" cy="20" rx="14" ry="12" fill="#FFF0F5" />

            {/* Ears */}
            <path d="M6 12 L4 2 L12 10 Z" fill="#FFF0F5" />
            <path d="M30 12 L32 2 L24 10 Z" fill="#FFF0F5" />

            {/* Inner ears */}
            <path d="M7 10 L6 4 L11 9 Z" fill="#FFB6C1" />
            <path d="M29 10 L30 4 L25 9 Z" fill="#FFB6C1" />

            {/* Eyes */}
            <ellipse cx="12" cy="18" rx="3.5" ry="4" fill="#3D2314" />
            <ellipse cx="24" cy="18" rx="3.5" ry="4" fill="#3D2314" />

            {/* Eye shine */}
            <circle cx="13" cy="17" r="1.5" fill="white" />
            <circle cx="25" cy="17" r="1.5" fill="white" />

            {/* Nose */}
            <path d="M18 22 L16 25 L20 25 Z" fill="#FFB6C1" />

            {/* Mouth */}
            <path d="M18 25 L18 27" stroke="#3D2314" strokeWidth="1" />
            <path d="M14 28 Q18 31 22 28" stroke="#3D2314" strokeWidth="1" fill="none" />

            {/* Blush */}
            <ellipse cx="8" cy="23" rx="3" ry="2" fill="#FFB6C1" opacity="0.5" />
            <ellipse cx="28" cy="23" rx="3" ry="2" fill="#FFB6C1" opacity="0.5" />

            {/* Whiskers */}
            <line x1="1" y1="20" x2="8" y2="21" stroke="#DDD" strokeWidth="0.5" />
            <line x1="1" y1="23" x2="8" y2="23" stroke="#DDD" strokeWidth="0.5" />
            <line x1="1" y1="26" x2="8" y2="25" stroke="#DDD" strokeWidth="0.5" />
            <line x1="35" y1="20" x2="28" y2="21" stroke="#DDD" strokeWidth="0.5" />
            <line x1="35" y1="23" x2="28" y2="23" stroke="#DDD" strokeWidth="0.5" />
            <line x1="35" y1="26" x2="28" y2="25" stroke="#DDD" strokeWidth="0.5" />
          </svg>
        </div>
      </div>
    </div>
  )
}
