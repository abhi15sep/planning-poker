import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Vote } from '../types'

const POLL_INTERVAL = 3000 // 3 seconds for votes (more responsive)

export function useVotes(storyId?: string) {
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pollIntervalRef = useRef<number | null>(null)

  const fetchVotes = useCallback(async () => {
    if (!storyId || !isSupabaseConfigured()) return

    try {
      const { data, error: fetchError } = await supabase
        .from('votes')
        .select('*')
        .eq('story_id', storyId)
        .order('voted_at', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      setVotes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch votes')
    } finally {
      setLoading(false)
    }
  }, [storyId])

  useEffect(() => {
    if (!storyId) {
      setVotes([])
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Initial fetch
    fetchVotes()

    // Set up polling as fallback
    pollIntervalRef.current = window.setInterval(() => {
      fetchVotes()
    }, POLL_INTERVAL)

    const channel = supabase
      .channel(`votes:${storyId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
          filter: `story_id=eq.${storyId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVotes((prev) => [...prev, payload.new as Vote])
          } else if (payload.eventType === 'UPDATE') {
            setVotes((prev) =>
              prev.map((v) =>
                v.id === (payload.new as Vote).id ? (payload.new as Vote) : v
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setVotes((prev) =>
              prev.filter((v) => v.id !== (payload.old as Vote).id)
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
  }, [storyId, fetchVotes])

  const castVote = useCallback(
    async (
      userId: string,
      userName: string,
      value: string
    ): Promise<Vote | null> => {
      if (!storyId || !isSupabaseConfigured()) return null

      try {
        const { data: existing } = await supabase
          .from('votes')
          .select('*')
          .eq('story_id', storyId)
          .eq('user_id', userId)
          .single()

        if (existing) {
          const { data, error: updateError } = await supabase
            .from('votes')
            .update({
              value,
              voted_at: new Date().toISOString(),
            })
            .eq('id', existing.id)
            .select()
            .single()

          if (updateError) throw updateError
          return data
        }

        const { data, error: insertError } = await supabase
          .from('votes')
          .insert({
            story_id: storyId,
            user_id: userId,
            user_name: userName,
            value,
            voted_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (insertError) throw insertError
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to cast vote')
        return null
      }
    },
    [storyId]
  )

  const clearVotes = useCallback(async (): Promise<boolean> => {
    if (!storyId || !isSupabaseConfigured()) return false

    try {
      const { error: deleteError } = await supabase
        .from('votes')
        .delete()
        .eq('story_id', storyId)

      if (deleteError) {
        throw deleteError
      }

      setVotes([])
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear votes')
      return false
    }
  }, [storyId])

  const getUserVote = useCallback(
    (userId: string): Vote | undefined => {
      return votes.find((v) => v.user_id === userId)
    },
    [votes]
  )

  return {
    votes,
    loading,
    error,
    castVote,
    clearVotes,
    getUserVote,
  }
}
