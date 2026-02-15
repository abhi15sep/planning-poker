import { create } from 'zustand'

interface GameState {
  selectedCard: string | null
  timerEndTime: number | null
  isTimerRunning: boolean

  selectCard: (value: string | null) => void
  startTimer: (durationSeconds: number) => void
  stopTimer: () => void
  resetTimer: () => void
}

export const useGameStore = create<GameState>((set) => ({
  selectedCard: null,
  timerEndTime: null,
  isTimerRunning: false,

  selectCard: (value) => set({ selectedCard: value }),

  startTimer: (durationSeconds) =>
    set({
      timerEndTime: Date.now() + durationSeconds * 1000,
      isTimerRunning: true,
    }),

  stopTimer: () => set({ isTimerRunning: false }),

  resetTimer: () =>
    set({
      timerEndTime: null,
      isTimerRunning: false,
    }),
}))
