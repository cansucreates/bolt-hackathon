/*
  # Lost & Found Pet Registry System Database Schema

  1. New Tables
    - `lost_found_pets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (enum: 'lost', 'found')
      - `pet_name` (varchar, optional for found pets)
      - `description` (text, detailed description)
      - `photo_url` (text, required image URL)
      - `location` (text, where pet was lost/found)
      - `contact_info` (text, contact details)
      - `date_reported` (timestamp with time zone)
      - `status` (enum: 'active', 'resolved')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `lost_found_pets` table
    - Add policies for public read access
    - Add policies for authenticated user CRUD operations
    - Add policies for post owners to manage their posts

  3. Indexes
    - Add indexes for performance on common queries
*/

-- Create enum types
CREATE TYPE pet_report_type AS ENUM ('lost', 'found');
CREATE TYPE pet_report_status AS ENUM ('active', 'resolved');

-- Create lost_found_pets table
CREATE TABLE IF NOT EXISTS lost_found_pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type pet_report_type NOT NULL,
  pet_name varchar(100),
  description text NOT NULL,
  photo_url text NOT NULL,
  location text NOT NULL,
  contact_info text NOT NULL,
  date_reported timestamptz DEFAULT now(),
  status pet_report_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE lost_found_pets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users"
  ON lost_found_pets
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON lost_found_pets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for post owners"
  ON lost_found_pets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for post owners"
  ON lost_found_pets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lost_found_pets_type ON lost_found_pets(type);
CREATE INDEX IF NOT EXISTS idx_lost_found_pets_status ON lost_found_pets(status);
CREATE INDEX IF NOT EXISTS idx_lost_found_pets_date_reported ON lost_found_pets(date_reported DESC);
CREATE INDEX IF NOT EXISTS idx_lost_found_pets_location ON lost_found_pets USING gin(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_lost_found_pets_description ON lost_found_pets USING gin(to_tsvector('english', description));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_lost_found_pets_updated_at
  BEFORE UPDATE ON lost_found_pets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON lost_found_pets TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;