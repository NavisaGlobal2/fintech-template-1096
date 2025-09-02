-- Add professional employment fields to loan_applications table
ALTER TABLE public.loan_applications 
ADD COLUMN IF NOT EXISTS professional_employment jsonb DEFAULT '{}'::jsonb;