"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Heart,
  Music2,
  Video,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"
import WalkingGirl from "./walking-girl"
import CatTimeline from "./cat-timeline"
import YouTubePlayer from "./youtube-player"
import { allSongs, extractYouTubeId } from "@/lib/song-data"

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [likedSongs, setLikedSongs] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playerReady, setPlayerReady] = useState(false)
  const [seekToTime, setSeekToTime] = useState<number | undefined>(undefined)
  const [showVideo, setShowVideo] = useState(true)
  const [showLyrics, setShowLyrics] = useState(false)
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0)
  const lyricsContainerRef = useRef<HTMLDivElement>(null)

  const filteredSongs =
    selectedCategory === "All" ? allSongs : allSongs.filter((song) => song.category === selectedCategory)

  const currentSong = filteredSongs[currentSongIndex]
  const videoId = extractYouTubeId(currentSong.youtubeUrl)

  const categories = ["All", ...Array.from(new Set(allSongs.map((song) => song.category)))]

  const handleStateChange = (state: number) => {
    // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
    if (state === 0) {
      // Video ended
      if (repeat) {
        setIsPlaying(true)
      } else {
        handleNext()
      }
    } else if (state === 1) {
      setIsPlaying(true)
    } else if (state === 2) {
      setIsPlaying(false)
    }
  }

  const handleTimeUpdate = (current: number, total: number) => {
    setCurrentTime(current)
    setDuration(total)
    if (total > 0) {
      setProgress((current / total) * 100)
    }
    if (currentSong.syncedLyrics) {
      const lyricIndex = currentSong.syncedLyrics.findIndex(
        (lyric, idx) =>
          current >= lyric.time &&
          (idx === currentSong.syncedLyrics!.length - 1 || current < currentSong.syncedLyrics![idx + 1].time),
      )
      if (lyricIndex !== -1 && lyricIndex !== currentLyricIndex) {
        setCurrentLyricIndex(lyricIndex)
      }
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * filteredSongs.length)
      setCurrentSongIndex(randomIndex)
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % filteredSongs.length)
    }
    setProgress(0)
    setCurrentTime(0)
    setPlayerReady(false)
    setCurrentLyricIndex(0)
  }

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + filteredSongs.length) % filteredSongs.length)
    setProgress(0)
    setCurrentTime(0)
    setPlayerReady(false)
    setCurrentLyricIndex(0)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    if (duration > 0) {
      const newTime = percent * duration
      setSeekToTime(newTime)
      setProgress(percent * 100)
      setTimeout(() => setSeekToTime(undefined), 100)
    }
  }

  const toggleLike = (id: number) => {
    setLikedSongs((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const downloadPlaylist = () => {
    const playlistData = filteredSongs.map((song) => ({
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      youtubeUrl: song.youtubeUrl,
    }))

    const dataStr = JSON.stringify(playlistData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `playlist-${selectedCategory.toLowerCase()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (lyricsContainerRef.current && currentSong.syncedLyrics) {
      const container = lyricsContainerRef.current
      const activeLine = container.querySelector('[data-active="true"]')
      if (activeLine) {
        activeLine.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }
  }, [currentLyricIndex, currentSong.syncedLyrics])

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-6 bg-[#FEC3A6]">
      <YouTubePlayer
        videoId={videoId}
        isPlaying={isPlaying}
        onReady={() => setPlayerReady(true)}
        onStateChange={handleStateChange}
        onTimeUpdate={handleTimeUpdate}
        volume={volume}
        seekTo={seekToTime}
      />

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#5a3d2b]">Music Player</h1>
        <p className="text-[#7a5d4b] mt-2">Your Personal Playlist</p>
      </div>

      {/* Main Player Card */}
      <div className="w-full max-w-md bg-[#FFAC81] rounded-3xl p-6 shadow-xl">
        {/* Walking Girl Animation */}
        <div className="relative h-48 bg-gradient-to-b from-[#CDEAC0] to-[#EFE9AE] rounded-2xl overflow-hidden mb-6">
          <WalkingGirl isPlaying={isPlaying} />
        </div>

        {/* Song Info */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-[#5a3d2b] truncate">{currentSong.title}</h2>
          <p className="text-[#7a5d4b]">{currentSong.artist}</p>
          <span className="inline-block mt-1 px-3 py-1 bg-[#FF928B] text-white text-sm rounded-full">
            {currentSong.genre}
          </span>
        </div>

        {/* Video and Lyrics Toggle Buttons */}
        <div className="flex gap-2 justify-center mb-4">
          <button
            onClick={() => setShowVideo(!showVideo)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              showVideo ? "bg-[#FF928B] text-white" : "bg-[#EFE9AE] text-[#5a3d2b] hover:bg-[#CDEAC0]",
            )}
          >
            <Video size={16} />
            {showVideo ? "Hide" : "Show"} Video
          </button>
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              showLyrics ? "bg-[#FF928B] text-white" : "bg-[#EFE9AE] text-[#5a3d2b] hover:bg-[#CDEAC0]",
            )}
          >
            <Music2 size={16} />
            {showLyrics ? "Hide" : "Show"} Lyrics
          </button>
        </div>

        {/* YouTube Video Embed */}
        {showVideo && (
          <div className="mb-4 rounded-2xl overflow-hidden bg-[#EFE9AE] p-2">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1`}
                title={currentSong.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Lyrics Display */}
        {showLyrics && (
          <div ref={lyricsContainerRef} className="mb-4 p-4 bg-[#EFE9AE] rounded-2xl max-h-64 overflow-y-auto">
            <h3 className="font-bold text-[#5a3d2b] mb-3 text-center">Lyrics</h3>
            {currentSong.syncedLyrics ? (
              <div className="space-y-2">
                {currentSong.syncedLyrics.map((lyric, index) => (
                  <p
                    key={index}
                    data-active={index === currentLyricIndex}
                    className={cn(
                      "text-center transition-all duration-300 text-base leading-relaxed",
                      index === currentLyricIndex
                        ? "text-[#FF928B] font-bold scale-110 text-lg"
                        : index < currentLyricIndex
                          ? "text-[#7a5d4b] opacity-60"
                          : "text-[#7a5d4b] opacity-40",
                    )}
                  >
                    {lyric.text}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-[#7a5d4b] text-sm leading-relaxed text-center italic whitespace-pre-line">
                {currentSong.lyrics || "Lyrics not available for this song. Enjoy the music!"}
              </p>
            )}
          </div>
        )}

        {/* Timeline with Cat Character */}
        <CatTimeline
          progress={progress}
          onSeek={handleSeek}
          currentTime={formatTime(currentTime)}
          duration={formatTime(duration || currentSong.duration)}
        />

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={cn(
              "p-2 rounded-full transition-all",
              shuffle ? "bg-[#FF928B] text-white" : "text-[#7a5d4b] hover:bg-[#FEC3A6]",
            )}
          >
            <Shuffle size={20} />
          </button>

          <button
            onClick={handlePrev}
            className="p-3 bg-[#EFE9AE] rounded-full text-[#5a3d2b] hover:scale-110 transition-transform"
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={togglePlay}
            className="p-4 bg-[#FF928B] rounded-full text-white hover:scale-110 transition-transform shadow-lg"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>

          <button
            onClick={handleNext}
            className="p-3 bg-[#EFE9AE] rounded-full text-[#5a3d2b] hover:scale-110 transition-transform"
          >
            <SkipForward size={24} />
          </button>

          <button
            onClick={() => setRepeat(!repeat)}
            className={cn(
              "p-2 rounded-full transition-all",
              repeat ? "bg-[#FF928B] text-white" : "text-[#7a5d4b] hover:bg-[#FEC3A6]",
            )}
          >
            <Repeat size={20} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 mt-6 px-4">
          <Volume2 size={20} className="text-[#7a5d4b]" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
            className="w-full h-2 bg-[#EFE9AE] rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#FF928B]
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Playlist - AT THE BOTTOM */}
      <div className="w-full max-w-md bg-[#EFE9AE] rounded-3xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-[#5a3d2b]">Playlist</h3>
          <button
            onClick={downloadPlaylist}
            className="flex items-center gap-2 px-3 py-2 bg-[#FF928B] text-white rounded-full text-sm font-medium hover:bg-[#ff7a73] transition-all"
          >
            <Download size={16} />
            Download
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                setCurrentSongIndex(0)
                setPlayerReady(false)
              }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                selectedCategory === category
                  ? "bg-[#FF928B] text-white"
                  : "bg-[#CDEAC0] text-[#5a3d2b] hover:bg-[#FEC3A6]",
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredSongs.map((song, index) => (
            <div
              key={song.id}
              onClick={() => {
                setCurrentSongIndex(index)
                setProgress(0)
                setCurrentTime(0)
                setPlayerReady(false)
                setIsPlaying(true)
                setCurrentLyricIndex(0)
              }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
                currentSongIndex === index
                  ? "bg-[#FF928B] text-white"
                  : "bg-[#CDEAC0] text-[#5a3d2b] hover:bg-[#FEC3A6]",
              )}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/30 text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{song.title}</p>
                <p className={cn("text-sm truncate", currentSongIndex === index ? "text-white/80" : "text-[#7a5d4b]")}>
                  {song.artist}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLike(song.id)
                }}
                className="p-1"
              >
                <Heart
                  size={18}
                  className={cn(
                    "transition-all",
                    likedSongs.includes(song.id)
                      ? "fill-red-500 text-red-500"
                      : currentSongIndex === index
                        ? "text-white/70"
                        : "text-[#7a5d4b]",
                  )}
                />
              </button>
              <span className={cn("text-sm", currentSongIndex === index ? "text-white/80" : "text-[#7a5d4b]")}>
                {formatTime(song.duration)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-[#7a5d4b] text-sm text-center">Celebrating Music from Around the World</p>
    </div>
  )
}
