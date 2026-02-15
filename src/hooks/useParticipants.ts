import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Participant } from '../types'

const POLL_INTERVAL = 5000 // 5 seconds
const OFFLINE_TIMEOUT_MS = 2 * 60 * 1000 // 2 minutes in milliseconds

// Filter out participants who have been offline for more than 2 minutes
function filterActiveParticipants(participants: Participant[]): Participant[] {
  const now = Date.now()
  return participants.filter((p) => {
    // Always show online participants
    if (p.is_online) return true

    // For offline participants, check if they've been offline for more than 2 minutes
    const lastSeen = new Date(p.last_seen).getTime()
    const timeSinceLastSeen = now - lastSeen

    // Show if offline for less than 2 minutes
    return timeSinceLastSeen < OFFLINE_TIMEOUT_MS
  })
}

export function useParticipants(roomId?: string) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pollIntervalRef = useRef<number | null>(null)

  const fetchParticipants = useCallback(async () => {
    if (!roomId || !isSupabaseConfigured()) return

    try {
      const { data, error: fetchError } = await supabase
        .from('participants')
        .select('*')
        .eq('room_id', roomId)
        .order('last_seen', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      // Filter out participants who have been offline for more than 2 minutes
      const activeParticipants = filterActiveParticipants(data || [])
      setParticipants(activeParticipants)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch participants'
      )
    } finally {
      setLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    if (!roomId) {
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Initial fetch
    fetchParticipants()

    // Set up polling as fallback for realtime
    pollIntervalRef.current = window.setInterval(() => {
      fetchParticipants()
    }, POLL_INTERVAL)

    const channel = supabase
      .channel(`participants:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          console.log('Participant change:', payload)
          if (payload.eventType === 'INSERT') {
            setParticipants((prev) => {
              // Avoid duplicates
              if (prev.some(p => p.id === (payload.new as Participant).id)) {
                return prev
              }
              const newParticipant = payload.new as Participant
              const updated = [...prev, newParticipant]
              return filterActiveParticipants(updated)
            })
          } else if (payload.eventType === 'UPDATE') {
            setParticipants((prev) => {
              const updated = prev.map((p) =>
                p.id === (payload.new as Participant).id
                  ? (payload.new as Participant)
                  : p
              )
              // Re-filter in case the updated participant should now be hidden
              return filterActiveParticipants(updated)
            })
          } else if (payload.eventType === 'DELETE') {
            setParticipants((prev) =>
              prev.filter((p) => p.id !== (payload.old as Participant).id)
            )
          }
        }
      )
      .subscribe((status) => {
        console.log('Participants subscription status:', status)
      })

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
      supabase.removeChannel(channel)
    }
  }, [roomId, fetchParticipants])

  const joinRoom = useCallback(
    async (
      userId: string,
      name: string,
      avatarColor?: string
    ): Promise<Participant | null> => {
      if (!roomId || !isSupabaseConfigured()) return null

      try {
        const { data: existing } = await supabase
          .from('participants')
          .select('*')
          .eq('room_id', roomId)
          .eq('user_id', userId)
          .single()

        if (existing) {
          const { data, error: updateError } = await supabase
            .from('participants')
            .update({
              name,
              avatar_color: avatarColor,
              is_online: true,
              last_seen: new Date().toISOString(),
            })
            .eq('id', existing.id)
            .select()
            .single()

          if (updateError) throw updateError
          return data
        }

        const { data, error: insertError } = await supabase
          .from('participants')
          .insert({
            room_id: roomId,
            user_id: userId,
            name,
            avatar_color: avatarColor,
            is_online: true,
            last_seen: new Date().toISOString(),
          })
          .select()
          .single()

        if (insertError) throw insertError
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to join room')
        return null
      }
    },
    [roomId]
  )

  const updatePresence = useCallback(
    async (userId: string, isOnline: boolean): Promise<void> => {
      if (!roomId || !isSupabaseConfigured()) return

      try {
        await supabase
          .from('participants')
          .update({
            is_online: isOnline,
            last_seen: new Date().toISOString(),
          })
          .eq('room_id', roomId)
          .eq('user_id', userId)
      } catch (err) {
        console.error('Failed to update presence:', err)
      }
    },
    [roomId]
  )

  const leaveRoom = useCallback(
    async (userId: string): Promise<void> => {
      await updatePresence(userId, false)
    },
    [updatePresence]
  )

  return {
    participants,
    loading,
    error,
    joinRoom,
    updatePresence,
    leaveRoom,
  }
}
