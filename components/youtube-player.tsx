"use client"

import { useEffect, useRef, useState } from "react"

interface YouTubePlayerProps {
  videoId: string
  isPlaying: boolean
  onReady: () => void
  onStateChange: (state: number) => void
  onTimeUpdate: (currentTime: number, duration: number) => void
  volume: number
  seekTo?: number
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function YouTubePlayer({
  videoId,
  isPlaying,
  onReady,
  onStateChange,
  onTimeUpdate,
  volume,
  seekTo,
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAPIReady, setIsAPIReady] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false)

  // Load YouTube API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsAPIReady(true)
      return
    }

    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      setIsAPIReady(true)
    }
  }, [])

  // Initialize player
  useEffect(() => {
    if (!isAPIReady || !containerRef.current || playerRef.current) return

    setIsPlayerReady(false)

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      height: "0",
      width: "0",
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          if (playerRef.current?.setVolume) {
            playerRef.current.setVolume(volume * 100)
          }
          setIsPlayerReady(true)
          onReady()
        },
        onStateChange: (event: any) => {
          onStateChange(event.data)
        },
      },
    })

    // Progress tracking
    const interval = setInterval(() => {
      if (
        playerRef.current &&
        typeof playerRef.current.getCurrentTime === "function" &&
        typeof playerRef.current.getDuration === "function"
      ) {
        try {
          const currentTime = playerRef.current.getCurrentTime()
          const duration = playerRef.current.getDuration()
          if (currentTime && duration) {
            onTimeUpdate(currentTime, duration)
          }
        } catch (error) {
          // Ignore errors during state transitions
        }
      }
    }, 100)

    return () => {
      clearInterval(interval)
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy()
      }
      playerRef.current = null
      setIsPlayerReady(false)
    }
  }, [isAPIReady, videoId])

  // Handle play/pause
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return

    try {
      if (isPlaying && typeof playerRef.current.playVideo === "function") {
        playerRef.current.playVideo()
      } else if (!isPlaying && typeof playerRef.current.pauseVideo === "function") {
        playerRef.current.pauseVideo()
      }
    } catch (error) {
      console.error("[v0] Error controlling playback:", error)
    }
  }, [isPlaying, isPlayerReady])

  // Handle volume
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return

    try {
      if (typeof playerRef.current.setVolume === "function") {
        playerRef.current.setVolume(volume * 100)
      }
    } catch (error) {
      console.error("[v0] Error setting volume:", error)
    }
  }, [volume, isPlayerReady])

  // Handle seek
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady || seekTo === undefined) return

    try {
      if (typeof playerRef.current.seekTo === "function") {
        playerRef.current.seekTo(seekTo, true)
      }
    } catch (error) {
      console.error("[v0] Error seeking:", error)
    }
  }, [seekTo, isPlayerReady])

  return <div ref={containerRef} className="hidden" />
}
