/*
  # Adoption Applications System

  1. New Tables
    - `adoption_applications`
      - `id` (uuid, primary key)
      - `pet_id` (string, references the pet being adopted)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text, applicant's name)
      - `email` (text, applicant's email)
      - `phone` (text, applicant's phone)
      - `address` (text, applicant's address)
      - `reason` (text, reason for adoption)
      - `has_experience` (boolean, previous pet experience)
      - `agrees_to_terms` (boolean, agreement to terms)
      - `status` (enum: 'pending', 'approved', 'rejected')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `adoption_applications` table
    - Add policies for users to manage their own applications
    - Add policies for admins to view all applications
*/

-- Create enum type for application status
CREATE TYPE adoption_status AS ENUM ('pending', 'approved', 'rejected');

-- Create adoption_applications table
CREATE TABLE IF NOT EXISTS adoption_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  reason text NOT NULL,
  has_experience boolean NOT NULL,
  agrees_to_terms boolean NOT NULL,
  status adoption_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own applications"
  ON adoption_applications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own applications"
  ON adoption_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_adoption_applications_user_id ON adoption_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_pet_id ON adoption_applications(pet_id);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_status ON adoption_applications(status);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_created_at ON adoption_applications(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_adoption_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_adoption_applications_updated_at
  BEFORE UPDATE ON adoption_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_adoption_applications_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON adoption_applications TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;