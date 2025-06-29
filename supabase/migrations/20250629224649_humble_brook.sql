/*
  # Community Forum Database Schema

  1. New Tables
    - `forum_posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text, required)
      - `content` (text, required)
      - `category` (text, required)
      - `tags` (text[], optional)
      - `is_pinned` (boolean, default false)
      - `is_solved` (boolean, default false)
      - `view_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `post_votes`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references forum_posts)
      - `user_id` (uuid, references auth.users)
      - `vote_type` (enum: 'up', 'down')
      - `created_at` (timestamp)
    
    - `post_follows`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references forum_posts)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated user CRUD operations
    - Add policies for post owners to manage their posts

  3. Indexes
    - Add indexes for performance on common queries
*/

-- Create forum_posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  is_pinned boolean DEFAULT false,
  is_solved boolean DEFAULT false,
  view_count integer DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create post_votes table
CREATE TABLE IF NOT EXISTS post_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create post_follows table
CREATE TABLE IF NOT EXISTS post_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_follows ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for forum_posts
CREATE POLICY "Anyone can read forum posts"
  ON forum_posts
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create forum posts"
  ON forum_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum posts"
  ON forum_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forum posts"
  ON forum_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for post_votes
CREATE POLICY "Anyone can read post votes"
  ON post_votes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote on posts"
  ON post_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON post_votes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON post_votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for post_follows
CREATE POLICY "Anyone can read post follows"
  ON post_follows
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can follow posts"
  ON post_follows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own follows"
  ON post_follows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_is_pinned ON forum_posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_forum_posts_is_solved ON forum_posts(is_solved);
CREATE INDEX IF NOT EXISTS idx_post_votes_post_id ON post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_user_id ON post_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_follows_post_id ON post_follows(post_id);
CREATE INDEX IF NOT EXISTS idx_post_follows_user_id ON post_follows(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_forum_post_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_forum_post_updated_at
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_forum_post_updated_at();

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for post images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Users can update own post images" ON storage.objects 
FOR UPDATE TO authenticated 
USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own post images" ON storage.objects 
FOR DELETE TO authenticated 
USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Create view for post stats
CREATE OR REPLACE VIEW post_stats AS
SELECT 
  p.id AS post_id,
  p.title,
  p.user_id,
  p.category,
  p.is_solved,
  p.view_count,
  COUNT(DISTINCT c.id) AS comment_count,
  COUNT(DISTINCT pv.id) FILTER (WHERE pv.vote_type = 'up') AS upvote_count,
  COUNT(DISTINCT pv.id) FILTER (WHERE pv.vote_type = 'down') AS downvote_count,
  COUNT(DISTINCT pf.id) AS follow_count
FROM 
  forum_posts p
LEFT JOIN 
  comments c ON p.id = c.post_id
LEFT JOIN 
  post_votes pv ON p.id = pv.post_id
LEFT JOIN 
  post_follows pf ON p.id = pf.post_id
GROUP BY 
  p.id;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON forum_posts TO authenticated;
GRANT ALL ON post_votes TO authenticated;
GRANT ALL ON post_follows TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;