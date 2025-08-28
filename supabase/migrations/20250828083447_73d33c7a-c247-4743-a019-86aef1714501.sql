-- Create underwriting system tables
CREATE TABLE public.underwriting_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name text NOT NULL,
  rule_type text NOT NULL CHECK (rule_type IN ('income', 'education', 'employment', 'credit', 'sponsor')),
  conditions jsonb NOT NULL,
  weight numeric NOT NULL DEFAULT 1.0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.underwriting_assessments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid NOT NULL,
  user_id uuid NOT NULL,
  risk_score numeric NOT NULL,
  risk_tier text NOT NULL CHECK (risk_tier IN ('low', 'medium', 'high')),
  decision text NOT NULL CHECK (decision IN ('auto-approve', 'manual-review', 'decline')),
  affordability_score numeric NOT NULL,
  education_score numeric NOT NULL,
  employment_score numeric NOT NULL,
  sponsor_score numeric NOT NULL,
  assessment_data jsonb NOT NULL DEFAULT '{}',
  assessed_at timestamp with time zone NOT NULL DEFAULT now(),
  assessed_by uuid
);

CREATE TABLE public.loan_offers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id uuid NOT NULL,
  application_id uuid NOT NULL,
  user_id uuid NOT NULL,
  offer_type text NOT NULL CHECK (offer_type IN ('loan', 'isa', 'hybrid')),
  loan_amount numeric NOT NULL,
  apr_rate numeric,
  isa_percentage numeric,
  repayment_term_months integer NOT NULL,
  grace_period_months integer DEFAULT 0,
  repayment_schedule jsonb NOT NULL DEFAULT '{}',
  terms_and_conditions jsonb NOT NULL DEFAULT '{}',
  offer_valid_until timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  accepted_at timestamp with time zone,
  declined_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.underwriting_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.underwriting_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view underwriting rules"
  ON public.underwriting_rules FOR SELECT
  USING (true);

CREATE POLICY "Users can view their own assessments"
  ON public.underwriting_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create assessments"
  ON public.underwriting_assessments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own offers"
  ON public.loan_offers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own offer status"
  ON public.loan_offers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND status IN ('accepted', 'declined'));

CREATE POLICY "System can create offers"
  ON public.loan_offers FOR INSERT
  WITH CHECK (true);

-- Insert default underwriting rules
INSERT INTO public.underwriting_rules (rule_name, rule_type, conditions, weight) VALUES
('High Income Threshold', 'income', '{"min_income": 50000, "currency": "GBP"}', 2.0),
('Medium Income Threshold', 'income', '{"min_income": 25000, "max_income": 49999, "currency": "GBP"}', 1.5),
('Low Income Threshold', 'income', '{"max_income": 24999, "currency": "GBP"}', 0.8),
('University Degree', 'education', '{"min_qualification": "bachelors"}', 1.8),
('Full-time Employment', 'employment', '{"status": "employed-full-time", "min_duration_months": 6}', 2.0),
('Part-time Employment', 'employment', '{"status": "employed-part-time"}', 1.2),
('Strong Credit History', 'credit', '{"min_score": 700}', 2.5),
('Co-signer Available', 'sponsor', '{"has_cosigner": true}', 1.5);