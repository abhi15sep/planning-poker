import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Input, Card, Spinner } from '../components/common'
import { useRoom } from '../hooks/useRoom'
import { useParticipants } from '../hooks/useParticipants'
import { useUser } from '../hooks/useUser'

export default function JoinRoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { room, loading: roomLoading, error: roomError } = useRoom(roomId)
  const { joinRoom, loading: joining } = useParticipants(roomId)
  const { user, updateName, isNameSet } = useUser()

  const [userName, setUserName] = useState(user.name)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isNameSet && room) {
      handleJoin()
    }
  }, [isNameSet, room])

  const handleJoin = async () => {
    if (!userName.trim()) {
      setError('Please enter your name')
      return
    }

    if (userName !== user.name) {
      updateName(userName.trim())
    }

    const participant = await joinRoom(user.id, userName.trim(), user.avatarColor)

    if (participant) {
      navigate(`/room/${roomId}`, { replace: true })
    } else {
      setError('Failed to join room')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleJoin()
  }

  if (roomLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (roomError || !room) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Room Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This room doesn&apos;t exist or has been deleted.
        </p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    )
  }

  if (isNameSet) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Join Room
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          You&apos;re joining <span className="font-semibold">{room.name}</span>
        </p>
      </div>

      <Card variant="elevated" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Your Name"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value)
              setError(null)
            }}
            placeholder="Enter your name"
            error={error || undefined}
            autoFocus
          />

          <Button type="submit" className="w-full" isLoading={joining}>
            Join Room
          </Button>
        </form>
      </Card>
    </div>
  )
}
