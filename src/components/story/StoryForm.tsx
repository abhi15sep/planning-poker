import { useState } from 'react'
import { Button, Input, TextArea, Modal } from '../common'

interface StoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, description?: string) => void
}

export default function StoryForm({ isOpen, onClose, onSubmit }: StoryFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    await onSubmit(title.trim(), description.trim() || undefined)
    setIsSubmitting(false)
    setTitle('')
    setDescription('')
    onClose()
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Story" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="User login feature"
          required
          autoFocus
        />

        <TextArea
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="As a user, I want to..."
          rows={3}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Add Story
          </Button>
        </div>
      </form>
    </Modal>
  )
}
