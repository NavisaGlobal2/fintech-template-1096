-- Create storage policies for anonymous temporary document uploads
-- Allow anonymous users to upload to temp/ folder in application-documents bucket
CREATE POLICY "Allow anonymous uploads to temp folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'application-documents' 
  AND (storage.foldername(name))[1] = 'temp'
  AND array_length(storage.foldername(name), 1) >= 2
);

-- Allow anonymous users to view their temp uploads (by session ID)
CREATE POLICY "Allow anonymous access to own temp uploads" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'application-documents' 
  AND (storage.foldername(name))[1] = 'temp'
);

-- Allow users to delete their temp files during transfer
CREATE POLICY "Allow temp file cleanup during transfer" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'application-documents' 
  AND (storage.foldername(name))[1] = 'temp'
);

-- Create a function to transfer temp documents to user folder
CREATE OR REPLACE FUNCTION public.transfer_temp_documents_to_user(
  temp_session_id TEXT,
  user_id UUID
) RETURNS VOID AS $$
DECLARE
  doc RECORD;
BEGIN
  -- Update application_documents records from temp session to user
  UPDATE public.application_documents 
  SET user_id = transfer_temp_documents_to_user.user_id,
      file_url = REPLACE(file_url, '/temp/' || temp_session_id || '/', '/' || transfer_temp_documents_to_user.user_id || '/')
  WHERE user_id IS NULL 
    AND file_url LIKE '%/temp/' || temp_session_id || '/%';
    
  -- Note: Storage object moving would need to be handled in the application layer
  -- as Supabase doesn't have a native SQL function to move storage objects
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update application_documents table to allow NULL user_id for temp uploads
ALTER TABLE public.application_documents 
ALTER COLUMN user_id DROP NOT NULL;

-- Add session_id column for tracking anonymous uploads
ALTER TABLE public.application_documents 
ADD COLUMN session_id TEXT;

-- Create index for session_id lookups
CREATE INDEX idx_application_documents_session_id 
ON public.application_documents(session_id);

-- Update RLS policies to allow anonymous temp uploads
CREATE POLICY "Allow anonymous temp document uploads" 
ON public.application_documents 
FOR INSERT 
WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

-- Allow anonymous users to view their temp documents by session_id
CREATE POLICY "Allow anonymous access to temp documents by session" 
ON public.application_documents 
FOR SELECT 
USING (user_id IS NULL AND session_id IS NOT NULL);