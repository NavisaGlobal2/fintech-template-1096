
-- First, let's extend the loan_applications table to support the full application data
ALTER TABLE public.loan_applications 
ADD COLUMN IF NOT EXISTS personal_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS kyc_documents JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS education_career JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS program_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS financial_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS loan_type_requested TEXT,
ADD COLUMN IF NOT EXISTS declarations JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS completed_steps JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewer_notes TEXT;

-- Create application documents table
CREATE TABLE IF NOT EXISTS public.application_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  verification_status TEXT DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on application_documents
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for application_documents
CREATE POLICY "Users can view their own documents" 
  ON public.application_documents 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own documents" 
  ON public.application_documents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" 
  ON public.application_documents 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" 
  ON public.application_documents 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create application status history table
CREATE TABLE IF NOT EXISTS public.application_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on application_status_history
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for application_status_history
CREATE POLICY "Users can view their own status history" 
  ON public.application_status_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create status history" 
  ON public.application_status_history 
  FOR INSERT 
  WITH CHECK (true);

-- Create storage bucket for application documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'application-documents', 
  'application-documents', 
  false, 
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for storage bucket
CREATE POLICY "Users can upload their own documents to bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'application-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents from bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'application-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents in bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'application-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents from bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'application-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
