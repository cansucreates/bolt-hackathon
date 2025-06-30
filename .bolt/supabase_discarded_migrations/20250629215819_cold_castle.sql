-- Create enum type for application status
DO $$ BEGIN
  CREATE TYPE adoption_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create adoption_applications table
CREATE TABLE IF NOT EXISTS adoption_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id text NOT NULL,
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
  updated_at timestamptz DEFAULT now(),
  pet_name text -- Add pet_name column
);

-- Enable Row Level Security
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own applications" ON adoption_applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON adoption_applications;

-- Create RLS policies with proper syntax
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

-- Create indexes for performance
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

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_adoption_applications_updated_at ON adoption_applications;
CREATE TRIGGER update_adoption_applications_updated_at
  BEFORE UPDATE ON adoption_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_adoption_applications_updated_at();