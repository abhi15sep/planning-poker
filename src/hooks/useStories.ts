import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Story, CreateStoryInput, StoryStatus } from '../types'

const POLL_INTERVAL = 5000 // 5 seconds

export function useStories(roomId?: string) {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pollIntervalRef = useRef<number | null>(null)

  const activeStory = stories.find(
    (s) => s.status === 'active' || s.status === 'revealed'
  )
  const queuedStories = stories.filter((s) => s.status === 'queue')
  const completedStories = stories.filter((s) => s.status === 'completed')

  const fetchStories = useCallback(async () => {
    if (!roomId || !isSupabaseConfigured()) return

    try {
      const { data, error: fetchError } = await supabase
        .from('stories')
        .select('*')
        .eq('room_id', roomId)
        .order('position', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      setStories(
        (data || []).map((s) => ({
          ...s,
          status: s.status as StoryStatus,
        }))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stories')
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
    fetchStories()

    // Set up polling as fallback
    pollIntervalRef.current = window.setInterval(() => {
      fetchStories()
    }, POLL_INTERVAL)

    const channel = supabase
      .channel(`stories:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stories',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newStory = {
              ...(payload.new as Story),
              status: (payload.new as Story).status as StoryStatus,
            }
            setStories((prev) =>
              [...prev, newStory].sort((a, b) => a.position - b.position)
            )
          } else if (payload.eventType === 'UPDATE') {
            const updatedStory = {
              ...(payload.new as Story),
              status: (payload.new as Story).status as StoryStatus,
            }
            setStories((prev) =>
              prev
                .map((s) => (s.id === updatedStory.id ? updatedStory : s))
                .sort((a, b) => a.position - b.position)
            )
          } else if (payload.eventType === 'DELETE') {
            setStories((prev) =>
              prev.filter((s) => s.id !== (payload.old as Story).id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
      channel.unsubscribe()
    }
  }, [roomId, fetchStories])

  const createStory = useCallback(
    async (input: CreateStoryInput): Promise<Story | null> => {
      if (!roomId || !isSupabaseConfigured()) return null

      try {
        const maxPosition = Math.max(...stories.map((s) => s.position), -1)

        const { data, error: createError } = await supabase
          .from('stories')
          .insert({
            room_id: roomId,
            title: input.title,
            description: input.description,
            status: 'queue',
            position: maxPosition + 1,
          })
          .select()
          .single()

        if (createError) {
          throw createError
        }

        return {
          ...data,
          status: data.status as StoryStatus,
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create story')
        return null
      }
    },
    [roomId, stories]
  )

  const updateStory = useCallback(
    async (storyId: string, updates: Partial<Story>): Promise<boolean> => {
      if (!isSupabaseConfigured()) return false

      try {
        const { error: updateError } = await supabase
          .from('stories')
          .update(updates)
          .eq('id', storyId)

        if (updateError) {
          throw updateError
        }

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update story')
        return false
      }
    },
    []
  )

  const deleteStory = useCallback(async (storyId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) return false

    try {
      const { error: deleteError } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId)

      if (deleteError) {
        throw deleteError
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete story')
      return false
    }
  }, [])

  const startVoting = useCallback(
    async (storyId: string): Promise<boolean> => {
      const currentActive = stories.find(
        (s) => s.status === 'active' || s.status === 'revealed'
      )
      if (currentActive && currentActive.id !== storyId) {
        await updateStory(currentActive.id, { status: 'queue' })
      }

      return updateStory(storyId, {
        status: 'active',
        started_at: new Date().toISOString(),
      })
    },
    [stories, updateStory]
  )

  const revealVotes = useCallback(
    async (storyId: string): Promise<boolean> => {
      return updateStory(storyId, { status: 'revealed' })
    },
    [updateStory]
  )

  const completeStory = useCallback(
    async (storyId: string, points: string): Promise<boolean> => {
      return updateStory(storyId, {
        status: 'completed',
        points,
        ended_at: new Date().toISOString(),
      })
    },
    [updateStory]
  )

  const resetVoting = useCallback(
    async (storyId: string): Promise<boolean> => {
      return updateStory(storyId, {
        status: 'active',
        started_at: new Date().toISOString(),
      })
    },
    [updateStory]
  )

  const importStories = useCallback(
    async (titles: string[]): Promise<boolean> => {
      if (!roomId || !isSupabaseConfigured()) return false

      try {
        const maxPosition = Math.max(...stories.map((s) => s.position), -1)

        const storiesToInsert = titles.map((title, index) => ({
          room_id: roomId,
          title: title.trim(),
          status: 'queue',
          position: maxPosition + 1 + index,
        }))

        const { error: insertError } = await supabase
          .from('stories')
          .insert(storiesToInsert)

        if (insertError) {
          throw insertError
        }

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to import stories')
        return false
      }
    },
    [roomId, stories]
  )

  return {
    stories,
    activeStory,
    queuedStories,
    completedStories,
    loading,
    error,
    createStory,
    updateStory,
    deleteStory,
    startVoting,
    revealVotes,
    completeStory,
    resetVoting,
    importStories,
  }
}
