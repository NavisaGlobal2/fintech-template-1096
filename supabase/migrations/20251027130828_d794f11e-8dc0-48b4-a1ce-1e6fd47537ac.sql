-- Create sponsors table
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  logo_url TEXT,
  description TEXT,
  funding_available NUMERIC NOT NULL DEFAULT 0,
  min_funding_amount NUMERIC DEFAULT 0,
  max_funding_amount NUMERIC,
  expertise TEXT[] DEFAULT '{}',
  countries_supported TEXT[] DEFAULT '{}',
  career_focus TEXT[] DEFAULT '{}',
  preferred_fields_of_study TEXT[] DEFAULT '{}',
  current_capacity INTEGER DEFAULT 10,
  max_capacity INTEGER DEFAULT 10,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- RLS Policies for sponsors table
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active sponsors"
  ON public.sponsors
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage all sponsors"
  ON public.sponsors
  FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'underwriter')
  )
  WITH CHECK (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'underwriter')
  );

-- Create sponsor_assignments table
CREATE TABLE public.sponsor_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES loan_applications(id) ON DELETE CASCADE NOT NULL,
  sponsor_id UUID REFERENCES sponsors(id) NOT NULL,
  user_id UUID NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assignment_method TEXT DEFAULT 'automatic' CHECK (assignment_method IN ('automatic', 'manual')),
  match_score NUMERIC,
  assignment_reason TEXT,
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'accepted', 'rejected', 'withdrawn')),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sponsor_assignments_application ON sponsor_assignments(application_id);
CREATE INDEX idx_sponsor_assignments_sponsor ON sponsor_assignments(sponsor_id);
CREATE INDEX idx_sponsor_assignments_user ON sponsor_assignments(user_id);
CREATE INDEX idx_sponsor_assignments_status ON sponsor_assignments(status);

ALTER TABLE public.sponsor_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sponsor assignments"
  ON public.sponsor_assignments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create sponsor assignments"
  ON public.sponsor_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage all sponsor assignments"
  ON public.sponsor_assignments
  FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'underwriter')
  )
  WITH CHECK (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'underwriter')
  );

-- Update loan_applications table with sponsor tracking
ALTER TABLE public.loan_applications 
  ADD COLUMN IF NOT EXISTS sponsor_assignment_status TEXT DEFAULT 'pending_match' 
    CHECK (sponsor_assignment_status IN (
      'pending_match', 
      'sponsor_assigned', 
      'sponsor_reviewing', 
      'sponsor_approved', 
      'sponsor_rejected'
    )),
  ADD COLUMN IF NOT EXISTS assigned_sponsor_id UUID REFERENCES sponsors(id),
  ADD COLUMN IF NOT EXISTS sponsor_assigned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sponsor_reviewed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_loan_applications_sponsor_status 
  ON loan_applications(sponsor_assignment_status);

-- Create audit log table
CREATE TABLE public.sponsor_assignment_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES sponsor_assignments(id) ON DELETE CASCADE,
  application_id UUID REFERENCES loan_applications(id),
  sponsor_id UUID REFERENCES sponsors(id),
  action TEXT NOT NULL CHECK (action IN ('assigned', 'updated', 'accepted', 'rejected', 'withdrawn')),
  previous_status TEXT,
  new_status TEXT,
  performed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sponsor_audit_assignment ON sponsor_assignment_audit_log(assignment_id);
CREATE INDEX idx_sponsor_audit_application ON sponsor_assignment_audit_log(application_id);

ALTER TABLE public.sponsor_assignment_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sponsor audit logs"
  ON public.sponsor_assignment_audit_log
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'underwriter')
  );

-- Function to safely decrement sponsor capacity
CREATE OR REPLACE FUNCTION decrement_sponsor_capacity(sponsor_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE sponsors
  SET current_capacity = GREATEST(current_capacity - 1, 0),
      updated_at = NOW()
  WHERE id = sponsor_id AND current_capacity > 0;
END;
$$;

-- Seed initial sponsor data
INSERT INTO public.sponsors (
  sponsor_name,
  contact_email,
  contact_phone,
  description,
  funding_available,
  min_funding_amount,
  max_funding_amount,
  expertise,
  countries_supported,
  career_focus,
  preferred_fields_of_study,
  current_capacity,
  max_capacity,
  status
) VALUES (
  'TechSkill UK Alumni Fund',
  'alumni@techskill.uk',
  '+44 20 1234 5678',
  'Supporting ambitious students pursuing technology education abroad',
  500000,
  5000,
  25000,
  ARRAY['Technology', 'Computer Science', 'Software Engineering', 'Data Science'],
  ARRAY['United Kingdom', 'United States', 'Canada', 'Australia'],
  ARRAY['Software Development', 'Data Analysis', 'Tech Leadership', 'Product Management'],
  ARRAY['Computer Science', 'Information Technology', 'Software Engineering'],
  50,
  50,
  'active'
);