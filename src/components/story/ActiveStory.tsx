import type { Story } from '../../types'
import { Card, Badge } from '../common'

interface ActiveStoryProps {
  story?: Story
}

export default function ActiveStory({ story }: ActiveStoryProps) {
  if (!story) {
    return (
      <Card variant="outlined" padding="lg">
        <div className="text-center py-4">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No Active Story
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a story from the queue to start voting
          </p>
        </div>
      </Card>
    )
  }

  const statusVariant =
    story.status === 'active'
      ? 'info'
      : story.status === 'revealed'
        ? 'warning'
        : 'success'

  const statusLabel =
    story.status === 'active'
      ? 'Voting'
      : story.status === 'revealed'
        ? 'Revealed'
        : 'Completed'

  return (
    <Card variant="elevated" padding="lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={statusVariant}>{statusLabel}</Badge>
            {story.points && (
              <Badge variant="success">
                {story.points} pts
              </Badge>
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
            {story.title}
          </h2>
          {story.description && (
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
              {story.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
