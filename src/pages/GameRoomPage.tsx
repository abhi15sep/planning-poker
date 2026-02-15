import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spinner, Card } from '../components/common'
import { useRoom } from '../hooks/useRoom'
import { useUser } from '../hooks/useUser'
import { useParticipants } from '../hooks/useParticipants'
import { useStories } from '../hooks/useStories'
import { useVotes } from '../hooks/useVotes'
import { useAllVotes } from '../hooks/useAllVotes'
import { usePresence } from '../hooks/usePresence'
import { useGameStore } from '../store/gameStore'
import { getDeck } from '../utils/cardDecks'
import CardDeck from '../components/game/CardDeck'
import VotingArea from '../components/game/VotingArea'
import ParticipantList from '../components/game/ParticipantList'
import ModeratorControls from '../components/game/ModeratorControls'
import VoteResults from '../components/game/VoteResults'
import VotingHistory from '../components/game/VotingHistory'
import Timer from '../components/game/Timer'
import ShareRoom from '../components/room/ShareRoom'
import StoryList from '../components/story/StoryList'
import ActiveStory from '../components/story/ActiveStory'

export default function GameRoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { user, isNameSet } = useUser()
  const { room, loading: roomLoading, error: roomError } = useRoom(roomId)
  const { participants, joinRoom } = useParticipants(roomId)
  const {
    stories,
    activeStory,
    queuedStories,
    completedStories,
    createStory,
    deleteStory,
    startVoting,
    revealVotes,
    completeStory,
    resetVoting,
    importStories,
  } = useStories(roomId)
  const { votes, castVote, clearVotes, getUserVote } = useVotes(activeStory?.id)
  const { selectedCard, selectCard } = useGameStore()

  // Get all story IDs for fetching historical votes
  const storyIds = useMemo(() => stories.map((s) => s.id), [stories])
  const { votesByStory } = useAllVotes(storyIds)

  usePresence(roomId, user.id, user.name, user.avatarColor)

  useEffect(() => {
    if (!roomLoading && room && !isNameSet) {
      navigate(`/room/${roomId}/join`, { replace: true })
    }
  }, [roomLoading, room, isNameSet, roomId, navigate])

  useEffect(() => {
    if (room && isNameSet) {
      joinRoom(user.id, user.name, user.avatarColor)
    }
  }, [room, isNameSet, user.id, user.name, user.avatarColor, joinRoom])

  useEffect(() => {
    if (activeStory?.status === 'active') {
      const userVote = getUserVote(user.id)
      if (userVote) {
        selectCard(userVote.value)
      } else {
        selectCard(null)
      }
    } else if (activeStory?.status === 'revealed') {
      selectCard(null)
    }
  }, [activeStory?.id, activeStory?.status, getUserVote, user.id, selectCard])

  const handleCardSelect = async (value: string) => {
    if (activeStory?.status !== 'active') return

    if (selectedCard === value) {
      selectCard(null)
    } else {
      selectCard(value)
      await castVote(user.id, user.name, value)
    }
  }

  const handleReveal = async () => {
    if (!activeStory) return
    await revealVotes(activeStory.id)
  }

  const handleReset = async () => {
    if (!activeStory) return
    await clearVotes()
    await resetVoting(activeStory.id)
    selectCard(null)
  }

  const handleComplete = async (points: string) => {
    if (!activeStory) return
    await completeStory(activeStory.id, points)
    selectCard(null)
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
      </div>
    )
  }

  const deck = getDeck(room.deck_type)
  const isOwner = room.owner_id === user.id
  const isRevealed = activeStory?.status === 'revealed'
  const isVoting = activeStory?.status === 'active'

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {room.name}
            </h1>
            {room.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {room.description}
              </p>
            )}
          </div>
          <ShareRoom roomId={room.id} />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <ActiveStory story={activeStory} />

          {room.timer_duration && isVoting && (
            <Timer
              duration={room.timer_duration}
              onComplete={handleReveal}
              isActive={isVoting}
              storyId={activeStory?.id}
            />
          )}

          <Card>
            <VotingArea
              votes={votes}
              participants={participants}
              isRevealed={isRevealed}
              currentUserId={user.id}
            />
          </Card>

          {isRevealed && <VoteResults votes={votes} deck={deck} />}

          {isOwner && activeStory && (
            <ModeratorControls
              isRevealed={isRevealed}
              hasVotes={votes.length > 0}
              onReveal={handleReveal}
              onReset={handleReset}
              onComplete={handleComplete}
              deck={deck}
            />
          )}

          {(isVoting || !activeStory) && (
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {activeStory ? 'Select your estimate' : 'Waiting for a story...'}
              </h3>
              <CardDeck
                cards={deck.cards}
                selectedValue={selectedCard}
                onSelect={handleCardSelect}
                disabled={!isVoting}
              />
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <ParticipantList
            participants={participants}
            votes={votes}
            isRevealed={isRevealed}
            currentUserId={user.id}
          />

          <StoryList
            stories={queuedStories}
            completedStories={completedStories}
            activeStoryId={activeStory?.id}
            isOwner={isOwner}
            roomName={room.name}
            onCreateStory={(title, description) =>
              createStory({ title, description, room_id: room.id })
            }
            onDeleteStory={deleteStory}
            onStartVoting={startVoting}
            onImportStories={importStories}
            allStories={stories}
            votesByStory={votesByStory}
          />

          <VotingHistory
            stories={stories}
            votesByStory={votesByStory}
            deck={deck}
          />
        </div>
      </div>
    </div>
  )
}
