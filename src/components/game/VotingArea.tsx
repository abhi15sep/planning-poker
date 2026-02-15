import type { Vote, Participant } from '../../types'
import ParticipantCard from './ParticipantCard'

interface VotingAreaProps {
  votes: Vote[]
  participants: Participant[]
  isRevealed: boolean
  currentUserId: string
}

export default function VotingArea({
  votes,
  participants,
  isRevealed,
  currentUserId,
}: VotingAreaProps) {
  const onlineParticipants = participants.filter((p) => p.is_online)

  if (onlineParticipants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No participants yet. Share the room link to invite others!
      </div>
    )
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 py-4">
      {onlineParticipants.map((participant) => {
        const vote = votes.find((v) => v.user_id === participant.user_id)
        return (
          <ParticipantCard
            key={participant.id}
            name={participant.name}
            avatarColor={participant.avatar_color || '#6366F1'}
            hasVoted={!!vote}
            voteValue={isRevealed ? vote?.value : undefined}
            isCurrentUser={participant.user_id === currentUserId}
          />
        )
      })}
    </div>
  )
}
