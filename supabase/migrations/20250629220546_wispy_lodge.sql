/*
  # Add pet_photo column to adoption_applications table

  1. Changes
    - Add pet_photo column to adoption_applications table
    - This column will store the URL of the pet's photo
*/

-- Add pet_photo column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'adoption_applications' AND column_name = 'pet_photo'
  ) THEN
    ALTER TABLE adoption_applications ADD COLUMN pet_photo text;
  END IF;
END $$;