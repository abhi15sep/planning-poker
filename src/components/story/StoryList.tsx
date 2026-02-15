import { useState } from 'react'
import type { Story, Vote } from '../../types'
import { Card, Button } from '../common'
import StoryCard from './StoryCard'
import StoryForm from './StoryForm'
import StoryImport from './StoryImport'
import { exportToPdf } from '../../utils/exportPdf'

interface StoryListProps {
  stories: Story[]
  completedStories: Story[]
  activeStoryId?: string
  isOwner: boolean
  roomName?: string
  onCreateStory: (title: string, description?: string) => void
  onDeleteStory: (storyId: string) => void
  onStartVoting: (storyId: string) => void
  onImportStories: (titles: string[]) => void
  allStories: Story[]
  votesByStory: Record<string, Vote[]>
}

export default function StoryList({
  stories,
  completedStories,
  activeStoryId,
  isOwner,
  roomName = 'Planning Session',
  onCreateStory,
  onDeleteStory,
  onStartVoting,
  onImportStories,
  allStories,
  votesByStory,
}: StoryListProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)

  const handleExport = () => {
    exportToPdf({ roomName, stories: allStories, votesByStory })
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Stories
          </h3>
          {isOwner && (
            <div className="flex gap-1">
              <button
                onClick={() => setShowAddForm(true)}
                className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-sm hover:shadow"
                title="Add story"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => setShowImport(true)}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all"
                title="Import stories"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          {stories.length > 0 ? (
            <div className="space-y-2">
              {stories.map((story, index) => (
                <div
                  key={story.id}
                  className="animate-in fade-in slide-in-from-top-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <StoryCard
                    story={story}
                    isActive={story.id === activeStoryId}
                    isOwner={isOwner}
                    onStart={() => onStartVoting(story.id)}
                    onDelete={() => onDeleteStory(story.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">No stories in queue</p>
              {isOwner && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-3 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  + Add your first story
                </button>
              )}
            </div>
          )}
        </div>

        {completedStories.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed ({completedStories.length})
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${showCompleted ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showCompleted && (
              <div className="px-4 pb-4 space-y-2">
                {completedStories.map((story) => (
                  <StoryCard key={story.id} story={story} isOwner={false} />
                ))}
              </div>
            )}
          </div>
        )}

        {completedStories.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="w-full group"
            >
              <svg
                className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF Report
            </Button>
          </div>
        )}
      </Card>

      <StoryForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={onCreateStory}
      />

      <StoryImport
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={onImportStories}
      />
    </>
  )
}
