-- Planning Poker Database Schema
-- Run this in your Supabase SQL Editor

-- Rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL,
  deck_type TEXT NOT NULL DEFAULT 'fibonacci',
  timer_duration INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  avatar_color TEXT,
  is_online BOOLEAN DEFAULT true,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Stories table
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'queue',
  points TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  position INT DEFAULT 0
);

-- Votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  value TEXT NOT NULL,
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(story_id, user_id)
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE rooms, participants, stories, votes;

-- Row Level Security (basic - rooms are public by ID)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies for rooms
CREATE POLICY "Rooms are viewable by anyone with the ID" ON rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can create rooms" ON rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Room owners can update" ON rooms FOR UPDATE USING (true);
CREATE POLICY "Room owners can delete" ON rooms FOR DELETE USING (true);

-- Policies for participants
CREATE POLICY "Participants are viewable" ON participants FOR SELECT USING (true);
CREATE POLICY "Anyone can join as participant" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Participants can update themselves" ON participants FOR UPDATE USING (true);
CREATE POLICY "Participants can leave" ON participants FOR DELETE USING (true);

-- Policies for stories
CREATE POLICY "Stories are viewable" ON stories FOR SELECT USING (true);
CREATE POLICY "Anyone can create stories" ON stories FOR INSERT WITH CHECK (true);
CREATE POLICY "Stories can be updated" ON stories FOR UPDATE USING (true);
CREATE POLICY "Stories can be deleted" ON stories FOR DELETE USING (true);

-- Policies for votes
CREATE POLICY "Votes are viewable" ON votes FOR SELECT USING (true);
CREATE POLICY "Anyone can vote" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Votes can be updated" ON votes FOR UPDATE USING (true);
CREATE POLICY "Votes can be deleted" ON votes FOR DELETE USING (true);

-- Indexes for better performance
CREATE INDEX idx_participants_room_id ON participants(room_id);
CREATE INDEX idx_participants_user_id ON participants(user_id);
CREATE INDEX idx_stories_room_id ON stories(room_id);
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_votes_story_id ON votes(story_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
