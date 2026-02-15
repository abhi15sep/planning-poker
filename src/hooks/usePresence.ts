import { useEffect, useRef, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Participant } from '../types'

interface PresenceState {
  user_id: string
  name: string
  avatar_color: string
  online_at: string
}

export function usePresence(
  roomId: string | undefined,
  userId: string,
  userName: string,
  avatarColor: string,
  onPresenceChange?: (online: Participant[], offline: Participant[]) => void
) {
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const updateParticipantStatus = useCallback(
    async (isOnline: boolean) => {
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
    [roomId, userId]
  )

  useEffect(() => {
    if (!roomId || !userId || !isSupabaseConfigured()) return

    // Use Supabase Presence for real-time online/offline detection
    const channel = supabase.channel(`presence:${roomId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceState>()
        console.log('Presence sync:', state)

        if (onPresenceChange) {
          // Could fetch and filter participants here based on Object.keys(state)
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences)
        // Mark user as online in database
        if (key !== userId) {
          supabase
            .from('participants')
            .update({ is_online: true, last_seen: new Date().toISOString() })
            .eq('room_id', roomId)
            .eq('user_id', key)
            .then(() => {})
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences)
        // Mark user as offline in database
        supabase
          .from('participants')
          .update({ is_online: false, last_seen: new Date().toISOString() })
          .eq('room_id', roomId)
          .eq('user_id', key)
          .then(() => {})
      })
      .subscribe(async (status) => {
        console.log('Presence channel status:', status)
        if (status === 'SUBSCRIBED') {
          // Track this user's presence
          await channel.track({
            user_id: userId,
            name: userName,
            avatar_color: avatarColor,
            online_at: new Date().toISOString(),
          })
          // Also update database
          updateParticipantStatus(true)
        }
      })

    channelRef.current = channel

    // Handle page visibility
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        await channel.untrack()
        updateParticipantStatus(false)
      } else {
        await channel.track({
          user_id: userId,
          name: userName,
          avatar_color: avatarColor,
          online_at: new Date().toISOString(),
        })
        updateParticipantStatus(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      channel.untrack()
      supabase.removeChannel(channel)
    }
  }, [roomId, userId, userName, avatarColor, updateParticipantStatus, onPresenceChange])
}
