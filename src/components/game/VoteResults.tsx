import type { Vote, Deck } from '../../types'
import { Card } from '../common'
import { calculateStatistics, formatStatValue } from '../../utils/statistics'
import { parseCardValue } from '../../utils/cardDecks'

interface VoteResultsProps {
  votes: Vote[]
  deck: Deck
}

export default function VoteResults({ votes, deck }: VoteResultsProps) {
  const stats = calculateStatistics(votes)

  const voteDistribution = votes.reduce(
    (acc, vote) => {
      acc[vote.value] = (acc[vote.value] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const sortedDistribution = Object.entries(voteDistribution).sort(
    ([, a], [, b]) => b - a
  )

  // Sort votes by value (numeric first, then special cards)
  const sortedVotes = [...votes].sort((a, b) => {
    const aNum = parseCardValue(a.value)
    const bNum = parseCardValue(b.value)
    if (aNum !== null && bNum !== null) return aNum - bNum
    if (aNum !== null) return -1
    if (bNum !== null) return 1
    return a.value.localeCompare(b.value)
  })

  const maxVoteCount = Math.max(...Object.values(voteDistribution))

  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Results
        </h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Average Score */}
        <div className="flex items-center justify-center">
          <div className="text-center px-8 py-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg shadow-primary-500/20">
            <div className="text-4xl font-bold text-white">
              {formatStatValue(stats.average)}
            </div>
            <div className="text-sm text-primary-100 mt-1">Average Score</div>
          </div>
        </div>

        {/* Vote Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Vote Distribution
          </h4>
          <div className="space-y-3">
            {sortedDistribution.map(([value, count]) => {
              const card = deck.cards.find((c) => c.value === value)
              const percentage = (count / votes.length) * 100
              const isTopVote = count === maxVoteCount

              return (
                <div key={value} className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${
                    isTopVote
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {card?.label || value}
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isTopVote
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-primary-400 to-primary-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20 text-right">
                    {count} vote{count !== 1 ? 's' : ''} ({Math.round(percentage)}%)
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Individual Votes */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Individual Votes
          </h4>
          <div className="flex flex-wrap gap-2">
            {sortedVotes.map((vote) => {
              const card = deck.cards.find((c) => c.value === vote.value)
              return (
                <div
                  key={vote.id}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 transition-colors"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {vote.user_name}
                  </span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold text-sm">
                    {card?.label || vote.value}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
