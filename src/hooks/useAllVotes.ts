import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Vote } from '../types'

export function useAllVotes(storyIds: string[]) {
  const [votesByStory, setVotesByStory] = useState<Record<string, Vote[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (storyIds.length === 0 || !isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    const fetchAllVotes = async () => {
      try {
        const { data, error } = await supabase
          .from('votes')
          .select('*')
          .in('story_id', storyIds)
          .order('voted_at', { ascending: true })

        if (error) {
          throw error
        }

        // Group votes by story_id
        const grouped = (data || []).reduce(
          (acc, vote) => {
            if (!acc[vote.story_id]) {
              acc[vote.story_id] = []
            }
            acc[vote.story_id].push(vote)
            return acc
          },
          {} as Record<string, Vote[]>
        )

        setVotesByStory(grouped)
      } catch (err) {
        console.error('Failed to fetch all votes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllVotes()

    // Subscribe to vote changes for all stories
    const channel = supabase
      .channel('all-votes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const vote = payload.new as Vote
            if (storyIds.includes(vote.story_id)) {
              setVotesByStory((prev) => ({
                ...prev,
                [vote.story_id]: [...(prev[vote.story_id] || []), vote],
              }))
            }
          } else if (payload.eventType === 'UPDATE') {
            const vote = payload.new as Vote
            if (storyIds.includes(vote.story_id)) {
              setVotesByStory((prev) => ({
                ...prev,
                [vote.story_id]: (prev[vote.story_id] || []).map((v) =>
                  v.id === vote.id ? vote : v
                ),
              }))
            }
          } else if (payload.eventType === 'DELETE') {
            const vote = payload.old as Vote
            if (storyIds.includes(vote.story_id)) {
              setVotesByStory((prev) => ({
                ...prev,
                [vote.story_id]: (prev[vote.story_id] || []).filter(
                  (v) => v.id !== vote.id
                ),
              }))
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [storyIds.join(',')])

  return { votesByStory, loading }
}
