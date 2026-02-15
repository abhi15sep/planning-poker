import { useState } from 'react'
import { Button, TextArea, Modal } from '../common'

interface StoryImportProps {
  isOpen: boolean
  onClose: () => void
  onImport: (titles: string[]) => void
}

export default function StoryImport({
  isOpen,
  onClose,
  onImport,
}: StoryImportProps) {
  const [input, setInput] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const handleImport = async () => {
    const lines = input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    if (lines.length === 0) return

    setIsImporting(true)
    await onImport(lines)
    setIsImporting(false)
    setInput('')
    onClose()
  }

  const handleClose = () => {
    setInput('')
    onClose()
  }

  const previewCount = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0).length

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Stories" size="lg">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Paste your stories below, one per line. Each line will become a
          separate story.
        </p>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="User authentication
Shopping cart feature
Payment integration
..."
          rows={10}
          className="font-mono text-sm"
        />

        {previewCount > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {previewCount} {previewCount === 1 ? 'story' : 'stories'} will be
            imported
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            isLoading={isImporting}
            disabled={previewCount === 0}
          >
            Import {previewCount > 0 ? `(${previewCount})` : ''}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
