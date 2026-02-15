export type DeckType = 'scrum' | 'fibonacci' | 'sequential' | 'tshirt'
export type StoryStatus = 'queue' | 'active' | 'revealed' | 'completed'

export interface User {
  id: string
  name: string
  avatarColor: string
}

export interface Room {
  id: string
  name: string
  description: string | null
  owner_id: string
  deck_type: DeckType
  timer_duration: number | null
  created_at: string
}

export interface Participant {
  id: string
  room_id: string
  user_id: string
  name: string
  avatar_color: string | null
  is_online: boolean
  last_seen: string
}

export interface Story {
  id: string
  room_id: string
  title: string
  description: string | null
  status: StoryStatus
  points: string | null
  started_at: string | null
  ended_at: string | null
  position: number
  created_at: string
}

export interface Vote {
  id: string
  story_id: string
  user_id: string
  user_name: string
  value: string
  voted_at: string
}

export interface CardValue {
  value: string
  label: string
  isSpecial?: boolean
}

export interface Deck {
  name: string
  type: DeckType
  cards: CardValue[]
}

export interface VoteStatistics {
  average: number | null
  median: number | null
  mode: string | null
  totalVotes: number
  agreement: number
}

export interface CreateRoomInput {
  name: string
  description?: string
  deck_type: DeckType
  timer_duration?: number
}

export interface CreateStoryInput {
  title: string
  description?: string
  room_id: string
}
