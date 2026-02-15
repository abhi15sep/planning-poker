import type { Vote, VoteStatistics } from '../types'
import { parseCardValue } from './cardDecks'

export function calculateStatistics(votes: Vote[]): VoteStatistics {
  const numericVotes = votes
    .map((v) => parseCardValue(v.value))
    .filter((v): v is number => v !== null)

  if (numericVotes.length === 0) {
    return {
      average: null,
      median: null,
      mode: null,
      totalVotes: votes.length,
      agreement: 0,
    }
  }

  const average = numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length

  const sorted = [...numericVotes].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const median =
    sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2

  const valueCounts = votes.reduce(
    (acc, vote) => {
      acc[vote.value] = (acc[vote.value] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const maxCount = Math.max(...Object.values(valueCounts))
  const modes = Object.entries(valueCounts)
    .filter(([, count]) => count === maxCount)
    .map(([value]) => value)

  const mode = modes.length === 1 ? modes[0] : null

  const agreement =
    votes.length > 0 ? (maxCount / votes.length) * 100 : 0

  return {
    average: Math.round(average * 100) / 100,
    median: Math.round(median * 100) / 100,
    mode,
    totalVotes: votes.length,
    agreement: Math.round(agreement),
  }
}

export function formatStatValue(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '-'
  }
  return value.toString()
}
