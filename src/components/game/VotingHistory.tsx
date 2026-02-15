import { useState } from 'react'
import type { Story, Vote, Deck } from '../../types'
import { Card, Badge } from '../common'
import { calculateStatistics } from '../../utils/statistics'

interface VotingHistoryProps {
  stories: Story[]
  votesByStory: Record<string, Vote[]>
  deck: Deck
}

export default function VotingHistory({
  stories,
  votesByStory,
  deck,
}: VotingHistoryProps) {
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null)

  const completedStories = stories
    .filter((s) => s.status === 'completed')
    .sort((a, b) => {
      const aTime = a.ended_at ? new Date(a.ended_at).getTime() : 0
      const bTime = b.ended_at ? new Date(b.ended_at).getTime() : 0
      return bTime - aTime // Most recent first
    })

  if (completedStories.length === 0) {
    return null
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Voting History
      </h3>
      <div className="space-y-2">
        {completedStories.map((story) => {
          const votes = votesByStory[story.id] || []
          const stats = calculateStatistics(votes)
          const isExpanded = expandedStoryId === story.id
          const card = deck.cards.find((c) => c.value === story.points)

          return (
            <div
              key={story.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedStoryId(isExpanded ? null : story.id)
                }
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {story.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {story.ended_at
                      ? new Date(story.ended_at).toLocaleString()
                      : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success">
                    {card?.label || story.points || '-'}
                  </Badge>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-700">
                  {votes.length > 0 ? (
                    <>
                      <div className="grid grid-cols-3 gap-2 py-3 text-center text-sm">
                        <div>
                          <div className="font-semibold text-primary-600 dark:text-primary-400">
                            {stats.average ?? '-'}
                          </div>
                          <div className="text-xs text-gray-500">Average</div>
                        </div>
                        <div>
                          <div className="font-semibold text-primary-600 dark:text-primary-400">
                            {stats.median ?? '-'}
                          </div>
                          <div className="text-xs text-gray-500">Median</div>
                        </div>
                        <div>
                          <div className="font-semibold text-primary-600 dark:text-primary-400">
                            {stats.agreement}%
                          </div>
                          <div className="text-xs text-gray-500">Agreement</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Individual Votes:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {votes.map((vote) => {
                            const voteCard = deck.cards.find(
                              (c) => c.value === vote.value
                            )
                            return (
                              <span
                                key={vote.id}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                              >
                                <span className="text-gray-600 dark:text-gray-300">
                                  {vote.user_name}:
                                </span>
                                <span className="font-medium text-primary-600 dark:text-primary-400">
                                  {voteCard?.label || vote.value}
                                </span>
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="py-3 text-sm text-gray-500 dark:text-gray-400">
                      No vote data available
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
