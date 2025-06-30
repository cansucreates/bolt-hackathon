/*
  # Fix forum_posts table and add storage bucket for post images

  1. Ensure forum_posts table exists with correct structure
  2. Create storage bucket for post images if it doesn't exist
  3. Set up proper storage policies for post images
*/

-- Create forum_posts table if it doesn't exist
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

-- Enable Row Level Security if not already enabled
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them cleanly
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'forum_posts') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON forum_posts';
    END LOOP;
END $$;

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

-- Create indexes for performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_is_pinned ON forum_posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_forum_posts_is_solved ON forum_posts(is_solved);

-- Create function to update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_forum_post_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at if it doesn't exist
DROP TRIGGER IF EXISTS update_forum_post_updated_at ON forum_posts;
CREATE TRIGGER update_forum_post_updated_at
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_forum_post_updated_at();

-- Create storage bucket for post images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for post images with unique names to avoid conflicts
DO $$
BEGIN
  -- Check if policy exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Post Images Public Access'
  ) THEN
    CREATE POLICY "Post Images Public Access" ON storage.objects 
    FOR SELECT USING (bucket_id = 'post-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload post images'
  ) THEN
    CREATE POLICY "Authenticated users can upload post images" ON storage.objects 
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'post-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update own post images'
  ) THEN
    CREATE POLICY "Users can update own post images" ON storage.objects 
    FOR UPDATE TO authenticated 
    USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete own post images'
  ) THEN
    CREATE POLICY "Users can delete own post images" ON storage.objects 
    FOR DELETE TO authenticated 
    USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON forum_posts TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;