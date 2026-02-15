import type { Story } from '../../types'
import { Badge } from '../common'
import { cn } from '../../utils/cn'

interface StoryCardProps {
  story: Story
  isActive?: boolean
  isOwner: boolean
  onStart?: () => void
  onDelete?: () => void
}

export default function StoryCard({
  story,
  isActive = false,
  isOwner,
  onStart,
  onDelete,
}: StoryCardProps) {
  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-colors',
        isActive
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">
            {story.title}
          </h4>
          {story.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {story.description}
            </p>
          )}
        </div>
        {story.points && (
          <Badge variant="success" size="sm">
            {story.points}
          </Badge>
        )}
      </div>

      {isOwner && story.status === 'queue' && (
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={onStart}
            className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Start Voting
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={onDelete}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
