import type { Story, Vote } from '../types'
import { calculateStatistics } from './statistics'

interface ExportData {
  stories: Story[]
  votesByStory: Record<string, Vote[]>
}

export function exportToCsv({ stories, votesByStory }: ExportData): void {
  const completedStories = stories.filter((s) => s.status === 'completed')

  if (completedStories.length === 0) {
    alert('No completed stories to export')
    return
  }

  const headers = [
    'Story Title',
    'Description',
    'Final Points',
    'Average',
    'Median',
    'Agreement %',
    'Total Votes',
    'Started At',
    'Ended At',
  ]

  const rows = completedStories.map((story) => {
    const votes = votesByStory[story.id] || []
    const stats = calculateStatistics(votes)

    return [
      escapeCSV(story.title),
      escapeCSV(story.description || ''),
      story.points || '',
      stats.average?.toString() || '',
      stats.median?.toString() || '',
      stats.agreement.toString(),
      stats.totalVotes.toString(),
      story.started_at ? new Date(story.started_at).toLocaleString() : '',
      story.ended_at ? new Date(story.ended_at).toLocaleString() : '',
    ]
  })

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    `planning-poker-export-${new Date().toISOString().split('T')[0]}.csv`
  )
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
