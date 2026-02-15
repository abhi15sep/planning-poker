import { useState, useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'

interface TimerProps {
  duration: number
  onComplete: () => void
  isActive: boolean
  storyId?: string
}

export default function Timer({
  duration,
  onComplete,
  isActive,
  storyId,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const hasCompletedRef = useRef(false)
  const lastStoryIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (storyId !== lastStoryIdRef.current) {
      setTimeLeft(duration)
      setIsRunning(false)
      hasCompletedRef.current = false
      lastStoryIdRef.current = storyId
    }
  }, [storyId, duration])

  useEffect(() => {
    if (!isActive) {
      setIsRunning(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            if (!hasCompletedRef.current) {
              hasCompletedRef.current = true
              onComplete()
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, onComplete, timeLeft])

  const startTimer = () => {
    setIsRunning(true)
    hasCompletedRef.current = false
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(duration)
    hasCompletedRef.current = false
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (timeLeft / duration) * 100

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Voting Timer
        </h4>
        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={startTimer}
              disabled={timeLeft === 0}
              className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <button
            onClick={resetTimer}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={cn(
            'text-3xl font-bold tabular-nums',
            timeLeft <= 10 && timeLeft > 0
              ? 'text-red-500 animate-pulse'
              : 'text-gray-900 dark:text-white'
          )}
        >
          {formatTime(timeLeft)}
        </div>
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000',
              progress > 20
                ? 'bg-primary-500'
                : progress > 10
                  ? 'bg-amber-500'
                  : 'bg-red-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
