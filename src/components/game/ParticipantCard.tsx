import { cn } from '../../utils/cn'

interface ParticipantCardProps {
  name: string
  avatarColor: string
  hasVoted: boolean
  voteValue?: string
  isCurrentUser: boolean
}

export default function ParticipantCard({
  name,
  avatarColor,
  hasVoted,
  voteValue,
  isCurrentUser,
}: ParticipantCardProps) {
  const isRevealed = voteValue !== undefined

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'w-16 h-24 rounded-xl flex items-center justify-center text-xl font-bold transition-all duration-300',
          'border-2',
          isRevealed
            ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
            : hasVoted
              ? 'card-face-down border-primary-600'
              : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 border-dashed'
        )}
      >
        {isRevealed ? (
          <span className="animate-bounce-subtle">{voteValue}</span>
        ) : hasVoted ? (
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">?</span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: avatarColor }}
        />
        <span
          className={cn(
            'text-sm truncate max-w-[80px]',
            isCurrentUser
              ? 'font-semibold text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300'
          )}
        >
          {name}
          {isCurrentUser && ' (you)'}
        </span>
      </div>
    </div>
  )
}
