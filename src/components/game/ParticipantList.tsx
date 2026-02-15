import type { Participant, Vote } from '../../types'
import { Card, Badge } from '../common'
import { cn } from '../../utils/cn'

interface ParticipantListProps {
  participants: Participant[]
  votes: Vote[]
  isRevealed: boolean
  currentUserId: string
}

export default function ParticipantList({
  participants,
  votes,
  isRevealed,
  currentUserId,
}: ParticipantListProps) {
  const onlineCount = participants.filter((p) => p.is_online).length
  const votedCount = votes.length

  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.is_online !== b.is_online) return a.is_online ? -1 : 1
    if (a.user_id === currentUserId) return -1
    if (b.user_id === currentUserId) return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Participants
        </h3>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {onlineCount} online
          </span>
          {votedCount > 0 && (
            <Badge variant="info" size="sm">
              {votedCount} voted
            </Badge>
          )}
        </div>
      </div>

      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
        {sortedParticipants.map((participant, index) => {
          const vote = votes.find((v) => v.user_id === participant.user_id)
          const isCurrentUser = participant.user_id === currentUserId

          return (
            <li
              key={participant.id}
              className={cn(
                'flex items-center justify-between py-3 px-4 transition-colors',
                'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                isCurrentUser && 'bg-primary-50/50 dark:bg-primary-900/10'
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                    style={{
                      backgroundColor: participant.avatar_color || '#6366F1',
                    }}
                  >
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800',
                      participant.is_online ? 'bg-green-500' : 'bg-gray-400'
                    )}
                  />
                </div>
                <div>
                  <span
                    className={cn(
                      'text-sm font-medium block',
                      participant.is_online
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-500'
                    )}
                  >
                    {participant.name}
                    {isCurrentUser && (
                      <span className="ml-1 text-xs text-primary-500">(you)</span>
                    )}
                  </span>
                  {!participant.is_online && (
                    <span className="text-xs text-gray-400">offline</span>
                  )}
                </div>
              </div>
              <div>
                {vote ? (
                  isRevealed ? (
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold shadow-sm">
                      {vote.value}
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )
                ) : (
                  participant.is_online && (
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  )
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
