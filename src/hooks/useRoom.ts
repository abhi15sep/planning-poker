import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Room, CreateRoomInput, DeckType } from '../types'

export function useRoom(roomId?: string) {
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roomId) {
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured')
      setLoading(false)
      return
    }

    const fetchRoom = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single()

        if (fetchError) {
          throw fetchError
        }

        setRoom({
          ...data,
          deck_type: data.deck_type as DeckType,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch room')
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setRoom({
              ...payload.new as Room,
              deck_type: (payload.new as Room).deck_type as DeckType,
            })
          } else if (payload.eventType === 'DELETE') {
            setRoom(null)
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [roomId])

  const createRoom = useCallback(
    async (input: CreateRoomInput, ownerId: string): Promise<Room | null> => {
      if (!isSupabaseConfigured()) {
        setError('Supabase is not configured')
        return null
      }

      try {
        setLoading(true)
        const insertData = {
          name: input.name,
          owner_id: ownerId,
          deck_type: input.deck_type,
          description: input.description || null,
          timer_duration: input.timer_duration || null,
        }

        console.log('Creating room with:', insertData)

        const { data, error: createError } = await supabase
          .from('rooms')
          .insert(insertData)
          .select()
          .single()

        if (createError) {
          throw createError
        }

        return {
          ...data,
          deck_type: data.deck_type as DeckType,
        }
      } catch (err) {
        console.error('Create room error:', err)
        const message = err instanceof Error ? err.message : JSON.stringify(err)
        setError(message || 'Failed to create room')
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const updateRoom = useCallback(
    async (updates: Partial<Room>): Promise<boolean> => {
      if (!roomId || !isSupabaseConfigured()) return false

      try {
        const { error: updateError } = await supabase
          .from('rooms')
          .update(updates)
          .eq('id', roomId)

        if (updateError) {
          throw updateError
        }

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update room')
        return false
      }
    },
    [roomId]
  )

  return {
    room,
    loading,
    error,
    createRoom,
    updateRoom,
  }
}
