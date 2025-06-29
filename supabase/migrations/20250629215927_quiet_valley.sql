/*
  # Adoption Applications Table Setup

  1. New Tables
    - `adoption_applications`
      - `id` (uuid, primary key)
      - `pet_id` (text, references the pet being adopted)
      - `pet_name` (text, name of the pet)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text, applicant's full name)
      - `email` (text, applicant's email)
      - `phone` (text, applicant's phone)
      - `address` (text, applicant's address)
      - `reason` (text, why they want to adopt)
      - `has_experience` (boolean, pet experience)
      - `agrees_to_terms` (boolean, terms agreement)
      - `status` (enum, application status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `adoption_applications` table
    - Add policies for users to manage their own applications

  3. Indexes
    - Add indexes for performance optimization
*/

-- Create enum type for application status (only if it doesn't exist)
DO $$ BEGIN
  CREATE TYPE adoption_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create adoption_applications table
CREATE TABLE IF NOT EXISTS adoption_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id text NOT NULL,
  pet_name text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  reason text NOT NULL,
  has_experience boolean NOT NULL DEFAULT false,
  agrees_to_terms boolean NOT NULL DEFAULT false,
  status adoption_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add pet_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'adoption_applications' AND column_name = 'pet_name'
  ) THEN
    ALTER TABLE adoption_applications ADD COLUMN pet_name text;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to recreate them cleanly
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'adoption_applications') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON adoption_applications';
    END LOOP;
END $$;

-- Create RLS policies
CREATE POLICY "Users can view their own applications"
  ON adoption_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON adoption_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON adoption_applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_adoption_applications_user_id ON adoption_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_pet_id ON adoption_applications(pet_id);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_status ON adoption_applications(status);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_created_at ON adoption_applications(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_adoption_applications_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop existing trigger and recreate
DROP TRIGGER IF EXISTS update_adoption_applications_updated_at ON adoption_applications;
CREATE TRIGGER update_adoption_applications_updated_at
  BEFORE UPDATE ON adoption_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_adoption_applications_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON adoption_applications TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;