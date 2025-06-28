-- Create storage bucket for pet images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pet-images', 'pet-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for pet images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'pet-images');

CREATE POLICY "Authenticated users can upload pet images" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'pet-images');

CREATE POLICY "Users can update own pet images" ON storage.objects 
FOR UPDATE TO authenticated 
USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own pet images" ON storage.objects 
FOR DELETE TO authenticated 
USING (auth.uid()::text = (storage.foldername(name))[1]);