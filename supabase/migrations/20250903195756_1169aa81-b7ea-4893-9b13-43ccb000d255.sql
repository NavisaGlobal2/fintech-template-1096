-- Fix storage policies for application documents

-- Create policies for application-documents bucket
CREATE POLICY "Allow authenticated users to upload application documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'application-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to view their own documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'application-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to update their own application documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'application-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to delete their own application documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'application-documents' 
  AND auth.role() = 'authenticated'
);