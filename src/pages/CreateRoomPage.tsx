import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Select, Card, TextArea } from '../components/common'
import { useRoom } from '../hooks/useRoom'
import { useUser } from '../hooks/useUser'
import { getDeckOptions } from '../utils/cardDecks'
import { TIMER_PRESETS } from '../utils/constants'
import type { DeckType } from '../types'

export default function CreateRoomPage() {
  const navigate = useNavigate()
  const { createRoom, loading, error } = useRoom()
  const { user, updateName, isNameSet } = useUser()

  const [roomName, setRoomName] = useState('')
  const [description, setDescription] = useState('')
  const [deckType, setDeckType] = useState<DeckType>('fibonacci')
  const [timerDuration, setTimerDuration] = useState<number | undefined>()
  const [userName, setUserName] = useState(user.name)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!roomName.trim()) return

    if (userName.trim() && userName !== user.name) {
      updateName(userName.trim())
    }

    const room = await createRoom(
      {
        name: roomName.trim(),
        description: description.trim() || undefined,
        deck_type: deckType,
        timer_duration: timerDuration,
      },
      user.id
    )

    if (room) {
      navigate(`/room/${room.id}`)
    }
  }

  const timerOptions = [
    { value: '', label: 'No timer' },
    ...TIMER_PRESETS.map((p) => ({ value: p.value.toString(), label: p.label })),
  ]

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create a Room
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Set up your planning poker session
        </p>
      </div>

      <Card variant="elevated" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isNameSet && (
            <Input
              label="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          )}

          <Input
            label="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Sprint 42 Planning"
            required
          />

          <TextArea
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are we estimating today?"
            rows={3}
          />

          <Select
            label="Card Deck"
            value={deckType}
            onChange={(e) => setDeckType(e.target.value as DeckType)}
            options={getDeckOptions()}
          />

          <Select
            label="Voting Timer"
            value={timerDuration?.toString() || ''}
            onChange={(e) =>
              setTimerDuration(e.target.value ? parseInt(e.target.value) : undefined)
            }
            options={timerOptions}
          />

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <Button type="submit" className="w-full" isLoading={loading}>
            Create Room
          </Button>
        </form>
      </Card>
    </div>
  )
}
